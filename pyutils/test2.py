#encoding=utf-8
'''
把某些地理位置的晒出来
'''
import numpy as np
id_file = '../Data/agent_path/v2/selected.txt'
cid_file = '../Data/agent_path/v2/selected_cluster_1.txt'
feature_file = '../Data/agent_path/v2/selected_feature.txt'
agent_file = '../Data/agent_path/agent_pos_0.txt'

id_arr = np.loadtxt(id_file)
cid_arr = np.loadtxt(cid_file)
feature_arr = np.loadtxt(feature_file)
agent_road = dict()
new_id_arr = []
new_cid_arr = []
new_feature_arr = []
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
	if cid==0:
		flag = True
		for road in agent_road[idx]:
			if road[1]>61348:
				flag = False
				break

		if flag==True:
			new_id_arr.append(id_arr[i])
			new_feature_arr.append(feature_arr[i])
			new_cid_arr.append(0)
	else:
		if agent_road[idx][-1][1]>61524:
			continue
		if agent_road[idx][-1][0]>4096:
			continue
		new_id_arr.append(id_arr[i])
		new_feature_arr.append(feature_arr[i])
		new_cid_arr.append(1)

np.savetxt('../Data/agent_path/vv/selected.txt', new_id_arr, fmt='%d')
np.savetxt('../Data/agent_path/vv/selected_cluster_1.txt', new_cid_arr, fmt='%d')
np.savetxt('../Data/agent_path/vv/selected_feature.txt', new_feature_arr)
