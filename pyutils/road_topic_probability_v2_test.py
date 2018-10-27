#encoding=utf-8
import numpy as np
'''
得到选取的轨迹的每段路，计算每段路在不同主题下的概率
road_dict是一个字典，key是道路编号，value是一个数组，每个位置时道路在这个类的概率
cluster_road_dict是一个list，每个位置是某个类对应的dict，key是道路编号，value是这个道路在这类的概率
'''
# agent_file = 'Data/agent_path/agent_road_0.txt'
# id_file = 'Data/agent_path/selected.txt'
# cluster_file = 'Data/agent_path/selected_cluster_1.txt'
agent_file = '../Data/agent_path/agent_road_0.txt'
id_file = '../Data/agent_path/selected.txt'
cluster_file = '../Data/agent_path/selected_cluster_1.txt'

def road_topic_prob():
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
	with open(agent_file,"r") as f:
		data = f.readlines()
		for i in range(0,len(data),2):
			idx = int(data[i])
			path = map(int,data[i+1].split())
			agent_path[idx] = path

	for i in range(len(selected_id)):
		cluster_idx = int(selected_clusterid[i])
		pre_road = 0
		for road in agent_path[selected_id[i]]:
			if road==pre_road:
				continue
			if road not in road_dict:
				road_dict[road] = [0]*cluster_num
			road_dict[road][cluster_idx] += 1
			pre_road = road

	print('total road without repeat: ', len(road_dict))
	cluster_road_dict = []
	for i in range(cluster_num):
		cluster_road_dict.append(dict())
	for key in road_dict:
		sum_ = 0
		for v in road_dict[key]:
			sum_ += v
		for i in range(len(road_dict[key])):
			road_dict[key][i] = road_dict[key][i]/sum_
			cluster_road_dict[i][key] = road_dict[key][i]
		# sum_ = 0
		# for v in road_dict[key]:
		# 	if v > 0:
		# 		sum_ += 1
		# if sum_>1:
		# 	print(road_dict[key])
	for i in range(cluster_num):
		cluster_road_dict[i] = sorted(cluster_road_dict[i].items(), key=lambda item:item[1], reverse=True)
	print(cluster_road_dict[2])
	print(cluster_road_dict[3])
	return road_dict, cluster_road_dict


road_topic_prob()

