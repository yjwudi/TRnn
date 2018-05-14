import numpy as np
from default import *


random_sequences = np.random.randint(up_bound, size=total_num*step_num*elem_num)
np.savetxt(fname, random_sequences);
# x = np.loadtxt('rand_data.txt').reshape([batch_num,step_num,elem_num])
# print(x.shape)
# print(x[0])
# with open('rand_data.txt','w') as f:
# 	random_sequences = np.random.randint(up_bound, size=batch_num*step_num*elem_num).reshape([batch_num,step_num,elem_num])
# 	f.write(random_sequences)
