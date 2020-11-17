---
id: Output
title: Output Resources
---

The **output** commands queries the current live resources information

```
gc output --type Ip --name myip --field address
```

## Command options

```
gc output --help
```

```
Usage: gc output|o [options]

Output the value of a resource

Options:
  -n, --name <value>      resource name
  -t, --type <value>      resource type
  -f, --field <value>     the resource field to get
  -p, --provider <value>  Filter by provider, multiple values allowed
  -h, --help              display help for command
```
