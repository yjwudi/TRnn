import struct
import os
import copy
import numpy as np
from flask import Flask, render_template, request, jsonify
from random import shuffle
from pyutils.road_topic_probability_v2 import road_topic_prob
from pyutils.road_theme_variation import road_theme_variation
from pyutils.road_high_number import road_high_number
from datetime import timedelta
from pyutils.global_variable import pca_file
from pyutils.global_variable import cluster_num
from pyutils.global_variable import id_file as selected_id_file
from pyutils.global_variable import cluster_file as selected_cluster_file
from pyutils.select_agent_id import select_agent_id
from pyutils.cluster_attention_app import cluster_attention
from pyutils.get_feature import get_feature


app = Flask(__name__)
app.config['SEND_FILE_MAX_AGE_DEFAULT']=timedelta(seconds=1)

river_file = 'Data/river.dat'
city_file = 'Data/city.dat'
citymat_file = 'Data/city_grid.txt'
shelter_file = 'Data/shelter.dat'
building_file = 'Data/building.txt'
road_file = 'Data/road.dat'
# road_file = 'Data/main_road.dat'
agent_road_file = 'Data/agent_path/agent_road_0.txt'

case_id = -1
ce_road_num = 1200
x_move = 5391
y_move = 61852.5
traj_map = {} #traj_map[idx] = [[x1,y1,z1],[x2,y2,z2]...]

def read_triangle_file(fname):
	vertices = []
	faces = []
	with open(river_file, 'r', encoding='UTF-8') as f:
		head = f.readline()
		data = f.readlines()
		head = data[0].split()
		point_num = int(head[0])
		tri_num = int(head[1])
		for i in range(1, point_num+1):
			pos = data[i].split()
			pos = list(map(float, pos))
			pos[0] -= x_move
			pos[1] -= y_move
			vertices.append(pos)
		for i in range(point_num+1, len(data)):
			face = data[i].split()
			face = list(map(int, face))
			faces.append(face)
	return vertices, faces

def read_triangle_file_bin(fname):
	vertices = []
	faces = []
	with open(fname, 'rb') as f:
		# data = f.read(4)
		point_num = struct.unpack('i', f.read(4))[0]
		tri_num = struct.unpack('i', f.read(4))[0]

		for i in range(1, point_num+1):
			x = struct.unpack('f', f.read(4))[0]-x_move
			y = struct.unpack('f', f.read(4))[0]-y_move
			z = struct.unpack('f', f.read(4))[0]
			pos = [x, y, z]
			vertices.append(pos)
		for i in range(point_num+1, point_num+1+tri_num):
			x = struct.unpack('i', f.read(4))[0]
			y = struct.unpack('i', f.read(4))[0]
			z = struct.unpack('i', f.read(4))[0]
			face = [x, y, z]
			faces.append(face)
	return vertices, faces
def read_line_file_bin(fname):
	vertices = []
	faces = []
	with open(fname, 'rb') as f:
		# data = f.read(4)
		point_num = struct.unpack('i', f.read(4))[0]
		tri_num = struct.unpack('i', f.read(4))[0]

		for i in range(1, point_num+1):
			x = struct.unpack('f', f.read(4))[0]-x_move
			y = struct.unpack('f', f.read(4))[0]-y_move
			z = struct.unpack('f', f.read(4))[0]
			pos = [x, y, z]
			vertices.append(pos)
		for i in range(point_num+1, point_num+1+tri_num):
			x = struct.unpack('i', f.read(4))[0]
			y = struct.unpack('i', f.read(4))[0]
			face = [x, y]
			faces.append(face)
	return vertices, faces

def read_single_file(fname):
	arr = []
	with open(fname, 'r') as f:
		data = f.readlines()
		for _ in data:
			arr.append(int(_))
	return arr

def read_traj_file(fname):
	with open(fname, 'r') as f:
		head = f.readline()
		while head:
			head = head.split()
			idx = int(head[0])
			cnt = int(head[1])
			traj = []
			for i in range(cnt):
				co = f.readline()
				co = co.split()
				co = list(map(float, co))
				co[0] -= x_move
				co[1] -= y_move
				traj.append(co)
			traj_map[idx] = traj
			head = f.readline()

city_map = {}
ori_map = {}

def load_data():
	
    vertices, faces = read_triangle_file_bin(river_file)
    city_map['river_vertices'] = vertices
    city_map['river_faces'] = faces

    # vertices1, faces1 = read_triangle_file_bin(city_file)
    # city_map['city_vertices'] = vertices1
    # city_map['city_faces'] = faces1

    city_mat_x = []
    city_mat_y = []
    with open(building_file,"r") as f:
    	data = f.readlines()
    	for co in data:
    		co = co.split()
    		city_mat_x.append(int(co[0])+582-23-x_move)
    		city_mat_y.append(int(co[1])+59205-28-y_move)
    city_map['city_mat_x'] = city_mat_x
    city_map['city_mat_y'] = city_mat_y

    vertices2, faces2 = read_triangle_file_bin(shelter_file)
    city_map['shelter_vertices'] = vertices2
    city_map['shelter_faces'] = faces2

    vertices3, faces3 = read_line_file_bin(road_file)
    city_map['road_vertices'] = vertices3
    city_map['road_lines'] = faces3

    for base in range(15):
    	fname = 'Data2/agent_path/agent_pos_0/agent_'+str(base)+'.txt'
    	read_traj_file(fname)
    selected_id = read_single_file(selected_id_file)
    city_map['selected_id'] = selected_id
    selected_traj = []
    for idx in selected_id:
    	selected_traj.append(traj_map[idx])
    city_map['selected_traj'] = selected_traj

    selected_cluster_id = read_single_file(selected_cluster_file)
    city_map['selected_cluster_id'] = selected_cluster_id

    #返回的cluster_road_dict, ce_dict都是list，每个元素是（key，value）这样的tuple
    road_dict, cluster_road_dict, ce_dict = road_topic_prob(selected_id,selected_cluster_id,cluster_num)
    city_map['cluster_road_dict'] = cluster_road_dict

    road_high_number_set = road_high_number(selected_id,selected_cluster_id,cluster_num)

    ce_road_arr =[]
    ce_road_value = []
    for i in range(min(ce_road_num,len(ce_dict))):
    	ce_road_arr.append(ce_dict[i][0])
    	ce_road_value.append(ce_dict[i][1])

    connections, circles, road_time_num = road_theme_variation(ce_road_arr, road_high_number_set,
															   selected_id,selected_cluster_id,cluster_num)
    city_map['ce_road_arr'] = ce_road_arr
    city_map['ce_road_value'] = ce_road_value
    city_map['connections'] = connections
    city_map['circles'] = circles
    city_map['road_time_num'] = road_time_num

    agent_road = []
    agent_id = []
    with open(agent_road_file,"r") as f:
    	data = f.readlines()
    	for i in range(0,len(data),2):
    		idx = int(data[i])
    		path = list(map(int,data[i+1].split()))
    		agent_id.append(idx)
    		agent_road.append(path)
    city_map['agent_id'] = agent_id
    city_map['agent_road'] = agent_road
    city_map['cluster_num'] = cluster_num
    city_map['pca_file'] = pca_file
    global ori_map
    ori_map = copy.deepcopy(city_map)

@app.context_processor
def override_url_for():
    return dict(url_for=dated_url_for)
 
def dated_url_for(endpoint, **values):
    if endpoint == 'static':
        filename = values.get('filename', None)
    if filename:
        file_path = os.path.join(app.root_path, endpoint, filename)
        values['q'] = int(os.stat(file_path).st_mtime)
        return url_for(endpoint, **values)

@app.route('/')
def hello_world():
    return render_template("index.html", geo=ori_map)

@app.route("/select_region",methods=['POST','GET'])
def select_region():
	data = request.get_json(force=True)
	x1 = data['regionx1']
	y1 = data['regiony1']
	x2 = data['regionx2']
	y2 = data['regiony2']
	all_id = select_agent_id(traj_map, x1, y1, x2, y2, x_move, y_move)
	shuffle(all_id)
	selected_id = all_id[0:int(len(all_id)*0.8)]
	selected_id_test = all_id[int(len(all_id)*0.8):]
	global case_id
	case_id = -1
	return json_data(selected_id, selected_id_test)

@app.route("/select_case",methods=['POST','GET'])
def select_case():
	data = request.get_json(force=True)
	idx = data['idx']
	tmp_id = np.loadtxt('Data2/agent_path/v'+str(idx)+'/selected.txt')
	all_id = []
	for v in tmp_id:
		all_id.append(int(v))
	shuffle(all_id)
	selected_id = all_id[0:int(len(all_id) * 0.8)]
	print(len(selected_id))
	selected_id_test = all_id[int(len(all_id) * 0.8):]
	global case_id
	case_id = idx
	return json_data(selected_id, selected_id_test)

def json_data(selected_id, selected_id_test):
	city_map['selected_id'] = selected_id
	city_map['selected_id_test'] = selected_id_test
	selected_traj = []
	selected_traj_test = []
	for idx in selected_id:
		selected_traj.append(traj_map[idx])
	city_map['selected_traj'] = selected_traj
	for idx in selected_id_test:
		selected_traj_test.append(traj_map[idx])
	city_map['selected_traj_test'] = selected_traj_test

	return jsonify({'selected_id': selected_id,
					'selected_traj': selected_traj,
					'selected_cluster_id': [0] * len(selected_id)
					})

@app.route("/start_cluster",methods=['POST','GET'])
def start_cluster():
	data = request.get_json(force=True)
	cluster_num = data['cluster_num']
	city_map['cluster_num'] = cluster_num
	selected_id = city_map['selected_id']
	selected_cluster_id, city_map['cluster_centers'] = cluster_attention(selected_id, cluster_num, case_id)
	city_map['selected_cluster_id'] = selected_cluster_id

	road_dict, cluster_road_dict, ce_dict = road_topic_prob(selected_id, selected_cluster_id, cluster_num)
	road_high_number_set = road_high_number(selected_id, selected_cluster_id, cluster_num)

	ce_road_arr = []
	ce_road_value = []
	for i in range(min(ce_road_num, len(ce_dict))):
		ce_road_arr.append(ce_dict[i][0])
		ce_road_value.append(ce_dict[i][1])
	connections, circles, road_time_num = road_theme_variation(ce_road_arr, road_high_number_set,
															   selected_id, selected_cluster_id, cluster_num)
	semantics_dict = {}
	for i in range(cluster_num):
		semantics_dict[i] = 'Unknown'
	return jsonify({'selected_cluster_id': selected_cluster_id,
					'ce_road_arr':ce_road_arr,
					'ce_road_value':ce_road_value,
					'connections':connections,
					'circles':circles,
					'road_time_num':road_time_num,
					'semantics_dict':semantics_dict})

@app.route("/cluster_test",methods=['POST','GET'])
def cluster_test():
	cluster_num = city_map['cluster_num']
	cluster_centers = city_map['cluster_centers']
	dist_threshold = 10
	selected_id_test = city_map['selected_id_test']
	selected_cluster_id_test = [-1]*len(selected_id_test)
	feature_arr = get_feature(selected_id_test)
	for idx in range(len(selected_id_test)):
		min_dist = dist_threshold+1
		for i in range(cluster_num):
			dist = np.linalg.norm(feature_arr[idx]-cluster_centers[i])
			if dist < min_dist:
				min_dist = dist
				selected_cluster_id_test[idx] = i
	for i in range(len(selected_id_test)):
		if selected_cluster_id_test[i]==-1:
			selected_cluster_id_test[i] = cluster_num
	cluster_num += 1
	return jsonify({'selected_id': selected_id_test,
					'selected_cluster_id': selected_cluster_id_test,
					'selected_traj': city_map['selected_traj_test']
					})

@app.route("/show_train",methods=['POST','GET'])
def show_train():
	return jsonify({'selected_id': city_map['selected_id'],
					'selected_cluster_id': city_map['selected_cluster_id'],
					'selected_traj': city_map['selected_traj']
					})

if __name__ == '__main__':
	load_data()
	app.run(host='0.0.0.0',port=5000,debug=True)