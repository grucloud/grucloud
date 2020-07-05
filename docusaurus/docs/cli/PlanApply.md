---
id: PlanApply
title: Plan Apply
---

```
gc apply
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


✔ Are you sure to deploy 4 resources ? … yes
Deploying resources
✓ mock::Ip::myip
✓ mock::Volume::volume1
✓ mock::SecurityGroup::sg
✓ mock::Server::web-server
4 resources deployed
Command "gc a" executed in 8s
```
