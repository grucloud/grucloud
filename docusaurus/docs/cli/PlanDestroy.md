---
id: PlanDestroy
title: Plan Destroy
---

The **destroy** command destroys the resources which has been previously deployed.

```
gc destroy
```

```
┌───────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┐
│ mock                                                                                                                                                          │
├────────────┬─────────┬───────────────┬────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┤
│ Name       │ Action  │ Type          │ Config                                                                                                                 │
├────────────┼─────────┼───────────────┼────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┤
│ web-server │ DESTROY │ Server        │ id: "9odkiaTdp"                                                                                                        │
│            │         │               │ name: "web-server"                                                                                                     │
│            │         │               │ zone: "projects/undefined/zones/undefined"                                                                             │
│            │         │               │ machineType: "projects/undefined/zones/undefined/machineTypes/f1-micro"                                                │
│            │         │               │ tags:                                                                                                                  │
│            │         │               │   items:                                                                                                               │
│            │         │               │     - "web-serverManagedByGru"                                                                                         │
│            │         │               │ disks:                                                                                                                 │
│            │         │               │   - deviceName: "web-serverManagedByGru"                                                                               │
│            │         │               │     initializeParams:                                                                                                  │
│            │         │               │       sourceImage: "projects/debian-cloud/global/images/debian-9-stretch-v20200420"                                    │
│            │         │               │       diskType: "projects/undefined/zones/undefined/diskTypes/pd-standard"                                             │
│            │         │               │       diskSizeGb: "20"                                                                                                 │
│            │         │               │ networkInterfaces:                                                                                                     │
│            │         │               │   - subnetwork: "projects/undefined/regions/undefined/subnetworks/default"                                             │
│            │         │               │     accessConfigs:                                                                                                     │
│            │         │               │       - natIP: "<< address of myip not available yet >>"                                                               │
│            │         │               │                                                                                                                        │
├────────────┼─────────┼───────────────┼────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┤
│ sg         │ DESTROY │ SecurityGroup │ id: "BLLBCgRVh"                                                                                                        │
│            │         │               │ name: "sg"                                                                                                             │
│            │         │               │ tags:                                                                                                                  │
│            │         │               │   - "sgManagedByGru"                                                                                                   │
│            │         │               │                                                                                                                        │
├────────────┼─────────┼───────────────┼────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┤
│ myip       │ DESTROY │ Ip            │ id: "x4iMBAKMTO"                                                                                                       │
│            │         │               │ name: "myip"                                                                                                           │
│            │         │               │ tags:                                                                                                                  │
│            │         │               │   - "myipManagedByGru"                                                                                                 │
│            │         │               │                                                                                                                        │
├────────────┼─────────┼───────────────┼────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┤
│ volume1    │ DESTROY │ Volume        │ id: "Fgn_06TaB"                                                                                                        │
│            │         │               │ name: "volume1"                                                                                                        │
│            │         │               │ tags:                                                                                                                  │
│            │         │               │   - "volume1ManagedByGru"                                                                                              │
│            │         │               │ size: 20000000000                                                                                                      │
│            │         │               │                                                                                                                        │
└────────────┴─────────┴───────────────┴────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┘


✔ Are you sure to destroy 4 resources ? … yes
Destroying resources
✓ mock::Server::web-server
✓ mock::Volume::volume1
✓ mock::SecurityGroup::sg
✓ mock::Ip::myip
4 resources destroyed
Command "gc destroy" executed in 2s
```

## Command Options

```
gc help destroy
```

```
Usage: gc destroy|d [options]

Destroy the resources

Options:
  -f, --force             force destroy, will not prompt user
  -t, --types <type>      Filter by type, multiple values allowed
  -a, --all               destroy all resources including those not managed by us
  -n, --name <value>      destroy by name
  --id <value>            destroy by id
  -p, --provider <value>  Filter by provider name
  -h, --help              display help for command
```

### alias

The command alias is _d_

```
gc d
```

### force

The **force** option to not prompt the user to destroy the resources:

```
gc destroy --force
```

### all

By default, the destroy command only destroys the resources that has been created by this application.
The **all** options destroys resources that has deployed ouside this application.

```
gc destroy --all
```

### types

The **types** option allows to destroy resources of a given type:

```
gc destroy --types Server
```

Example with multiple types:

```
gc destroy --types Server --types Volume
```

### name

The **name** option allows to destroy a specific resource given its name:

```
gc destroy --name web-server
```

### id

The **id** option allows to destroy a specific resource given its id:

```
gc destroy --name ewBMe9BLC
```

### provider

The **provider** option allows to destroy resources of a given provider.

```
gc destroy --provider mock
```
