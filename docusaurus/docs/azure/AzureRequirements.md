---
id: AzureRequirements
title: Requirements
---

## Azure Account and Subscription

Visit the [azure portal](https://portal.azure.com) and ensure you have an azure account as well as a subscription.

## Azure CLI

Install the Azure Command Line Interface from https://docs.microsoft.com/en-us/cli/azure/install-azure-cli?view=azure-cli-latest

At this point, ensure the **az** command is installed:

```bash
az --version
```

## Login

Login to your Azure account

```bash
az login
```

### tenantId

```bash
az account show
```

### subscriptionId

Get the **subscriptionId** from the following command:

```bash
az account show --query id -otsv
```

### appId and password

Create a service principal name for instance **sp1** to manage new resources:

```bash
az ad sp create-for-rbac -n "sp1"
```

Save somewhere the **appId** and the **password**
