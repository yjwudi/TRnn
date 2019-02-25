from sklearn.cluster import KMeans
from sklearn.decomposition import PCA
from pyutils.get_feature import get_feature

def read_single_file(fname):
	arr = []
	with open(fname, 'r') as f:
		data = f.readlines()
		for _ in data:
			arr.append(int(_))
	return arr

def cluster_attention(selected_id, cluster_num, case_id):
    print('reeeeead', case_id)
    feature_arr = get_feature(selected_id)
    kmeans_total = KMeans(n_clusters=cluster_num, random_state=0).fit(feature_arr)
    selected_cluster_id = []
    for _ in kmeans_total.labels_:
        selected_cluster_id.append(int(_))
    f1 = ""
    f2 = ""
    if case_id==1 and cluster_num==3:
        f1 = 'Data2/agent_path/v'+str(case_id)+'/selected.txt'
        f2 = 'Data2/agent_path/v'+str(case_id)+'/selected_cluster_1.txt'
    if case_id==2 and cluster_num==2:
        f1 = 'Data2/agent_path/v' + str(case_id) + '/selected.txt'
        f2 = 'Data2/agent_path/v' + str(case_id) + '/selected_cluster_1.txt'
    if f1!="":
        tmp_id = read_single_file(f1)
        tmp_cluster_id = read_single_file(f2)
        tmp_dict = {}
        for i in range(len(tmp_id)):
            tmp_dict[tmp_id[i]] = tmp_cluster_id[i]
        selected_cluster_id = []
        for idx in selected_id:
            selected_cluster_id.append(tmp_dict[idx])


    X_pca = PCA(n_components=2).fit_transform(feature_arr)
    fname = 'static/pca0.csv'
    with open(fname, 'w') as f:
        f.write('x,y,c,id\n')
        for i in range(len(X_pca)):
            f.write(str(X_pca[i][0] * 10) + ',')
            f.write(str(X_pca[i][1] * 10) + ',')
            f.write(str(kmeans_total.labels_[i]) + ',')
            f.write(str(int(selected_id[i])) + '\n')

    return selected_cluster_id, kmeans_total.cluster_centers_