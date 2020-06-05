---
id: GoogleGettingStarted
title: Getting Started
---

Let's create a simple infrastructure with a server running ubuntu, connected to a public ip address, accessible through SSH.

First of all, make sure all the gcp prerequisites has been met: [GoogleRequirements](./GoogleRequirements.md)

```
gcloud info
```

To go further, you'll need a **service account**, **project**, **region** and **zone**

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

### .env

Edit the _.env_ file and set the _GOOGLE_APPLICATION_CREDENTIALS_ environment variable which points the the service account credential.

```bash
GOOGLE_APPLICATION_CREDENTIALS="/Users/mario/Downloads/superduperproject-605f4eb1b929.json"
```

### Config

Find out the default region, zone and project:

gcloud config list

Edit **config.js** and set the **project id**, **region** and **zone**:

```js
const config = {
  project: "SuperDuperProject",
  region: "us-central1",
  zone: "us-central1-a",
  applicationCredentials: process.env.GOOGLE_APPLICATION_CREDENTIALS,
};
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
    dependencies: { ip },
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

```
gcloud compute ssh web-server
```

## List

List the available resources with:

```
gc list
```

## Destroy

Time to destroy the resouces allocated:

    gc destroy
