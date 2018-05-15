#encoding=utf-8
import numpy as np
'''
将每个人的path中的每段路变成中点的二维坐标，从小到大排序，坐标映射为序号
'''



fname = '../Data/agent_path/agent_road_0_new.txt'
formated_fname = '../Data/agent_path/agent_road_0_new_formated.txt'

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

# count = [0]*250
# for path in agent_path:
#     count[len(path)] += 1
# for i in range(step_num+5):
#     print(i, count[i])
step_num = 120

for path in agent_path:
    while len(path)<step_num:
        path.insert(0,[0,0])
    while len(path)>step_num:
        del path[0]
print(agent_path[0])

with open(formated_fname,'w') as f:
    for i in range(len(agent_id)):
        f.write('%d %d\n'%(agent_id[i],len(agent_path[i])))
        for p in agent_path[i]:
            f.write('%d %d\n'%(p[0], p[1]))


















