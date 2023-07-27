---
id: Graph
title: gc graph
---

The **Graph** commands generates the _dot_ file and the _svg_ depicting the target resources and their dependencies.

```sh
gc graph
```

![diagram-target.svg](https://raw.githubusercontent.com/grucloud/grucloud/main/examples/aws/RDS/aurora-v2/artifacts/diagram-target.svg)

> The `graph` command requires [graphviz](https://graphviz.org/) to convert the generated `artifacts/diagram-target.dot` into an image such as `artifacts/diagram-target.svg`

## Command Options

```sh
gc help graph
```

```txt
Usage: gc graph|gt [options]

Output the target resources in a dot file and a graphical format such as SVG

Options:
  --dot-file <dotFile>    output 'dot' file name for the target diagam (default: "artifacts/diagram-target.dot")
  --title <value>         diagram title (default: "subnet-simple")
  -t, --type <type>       file type: png, svg (default: "svg")
  -p, --provider <value>  Filter by provider, multiple values allowed
  -h, --help              display help for command

```
