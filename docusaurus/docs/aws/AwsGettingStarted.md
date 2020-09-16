---
id: AwsGettingStarted
title: Getting Started
---

Let's create a simple infrastructure with

- a server running ubuntu
- connected to a public ip address.
- accessible through SSH

Ensure the AWS CLI is configured properly and the possesion of the **SSH keys**.
Visit the [Aws Requirements](./AwsRequirements.md) to retrieve these informations.

## Getting the code

Install the _grucloud_ command line utility: **gc**

```bash
npm i -g @grucloud/core
```

Clone the source code containing the examples:

```bash
git clone git@github.com:FredericHeem/grucloud.git
```

Change the directory to one of the examples:

```bash
cd grucloud/examples/aws/ec2
```

Install the node dependencies:

```bash
npm install
```

## iac.js

Edit **iac.js** and set the correct **KeyName**

## Plan

Find out which resources are going to be allocated:

```bash
gc plan
```

## Deploy

Happy with the expected plan ? Deploy it now:

```bash
gc deploy
```

## List

List all the resources:

```bash
gc list
```

## Destroy

Time to destroy the resources allocated:

```bash
gc destroy
```
