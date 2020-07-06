---
id: PlanQuery
title: Plan Query
---

The **plan** commands finds out which resources need to be deployed or destroyed. It interrogates the cloud service provider to retrieve the currently deployed resources and compare it to the desired state.

```
gc plan
```

```
Query Plan for mock
✓ mock::Ip::myip
✓ mock::Volume::volume1
✓ mock::SecurityGroup::sg
✓ mock::Server::web-server
┌──────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┐
│ mock                                                                                                                                                         │
├────────────┬────────┬───────────────┬────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┤
│ Name       │ Action │ Type          │ Config                                                                                                                 │
├────────────┼────────┼───────────────┼────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┤
│ myip       │ CREATE │ Ip            │ name: "myip"                                                                                                           │
│            │        │               │ tags:                                                                                                                  │
│            │        │               │   - "myipManagedByGru"                                                                                                 │
│            │        │               │                                                                                                                        │
├────────────┼────────┼───────────────┼────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┤
│ volume1    │ CREATE │ Volume        │ name: "volume1"                                                                                                        │
│            │        │               │ tags:                                                                                                                  │
│            │        │               │   - "volume1ManagedByGru"                                                                                              │
│            │        │               │ size: 20000000000                                                                                                      │
│            │        │               │                                                                                                                        │
├────────────┼────────┼───────────────┼────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┤
│ sg         │ CREATE │ SecurityGroup │ name: "sg"                                                                                                             │
│            │        │               │ tags:                                                                                                                  │
│            │        │               │   - "sgManagedByGru"                                                                                                   │
│            │        │               │                                                                                                                        │
├────────────┼────────┼───────────────┼────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┤
│ web-server │ CREATE │ Server        │ name: "web-server"                                                                                                     │
│            │        │               │ zone: "projects/undefined/zones/undefined"                                                                             │
│            │        │               │ machineType: "projects/undefined/zones/undefined/machineTypes/f1-micro"                                                │
│            │        │               │ tags:                                                                                                                  │
│            │        │               │   items:                                                                                                               │
│            │        │               │     - "web-serverManagedByGru"                                                                                         │
│            │        │               │ disks:                                                                                                                 │
│            │        │               │   - deviceName: "web-serverManagedByGru"                                                                               │
│            │        │               │     initializeParams:                                                                                                  │
│            │        │               │       sourceImage: "projects/debian-cloud/global/images/debian-9-stretch-v20200420"                                    │
│            │        │               │       diskType: "projects/undefined/zones/undefined/diskTypes/pd-standard"                                             │
│            │        │               │       diskSizeGb: "20"                                                                                                 │
│            │        │               │ networkInterfaces:                                                                                                     │
│            │        │               │   - subnetwork: "projects/undefined/regions/undefined/subnetworks/default"                                             │
│            │        │               │     accessConfigs:                                                                                                     │
│            │        │               │       - natIP: "<< address of myip not available yet >>"                                                               │
│            │        │               │                                                                                                                        │
└────────────┴────────┴───────────────┴────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┘


4 resources to deploy on 1 provider
Command "gc plan" executed in 1s

```
