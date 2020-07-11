---
id: AwsGettingStarted
title: Getting Started
---

Let's create a simple infrastructure with

- a server running ubuntu
- connected to a public ip address.
- accessible through SSH

Ensure possession of the **AWSAccessKeyId**, **AWSSecretKey**, **AccountId** and **SSH keys**.
Visit the [Aws Requirements](./AwsRequirements.md) to retrieve these informations.

## Getting the code

Install the _grucloud_ command line utility: **gc**

```bash
npm i -g @grucloud/core
```

Clone one of the example:

```bash
git clone git@github.com:FredericHeem/grucloud.git
```

```bash
cd grucloud/examples/aws
```

```bash
npm install
```

## Environment file

```sh
cp config/default.env.example config/default.env
```

Edit **config/default.env** and set the correct values:

```sh
AccountId=
AWSAccessKeyId=
AWSSecretKey=
```

## config file

Edit **config/default.js** and set the project id, region and zone:

```js
module.exports = () => ({
  region: "eu-west-2",
  zone: "eu-west-2a",
});
```

To find out the list of regions:

```
aws ec2 describe-regions
```

Choose a region close to your location, at this point select a zone name in the given region:

```
aws ec2 describe-availability-zones --region eu-west-2
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
