from sklearn.cluster import KMeans,estimate_bandwidth,MeanShift
from sklearn.cluster import DBSCAN,AgglomerativeClustering
import numpy as np
from global_variable import cluster_num


id_file = '../Data/agent_path/selected.txt'
feature_file = '../Data/agent_path/selected_feature.txt'


id_arr = np.loadtxt(id_file)
feature_arr = np.loadtxt(feature_file)
print(np.shape(id_arr))
print(np.shape(feature_arr))


feature_0 = feature_arr[0:len(feature_arr):2]
feature_1 = feature_arr[1:len(feature_arr):2]
feature_total = np.concatenate((feature_0,feature_1),axis=1)

#KMeans
kmeans_0 = KMeans(n_clusters=cluster_num, random_state=0).fit(feature_0)
kmeans_1 = KMeans(n_clusters=cluster_num, random_state=0).fit(feature_1)
kmeans_total = KMeans(n_clusters=cluster_num, random_state=0).fit(feature_total)


np.savetxt('../Data/agent_path/v1/selected_cluster_0.txt', kmeans_0.labels_, fmt='%d')
np.savetxt('../Data/agent_path/v1/selected_cluster_1.txt', kmeans_1.labels_, fmt='%d')
np.savetxt('../Data/agent_path/v1/selected_cluster_total.txt', kmeans_total.labels_, fmt='%d')

# PCA
from sklearn.manifold import TSNE
from sklearn.datasets import load_iris,load_digits
from sklearn.decomposition import PCA
import matplotlib.pyplot as plt
import os

X_pca = PCA(n_components=2).fit_transform(feature_1)

kmeans_1 = KMeans(n_clusters=cluster_num, random_state=0).fit(feature_1)
plt.figure(figsize=(10, 5))
plt.scatter(X_pca[:, 0], X_pca[:, 1], c =kmeans_1.labels_, label="PCA")
print(np.shape(X_pca))
fname = '../static/cluster.csv'
with open(fname,'w') as f:
	f.write('x,y,c\n')
	for i in range(len(X_pca)):
		f.write(str(X_pca[i][0]*10)+',')
		f.write(str(X_pca[i][1]*10)+',')
		f.write(str(kmeans_1.labels_[i])+'\n')

# DBSCAN
# eps表示两个点为同一类时距离不能超过eps
# clustering = DBSCAN(eps=0.045, min_samples=20).fit(X_pca)
# np.savetxt('../Data/agent_path/selected_cluster_1_DBSCAN.txt', clustering.labels_, fmt='%d')
# plt.figure(figsize=(10, 5))
# plt.scatter(X_pca[:, 0], X_pca[:, 1], c = clustering.labels_, label="PCA")
# plt.show()

# Meanshift
# bandwidth = estimate_bandwidth(X_pca, quantile=0.2, n_samples=200)
# ms = MeanShift(bandwidth=bandwidth, bin_seeding=True)
# ms.fit(X_pca)
# np.savetxt('../Data/agent_path/selected_cluster_1_meanshift.txt', ms.labels_, fmt='%d')
# plt.figure(figsize=(10, 5))
# plt.scatter(X_pca[:, 0], X_pca[:, 1], c = ms.labels_, label="PCA")
# plt.show()