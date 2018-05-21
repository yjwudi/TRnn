#encoding=utf-8
import numpy as np 

'''
将所有人在不同时刻的位置放到一个文件里，文件格式
agentid（从0开始编号） 点数
点的坐标
'''

agent_file = '../Data/agent/timestep0_'
total_timestep = 300
# new_agent_file = '../Data/agent_path/agent_pos_0.txt'
new_agent_file = '../Data/agent_path/agent_pos_0/agent_'

agent_pos = []
upper = 75000
for i in range(upper):
	lst = []
	agent_pos.append(lst)

for i in range(total_timestep):
	tmp_file = agent_file+'%07d.txt'%(i*50)
	with open(tmp_file,"r") as f:
		data = f.readlines()
		num = int(data[0])
		pos_arr = []
		for i in range(1, num+1):
			pos = data[i].split()
			# pos = map(float,pos)
			pos_arr.append(pos)
		for i in range(num+1, num+num+1):
			idx = int(data[i])
			agent_pos[idx].append(pos_arr[i-num-1])

# with open(new_agent_file,"w") as f:
# 	for i in range(75000):
# 		f.write('%d %d\n'%(i, len(agent_pos[i])))
# 		for pos in agent_pos[i]:
# 			f.write('%f %f %f\n'%(pos[0],pos[1],pos[2]))
print(agent_pos[0])
for i in range(upper):
	idx = i/5000
	fname = new_agent_file+'%d.txt'%(idx)
	with open(fname,"a") as f:
		f.write('%d %d\n'%(i, len(agent_pos[i])))
		for pos in agent_pos[i]:
			f.write('%s %s %s\n'%(pos[0],pos[1],pos[2]))






















