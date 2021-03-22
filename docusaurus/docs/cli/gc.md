---
id: gc
title: gc
---

The **gc** command line interface is a short for GruCloud.
It is a _node js_ application which can be installed with _npm_

```bash
npm i -g @grucloud/core
```

Now check that **gc** is installed correctly:

```
gc
```

```
Usage: gc [options] [command]

Options:
  -V, --version        output the version number
  -i, --infra <file>   infrastructure default is iac.js
  -j, --json <file>    write result to a file in json format
  -h, --help           display help for command

Commands:
  info                 Get Information about the current project
  init|i               Initialise the cloud providers
  uninit|u             Un-initialise the cloud providers
  plan|p [options]     Find out which resources need to be deployed or destroyed
  run|r [options]      run onDeployed or onDestroy
  apply|a [options]    Apply the plan, a.k.a deploy the resources
  destroy|d [options]  Destroy the resources
  list|l [options]     List the resources
  output|o [options]   Output the value of a resource
  help [command]       display help for command
```
