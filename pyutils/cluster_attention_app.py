from sklearn.cluster import KMeans
from sklearn.decomposition import PCA
import numpy as np
import pymongo

def cluster_attention(selected_id, cluster_num):
    myclient = pymongo.MongoClient("mongodb://localhost:27017/")
    mydb = myclient["featuredb"]
    mycol = mydb["sites"]
    feature_arr = []
    myquery = {"id": {"$in": selected_id}}
    x = mycol.find(myquery)
    for i in x:
        feature = np.array(i["feature"])
        feature_arr.append(feature)
    kmeans_total = KMeans(n_clusters=cluster_num, random_state=0).fit(feature_arr)
    selected_cluster_id = []
    for _ in kmeans_total.labels_:
        selected_cluster_id.append(int(_))

    X_pca = PCA(n_components=2).fit_transform(feature_arr)
    fname = 'static/pca0.csv'
    with open(fname, 'w') as f:
        f.write('x,y,c,id\n')
        for i in range(len(X_pca)):
            f.write(str(X_pca[i][0] * 10) + ',')
            f.write(str(X_pca[i][1] * 10) + ',')
            f.write(str(kmeans_total.labels_[i]) + ',')
            f.write(str(int(selected_id[i])) + '\n')

    return selected_cluster_id