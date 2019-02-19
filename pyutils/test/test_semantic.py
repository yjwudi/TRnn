from sklearn.cluster import KMeans
import numpy as np

id_file = '../../Data2/agent_path/v0/selected.txt'
feature_file = '../../Data2/agent_path/v0/selected_feature.txt'


id_arr = np.loadtxt(id_file)
feature_arr = np.loadtxt(feature_file)
print(np.shape(id_arr))
print(np.shape(feature_arr))

kmeans_total = KMeans(n_clusters=3, random_state=0).fit(feature_arr)

centers = kmeans_total.cluster_centers_
print(centers)

id_file = '../../Data2/agent_path/v1/selected.txt'
feature_file = '../../Data2/agent_path/v1/selected_feature.txt'
id_arr = np.loadtxt(id_file)
feature_arr = np.loadtxt(feature_file)
mylabels = []
for feature in feature_arr:
    min_dist = np.linalg.norm(feature - centers[0])
    print(min_dist)
    tmp_label = 0
    for i in range(1,3):
        tmp_dist = np.linalg.norm(feature - centers[i])
        print(tmp_dist)
        if tmp_dist < min_dist:
            min_dist = tmp_dist
            tmp_label = i
    mylabels.append(tmp_label)
    print("")
np.savetxt('../../Data2/agent_path/v1/selected_cluster_1.txt', mylabels, fmt='%d')