import matplotlib.pyplot as plt
import numpy as np

loss_file1 = '../attention/logs_mse.txt'
loss_file2 = '../attention/logs_mse_noattn.txt'
start = 0
steps = 12320

with open(loss_file1, 'r') as f:
    lines1 = f.readlines()
with open(loss_file2, 'r') as f:
    lines2 = f.readlines()
step_arr = []
loss_arr1 = []
loss_arr2 = []
for i in range(start,steps):
    line = lines1[i].split()
    step = line[5][1:]
    loss = line[7]
    step_arr.append(step)
    loss_arr1.append(loss)
for i in range(start,steps):
    line = lines2[i].split()
    loss = line[7]
    loss_arr2.append(loss)

plt.plot(step_arr, loss_arr1,'r', label='Attention')
plt.plot(step_arr, loss_arr2,'b',label='No Attention')

plt.ylim(ymin = 0, ymax = 0.0015)
plt.xlabel('steps')
plt.ylabel('loss')
plt.legend(bbox_to_anchor=[0.3, 1])
plt.show()
