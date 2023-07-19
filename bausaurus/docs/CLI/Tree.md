---
id: Tree
title: gc tree
---

The **tree** commands generates a [mind map](https://plantuml.com/mindmap-diagram) tree of the target resources.

```
gc tree
```

## Requirements

The conversion from \*.puml to SVG/PNG is performed by [plantuml](https://plantuml.com/download).
Do not forget to download the [plantuml.jar](https://plantuml.com/download).

## Help

```sh
gc tree --help
```

```txt
Output the target resources as a mind map tree

Options:
  --pumlFile <file>         plantuml output file name (default: "resources-mindmap.puml")
  --title <value>           title (default: "multi")
  -t, --type <type>         file type: png, svg (default: "svg")
  -f, --full                display resources name
  -j, --plantumlJar <type>  plantuml.jar location (default: "/Users/mario/Downloads/plantuml.jar")
  -p, --provider <value>    Filter by provider, multiple values allowed
  -h, --help                display help for command
```

## Example

### Alias

```sh
gc t
```

A kubernetes cluster running on AWS EKS:

![tree-eks](https://raw.githubusercontent.com/grucloud/grucloud/main/examples/starhackit/eks-lean/resources-mindmap.svg)

### Full

```
gc tree --full --pumlFile resources-all-mindmap.svg
```

![tree-eks](https://raw.githubusercontent.com/grucloud/grucloud/main/examples/starhackit/eks-lean/resources-all-mindmap.svg)
