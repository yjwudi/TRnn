import struct
from flask import Flask, render_template
import numpy as np

app = Flask(__name__)

river_file = 'Data/river.dat'
city_file = 'Data/city.dat'
citymat_file = 'Data/city_grid.txt'
shelter_file = 'Data/shelter.dat'
building_file = 'Data/building.txt'

x_move = 5391
y_move = 61852.5

def read_triangle_file(fname):
	vertices = []
	faces = []
	with open(river_file, 'r', encoding='UTF-8') as f:
		head = f.readline()
		data = f.readlines()
		head = data[0].split()
		print(head[0], head[1])
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

@app.route('/')
def hello_world():

    city_map = {}
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
    return render_template("index.html", geo=city_map)

if __name__ == '__main__':
	app.run()