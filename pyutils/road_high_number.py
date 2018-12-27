from pyutils.global_variable import cluster_num, id_file, cluster_file

agent_road_file = 'Data/agent_path/agent_road_0.txt'
selected_id_file = id_file #'Data/agent_path/selected.txt'
selected_cluster_file = cluster_file #'Data/agent_path/selected_cluster_1.txt'
outfile = 'static/road_number.tsv'

'''
从每一类中找到single_target个通过人数最多的道路
agent_road[idx] 第idx个人经过的道路list
road_high_number_set保存了每个类别的single_target个通过次数最高的路，一共是类别数*single_target个元素
road_cluster_dict[road][cid] 编号为road的道路在cid这一类中出现的次数
'''
def read_single_file(fname):
	arr = []
	with open(fname, 'r') as f:
		data = f.readlines()
		for _ in data:
			arr.append(int(_))
	return arr
def road_high_number():
	selected_id = read_single_file(selected_id_file)
	selected_cluster_id = read_single_file(selected_cluster_file)
	agent_road = dict()
	with open(agent_road_file,"r") as f:
		data = f.readlines()
		for i in range(0,len(data),2):
			idx = int(data[i])
			path = list(map(int,data[i+1].split()))
			agent_road[idx] = path

	#每条道路对应的人数
	# road_number_dict = dict()
	# for idx in selected_id:
	# 	for road in agent_road[idx]:
	# 		if road not in road_number_dict:
	# 			road_number_dict[road] = 1
	# 		else:
	# 			road_number_dict[road] += 1

	single_target = 10 #每一类应该贡献的道路数量
	road_high_number_set = []
	for cid in range(cluster_num):
		tmp_dict = dict()
		for i in range(len(selected_id)):
			if selected_cluster_id[i] != cid:
				continue
			for road in agent_road[selected_id[i]]:
				if road not in tmp_dict:
					tmp_dict[road] = 1 #road_number_dict[road]
				else:
					tmp_dict[road] += 1 #road_number_dict[road]
		tmp_dict = sorted(tmp_dict.items(), key=lambda item:item[1], reverse=True)
		sum_ = 0
		for pair in tmp_dict:
			if pair[0] in road_high_number_set:
				continue
			sum_ += 1
			road_high_number_set.append(pair[0])
			if sum_ >= single_target:
				break
	# print(road_high_number_set)

	#道路在每一类中的人数，key为道路编号，value为list，第i个元素为在第i类中的人数
	road_cluster_dict = dict()
	for road in road_high_number_set:
		road_cluster_dict[road] = [0]*cluster_num
	for i in range(len(selected_id)):
		idx = selected_id[i]
		cid = selected_cluster_id[i]
		for road in agent_road[idx]:
			if road in road_high_number_set:
				road_cluster_dict[road][cid] += 1
	# print(road_cluster_dict)

	with open(outfile, 'w') as f:
		f.write('cluster\troad\tvalue\tridx\n')
		for cid in range(cluster_num):
			i = 1
			for road in road_cluster_dict:
				f.write('%d\t%d\t%d\t%d\n'%(cid, i, road_cluster_dict[road][cid], road))
				i += 1
	return road_high_number_set
# road_high_number()