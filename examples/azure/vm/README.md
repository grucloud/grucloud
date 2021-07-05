# Deploying a virtual machine on Azure with GruCloud

The purpose of this example is to deploy automatically a virtual machine attached to a public IP address, inside a VPC, secured by firewall rules.

![diagram-target](diagram-target.svg)

The infrastructure is described in [iac.js](./iac.js), and configured in [config.js](./config.js).

Hooks are defined in [hook.js](hook.js), it contains a bunch of
functions which are invoked after resources are created or destroyed. In the case of a virtual machine, we'll ping and connect with SSH programatically thanks to the [ping](https://www.npmjs.com/package/ping) and [ssh2](https://www.npmjs.com/package/ssh2) Javascript library.

## Requirements

### Azure

Ensure access to the [Azure Portal](https://portal.azure.com)

Verify the **az** CLI is installed:

```sh
az --version
```

Create or edit **default.env** and set the correct values:

```sh
TENANT_ID=
SUBSCRIPTION_ID=
APP_ID=
PASSWORD=
MACHINE_ADMIN_USERNAME=
MACHINE_ADMIN_PASSWORD=
```

> See [AzureRequirements](./AzureRequirements.md) to retrieve these informations

### GruCloud

Ensure _node_ is installed:

```sh
node --version
```

Install the GruCloud CLI globally:

```sh
npm i @grucloud/core -g
```

Check if **gc** is installed correctly:

```sh
gc --version
```

The _info_ commands show some information about installation:

```sh
gc info
```

```sh
  - provider:
      name: azure
      type: azure
    stage: dev
    subscriptionId: ****************
    tenantId: ****************
    appId: ****************

Command "gc info" executed in 1s
```

Let's install the npm dependencies such as the [@grucloud/provider-azure](https://www.npmjs.com/package/@grucloud/provider-azure)

```sh
npm i
```

## Workflow

### Target Diagram

Based on the infrastructure code [iac.js](./iac.js), GruCloud is able to create a diagram of the target resources showing their dependencies.

```sh
gc graph
```

### Deploying

Let's deploy the infrastructure with the _apply_ command. **gc** will interogate the Azure API and fetch the live resources, compare them with what is supposed to be installed. At this point, you will be presented with a plan describing what shoud be installed, modified or removed.

```sh
gc apply
```

```sh
Querying resources on 1 provider: azure
✓ azure
  ✓ Initialising
  ✓ Listing 6/6
  ✓ Querying
    ✓ ResourceGroup 1/1
    ✓ VirtualNetwork 1/1
    ✓ SecurityGroup 1/1
    ✓ PublicIpAddress 1/1
    ✓ NetworkInterface 1/1
    ✓ VirtualMachine 1/1
┌───────────────────────────────────────────────────────────────────────────────────────────┐
│ Plan summary for provider azure                                                           │
├───────────────────────────────────────────────────────────────────────────────────────────┤
│ DEPLOY RESOURCES                                                                          │
├────────────────────┬──────────────────────────────────────────────────────────────────────┤
│ ResourceGroup      │ resource-group-dev                                                   │
├────────────────────┼──────────────────────────────────────────────────────────────────────┤
│ VirtualNetwork     │ virtual-network-dev                                                  │
├────────────────────┼──────────────────────────────────────────────────────────────────────┤
│ SecurityGroup      │ security-group-dev                                                   │
├────────────────────┼──────────────────────────────────────────────────────────────────────┤
│ PublicIpAddress    │ ip-dev                                                               │
├────────────────────┼──────────────────────────────────────────────────────────────────────┤
│ NetworkInterface   │ network-interface-dev                                                │
├────────────────────┼──────────────────────────────────────────────────────────────────────┤
│ VirtualMachine     │ vm-dev                                                               │
└────────────────────┴──────────────────────────────────────────────────────────────────────┘
Deploying resources on 1 provider: azure
✓ azure
  ✓ Initialising
  ✓ Deploying
    ✓ ResourceGroup 1/1
    ✓ VirtualNetwork 1/1
    ✓ SecurityGroup 1/1
    ✓ PublicIpAddress 1/1
    ✓ NetworkInterface 1/1
    ✓ VirtualMachine 1/1
  ✓ azure hooks::onDeployed
    ✓ Ping VM
    ✓ SSH VM
6 resources deployed of 6 types and 1 provider
Running OnDeployedGlobal resources on 1 provider: azure
Command "gc a -f" executed in 1m 47s
```

Your server should be up and running, reachable through ping and SSH.

Try to run the **gc apply** command again. Nothing should be deployed, indeed, the target infrastructure is the same as the live infrastructure.

```sh
gc apply
```

```sh
Querying resources on 1 provider: azure
✓ azure
  ✓ Initialising
  ✓ Listing 6/6
  ✓ Querying
    ✓ ResourceGroup 1/1
    ✓ VirtualNetwork 1/1
    ✓ SecurityGroup 1/1
    ✓ PublicIpAddress 1/1
    ✓ NetworkInterface 1/1
    ✓ VirtualMachine 1/1
┌───────────────────────────────────────────────────────────────────────────────────────────┐
│ Plan summary for provider azure                                                           │
└───────────────────────────────────────────────────────────────────────────────────────────┘
Nothing to deploy
Running OnDeployedGlobal resources on 1 provider: azure
Command "gc a" executed in 4s
```

### Listing

To list the live resources which has been created as well as a diagram, use the **list** command with the _graph_ option:

```
gc list --graph
```

![diagram-live](diagram-live.svg)

The live and target diagram should be indentical from a topology point of view.

Have a look the [gc list documentation](https://www.grucloud.com/docs/cli/List) for a list of options to filter the resources by type, name, id, provider, created by GruCloud and so on.

For instance, to list all the virtual machines:

```sh
gc list -t VirtualMachine
```

```sh
Listing resources on 1 provider: azure
✓ azure
  ✓ Initialising
  ✓ Listing 6/6
┌────────────────────────────────────────────────────────────────────────────────────────────┐
│ 1 VirtualMachine from azure                                                                │
├──────────┬──────────────────────────────────────────────────────────────────────────┬──────┤
│ Name     │ Data                                                                     │ Our  │
├──────────┼──────────────────────────────────────────────────────────────────────────┼──────┤
│ vm-dev   │ name: vm-dev                                                             │ Yes  │
│          │ id: /subscriptions/8e0e234e-8384-438d-a652-105826b63bc9/resourceGroups/… │      │
│          │ type: Microsoft.Compute/virtualMachines                                  │      │
│          │ location: uksouth                                                        │      │
│          │ tags:                                                                    │      │
│          │   ManagedBy: GruCloud                                                    │      │
│          │   stage: dev                                                             │      │
│          │ properties:                                                              │      │
│          │   vmId: 8ba75419-2a5a-4e64-9175-8626de6b188a                             │      │
│          │   hardwareProfile:                                                       │      │
│          │     vmSize: Standard_A1_v2                                               │      │
│          │   storageProfile:                                                        │      │
│          │     imageReference:                                                      │      │
│          │       publisher: Canonical                                               │      │
│          │       offer: UbuntuServer                                                │      │
│          │       sku: 18.04-LTS                                                     │      │
│          │       version: latest                                                    │      │
│          │       exactVersion: 18.04.202104150                                      │      │
│          │     osDisk:                                                              │      │
│          │       osType: Linux                                                      │      │
│          │       name: vm-dev_OsDisk_1_19972ecb583f44518a0058641aa60dda             │      │
│          │       createOption: FromImage                                            │      │
│          │       caching: ReadWrite                                                 │      │
│          │       managedDisk:                                                       │      │
│          │         storageAccountType: Standard_LRS                                 │      │
│          │         id: /subscriptions/8e0e234e-8384-438d-a652-105826b63bc9/resourc… │      │
│          │       diskSizeGB: 30                                                     │      │
│          │     dataDisks: []                                                        │      │
│          │   osProfile:                                                             │      │
│          │     computerName: myVM                                                   │      │
│          │     adminUsername: ops                                                   │      │
│          │     linuxConfiguration:                                                  │      │
│          │       disablePasswordAuthentication: false                               │      │
│          │       provisionVMAgent: true                                             │      │
│          │     secrets: []                                                          │      │
│          │     allowExtensionOperations: true                                       │      │
│          │     requireGuestProvisionSignal: true                                    │      │
│          │   networkProfile:                                                        │      │
│          │     networkInterfaces:                                                   │      │
│          │       - id: /subscriptions/8e0e234e-8384-438d-a652-105826b63bc9/resourc… │      │
│          │   provisioningState: Succeeded                                           │      │
│          │                                                                          │      │
└──────────┴──────────────────────────────────────────────────────────────────────────┴──────┘


List Summary:
Provider: azure
┌───────────────────────────────────────────────────────────────────────────────────────────┐
│ azure                                                                                     │
├────────────────────┬──────────────────────────────────────────────────────────────────────┤
│ VirtualMachine     │ vm-dev                                                               │
└────────────────────┴──────────────────────────────────────────────────────────────────────┘
1 resource, 1 type, 1 provider
Command "gc list -t VirtualMachine" executed in 3s
```

### Hooks

You may want to run the hooks outside a deployment, either to check the health of the infrastructure or while developing and debugging the hooks:

```sh
gc run --onDeployed
```

```sh
Running OnDeployed resources on 1 provider: azure
✓ azure
  ✓ Initialising
  ✓ azure hooks::onDeployed
    ✓ Ping VM
    ✓ SSH VM
Command "gc run --onDeployed" executed in 5s
```

Sounds good, the virtual machine can be pinged and accessed through SSH.

### Destroy

To destroy the resources and stop paying $£€ for their use:

```sh
gc destroy
```

```sh
Find Deletable resources on 1 provider: azure
✓ azure
  ✓ Initialising
  ✓ Listing 6/6

┌───────────────────────────────────────────────────────────────────────────────────────────┐
│ Destroy summary for provider azure                                                        │
├────────────────────┬──────────────────────────────────────────────────────────────────────┤
│ ResourceGroup      │ resource-group-dev                                                   │
├────────────────────┼──────────────────────────────────────────────────────────────────────┤
│ PublicIpAddress    │ ip-dev                                                               │
├────────────────────┼──────────────────────────────────────────────────────────────────────┤
│ SecurityGroup      │ security-group-dev                                                   │
├────────────────────┼──────────────────────────────────────────────────────────────────────┤
│ VirtualNetwork     │ virtual-network-dev                                                  │
├────────────────────┼──────────────────────────────────────────────────────────────────────┤
│ NetworkInterface   │ network-interface-dev                                                │
├────────────────────┼──────────────────────────────────────────────────────────────────────┤
│ VirtualMachine     │ vm-dev                                                               │
└────────────────────┴──────────────────────────────────────────────────────────────────────┘
✔ Are you sure to destroy 6 resources, 6 types on 1 provider? … yes
Destroying resources on 1 provider: azure
✓ azure
  ✓ Initialising
  ✓ Destroying
    ✓ ResourceGroup 1/1
    ✓ PublicIpAddress 1/1
    ✓ SecurityGroup 1/1
    ✓ VirtualNetwork 1/1
    ✓ NetworkInterface 1/1
    ✓ VirtualMachine 1/1
  ✓ azure hooks::onDestroyed
    ✓ Perform check
6 resources destroyed, 6 types on 1 provider
Running OnDestroyedGlobal resources on 1 provider: azure
Command "gc destroy" executed in 2m 43s
```

At this stage, all the resources should have been destroyed.

Try to run the _destroy_ command again, it should not destroy anything.

```sh
gc destroy
```

```sh
Find Deletable resources on 1 provider: azure
✓ azure
  ✓ Initialising
  ✓ Listing 6/6

No resources to destroy
Running OnDestroyedGlobal resources on 1 provider: azure
Command "gc d -f" executed in 3s
```

Let's double check that the our resources has been destroyed with the **our** list option:

```sh
gc list --our
```

For the lazy or people affected by RSI:

```sh
gc l -o
```

```
Listing resources on 1 provider: azure
✓ azure
  ✓ Initialising
  ✓ Listing 6/6
No live resources to list
Command "gc list --our" executed in 3s
```

To summarise, we deployed, listed and destroyed resources automatically on Azure with simple commands:

- gc apply
- gc list
- gc destroy

Visit the [Azure Examples](https://www.grucloud.com/docs/azure/AzureExamples) page for more content.
