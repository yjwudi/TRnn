import pymongo
import numpy as np

myclient = pymongo.MongoClient("mongodb://localhost:27017/")
mydb = myclient["featuredb"]
mycol = mydb["sites"]


# myquery = {"id": {"$in": [68951,44,21]}}
# x = mycol.find(myquery)
# print(x)
# for i in x:
# 	print(i)
# 	feature = np.array(i["feature"])
# 	print(i["id"])
# 	print(feature)

from pyutils.get_feature import get_feature
test_list = [68951,44,21,31873]
feature_arr = get_feature(test_list)
#print(feature_arr[0])
for v in feature_arr:
	print(v)