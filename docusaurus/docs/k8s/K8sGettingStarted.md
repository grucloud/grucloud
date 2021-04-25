---
id: K8sGettingStarted
title: Getting Started with Kubernetes
---

## Introduction

The Kubernetes Grucloud provider allows to define and describe Kubernetes resources in Javascript, removing the need to write YAML or templating file.

The GruCloud Command Line Interface **gc** reads this description in Javascript and connect to the k8s control plane to apply the new or updated resource definitions.

Let's define a _Deployment_ and a _Service_ to serve the nginx web server.

## Requirements

Ensure **kubectl** and **minikube** is started with the ingress addon: [K8s Requirements](./K8sRequirements.md)

### Getting GruCLoud CLI

Install the _grucloud_ command line utility: **gc**

```bash
npm i -g @grucloud/core
```

```
gc --version
```

## Create the project

```sh
mkdir tuto
cd tuto
```

### package.json

```sh
npm init
```

```sh
npm install @grucloud/core @grucloud/provider-k8s
```

### config.js

Create the **config.js**

```js
// config.js
const pkg = require("./package.json");
module.exports = () => ({
  projectName: pkg.name,
  namespaceName: "default",
});
```

### iac.js

```js
const { K8sProvider } = require("@grucloud/provider-k8s");
exports.createStack = async (config) => {
  const provider = K8sProvider({ config });
  // Define manifest here
  return { provider };
};
```

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
