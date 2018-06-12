#encoding=utf-8
import numpy as np
'''
得到选取的轨迹的每段路，计算每段路在不同主题下的概率
'''
agent_file = '../Data/agent_path/agent_road_0_new_formated.txt'
id_file = '../Data/agent_path/selected.txt'
cluster_file = '../Data/agent_path/selected_cluster_1.txt'

selected_id = []
with open(id_file, 'r') as f:
	data = f.readlines()
	selected_id = list(map(int, data))
print('selected_id[0]=',selected_id[0])

cluster_num = 4
selected_clusterid = np.loadtxt(cluster_file)
print('selected_clusterid len:', np.shape(selected_clusterid), selected_clusterid[0])

road_dict = dict()#{<x, y>, idx}
max_x = 8981.0
max_y = 4966.0
agent_path = dict()
road_sum = 0
repeat_sum = 0
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
				if pos[0]+pos[1]<1:
					continue
				# pos[0] = pos[0]/max_x
				# pos[1] = pos[1]/max_y
				# if data[j] not in road_dict:# data[j]是从文件中读出的字符串
				# 	road_dict[data[j]] = len(road_dict)
				# else:
				# 	repeat_sum += 1
				my_path.append(data[j])
			agent_path[agent_id] = my_path
		i = i+line_num
for i in range(len(selected_id)):
	cluster_idx = int(selected_clusterid[i])
	pre_road = ''
	for road in agent_path[selected_id[i]]:
		if road==pre_road:
			continue
		if road not in road_dict:
			road_dict[road] = [0]*(cluster_num+1)
		road_dict[road][cluster_idx] += 1
		pre_road = road

print('total road without repeat: ', len(road_dict))



