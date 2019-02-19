import pymongo
import numpy as np

myclient = pymongo.MongoClient("mongodb://localhost:27017/")
mydb = myclient["featuredb"]
mycol = mydb["sites"]


myquery = {"id": {"$in": [74997,14,15,17]}}
x = mycol.find(myquery)
print(x)
for i in x:
	print(i)
	feature = np.array(i["feature"])
	# print(feature)