#encoding=utf-8
import numpy as np
import random
'''
对于交叉熵大的路，统计每条路在不同时间间隔内，每个主题下的出现次数
得到每条路在每个时间间隔内所属的主要主题
'''

id_file = 'Data/agent_path/v1/selected.txt'
cluster_file = 'Data/agent_path/v1/selected_cluster_1.txt'
road_file = 'Data/agent_path/agent_road_0.txt'
time_file = 'Data/agent_path/agent_road_0_time.txt'


# road_arr = [5601, 5642, 5605, 5603, 1321, 5650, 1322, 5628, 5656, 8072, 5598, 5662]
def road_theme_variation(road_arr):
	selected_id = []
	with open(id_file, 'r') as f:
		data = f.readlines()
		selected_id = list(map(int, data))
	selected_clusterid = np.loadtxt(cluster_file)
	idx_id = dict()#idx_id[agent_idx] = id, means agent_idx belongs to class id
	for i in range(len(selected_id)):
		idx_id[selected_id[i]] = selected_clusterid[i]
	road_time = dict()# road_time[road] = a list of time, in which the road is in a traj
	road_id = dict()
	# road_id[road] = a list of id, a road appears in a traj in time (road_time[raod]) and the traj's class is id
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
						road_time[road] = []
						road_id[road] = []
					road_time[road].append(times[j])
					road_id[road].append(idx_id[idx])
	result = []
	for road in road_arr:
		id_lst = []
		for st in range(1, 300, 50):
			ed = st+49
			id_num = dict()
			# id_num[id] = num, means during [st, ed], 道路road在类id中出现了num次，我们要找出最大的num对应的id
			for i in range(len(road_time[road])):
				time = road_time[road][i]
				if time >= st and time <= ed:
					cluster_id = road_id[road][i]
					if cluster_id not in id_num:
						id_num[cluster_id] = 1
					else:
						id_num[cluster_id] += 1
			if len(id_num) > 0:
				max_id = max(id_num,key=id_num.get)#出现次数最多的那一类
				id_lst.append(max_id)
			else:
				if len(id_lst)==0:
					id_lst.append(-1)
				else:
					id_lst.append(id_lst[-1])
		last_id = id_lst[-1]
		for i in range(len(id_lst)-1, -1, -1):
			if id_lst[i] == -1:
				id_lst[i] = last_id
			last_id = id_lst[i]
		result.append(id_lst)
	# print(result)
	fname = 'static/pcp_test.csv'
	with open(fname,'w') as f:
		f.write('t1,t2,t3,t4,t5,t6\n')
		for i in range(len(result)):
			for j in range(len(result[i])-1):
				m = random.uniform(-0.2,0.2)
				f.write(str(result[i][j]+m)+',')
			f.write(str(result[i][-1]))
			f.write('\n')


