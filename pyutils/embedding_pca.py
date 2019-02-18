from sklearn.decomposition import PCA
from global_variable import cluster_num
import numpy as np

feature_file = '../Data/agent_path/v0/selected_feature.txt'
cluster_file = '../Data/agent_path/v0/selected_cluster_1.txt'

feature_arr = np.loadtxt(feature_file)
cid_arr = np.loadtxt(cluster_file)

X_pca = PCA(n_components=2).fit_transform(feature_arr)
fname = 'tmp.csv'
with open(fname,'w') as f:
	f.write('x,y,c\n')
	for i in range(len(X_pca)):
		f.write(str(X_pca[i][0]*10)+',')
		f.write(str(X_pca[i][1]*10)+',')
		f.write(str(cid_arr[i])+'\n')