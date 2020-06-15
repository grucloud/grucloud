---
id: AwsGettingStarted
title: Getting Started
---

Let's create a simple infrastructure with

- a server running ubuntu
- connected to a public ip address.
- accessible through SSH

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

## Environment file

```sh
cp config/dev.example.json config/dev.json

```

Edit the _config/dev.json_ file and set the correct values:

```json
{
  accountId=12345678980
  AWSAccessKeyId=XXXXXXXXXXXXXXXXX
  AWSSecretKey=XXXXXXXXXXXXXXXXXXXXXXXX
}
```

## config file

Edit **config.js** and set the project id, region and zone:

```js
const config = {
  region: "us-central1",
  zone: "us-central1-a",
};
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
