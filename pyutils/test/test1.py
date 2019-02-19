#encoding=utf-8
'''
把某些地理位置的晒出来
'''
import numpy as np
id_file = '../Data/agent_path/v1/selected.txt'
cid_file = '../Data/agent_path/v1/selected_cluster_1.txt'
agent_file = '../Data/agent_path/agent_pos_0.txt'

id_arr = np.loadtxt(id_file)
cid_arr = np.loadtxt(cid_file)
agent_road = dict()
with open(agent_file, 'r') as f:
	data = f.readlines()
	i = 0
	while True:
		if i >= len(data):
			break
		head_line = data[i].split()
		i += 1
		tmp_id = int(head_line[0])
		tmp_num = int(head_line[1])
		tmp_path = []
		for j in range(i, i+tmp_num):
			pos = data[j].split()
			pos = map(float, pos)
			pos = list(pos)
			tmp_path.append(pos)
		i = i+tmp_num
		agent_road[tmp_id] = tmp_path
for i in range(len(id_arr)):
	idx = id_arr[i]
	cid = cid_arr[i]
	if cid==1:
		flag = True
		for road in agent_road[idx]:
			if road[0]>6100:
				flag = False
				break
		if flag==False:
			cid_arr[i] = 2

np.savetxt('../Data/agent_path/vv/selected_cluster_1.txt', cid_arr, fmt='%d')
