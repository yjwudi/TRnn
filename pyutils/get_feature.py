import numpy as np
import pymongo

def get_feature(selected_id):
    myclient = pymongo.MongoClient("mongodb://localhost:27017/")
    mydb = myclient["featuredb"]
    mycol = mydb["sites"]
    feature_arr = []
    feature_dict = {}

    myquery = {"id": {"$in": selected_id}}
    x = mycol.find(myquery)
    for i in x:
        feature = np.array(i["feature"])
        idx = i['id']
        feature_dict[idx] = feature
        # feature_arr.append(feature)
    for idx in selected_id:
        feature_arr.append(feature_dict[idx])

    # for idx in selected_id:
    #     # myquery = {"id": {"$in": selected_id}}
    #     myquery = {"id": idx}
    #     x = mycol.find(myquery)
    #     for i in x:
    #         feature = np.array(i["feature"])
    #         feature_arr.append(feature)

    myclient.close()
    return feature_arr