# Basic libraries
import numpy as np
import tensorflow as tf

tf.reset_default_graph()
tf.set_random_seed(2016)
np.random.seed(2016)

# LSTM-autoencoder
from LSTMAutoencoder import *
from default import *

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

dict_x = dict()
dict_y = dict()
for i in range(len(agent_path_x)):
    dict_x[agent_path_x[i]] = i+1
for i in range(len(agent_path_y)):
    dict_y[agent_path_y[i]] = i+1

print(agent_path[0])
for path in agent_path:
    for i in range(len(path)):
        path[i][0] = dict_x[path[i][0]]
        path[i][1] = dict_y[path[i][1]]
print(agent_path[0])

for path in agent_path:
    while len(path)<step_num:
        path.insert(0,[0,0])
print(agent_path[0])


# x = np.loadtxt(fname).reshape([total_num,step_num,elem_num])
x = np.array(agent_path)
print('x shape: ', np.shape(x))

# placeholder list
p_input = tf.placeholder(tf.float32, shape=(batch_num, step_num, elem_num))
p_inputs = [tf.squeeze(t, [1]) for t in tf.split(p_input, step_num, 1)]#len=8, 128*1

cell = tf.nn.rnn_cell.LSTMCell(hidden_num, use_peepholes=True)
ae = LSTMAutoencoder(hidden_num, p_inputs, cell=cell, decode_without_input=True)

def get_rand_batch():
    arr = np.arange(total_num)
    np.random.shuffle(arr)
    batch_list = []
    for i in range(batch_num):
        batch_list.append(x[arr[i]])
    batch_np = np.array(batch_list)
    return batch_np

def get_test_batch():
    return x[0:batch_num]

log_dir = 'logs/lstm-parameter'
restore_flag = False
gpu_options = tf.GPUOptions(allow_growth=True)
with tf.Session(config=tf.ConfigProto(gpu_options=gpu_options)) as sess:
    sess.run(tf.global_variables_initializer())
    saver = tf.train.Saver()

    if restore_flag:
        saver.restore(sess, log_dir)

    i = 0
    while True:

        random_sequences = get_rand_batch()#[128,8,1]
        (loss_val, _) = sess.run([ae.loss, ae.train], {p_input: random_sequences})
        # print('iter %d:' % (i + 1), loss_val)

        if i%20000==0:
            print('iter %d:' % (i + 1), loss_val)
            (z_codes, enc_state, input_, output_) = sess.run([ae.z_codes, ae.enc_state, ae.input_, ae.output_], {p_input: random_sequences})
            print('train result :')
            print('input :', input_[0])
            print('output :', output_[0], flush=True)
        if i%100000==0:
            saver.save(sess, log_dir)

        i = i+1
    random_sequences = np.random.randint(up_bound, size=batch_num*step_num*elem_num).reshape([batch_num,step_num,elem_num])
    (input_, output_) = sess.run([ae.input_, ae.output_], {p_input: random_sequences})
    print('train result :')
    print('input :', input_[0, :, :].flatten())
    print('output :', output_[0, :, :].flatten(), flush=True)
















