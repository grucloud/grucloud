---
id: List
title: List Resources
---

The **list** commands lists the live resources.

## Command Options

```
gc help list
```

```
Usage: gc list|l [options]

List the live resources

Options:
  -g, --graph                  create an SVG representation of the live infrastructure
  -a, --all                    List also read-only resources
  -n, --name <value>           List by name
  --id <value>                 List by id
  -o, --our                    List only our managed resources
  --default-exclude            Exclude the default resources, i.e VPC and Subnet
  -e, --types-exclude <value>  Exclude by type, multiple values allowed
  -d, --canBeDeleted           display resources which can be deleted, a.k.a non default resources
  -p, --provider <value>       Filter by provider, multiple values allowed
  -t, --types <value>          Include by type, multiple values allowed
  -h, --help                   display help for command
```

### graph

Produce a diagram depicting the lives resources and their associations.

```sh
gc list --graph
```

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

### --types-exclude

The **--types-exclude** option excludes one or more types

```
gc list --graph  --types-exclude Certificate --types-exclude Route53Domain --types-exclude NetworkInterface
```

### our

The **our** option only list resources deployed by this application

```
gc list --our
```

### canBeDeleted

The **canBeDeleted** option only lists resources that can be deleted by this application. For instance, the default AWS VPC for instance cannot be deleted and will not show up with this option.

```
gc list --canBeDeleted
```

### --default-exclude

The **--default-exclude** option excludes the default resources such as VPC, subnet and security group.

```
gc list --default-exclude
```

### provider

The **provider** option only lists resources for a given provider

```
gc list --provider=aws
```
