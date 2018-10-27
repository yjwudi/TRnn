# Basic libraries
import numpy as np
from default import *

np.random.seed(2016)


# Constants
# hidden_num : the number of hidden units in each RNN-cell
batch_num = 128
hidden_num = 12
iteration = 1000000


fname = '../Data/agent_path/agent_road_0_new.txt'
agent_id = []
agent_path = []
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
print(agent_path[0])

road2index = {}
cnt = 0
for path in agent_path:
    for road in path:
        tp = (road[0],road[1])
        if tp not in road2index:
            road2index[tp] = cnt
            cnt += 1



from __future__ import unicode_literals, print_function, division
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
save_path = 'logs'
device = torch.device("cuda" if torch.cuda.is_available() else "cpu")


class EncoderRNN(nn.Module):
    def __init__(self, hidden_size):
        super(EncoderRNN, self).__init__()
        self.hidden_size = hidden_size
        self.gru = nn.GRU(hidden_size, hidden_size)

    def forward(self, input, hidden):
        output, hidden = self.gru(input, hidden)
        return output, hidden

    def initHidden(self):
        return torch.zeros(1, 1, self.hidden_size, device=device)

class AttnDecoderRNN(nn.Module):
    def __init__(self, hidden_size, output_size, dropout_p=0.1, max_length=MAX_LENGTH):
        super(AttnDecoderRNN, self).__init__()
        self.hidden_size = hidden_size
        self.output_size = output_size
        self.dropout_p = dropout_p
        self.max_length = max_length

        self.embedding = nn.Embedding(self.output_size, self.hidden_size)
        self.attn = nn.Linear(self.hidden_size * 2, self.max_length) #矩阵乘法
        self.attn_combine = nn.Linear(self.hidden_size * 2, self.hidden_size)
        self.dropout = nn.Dropout(self.dropout_p)
        self.gru = nn.GRU(self.hidden_size, self.hidden_size)
        self.out = nn.Linear(self.hidden_size, self.output_size)

    def forward(self, input, hidden, encoder_outputs):
        embedded = self.embedding(input).view(1, 1, -1)
        embedded = self.dropout(embedded)

        attn_weights = F.softmax(
            self.attn(torch.cat((embedded[0], hidden[0]), 1)), dim=1)
        attn_applied = torch.bmm(attn_weights.unsqueeze(0),
                                 encoder_outputs.unsqueeze(0))

        output = torch.cat((embedded[0], attn_applied[0]), 1)
        output = self.attn_combine(output).unsqueeze(0)

        output = F.relu(output)
        output, hidden = self.gru(output, hidden)

        output = F.log_softmax(self.out(output[0]), dim=1)
        return output, hidden, attn_weights

    def initHidden(self):
        return torch.zeros(1, 1, self.hidden_size, device=device)

teacher_forcing_ratio = 0.5


def train(input_tensor, target_tensor, encoder, decoder, encoder_optimizer, decoder_optimizer, criterion, max_length=MAX_LENGTH):
    encoder_hidden = encoder.initHidden()

    encoder_optimizer.zero_grad()
    decoder_optimizer.zero_grad()

    input_length = input_tensor.size(0)
    target_length = target_tensor.size(0)

    encoder_outputs = torch.zeros(max_length, encoder.hidden_size, device=device)

    loss = 0

    for ei in range(input_length):
        encoder_output, encoder_hidden = encoder(
            input_tensor[ei], encoder_hidden)
        encoder_outputs[ei] = encoder_output[0, 0]

    decoder_input = torch.tensor([[SOS_token]], device=device)

    decoder_hidden = encoder_hidden

    
    # Without teacher forcing: use its own predictions as the next input
    for di in range(target_length):
        decoder_output, decoder_hidden, decoder_attention = decoder(
            decoder_input, decoder_hidden, encoder_outputs)
        topv, topi = decoder_output.topk(1)
        decoder_input = topi.squeeze().detach()  # detach from history as input

        loss += criterion(decoder_output, target_tensor[di])
        if decoder_input.item() == EOS_token:
            break

    loss.backward()

    encoder_optimizer.step()
    decoder_optimizer.step()

    return loss.item() / target_length


######################################################################
# This is a helper function to print time elapsed and estimated time
# remaining given the current time and progress %.
#

import time
import math


def asMinutes(s):
    m = math.floor(s / 60)
    s -= m * 60
    return '%dm %ds' % (m, s)


def timeSince(since, percent):
    now = time.time()
    s = now - since
    es = s / (percent)
    rs = es - s
    return '%s (- %s)' % (asMinutes(s), asMinutes(rs))


######################################################################
# The whole training process looks like this:
#
# -  Start a timer
# -  Initialize optimizers and criterion
# -  Create set of training pairs
# -  Start empty losses array for plotting
#
# Then we call ``train`` many times and occasionally print the progress (%
# of examples, time so far, estimated time) and average loss.
#

def tensorsFromPair(path):
    target_tensor = [road2index[(road[0],road[1])] for road in path]
    return (torch.tensor(path, device=device), torch.tensor(target_tensor, dtype=torch.long, device=device))

def trainIters(encoder, decoder, n_iters, print_every=1000, plot_every=100, learning_rate=0.01):
    start = time.time()
    plot_losses = []
    print_loss_total = 0  # Reset every print_every
    plot_loss_total = 0  # Reset every plot_every

    encoder_optimizer = optim.SGD(encoder.parameters(), lr=learning_rate)
    decoder_optimizer = optim.SGD(decoder.parameters(), lr=learning_rate)
    training_pairs = [tensorsFromPair(random.choice(agent_path))
                      for i in range(n_iters)]
    criterion = nn.NLLLoss()

    for iter in range(1, n_iters + 1):
        training_pair = training_pairs[iter - 1]
        input_tensor = training_pair[0]
        target_tensor = training_pair[1]
        if iter==1:
            print(input_tensor)
            print(target_tensor)

        loss = train(input_tensor, target_tensor, encoder,
                     decoder, encoder_optimizer, decoder_optimizer, criterion)
        print_loss_total += loss
        plot_loss_total += loss

        if iter % print_every == 0:
            print_loss_avg = print_loss_total / print_every
            print_loss_total = 0
            print('%s (%d %d%%) %.4f' % (timeSince(start, iter / n_iters),
                                         iter, iter / n_iters * 100, print_loss_avg))
            torch.save({
                        'iter':iter,
                        'encoder_state_dict': encoder.state_dict(),
                        'decoder_state_dict': decoder.state_dict(),
                        'enoptimizer_state_dict': encoder_optimizer.state_dict(),
                        'deoptimizer_state_dict': decoder_optimizer.state_dict(),
                        'loss': print_loss_avg
                       }, save_path)

hidden_size = 256
encoder1 = EncoderRNN(hidden_size).to(device)
#所有人一共经历了13760个道路
attn_decoder1 = AttnDecoderRNN(hidden_size, 13760, dropout_p=0.1).to(device)

trainIters(encoder1, attn_decoder1, 75000, print_every=5000)
