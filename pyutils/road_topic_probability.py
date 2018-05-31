#encoding=utf-8
import numpy as np
'''
得到选取的轨迹的每段路，计算每段路在不同主题下的概率
'''
agent_file = '../Data/agent_path/agent_road_0_new_formated.txt'
id_file = '../Data/agent_path/selected.txt'

selected_id = []
with open(id_file, 'r') as f:
	data = f.readlines()
	selected_id = list(map(int, data))
print('selected_id[0]=',selected_id[0])

road_dict = dict()#{<x, y>, idx}
max_x = 8981.0
max_y = 4966.0
agent_path = []
road_sum = 0
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
		road_sum += line_num
		if agent_id in selected_id:
			my_path = []
			for j in range(i, i+line_num):
				pos = data[j].split()
				pos = list(map(float, pos))
				pos[0] = pos[0]/max_x
				pos[1] = pos[1]/max_y
				road_dict[data[j]] = len(road_dict)
				my_path.append(pos)
			agent_path.append(my_path)
		i = i+line_num
print('total road: ', road_sum)
print('total road without repeat: ', len(road_dict))
