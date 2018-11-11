#encoding=utf-8
'''
给定地理范围，找到出生点在这个范围内的agent的id并输出
'''
import numpy as np
id_fname = '../Data/agent_path/v1/selected.txt'
agent_file = '../Data/agent_path/agent_pos_0.txt'
x_lower = 5286.63
x_upper = 6292.56
y_lower = 62412.6
y_upper = 62893.6

agent_id = []
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
		if len(tmp_path)<10:
			continue
		p1 = np.array(tmp_path[0])
		p2 = np.array(tmp_path[len(tmp_path)-1])
		dist = np.linalg.norm(p1 - p2)
		if dist < 500:
			continue
		if p1[0]>=x_lower and p1[0]<=x_upper and p1[1]>=y_lower and p1[1]<=y_upper:
			# for pos in tmp_path:
			# 	p = np.array(pos)
			# 	if p[0] > 5580 and p[1] < 62590:
			# 		print(tmp_id)
			agent_id.append(tmp_id)
		

with open(id_fname, 'w') as f:
	for idx in agent_id:
		f.write('%d\n'%idx)
























