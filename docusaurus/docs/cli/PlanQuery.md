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
┌────────────────────────────────────────────────────────────────────────────────────────────────────────┐
│ 1 Ip from mock                                                                                         │
├──────────┬──────────┬──────────────────────────────────────────────────────────────────────────────────┤
│ Name     │ Action   │ Data                                                                             │
├──────────┼──────────┼──────────────────────────────────────────────────────────────────────────────────┤
│ myip     │ CREATE   │ name: myip                                                                       │
│          │          │ tags:                                                                            │
│          │          │   - "myipManagedByGru"                                                           │
│          │          │                                                                                  │
└──────────┴──────────┴──────────────────────────────────────────────────────────────────────────────────┘


┌────────────────────────────────────────────────────────────────────────────────────────────────────────┐
│ 1 Volume from mock                                                                                     │
├──────────┬──────────┬──────────────────────────────────────────────────────────────────────────────────┤
│ Name     │ Action   │ Data                                                                             │
├──────────┼──────────┼──────────────────────────────────────────────────────────────────────────────────┤
│ volume1  │ CREATE   │ name: volume1                                                                    │
│          │          │ tags:                                                                            │
│          │          │   - "volume1ManagedByGru"                                                        │
│          │          │ size: 20000000000                                                                │
│          │          │                                                                                  │
└──────────┴──────────┴──────────────────────────────────────────────────────────────────────────────────┘


┌────────────────────────────────────────────────────────────────────────────────────────────────────────┐
│ 1 SecurityGroup from mock                                                                              │
├──────────┬──────────┬──────────────────────────────────────────────────────────────────────────────────┤
│ Name     │ Action   │ Data                                                                             │
├──────────┼──────────┼──────────────────────────────────────────────────────────────────────────────────┤
│ sg       │ CREATE   │ name: sg                                                                         │
│          │          │ tags:                                                                            │
│          │          │   - "sgManagedByGru"                                                             │
│          │          │ securityRules:                                                                   │
│          │          │   - name: SSH                                                                    │
│          │          │     properties:                                                                  │
│          │          │       access: Allow                                                              │
│          │          │       direction: Inbound                                                         │
│          │          │       protocol: Tcp                                                              │
│          │          │       destinationPortRange: 22                                                   │
│          │          │       destinationAddressPrefix: *                                                │
│          │          │       sourcePortRange: *                                                         │
│          │          │       sourceAddressPrefix: *                                                     │
│          │          │       priority: 1000                                                             │
│          │          │                                                                                  │
└──────────┴──────────┴──────────────────────────────────────────────────────────────────────────────────┘


┌────────────────────────────────────────────────────────────────────────────────────────────────────────┐
│ 1 Server from mock                                                                                     │
├────────────┬──────────┬────────────────────────────────────────────────────────────────────────────────┤
│ Name       │ Action   │ Data                                                                           │
├────────────┼──────────┼────────────────────────────────────────────────────────────────────────────────┤
│ web-server │ CREATE   │ name: web-server                                                               │
│            │          │ zone: projects/undefined/zones/undefined                                       │
│            │          │ machineType: projects/undefined/zones/undefined/machineTypes/f1-micro          │
│            │          │ tags:                                                                          │
│            │          │   items:                                                                       │
│            │          │     - "web-serverManagedByGru"                                                 │
│            │          │ disks:                                                                         │
│            │          │   - deviceName: web-serverManagedByGru                                         │
│            │          │     initializeParams:                                                          │
│            │          │       sourceImage: projects/debian-cloud/global/images/debian-9-stretch-v2020… │
│            │          │       diskType: projects/undefined/zones/undefined/diskTypes/pd-standard       │
│            │          │       diskSizeGb: 20                                                           │
│            │          │ networkInterfaces:                                                             │
│            │          │   - subnetwork: projects/undefined/regions/undefined/subnetworks/default       │
│            │          │     accessConfigs:                                                             │
│            │          │       - natIP: << address of myip not available yet >>                         │
│            │          │                                                                                │
└────────────┴──────────┴────────────────────────────────────────────────────────────────────────────────┘


Plan Summary:
Provider: mock
+ Ip::myip
+ Volume::volume1
+ SecurityGroup::sg
+ Server::web-server


4 resources to deploy on 1 provider
Command "gc plan" executed in 1s

```
