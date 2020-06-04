---
id: GoogleGettingStarted
title: Getting Started
---

Let's create a simple infrastructure with a server running ubuntu attached to a 20GB disk, connected to a public ip address.

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
cd grucloud/examples/google
```

```bash
npm install
```

## Config

Go the [google cloud console](https://console.cloud.google.com/home/dashboard)

- Create a new project and retrieve the project id

- Enable the Google Engine API

Edit **config.js** and set the project id, region and zone:

```js
const config = {
  project: "SuperDuperProject",
  region: "us-central1",
  zone: "us-central1-a",
  applicationCredentials: process.env.GOOGLE_APPLICATION_CREDENTIALS,
};
```

## Service Account

Create a [service account](https://cloud.google.com/iam/docs/creating-managing-service-accounts) and download the credential file.

Createthe file _.env_ and set the _GOOGLE_APPLICATION_CREDENTIALS_ environment variable.

```bash
GOOGLE_APPLICATION_CREDENTIALS="/Users/mario/Downloads/superduperproject-605f4eb1b929.json"
```

Active the service account:

    gcloud auth activate-service-account --key-file=/replace/with/your/credential1118fd0337b2.json
    gcloud auth list
    gcloud config set account accountname@yourproject.iam.gserviceaccount.com

Upload your ssh keys:

```sh
gcloud compute os-login ssh-keys add --key-file .ssh/id_rsa.pub
```

## Status

Query the status of the current resources on the given cloud account:

```bash
gc status
```

Now it is time to edit the infrastructure **iac.js** file that describes the architecture:

```js
const GoogleProvider = require("@grucloud/core").GoogleProvider;

const config = require("./config");

const createStack = ({ options }) => {
  // Create GCP provider
  const provider = GoogleProvider({ name: "google" }, config);
  // Allocate public Ip address
  const ip = provider.makeAddress({ name: "ip-webserver" });
  // Allocate a server
  const server = provider.makeInstance({
    name: "web-server",
    dependencies: {},
    properties: {
      machineType: "e2-micro",
    },
  });

  return { providers: [provider] };
};

module.exports = createStack;
```

## Plan

Find out which resources are going to be allocated:

    gc plan

## Deploy

Happy with the expected plan ? Deploy it now:

    gc deploy

## Destroy

Time to destroy the resouces allocated:

    gc destroy
