import struct
from flask import Flask, render_template

app = Flask(__name__)

river_file = 'Data/river.dat'
city_file = 'Data/city.dat'
shelter_file = 'Data/shelter.dat'

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
			pos[0] -= 5391
			pos[1] -= 61852.5
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
			x = struct.unpack('f', f.read(4))[0]-5391
			y = struct.unpack('f', f.read(4))[0]-61852.5
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
    vertices1, faces1 = read_triangle_file_bin(city_file)
    city_map['city_vertices'] = vertices1
    city_map['city_faces'] = faces1
    print(len(vertices1))
    vertices2, faces2 = read_triangle_file_bin(shelter_file)
    city_map['shelter_vertices'] = vertices2
    city_map['shelter_faces'] = faces2
    return render_template("map.html", geo=city_map)

if __name__ == '__main__':
	app.run()