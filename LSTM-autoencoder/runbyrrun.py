import rrun

client = rrun.Client()

spec = rrun.RunnerSpec()
spec.name = 'my-work/my-runner'
spec.commands[:] = ['python', 'test.py']
spec.log_dir = '/home/liuyingjie/LSTM-autoencoder-master/logs'
spec.scheduling_hint.group = '' # Inherit from master
spec.resources.cpu = 4
spec.resources.gpu = 1
spec.resources.memory_in_mb = 4096
spec.preemptible = True
spec.max_wait_time = 24 * 3600 * int(1e9)
spec.minimum_lifetime = 24 * 3600 * int(1e9)

# Fill in several fields in runner spec from current environment.
rrun.fill_runner_spec(
    spec,
    environments=True, # Propagate environment variables to runner
    uid_gid=True, # Propagate linux uid and gids to runner
    share_dirs=True, # Propagate writability of share directories to runner
    work_dir=True, # Propagate current working directory to runner
)

response = client.start_runner(rrun.StartRunnerRequest(spec=spec))
runner_id = response.id
print(runner_id)