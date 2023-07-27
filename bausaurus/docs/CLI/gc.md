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

```sh
gc
```

```txt
Usage: gc [options] [command]

Options:
  -V, --version                  output the version number
  -i, --infra <file>             infrastructure default is iac.js
  -c, --config <file>            config file, default is config.js
  -r, --resource <file>          additional resource file
  -j, --json <file>              write result to a file in json format
  -d, --workingDirectory <file>  The working directory.
  --noOpen                       Do not open diagram
  -h, --help                     display help for command

Commands:
  info [options]                 Get Information about the current project
  new [options]                  Create a new project
  init|i                         Initialise the cloud providers
  uninit|u                       Un-initialise the cloud providers
  plan|p [options]               Find out which resources need to be deployed or destroyed
  run|r [options]                run onDeployed or onDestroy
  apply|a [options]              Apply the plan, a.k.a deploy the resources
  destroy|d [options]            Destroy the resources
  list|l [options]               List the live resources
  output|o [options]             Output the value of a resource
  graph|gt [options]             Output the target resources in a dot file and a graphical format such as SVG
  tree|t [options]               Output the target resources as a mind map tree
  gencode|c [options]            Generate infrastruture code from deployed resources
  help [command]                 display help for command
```
