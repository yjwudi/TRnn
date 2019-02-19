#encoding=utf-8
'''
把某些类筛掉
'''
import numpy as np
id_file = '../Data/agent_path/v1/selected.txt'
cid_file = '../Data/agent_path/v1/selected_cluster_1.txt'
feature_file = '../Data/agent_path/v1/selected_feature.txt'

id_arr = np.loadtxt(id_file)
cid_arr = np.loadtxt(cid_file)
feature_arr = np.loadtxt(feature_file)

new_id_arr = []
new_cid_arr = []
new_feature_arr = []

for i in range(len(id_arr)):
    if cid_arr[i]==2 or cid_arr[i]==4:
        new_id_arr.append(id_arr[i])
        new_feature_arr.append(feature_arr[i])
for i in range(len(id_arr)):
    if cid_arr[i]==2:
        new_cid_arr.append(0)
    if cid_arr[i] == 4:
        new_cid_arr.append(1)


np.savetxt('../Data/agent_path/vv/selected.txt', new_id_arr, fmt='%d')
np.savetxt('../Data/agent_path/vv/selected_cluster_1.txt', new_cid_arr, fmt='%d')
np.savetxt('../Data/agent_path/vv/selected_feature.txt', new_feature_arr)

