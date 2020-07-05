---
id: PlanDestroy
title: Plan Destroy
---

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


✔ Are you sure to destroy these 4 resources ? … yes
Destroying resources
✓ mock::Server::web-server
✓ mock::Volume::volume1
✓ mock::SecurityGroup::sg
✓ mock::Ip::myip
4 resources destroyed
Command "gc destroy" executed in 2s

```
