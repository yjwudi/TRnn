#encoding=utf-8
import numpy as np
import random
from pyutils.global_variable import cluster_num, id_file, cluster_file
'''
对于交叉熵大的路，统计每条路在不同时间间隔内，每个主题下的出现次数
得到每条路在每个时间间隔内所属的主要主题
high_num_arr 是road_high_number计算出的每一类的高概率道路
road_time，字典，key是道路id，value是list，list中的每个元素是道路在轨迹中出现的时间，对应的出现时的轨迹编号在road_id里
road_time_num, 字典，key是道路id，value是一个二维数组，
road_time_num[key][time_id][cluster_id] 表示道路key在list_id个时间段内，在类cluster_id的出现次数
result是一个list，result[i][j]表示的是第i条路在第j个时间段出现次数最多的id
'''


road_file = 'Data/agent_path/agent_road_0.txt'
time_file = 'Data/agent_path/agent_road_0_time.txt'


# road_arr = [5601, 5642, 5605, 5603, 1321, 5650, 1322, 5628, 5656, 8072, 5598, 5662]
def road_theme_variation(road_arr, high_num_arr):
	# road_arr = [5601, 5642, 5605, 5603, 1321, 5650, 1322, 5628, 5656, 8072, 5598, 5662]
	# print(road_arr)
	selected_id = []
	with open(id_file, 'r') as f:
		data = f.readlines()
		selected_id = list(map(int, data))
	selected_clusterid = np.loadtxt(cluster_file)
	idx_id = dict()#idx_id[agent_idx] = id, means agent_idx belongs to class id
	for i in range(len(selected_id)):
		idx_id[selected_id[i]] = selected_clusterid[i]
	road_time = dict()
	road_id = dict()
	with open(road_file,"r") as f:
		road_data = f.readlines()
		with open(time_file,"r") as f1:
			time_data = f1.readlines()
			for i in range(0,len(road_data),2):
				idx = int(road_data[i])
				idx_check = int(time_data[i])
				if idx not in idx_id:
					continue
				roads = list(map(int,road_data[i+1].split()))
				times = list(map(int,time_data[i+1].split()))
				for j in range(len(roads)):
					road = roads[j]
					if road not in road_time:
						if road==299683:
							print('299683 exits')
						road_time[road] = []
						road_id[road] = []
					road_time[road].append(times[j])
					road_id[road].append(idx_id[idx])
	result = []
	for road in road_arr:
		road = int(road)
		id_lst = []
		for st in range(1, 300, 50):
			ed = st+49
			id_num = dict()
			# id_num[id] = num, means during [st, ed], 道路road在类id中出现了num次，我们要找出最大的num对应的id
			for i in range(len(road_time[road])):
				time = road_time[road][i]
				if time >= st and time <= ed:
					cluster_id = int(road_id[road][i])
					if cluster_id not in id_num:
						id_num[cluster_id] = 1
					else:
						id_num[cluster_id] += 1
			if len(id_num) > 0:
				max_id = max(id_num,key=id_num.get)#出现次数最多的那一类
				id_lst.append(max_id)
			else:
				id_lst.append(-1)
		if int(id_lst[4]) == -1:
			continue
		result.append(id_lst)
	road_time_num = dict()
	for road in high_num_arr:
		road = int(road)
		time_idx = -1
		for st in range(1, 300, 50):
			ed = st + 49
			time_idx += 1
			for i in range(len(road_time[road])):
				time = road_time[road][i]
				if time >= st and time <= ed:
					cluster_id = int(road_id[road][i])
					if road not in road_time_num:
						road_time_num[road] = [[0] * cluster_num for row in range(6)]
					road_time_num[road][time_idx][cluster_id] += 1
	# print(high_num_arr)
	# print('road_time_num')
	# for key in road_time_num:
	# 	print(road_time_num[key])
	# print(result)
	fname = 'static/pcp_test.csv'
	with open(fname,'w') as f:
		f.write('t1,t2,t3,t4,t5,t6\n')
		for i in range(len(result)):
			for j in range(len(result[i])-1):
				f.write(str(result[i][j])+',')
			f.write(str(result[i][-1]))
			f.write('\n')
	connections = []
	for t in range(5):
		con_list = [[0 for col in range(cluster_num)] for row in range(cluster_num)]
		for lst in result:
			a = int(lst[t])
			b = int(lst[t+1])
			if a==-1 or b==-1:
				continue
			con_list[a][b] += 1
		connections.append(con_list)
	# print(connections)
	circles = []
	for t in range(6):
		cle_lst = [0]*cluster_num
		for lst in result:
			if int(lst[t]) == -1:
				continue
			cle_lst[int(lst[t])] += 1
		circles.append(cle_lst)
	# print(circles)
	return connections, circles, road_time_num


