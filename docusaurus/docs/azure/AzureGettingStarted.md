---
id: AzureGettingStarted
title: Azure Getting Started
---

Let's create a simple infrastructure with the following resources:

- [Resource Group](./resources/resourceManagement/ResourceGroup.md)
- [Virtual Network](./resources/virtualNetworks/VirtualNetwork.md)
- [Security Group](./resources/virtualNetworks/SecurityGroup.md)
- [Public Ip Address](./resources/virtualNetworks/PublicIpAddress.md)
- [Network Interface](./resources/virtualNetworks/NetworkInterface.md)
- [Virtual Machine](./resources/compute/VirtualMachine.md)

## Install the GruCloud CLI

Install the grucloud command line utility: **gc**

```bash
npm i -g @grucloud/core
```

## Create a new project

Use the _new_ command to create a new project:

```sh
gc new
```

```txt
? Cloud Provider › - Use arrow-keys. Return to submit.
    AWS
❯   Azure - Microsoft Azure
    GCP
```

Select Azure as the cloud provider.

```txt
✔ Cloud Provider › Azure
? Project's name ›
```

Enter the project's name, for instance _my-project_

The directory _my-project_ will be created with all the necessary files for an Azure project.

## List

List the available resources and display a diagram with:

```sh
gc list --graph
```

## Generate the code

```sh
gc gencode
```

The file `resource.js` will be updated according the live insfrastructure.

## Plan

To find out which resources are going to be allocated.

```sh
gc plan
```

The plan should be empty at this stage.

## Destroy

Time to destroy the resouces allocated:

```sh
gc destroy
```

## Deploy

The instructure can be deployed with the _apply_ command.

```sh
gc apply
```
