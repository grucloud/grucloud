---
id: PlanApply
title: Plan Apply
---

The **apply** commands effectively deploys the resources. It first finds out which resources has to be deployed by running the **plan** command. The user is prompted to confirm the plan.

```
gc apply
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


✔ Are you sure to deploy 4 resources, 4 types on 1 provider? … yes
Deploying resources on 1 provider: mock
✓ mock
  ✓ Deploying
    ✓ Ip::myip
    ✓ Volume::volume1
    ✓ SecurityGroup::sg
    ✓ Server::web-server
  ✓ extra::onDeployed
    ✓ Checks1
    ✓ Checks 2
  ✓ default::onDeployed
    ✓ Ping
    ✓ SSH
4 resources deployed of 4 types and 1 provider
Command "gc a" executed in 8s
```

## Command options

```
gc help apply
```

```
Usage: gc apply|a [options]

Apply the plan, a.k.a deploy the resources

Options:
  -f, --force  force deploy, will not prompt user
  -h, --help   display help for command
```

### alias

The command alias is _a_

```
gc a
```

### force

The **force** option to not prompt the user to apply the plan

```
gc apply --force
```
