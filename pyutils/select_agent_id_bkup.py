# encoding=utf-8
'''
给定地理范围，找到出生点在这个范围内的agent的id并输出
'''
import numpy as np

# id_fname = '../Data/agent_path/all/selected.txt'
# agent_file = '../Data/agent_path/agent_pos_0.txt'
id_fname = 'Data/agent_path/all/selected.txt'
agent_file = 'Data/agent_path/agent_pos_0.txt'


def select_agent_id(x1, y1, x2, y2):
    x_lower = min(x1, x2)
    x_upper = max(x1, x2)
    y_lower = min(y1, y2)
    y_upper = max(y1, y2)

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
            for j in range(i, i + tmp_num):
                pos = data[j].split()
                pos = map(float, pos)
                pos = list(pos)
                tmp_path.append(pos)
            i = i + tmp_num
            if len(tmp_path) < 10:
                continue
            p1 = np.array(tmp_path[0])
            p2 = np.array(tmp_path[len(tmp_path) - 1])
            dist = np.linalg.norm(p1 - p2)
            if dist < 500:
                continue
            if p1[0] >= x_lower and p1[0] <= x_upper and p1[1] >= y_lower and p1[1] <= y_upper:
                # for pos in tmp_path:
                # 	p = np.array(pos)
                # 	if p[0] > 5580 and p[1] < 62590:
                # 		print(tmp_id)
                agent_id.append(tmp_id)
    return agent_id

# with open(id_fname, 'w') as f:
# 	for idx in agent_id:
# 		f.write('%d\n'%idx)
























