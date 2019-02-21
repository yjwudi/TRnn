import numpy as np
import pymongo

def get_feature(selected_id):
    myclient = pymongo.MongoClient("mongodb://localhost:27017/")
    mydb = myclient["featuredb"]
    mycol = mydb["sites"]
    feature_arr = []
    myquery = {"id": {"$in": selected_id}}
    x = mycol.find(myquery)
    for i in x:
        feature = np.array(i["feature"])
        feature_arr.append(feature)
    return feature_arr