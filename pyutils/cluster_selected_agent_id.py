from sklearn.cluster import KMeans
from sklearn.cluster import DBSCAN,AgglomerativeClustering
import numpy as np


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
cluster_num = 4
kmeans_0 = KMeans(n_clusters=cluster_num, random_state=0).fit(feature_0)
kmeans_1 = KMeans(n_clusters=cluster_num, random_state=0).fit(feature_1)
kmeans_total = KMeans(n_clusters=cluster_num, random_state=0).fit(feature_total)


np.savetxt('../Data/agent_path/selected_cluster_0.txt', kmeans_0.labels_, fmt='%d')
np.savetxt('../Data/agent_path/selected_cluster_1.txt', kmeans_1.labels_, fmt='%d')
np.savetxt('../Data/agent_path/selected_cluster_total.txt', kmeans_total.labels_, fmt='%d')

# PCA
# from sklearn.manifold import TSNE
# from sklearn.datasets import load_iris,load_digits
# from sklearn.decomposition import PCA
# import matplotlib.pyplot as plt
# import os
# X_tsne = TSNE(n_components=2,random_state=33).fit_transform(feature_1)
# X_pca = PCA(n_components=2).fit_transform(feature_1)

# ckpt_dir="images"
# if not os.path.exists(ckpt_dir):
#     os.makedirs(ckpt_dir)

# kmeans_1 = KMeans(n_clusters=4, random_state=0).fit(feature_1)
# plt.figure(figsize=(10, 5))
# plt.subplot(121)
# plt.scatter(X_tsne[:, 0], X_tsne[:, 1], c =kmeans_1.labels_, label="t-SNE")
# plt.legend()
# plt.subplot(122)
# plt.scatter(X_pca[:, 0], X_pca[:, 1], c =kmeans_1.labels_, label="PCA")
# plt.legend()
# plt.savefig('images/digits_tsne-pca.png', dpi=120)
# plt.show()

# DBSCAN
# eps表示两个点为同一类时距离不能超过eps
# clustering = DBSCAN(eps=0.045, min_samples=20).fit(X_pca)
# np.savetxt('../Data/agent_path/selected_cluster_1_DBSCAN.txt', clustering.labels_, fmt='%d')
# plt.figure(figsize=(10, 5))
# plt.scatter(X_pca[:, 0], X_pca[:, 1], c = clustering.labels_, label="PCA")
# plt.show()

#Meanshift
# bandwidth = estimate_bandwidth(feature_1, quantile=0.002, n_samples=200)
# ms = MeanShift(bandwidth=bandwidth, bin_seeding=True)
# ms.fit(feature_1)
# np.savetxt('../Data/agent_path/selected_cluster_1_meanshift.txt', ms.labels_, fmt='%d')