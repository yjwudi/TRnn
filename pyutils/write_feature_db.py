import pymongo
import numpy as np

id_file = '../Data/agent_path/all/selected.txt'
feature_file = '../Data/agent_path/all/selected_feature.txt'

selected_id = []
with open(id_file, 'r') as f:
    data = f.readlines()
    selected_id = list(map(int, data))
print('selected_id: ', len(selected_id))
feature_arr = np.loadtxt(feature_file)
print('feature_arr shape: ', np.shape(feature_arr))



myclient = pymongo.MongoClient("mongodb://localhost:27017/")
mydb = myclient["featuredb"]
mycol = mydb["sites"]


for i in range(len(selected_id)):
    id = selected_id[i]
    feature = feature_arr[i]
    mydict = {"id":id, "feature":feature.tolist()}
    mycol.insert_one(mydict)

myquery = {"id": 74997}
x = mycol.find(myquery)
print(x)
for i in x:
    feature = np.array(i["feature"])
    print(feature)