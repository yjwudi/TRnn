#encoding=utf-8
'''
给定地理范围，找到出生点在这个范围内的agent的id并输出
'''
import numpy as np
# id_fname = '../Data/agent_path/all/selected.txt'
# agent_file = '../Data/agent_path/agent_pos_0.txt'
id_fname = 'Data/agent_path/all/selected.txt'
agent_file = 'Data/agent_path/agent_pos_0.txt'

def select_agent_id(traj_map, x1, y1, x2, y2, x_move, y_move):
	x_lower = min(x1, x2)
	x_upper = max(x1, x2)
	y_lower = min(y1, y2)
	y_upper = max(y1, y2)

	agent_id = []
	for tmp_id in traj_map:
		tmp_path = traj_map[tmp_id]
		p1 = np.array(tmp_path[0])
		p2 = np.array(tmp_path[len(tmp_path) - 1])
		dist = np.linalg.norm(p1 - p2)
		if dist < 500:
			continue
		if p1[0]+x_move >= x_lower and p1[0]+x_move <= x_upper and p1[1]+y_move >= y_lower and p1[1]+y_move <= y_upper:
			agent_id.append(tmp_id)

	return agent_id
		

# with open(id_fname, 'w') as f:
# 	for idx in agent_id:
# 		f.write('%d\n'%idx)
























