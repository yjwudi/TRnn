from sklearn.cluster import KMeans
import numpy as np


id_file = '../Data/agent_path/selected.txt'
feature_file = '../Data/agent_path/selected_feature.txt'


id_arr = np.load_txt(id_file)
feature_arr = np.load_txt(feature_file)
print(np.shape(id_arr))
print(np.shape(feature_arr))


feature_0 = feature_arr[0:len(feature):2]
feature_1 = feature_arr[1:len(feature):2]
feature_total = np.concatenate((feature_0,feature_1),axis=1)

kmeans_0 = KMeans(n_clusters=6, random_state=0).fit(feature_0)
kmeans_1 = KMeans(n_clusters=6, random_state=0).fit(feature_1)
kmeans_total = KMeans(n_clusters=6, random_state=0).fit(feature_total)

np.savetxt('../Data/agent_path/selected_cluster_0.txt', kmeans_0.labels_)
np.savetxt('../Data/agent_path/selected_cluster_1.txt', kmeans_1.labels_)
np.savetxt('../Data/agent_path/selected_cluster_total.txt', kmeans_total.labels_)