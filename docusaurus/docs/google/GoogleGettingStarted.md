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
cd grucloud/examples/google/vm
```

```bash
npm install
```

### Config

Find out the default region, zone and project:

```
gcloud config list
```

Now it is time to edit the infrastructure **iac.js** file that describes the architecture:

```js
const GoogleProvider = require("@grucloud/core").GoogleProvider;

const config = require("./config");

exports.createStack = async ({ options }) => {
  // Create GCP provider
  const provider = GoogleProvider({ name: "google" }, config);
  // Allocate public Ip address
  const ip = await provider.makeAddress({ name: "ip-webserver" });
  // Allocate a server
  const server = await provider.makeVmInstance({
    name: "web-server",
    dependencies: { ip },
    properties: () => ({
      machineType: "e2-micro",
    }),
  });

  return { provider };
};
```

## Plan

Find out which resources are going to be allocated:

```sh
gc plan
```

## Deploy

Happy with the expected plan ? Deploy it now:

```sh
gc apply
```

Verify the newly created server is accessible:

```sh
gcloud compute ssh web-server
```

## List

List the available resources with:

```sh
gc list
```

## Destroy

Time to destroy the resouces allocated:

```sh
gc destroy
```
