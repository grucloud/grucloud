---
id: AzureGettingStarted
title: Azure Getting Started
---

Let's create a simple infrastructure with the following resources:

- [Resource Group](./resources/ResourceGroup)
- [Virtual Network](./resources/VirtualNetwork)
- [Security Group](./resources/SecurityGroup)
- [Public Ip Address](./resources/PublicIpAddress)
- [Network Interface](./resources/NetworkInterface)
- [Virtual Machine](./resources/VirtualMachine)

First of all, ensure all the Azure prerequisites has been met: [AzureRequirements](./AzureRequirements.md)

## Getting the code

Install the grucloud command line utility: **gc**

```bash
npm i -g @grucloud/core
```

Create a new project:

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

### Environment

Create **default.env** and set the correct values:

```sh
TENANT_ID=
SUBSCRIPTION_ID=
APP_ID=
PASSWORD=
MACHINE_ADMIN_USERNAME=
MACHINE_ADMIN_PASSWORD=
```

> See [AzureRequirements](./AzureRequirements.md) to retrieve these informations

### Config

Edit **config.js** and set the location:

```js
module.exports = () => ({
  projectName: "my-project",
  location: "uksouth",
});
```

To find out the list of locations:

```
az account list-locations -o table
```

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
