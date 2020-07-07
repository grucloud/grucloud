---
id: List
title: List Resources
---

The **list** commands list the already deployed resources:

```
gc list
```

```
List for mock
┌──────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┐
│ 1 Volume from mock                                                                                                                               │
├─────────┬────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┬───────────────┤
│ Name    │ Data                                                                                                                   │ Managed by Us │
├─────────┼────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┼───────────────┤
│ volume1 │ id: "dLyck8kW9"                                                                                                        │ Yes           │
│         │ name: "volume1"                                                                                                        │               │
│         │ tags:                                                                                                                  │               │
│         │   - "volume1ManagedByGru"                                                                                              │               │
│         │ size: 20000000000                                                                                                      │               │
│         │                                                                                                                        │               │
└─────────┴────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┴───────────────┘


┌───────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┐
│ 1 Ip from mock                                                                                                                                │
├──────┬────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┬───────────────┤
│ Name │ Data                                                                                                                   │ Managed by Us │
├──────┼────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┼───────────────┤
│ myip │ id: "t5XMOoWji_"                                                                                                       │ Yes           │
│      │ name: "myip"                                                                                                           │               │
│      │ tags:                                                                                                                  │               │
│      │   - "myipManagedByGru"                                                                                                 │               │
│      │                                                                                                                        │               │
└──────┴────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┴───────────────┘


┌───────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┐
│ 1 SecurityGroup from mock                                                                                                                     │
├──────┬────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┬───────────────┤
│ Name │ Data                                                                                                                   │ Managed by Us │
├──────┼────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┼───────────────┤
│ sg   │ id: "i72y9t-vwK"                                                                                                       │ Yes           │
│      │ name: "sg"                                                                                                             │               │
│      │ tags:                                                                                                                  │               │
│      │   - "sgManagedByGru"                                                                                                   │               │
│      │                                                                                                                        │               │
└──────┴────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┴───────────────┘


┌─────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┐
│ 1 Server from mock                                                                                                                                  │
├────────────┬────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┬───────────────┤
│ Name       │ Data                                                                                                                   │ Managed by Us │
├────────────┼────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┼───────────────┤
│ web-server │ id: "ewBMe9BLC"                                                                                                        │ Yes           │
│            │ name: "web-server"                                                                                                     │               │
│            │ zone: "projects/undefined/zones/undefined"                                                                             │               │
│            │ machineType: "projects/undefined/zones/undefined/machineTypes/f1-micro"                                                │               │
│            │ tags:                                                                                                                  │               │
│            │   items:                                                                                                               │               │
│            │     - "web-serverManagedByGru"                                                                                         │               │
│            │ disks:                                                                                                                 │               │
│            │   - deviceName: "web-serverManagedByGru"                                                                               │               │
│            │     initializeParams:                                                                                                  │               │
│            │       sourceImage: "projects/debian-cloud/global/images/debian-9-stretch-v20200420"                                    │               │
│            │       diskType: "projects/undefined/zones/undefined/diskTypes/pd-standard"                                             │               │
│            │       diskSizeGb: "20"                                                                                                 │               │
│            │ networkInterfaces:                                                                                                     │               │
│            │   - subnetwork: "projects/undefined/regions/undefined/subnetworks/default"                                             │               │
│            │     accessConfigs:                                                                                                     │               │
│            │       - natIP: "<< address of myip not available yet >>"                                                               │               │
│            │                                                                                                                        │               │
└────────────┴────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┴───────────────┘


4 resources, 4 types, 1 provider
Command "gc list" executed in 0s
```

## Command Options

```
gc help list
```

```
Usage: gc list|l [options]

List the resources

Options:
  -a, --all               List also read-only resources
  -n, --name <value>      List by name
  --id <value>            List by id
  -t, --types <value>     Filter by type, multiple values allowed
  -o, --our               List only our managed resources
  -d, --canBeDeleted      display resources which can be deleted, a.k.a non default resources
  -p, --provider <value>  Filter by provider
  -h, --help              display help for command
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

### provider

The **provider** option only lists resources for a given provider

```
gc list --provider=aws
```
