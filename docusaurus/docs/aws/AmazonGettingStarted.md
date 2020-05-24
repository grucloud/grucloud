---
id: AmazonGettingStarted
title: Getting Started
---

Let's create a simple infrastructure with

- a server running ubuntu
- attached to a 20GB disk
- connected to a public ip address.

## Getting the code

Install the grucloud command line utility: **gc**

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

## Config

Go the [amazon cloud console](https://console.aws.amazon.com)

Go to the "My Security Credential" menu and Create a new access key.

Edit **config.js** and set the project id, region and zone:

```js
const config = {
  region: "us-central1",
  zone: "us-central1-a",
  applicationCredentials: process.env.GOOGLE_APPLICATION_CREDENTIALS,
};
```

## Key Pair

Let's create an ssh key pair to access the server.

Some key pairs may already have been created, here is how to list all existing key pairs:

```bash
aws ec2 describe-key-pairs
```

If you need to create a new key pair, go to the [AWS documentation for ec2 key pair](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/ec2-key-pairs.html)

## Status

Query the status of the current resources on the given cloud account:

```bash
gc status
```

Now it is time to edit the infrastructure **iac.js** file that describes the architecture:

```js
TODO;
```

## Plan

Find out which resources are going to be allocated:

    gc plan

## Deploy

Happy with the expected plan ? Deploy it now:

    gc deploy

Make sure the instance is created by listing all instances:

```bash
aws ec2 describe-instances
```

Filtering by the instance name is also possible:

```bash
aws ec2 describe-instances --filters "Name=tag:name,Values=web-server"
```

## Destroy

Time to destroy the resouces allocated:

    gc destroy
