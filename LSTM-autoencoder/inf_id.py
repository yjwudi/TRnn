#encoding=utf-8
'''
推断给定id的agent的feature
'''
import numpy as np
import tensorflow as tf

agent_file = '../Data/agent_path/agent_road_0_new_formated.txt'
id_file = '../Data/agent_path/selected.txt'
feature_file = '../Data/agent_path/selected_feature.txt'


selected_id = []
with open(id_file, 'r') as f:
	data = f.readlines()
	selected_id = list(map(int, data))
print('selected_id[0]=',selected_id[0])

max_x = 8981.0
max_y = 4966.0
agent_path = []
with open(agent_file, 'r') as f:
	data = f.readlines()
	i = 0
	while True:
		if i >= len(data):
			break
		head_line = data[i].split()
		i += 1
		agent_id = int(head_line[0])
		line_num = int(head_line[1])
		if agent_id in selected_id:
			my_path = []
			for j in range(i, i+line_num):
				pos = data[j].split()
				pos = list(map(float, pos))
				pos[0] = pos[0]/max_x
				pos[1] = pos[1]/max_y
				my_path.append(pos)
			agent_path.append(my_path)
		i = i+line_num


tf.reset_default_graph()
tf.set_random_seed(2016)
np.random.seed(2016)

# LSTM-autoencoder
from LSTMAutoencoder import *
from default import *

# Constants
# hidden_num : the number of hidden units in each RNN-cell
batch_num = 128
hidden_num = 64
iteration = 1000000
step_num = 120

x = np.array(agent_path)
print('x shape: ', np.shape(x))
# print(x[0])

# placeholder list
p_input = tf.placeholder(tf.float32, shape=(batch_num, step_num, elem_num))
p_inputs = [tf.squeeze(t, [1]) for t in tf.split(p_input, step_num, 1)]#len=8, 128*1

cell = tf.nn.rnn_cell.LSTMCell(hidden_num, use_peepholes=True)
ae = LSTMAutoencoder(hidden_num, p_inputs, cell=cell, decode_without_input=True)

sp = np.shape(x)
batch_sum = sp[0]
idx = 0
def get_test_batch():
	upper = idx+batch_num
	if upper < batch_sum:
		batch_np = x[idx:upper]
	else:
		batch_np = x[batch_sum-batch_num:batch_sum]
	return batch_np

log_dir = 'test_hidden_num_64_norm/logs_bkup_260w/lstm-parameter-hidden_num-64'
restore_flag = True
results = []
gpu_options = tf.GPUOptions(allow_growth=True)
with tf.Session(config=tf.ConfigProto(gpu_options=gpu_options)) as sess:
	sess.run(tf.global_variables_initializer())
	saver = tf.train.Saver()

	if restore_flag:
		saver.restore(sess, log_dir)

	i = 0
	while True:

		if idx >= batch_sum:
			break
		random_sequences = get_test_batch()#[128,8,1]
		
		(enc_state, input_, output_) = sess.run([ae.enc_state, ae.input_, ae.output_], {p_input: random_sequences})
		if idx+batch_num >= batch_sum:
			for i in range(batch_num-(batch_sum-idx),batch_num):
				results.append(enc_state[0][i])
				results.append(enc_state[1][i])
		else:
			for i in range(batch_num):
				results.append(enc_state[0][i])
				results.append(enc_state[1][i])
		idx += batch_num

results = np.array(results)
print('results shape: ', np.shape(results))
np.savetxt(feature_file, results)
# with open(feature_file, 'w') as f:
# 	for enc_state in results:
# 		for i in range(len(enc_state)):
# 			f.write('%f',enc_state[i])
# 			if i==len(enc_state)-1:
# 				f.write('\n')
# 			else:
# 				f.write(' ')


































