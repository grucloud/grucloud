---
id: Tree
title: Tree
---

The **tree** commands generates a mind map tree of the resources.

```
gc tree
```

## Help

```sh
gc tree --help
```

```txt
Usage: gc tree|t [options]

Output the target resources as a mind map tree

Options:
  --pumlFile <file>       plantuml output file name (default: "resources-mindmap.puml")
  --title <value>         title (default: "multi")
  -t, --type <type>       file type: png, svg (default: "svg")
  -f, --full              display resources name
  -p, --provider <value>  Filter by provider, multiple values allowed
  -h, --help              display help for command
```

## Example

A kubernetes cluster running on AWS EKS:

```sh
gc t
```

![tree-eks](https://raw.githubusercontent.com/grucloud/grucloud/main/examples/starhackit/eks-lean/resources-mindmap.svg)

```
gc tree --full --pumlFile resources-all-mindmap.svg
```

![tree-eks](https://raw.githubusercontent.com/grucloud/grucloud/main/examples/starhackit/eks-lean/resources-all-mindmap.svg)
