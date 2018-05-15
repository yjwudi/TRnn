#encoding=utf-8
import numpy as np 

'''
将每个人的path中的每段路变成中点的二维坐标
'''

path_file = '../Data/agent_path/agent_road_0.txt'
road_file = '../Data/road.txt'
new_path_file = '../Data/agent_path/agent_road_0_new.txt'

road_point = []
road_index = []
with open(road_file,"r") as f:
	data = f.readlines()
	tmp = data[0].split()
	point_num = int(tmp[0])
	road_num = int(tmp[1])
	for i in range(1,point_num+1):
		point = data[i].split()
		point = map(float,point)
		road_point.append(point)
	for i in range(point_num+1, len(data)):
		idx = data[i].split()
		idx = map(int, idx)
		road_index.append(idx)



agent_id = []
agent_path = []
with open(path_file,"r") as f:
	data = f.readlines()
	for i in range(0,len(data),2):
		idx = int(data[i])
		path = map(int,data[i+1].split())
		agent_id.append(idx)
		agent_path.append(path)

new_agent_path = []
for i in range(len(agent_id)):
	path = agent_path[i]
	tmp_path = []
	for road_idx in path:
		road = road_index[road_idx]
		p1 = road_point[road[0]]
		p2 = road_point[road[1]]
		tmp_path.append([int((p1[0]+p2[0])/2.0),int((p1[1]+p2[1])/2.0)])
	new_agent_path.append(tmp_path)

with open(new_path_file, "w") as f:
	for i in range(len(agent_id)):
		f.write('%d %d\n'%(agent_id[i],len(new_agent_path[i])))
		for p in new_agent_path[i]:
			f.write('%d %d\n'%(p[0], p[1]))
























