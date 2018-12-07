# Basic libraries
from __future__ import unicode_literals, print_function, division
import numpy as np
from default import *
import random
from io import open
import unicodedata
import string
import re
import random

import torch
import torch.nn as nn
from torch import optim
import torch.nn.functional as F
MAX_LENGTH = 50
save_path = 'mse_noattn_train_logs'
device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
# device = torch.device("cpu")
teacher_forcing_ratio = 0.5

np.random.seed(2016)


# Constants
# hidden_num : the number of hidden units in each RNN-cell
batch_num = 128
hidden_num = 12
iteration = 1000000


fname = '../Data/agent_path/agent_road_0_new.txt'
id_file = '../Data/agent_path/selected.txt'
feature_file = '../Data/agent_path/selected_feature.txt'

agent_id = []
agent_path = []
new_agent_path = []
agent_path_x = []
agent_path_y = []
with open(fname,'r') as f:
    data = f.readlines()
    i = 0
    while True:
        if i >= len(data):
            break
        head_line = data[i].split()
        i += 1
        agent_id.append(int(head_line[0]))
        line_num = int(head_line[1])
        step_num = max(step_num,line_num)
        my_path = []
        for j in range(i, i+line_num):
            pos = data[j].split()
            pos = map(float, pos)
            pos = list(map(int, pos))
            my_path.append(pos)
            agent_path_x.append(pos[0])
            agent_path_y.append(pos[1])
        agent_path.append(my_path)
        i = i+line_num
step_num = 50
print('step_num: ', step_num)
print('agent_id len: ', len(agent_id))
print('agent_path_x len: ', len(agent_path_x))
print('agent_path_y len: ', len(agent_path_y))
agent_path_x = list(set(agent_path_x))
agent_path_y = list(set(agent_path_y))
agent_path_x.sort()
agent_path_y.sort()
print('agent_path_x after set len: ', len(agent_path_x))
print('agent_path_y after set len: ', len(agent_path_y))
max_x = float(len(agent_path_x))
max_y = float(len(agent_path_y))

dict_x = dict()
dict_y = dict()
for i in range(len(agent_path_x)):
    dict_x[agent_path_x[i]] = i+1
for i in range(len(agent_path_y)):
    dict_y[agent_path_y[i]] = i+1

for path in agent_path:
    for i in range(len(path)):
        path[i][0] = dict_x[path[i][0]]/max_x
        path[i][1] = dict_y[path[i][1]]/max_y


for path in agent_path:
    if len(path)>step_num:
        path = path[len(path)-50:len(path)]
    new_agent_path.append(path)
# agent_path = new_agent_path

road2index = {}
cnt = 0
for path in new_agent_path:
    if len(path)>step_num:
        print('hehe')
    for road in path:
        tp = (road[0],road[1])
        if tp not in road2index:
            road2index[tp] = cnt
            cnt += 1

selected_id = []
with open(id_file, 'r') as f:
    data = f.readlines()
    selected_id = list(map(int, data))
print('selected_id[0]=',selected_id[0])

agent_path = []
for i in range(len(agent_id)):
    if agent_id[i] in selected_id:
        agent_path.append(new_agent_path[i])


class EncoderRNN(nn.Module):
    def __init__(self, input_size, hidden_size):
        super(EncoderRNN, self).__init__()
        self.input_size = input_size
        self.hidden_size = hidden_size
        self.embedding = nn.Linear(input_size, hidden_size)
        self.gru = nn.GRU(hidden_size, hidden_size)

    def forward(self, input, hidden):
        output = self.embedding(input).view(1, 1, -1)
        output, hidden = self.gru(output, hidden)
        return output, hidden

    def initHidden(self):
        return torch.zeros(1, 1, self.hidden_size, device=device)

input_size = 2
hidden_size = 256
encoder1 = EncoderRNN(input_size, hidden_size).to(device)
checkpoint = torch.load(save_path)
iter = checkpoint['iter']
loss = checkpoint['loss']
print('iter=%d'%(iter)+',loss=%f'%(loss))
encoder1.load_state_dict(checkpoint['encoder_state_dict'])

def tensorsFromPair(path):
    return (torch.tensor(path, device=device), torch.tensor(path, device=device))

results = []
for path in agent_path:
    training_pair = tensorsFromPair(path)
    input_tensor = training_pair[0]
    target_tensor = training_pair[1]
    input_length = input_tensor.size(0)
    encoder_hidden = encoder1.initHidden()
    for ei in range(input_length):
        encoder_output, encoder_hidden = encoder1(
            input_tensor[ei], encoder_hidden)
    results.append(encoder_hidden[0][0].cpu().detach().numpy())

results = np.array(results)
print('results shape: ', np.shape(results))
print(results[0])
print(results[1])
np.savetxt(feature_file, results)