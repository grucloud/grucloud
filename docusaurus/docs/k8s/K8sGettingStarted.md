---
id: K8sGettingStarted
title: Getting Started with Kubernetes
---

## Introduction

The Kubernetes Grucloud provider allows to define and describe Kubernetes resources in Javascript, removing the need to write YAML or templating file.

The GruCloud Command Line Interface **gc** reads this description in Javascript and connect to the k8s control plane to apply the new or updated resource definitions.

For this tutorial, we will define a [namespace](https://www.grucloud.com/docs/k8s/resources/Namespace), a [service](https://www.grucloud.com/docs/k8s/resources/Service), and a [deployment](https://www.grucloud.com/docs/k8s/resources/Deployment) to serve an nginx web server.

## Requirements

Ensure **kubectl** and **minikube** is started with the ingress addon: [K8s Requirements](./K8sRequirements.md)

### Getting GruCLoud CLI

Install the _grucloud_ Command Line Interface: **gc**

```bash
npm i -g @grucloud/core
```

```
gc --version
```

## Project Content

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

Create the **config.js** which contains the configuration for this project.

```js
// config.js
const pkg = require("./package.json");
module.exports = () => ({
  projectName: pkg.name,
  namespace: "default",
  appLabel: "nginx-label",
  service: { name: "nginx-service" },
  deployment: { name: "nginx-service" },
});
```

### iac.js

Let's create the _iac.js_ with the following content:

```js
// iac.js
const { K8sProvider } = require("@grucloud/provider-k8s");

const createResource = async ({ provider }) => {
  const { config } = provider;

  const namespace = await provider.makeNamespace({
    name: config.namespace,
  });

  const service = await provider.makeService({
    name: config.service.name,
    dependencies: { namespace },
    properties: () => ({
      spec: {
        selector: {
          app: config.appLabel,
        },
        type: "NodePort",
        ports: [
          {
            protocol: "TCP",
            port: 80,
            targetPort: 8080,
          },
        ],
      },
    }),
  });

  const deployment = await provider.makeDeployment({
    name: config.deployment.name,
    dependencies: { namespace },
    properties: ({}) => ({
      metadata: {
        labels: {
          app: config.appLabel,
        },
      },
      spec: {
        replicas: 1,
        selector: {
          matchLabels: {
            app: config.appLabel,
          },
        },
        template: {
          metadata: {
            labels: {
              app: config.appLabel,
            },
          },
          spec: {
            containers: [
              {
                name: "nginx",
                image: "nginx:1.14.2",
                ports: [
                  {
                    containerPort: 80,
                  },
                ],
              },
            ],
          },
        },
      },
    }),
  });

  return { namespace, service, deployment };
};

exports.createStack = async ({ config }) => {
  const provider = K8sProvider({ config });
  const resources = await createResource({ provider });
  return { provider, resources };
};
```

## Workflow

### Deploy

Happy with the expected plan ? Deploy it now:

```bash
gc deploy
```

The first is to find out the plan, i.e what is going top be deployed.
You will be prompted if you accept or abort.
When typing: 'y', the resources will be deployed: a namespace, a service and a deployment.

```txt
Querying resources on 1 provider: k8s
✓ k8s
  ✓ Initialising
  ✓ Listing 7/7
  ✓ Querying
    ✓ Namespace 1/1
    ✓ Service 1/1
    ✓ Deployment 1/1
┌──────────────────────────────────────────────────────────────────────────────────────────┐
│ 1 Namespace from k8s                                                                     │
├──────────┬──────────┬────────────────────────────────────────────────────────────────────┤
│ Name     │ Action   │ Data                                                               │
├──────────┼──────────┼────────────────────────────────────────────────────────────────────┤
│ myapp    │ CREATE   │ apiVersion: v1                                                     │
│          │          │ kind: Namespace                                                    │
│          │          │ metadata:                                                          │
│          │          │   name: myapp                                                      │
│          │          │   annotations:                                                     │
│          │          │     Name: myapp                                                    │
│          │          │     ManagedBy: GruCloud                                            │
│          │          │     CreatedByProvider: k8s                                         │
│          │          │     stage: dev                                                     │
│          │          │     projectName: @grucloud/example-k8s-tuto1                       │
│          │          │                                                                    │
└──────────┴──────────┴────────────────────────────────────────────────────────────────────┘


┌──────────────────────────────────────────────────────────────────────────────────────────┐
│ 1 Service from k8s                                                                       │
├───────────────┬──────────┬───────────────────────────────────────────────────────────────┤
│ Name          │ Action   │ Data                                                          │
├───────────────┼──────────┼───────────────────────────────────────────────────────────────┤
│ nginx-service │ CREATE   │ spec:                                                         │
│               │          │   selector:                                                   │
│               │          │     app: nginx-label                                          │
│               │          │   type: NodePort                                              │
│               │          │   ports:                                                      │
│               │          │     - protocol: TCP                                           │
│               │          │       port: 80                                                │
│               │          │       targetPort: 8080                                        │
│               │          │ apiVersion: v1                                                │
│               │          │ kind: Service                                                 │
│               │          │ metadata:                                                     │
│               │          │   name: nginx-service                                         │
│               │          │   annotations:                                                │
│               │          │     Name: nginx-service                                       │
│               │          │     ManagedBy: GruCloud                                       │
│               │          │     CreatedByProvider: k8s                                    │
│               │          │     stage: dev                                                │
│               │          │     projectName: @grucloud/example-k8s-tuto1                  │
│               │          │   namespace: myapp                                            │
│               │          │                                                               │
└───────────────┴──────────┴───────────────────────────────────────────────────────────────┘


┌──────────────────────────────────────────────────────────────────────────────────────────┐
│ 1 Deployment from k8s                                                                    │
├──────────────────┬──────────┬────────────────────────────────────────────────────────────┤
│ Name             │ Action   │ Data                                                       │
├──────────────────┼──────────┼────────────────────────────────────────────────────────────┤
│ nginx-deployment │ CREATE   │ metadata:                                                  │
│                  │          │   labels:                                                  │
│                  │          │     app: nginx-label                                       │
│                  │          │   name: nginx-deployment                                   │
│                  │          │   annotations:                                             │
│                  │          │     Name: nginx-deployment                                 │
│                  │          │     ManagedBy: GruCloud                                    │
│                  │          │     CreatedByProvider: k8s                                 │
│                  │          │     stage: dev                                             │
│                  │          │     projectName: @grucloud/example-k8s-tuto1               │
│                  │          │   namespace: myapp                                         │
│                  │          │ spec:                                                      │
│                  │          │   replicas: 1                                              │
│                  │          │   selector:                                                │
│                  │          │     matchLabels:                                           │
│                  │          │       app: nginx-label                                     │
│                  │          │   template:                                                │
│                  │          │     metadata:                                              │
│                  │          │       labels:                                              │
│                  │          │         app: nginx-label                                   │
│                  │          │     spec:                                                  │
│                  │          │       containers:                                          │
│                  │          │         - name: nginx                                      │
│                  │          │           image: nginx:1.14.2                              │
│                  │          │           ports:                                           │
│                  │          │             - containerPort: 80                            │
│                  │          │ apiVersion: apps/v1                                        │
│                  │          │ kind: Deployment                                           │
│                  │          │                                                            │
└──────────────────┴──────────┴────────────────────────────────────────────────────────────┘


┌─────────────────────────────────────────────────────────────────────────────────────────┐
│ Plan summary for provider k8s                                                           │
├─────────────────────────────────────────────────────────────────────────────────────────┤
│ DEPLOY RESOURCES                                                                        │
├────────────────────┬────────────────────────────────────────────────────────────────────┤
│ Namespace          │ myapp                                                              │
├────────────────────┼────────────────────────────────────────────────────────────────────┤
│ Service            │ nginx-service                                                      │
├────────────────────┼────────────────────────────────────────────────────────────────────┤
│ Deployment         │ nginx-deployment                                                   │
└────────────────────┴────────────────────────────────────────────────────────────────────┘
Deploying resources on 1 provider: k8s
✓ k8s
  ✓ Initialising
  ✓ Deploying
    ✓ Namespace 1/1
    ✓ Service 1/1
    ✓ Deployment 1/1
3 resources deployed of 3 types and 1 provider
Running OnDeployedGlobal resources on 1 provider: k8s
Command "gc a -f" executed in 5s
```

In the case of the deployment manifest, **gc** will query the pod that is started by the deployment, when one of the container's pod is ready, the deployment can proceed.
Later on when we deal with the ingress type, **gc** will wait for the load balancer to be ready.
The command `gc apply` is the equivalent of `kubectl apply -f mymanifest.yaml` but

### List

Let's verify that our resources are deployed with the _gc list_ command:

```bash
gc list --our
```

```txt
List Summary:
Provider: k8s
┌─────────────────────────────────────────────────────────────────────────────────────────┐
│ k8s                                                                                     │
├────────────────────┬────────────────────────────────────────────────────────────────────┤
│ Namespace          │ myapp                                                              │
├────────────────────┼────────────────────────────────────────────────────────────────────┤
│ Service            │ nginx-service                                                      │
├────────────────────┼────────────────────────────────────────────────────────────────────┤
│ Deployment         │ nginx-deployment                                                   │
└────────────────────┴────────────────────────────────────────────────────────────────────┘
3 resources, 6 types, 1 provider
Command "gc l -o" executed in 0s
```

The deployment will create one or more pods depending on the _replica_ value.

Let's list them with the `t` flag:

```
gc l -t StatefullSet -t Pod
```

### Destroy

Time to destroy the resources allocated:

```bash
gc destroy
```
