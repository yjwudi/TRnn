import numpy as np
'''
根据city_grid.txt得到哪些点是城市，每行一个x,y坐标，坐标范围分别是[0,9600],[0,5400]
'''
citymat_file = '../Data/city_grid.txt'
building_file = '../Data/building.txt'
city_mat = np.loadtxt(citymat_file)
sz = np.shape(city_mat)
print(np.shape(city_mat))
i = 0
with open(building_file,"w") as f:
	for r in range(sz[0]):
		for c in range(sz[1]):
			if int(city_mat[r][c])==1:
				if i%3==0:
					f.write('%d %d\n'%(r, c))
				i += 1