---
id: List
title: gc list
---

The **list** commands lists the live resources.

## Screencast

<div>
    <iframe
    data-autoplay
    src="https://asciinema.org/a/JXYoBtVZKtiZ6BmIhgWCEpIho/iframe?autoplay=true&amp;speed=1&amp;loop=true"
    id="asciicast-iframe-13761"
    name="asciicast-iframe-13761"
    scrolling="no"
    style="width: 100%; height: 600px"
    ></iframe>

</div>

## Command Options

```sh
gc help list
```

```txt
Usage: gc list|l [options]

List the live resources

Options:
  -j, --json <file>            write inventory to a file in json format (default:
                               "artifacts/inventory.json")
  -g, --graph                  create an SVG representation of the live infrastructure
  -a, --all                    List also read-only resources
  -n, --name <value>           List by name
  --id <value>                 List by id
  -o, --our                    List only our managed resources
  --default-exclude            Exclude the default resources, i.e VPC and Subnet
  -e, --types-exclude <value>  Exclude by type, multiple values allowed
  -d, --canBeDeleted           display resources which can be deleted, a.k.a non default
                               resources
  -p, --provider <value>       Filter by provider, multiple values allowed
  --resource-group <value>     Azure only: Filter by resource groups, multiple values
                               allowed
  -t, --types <value>          Include by type, multiple values allowed
  --group <value>              Include by group, multiple values allowed
  --dot-file <dotFile>         output 'dot' file name for the live diagram (default:
                               "artifacts/diagram-live.dot")
  --title <value>              diagram title (default: "aks-basic")
  -h, --help                   display help for command
```

### graph

Produces a diagram depicting the lives resources and their associations.

```sh
gc list --graph
```

![diagram-live.svg](https://raw.githubusercontent.com/grucloud/grucloud/main/examples/aws/EC2/Instance/ec2-vpc/artifacts/diagram-live.svg)

> This command requires [graphviz](https://graphviz.org/) to convert the generated `artifacts/diagram-live.dot` into an image such as `artifacts/diagram-live.svg`

### all

The **all** option also display list-only resources which are resources not created/deleted by this application. For instance the AWS KeyPair resource is a considered as list-only.

```sh
gc list --all
```

### name

The **name** option lists the resource given its name:

```sh
gc list --name web-server
```

### id

The **id** option lists the resource given its id:

```sh
gc list --name ewBMe9BLC
```

### types

The **types** option lists the resources filtering by types

```sh
gc list --types Server
```

The **types** option is repeatable:

```sh
gc list --types Server --types SecurityGroup
```

### types-exclude

The **--types-exclude** option excludes one or more types:

```sh
gc list --graph  --types-exclude Certificate --types-exclude Route53Domain --types-exclude NetworkInterface
```

### our

The **our** option only list resources deployed by this application

```sh
gc list --our
```

### canBeDeleted

The **canBeDeleted** option only lists resources that can be deleted by this application. For instance, the default AWS VPC for instance cannot be deleted and will not show up with this option.

```sh
gc list --canBeDeleted
```

### --default-exclude

The **--default-exclude** option excludes the default resources such as VPC, subnet and security group.

```sh
gc list --default-exclude
```

### provider

The **provider** option only lists resources for a given provider

```sh
gc list --provider=aws
```

### resource-group

The **resource-group** option filters based on the resource group. Azure only.

```sh
gc list --resource-group=my-rg
```
