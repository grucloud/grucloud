---
id: Hook
title: Run Hooks
---

The **run** command executes the hooks when the infrastructure is being deployed and destroyed.

They are 2 types of hooks:

- provider hook: run per provider.
- global hook: run globally for all providers.

Execute the provider hooks when the infrastructure is deployed:

```sh
gc run --onDeployed
```

Execute the global hook when the infrastructure is deployed:

```sh
gc run --onDeployedGlobal
```

## Command options

```
gc run --help
```

```
Usage: gc run|r [options]

Run the hooks

Options:
  --onDeployed            Run Post Deploy Hook
  --onDeployedGlobal      Run Global Post Deploy Hook
  --onDestroyed           Run Post Destroy Hook
  --onDestroyedGlobal     Run Global Post Destroy Hook
  -p, --provider <value>  Filter by provider, multiple values allowed
  -h, --help              display help for command
```
