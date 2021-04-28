---
id: K8sGettingStarted
title: Getting Started with Kubernetes
---

## Introduction

The Kubernetes Grucloud provider allows to define and describe Kubernetes manifests in Javascript, removing the need to write YAML or template files.

The GruCloud Command Line Interface **gc** reads a description in Javascript and connects to the k8s control plane to apply the new or updated resource definitions.

For this tutorial, we will define a [Namespace](https://www.grucloud.com/docs/k8s/resources/Namespace), a [Service](https://www.grucloud.com/docs/k8s/resources/Service), and a [Deployment](https://www.grucloud.com/docs/k8s/resources/Deployment) to deploy an Nginx web server.

![diagram-target](https://raw.githubusercontent.com/grucloud/grucloud/main/examples/k8s/tuto1/diagram-target.svg)

> This diagram is generated from the code with `gc graph`

## Requirements

Ensure **kubectl** is installed, and **minikube** is started: [K8s Requirements](./K8sRequirements.md)

It is always a good idea to verify the current _kubectl_ context, especially when switching k8s clusters:

```sh
kubectl config current-context
```

### Getting GruCloud CLI: gc

The GruCloud CLI, `gc`, is written in Javascript and run on [Node.js](https://nodejs.org/), hence _node_ is required:

```sh
node --version
```

Install `gc` in just one command:

```bash
npm i -g @grucloud/core
```

Verify _gc_ is installed properly by displaying the version:

```
gc --version
```

## Project Content

We'll describe in the next sections the 4 files required for this _infrastructure as code_ project:

- [package.json](https://github.com/grucloud/grucloud/blob/main/examples/k8s/tuto1/package.json)
- [config.js](https://github.com/grucloud/grucloud/blob/main/examples/k8s/tuto1/config.js)
- [iac.js](https://github.com/grucloud/grucloud/blob/main/examples/k8s/tuto1/iac.js)
- [hook.js](https://github.com/grucloud/grucloud/blob/main/examples/k8s/tuto1/hook.js)

> The link to the [source code for this tutorial](https://github.com/grucloud/grucloud/tree/main/examples/k8s/tuto1)

Let's create a new project directory

```sh
mkdir tuto
cd tuto
```

### package.json

The `npm init` command will create a basic _package.json_:

```sh
npm init
```

Let's install the [GruCloud Kubernetes provider](https://www.npmjs.com/package/@grucloud/provider-k8s) and the SDK. We'll also install [axios](https://github.com/axios/axios) and [rubico](https://rubico.land/), needed for the post deployment hooks, which does some final health check.

```sh
npm install @grucloud/core @grucloud/provider-k8s rubico axios
```

### config.js

Create the **config.js** which contains the configuration for this project:

```js
// config.js
const pkg = require("./package.json");
module.exports = () => ({
  projectName: pkg.name,
  namespace: "myapp",
  appLabel: "nginx-label",
  service: { name: "nginx-service" },
  deployment: {
    name: "nginx-deployment",
    container: { name: "nginx", image: "nginx:1.14.2" },
  },
});
```

### iac.js

Let's create the _iac.js_ with the following content:

```js
// iac.js
const { K8sProvider } = require("@grucloud/provider-k8s");

// Create a namespace, service and deployment
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
            targetPort: 80,
            nodePort: 30020,
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
                name: config.deployment.container.name,
                image: config.deployment.container.image,
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
  return { provider, resources, hooks: [require("./hook")] };
};
```

### hook.js

When the resources are created, any code can be invoked, defined in [hook.js](https://github.com/grucloud/grucloud/blob/main/examples/k8s/tuto1/hook.js), useful to perform some final health check.

In this case, the _kubectl port-forward_ is called with the right option:

```
kubectl --namespace myapp port-forward svc/nginx-service 8081:80
```

Then, we'll use the _axios_ library to perform HTTP calls to the web server, retrying if necessary.

When the website is up, it will open a browser at [http://localhost:8081](http://localhost:8081)

```js
// hook.js
const assert = require("assert");
const Axios = require("axios");
const { pipe, tap, eq, get, or } = require("rubico");
const { first } = require("rubico/x");
const { retryCallOnError } = require("@grucloud/core").Retry;
const shell = require("shelljs");

module.exports = ({ resources, provider }) => {
  const localPort = 8081;
  const url = `http://localhost:${localPort}`;

  const servicePort = pipe([
    () => resources.service.properties({}),
    get("spec.ports"),
    first,
    get("port"),
  ])();

  const kubectlPortForwardCommand = `kubectl --namespace ${resources.namespace.name} port-forward svc/${resources.service.name} ${localPort}:${servicePort}`;

  const axios = Axios.create({
    timeout: 15e3,
    withCredentials: true,
  });

  return {
    onDeployed: {
      init: async () => {},
      actions: [
        {
          name: `exec: '${kubectlPortForwardCommand}', check web server at ${url}`,
          command: async () => {
            // start kubectl port-forward
            var child = shell.exec(kubectlPortForwardCommand, { async: true });
            child.stdout.on("data", function (data) {});

            // Get the web page, retry until it succeeds
            await retryCallOnError({
              name: `get ${url}`,
              fn: () => axios.get(url),
              shouldRetryOnException: ({ error }) =>
                or([
                  eq(get("code"), "ECONNREFUSED"),
                  eq(get("response.status"), 404),
                ])(error),
              isExpectedResult: (result) => {
                assert(result.headers["content-type"], `text/html`);
                return [200].includes(result.status);
              },
              config: { retryCount: 20, retryDelay: 5e3 },
            });
            // Open a browser
            shell.exec(`open ${url}`, { async: true });
          },
        },
      ],
    },
    onDestroyed: {
      init: () => {},
    },
  };
};
```

## Workflow

We'll describe the most useful _gc_ commands: `apply`, `list`, `destroy`, and `plan`.

### Deploy

We are now ready to deploy the resources with the [apply](https://www.grucloud.com/docs/cli/PlanApply) command:

```bash
gc apply
```

The first part is to find out the plan, i.e what is going to be deployed.
You will be prompted if you accept or abort.
When typing: 'y', the resources will be deployed: a namespace, a service, and a deployment.

```txt
Querying resources on 1 provider: k8s
✓ k8s
  ✓ Initialising
  ✓ Listing 7/7
  ✓ Querying
    ✓ Namespace 1/1
    ✓ Service 1/1
    ✓ Deployment 1/1
┌──────────────────────────────────────────────────────────────────────────────────────────────────────┐
│ 1 Namespace from k8s                                                                                 │
├──────────┬──────────┬────────────────────────────────────────────────────────────────────────────────┤
│ Name     │ Action   │ Data                                                                           │
├──────────┼──────────┼────────────────────────────────────────────────────────────────────────────────┤
│ myapp    │ CREATE   │ apiVersion: v1                                                                 │
│          │          │ kind: Namespace                                                                │
│          │          │ metadata:                                                                      │
│          │          │   name: myapp                                                                  │
│          │          │   annotations:                                                                 │
│          │          │     Name: myapp                                                                │
│          │          │     ManagedBy: GruCloud                                                        │
│          │          │     CreatedByProvider: k8s                                                     │
│          │          │     stage: dev                                                                 │
│          │          │     projectName: @grucloud/example-k8s-tuto1                                   │
│          │          │                                                                                │
└──────────┴──────────┴────────────────────────────────────────────────────────────────────────────────┘


┌──────────────────────────────────────────────────────────────────────────────────────────────────────┐
│ 1 Service from k8s                                                                                   │
├──────────────────────┬──────────┬────────────────────────────────────────────────────────────────────┤
│ Name                 │ Action   │ Data                                                               │
├──────────────────────┼──────────┼────────────────────────────────────────────────────────────────────┤
│ myapp::nginx-service │ CREATE   │ spec:                                                              │
│                      │          │   selector:                                                        │
│                      │          │     app: nginx-label                                               │
│                      │          │   type: NodePort                                                   │
│                      │          │   ports:                                                           │
│                      │          │     - protocol: TCP                                                │
│                      │          │       port: 80                                                     │
│                      │          │       targetPort: 8080                                             │
│                      │          │ apiVersion: v1                                                     │
│                      │          │ kind: Service                                                      │
│                      │          │ metadata:                                                          │
│                      │          │   name: nginx-service                                              │
│                      │          │   annotations:                                                     │
│                      │          │     Name: nginx-service                                            │
│                      │          │     ManagedBy: GruCloud                                            │
│                      │          │     CreatedByProvider: k8s                                         │
│                      │          │     stage: dev                                                     │
│                      │          │     projectName: @grucloud/example-k8s-tuto1                       │
│                      │          │   namespace: myapp                                                 │
│                      │          │                                                                    │
└──────────────────────┴──────────┴────────────────────────────────────────────────────────────────────┘


┌──────────────────────────────────────────────────────────────────────────────────────────────────────┐
│ 1 Deployment from k8s                                                                                │
├─────────────────────────┬──────────┬─────────────────────────────────────────────────────────────────┤
│ Name                    │ Action   │ Data                                                            │
├─────────────────────────┼──────────┼─────────────────────────────────────────────────────────────────┤
│ myapp::nginx-deployment │ CREATE   │ metadata:                                                       │
│                         │          │   labels:                                                       │
│                         │          │     app: nginx-label                                            │
│                         │          │   name: nginx-deployment                                        │
│                         │          │   annotations:                                                  │
│                         │          │     Name: nginx-deployment                                      │
│                         │          │     ManagedBy: GruCloud                                         │
│                         │          │     CreatedByProvider: k8s                                      │
│                         │          │     stage: dev                                                  │
│                         │          │     projectName: @grucloud/example-k8s-tuto1                    │
│                         │          │   namespace: myapp                                              │
│                         │          │ spec:                                                           │
│                         │          │   replicas: 1                                                   │
│                         │          │   selector:                                                     │
│                         │          │     matchLabels:                                                │
│                         │          │       app: nginx-label                                          │
│                         │          │   template:                                                     │
│                         │          │     metadata:                                                   │
│                         │          │       labels:                                                   │
│                         │          │         app: nginx-label                                        │
│                         │          │     spec:                                                       │
│                         │          │       containers:                                               │
│                         │          │         - name: nginx                                           │
│                         │          │           image: nginx:1.14.2                                   │
│                         │          │           ports:                                                │
│                         │          │             - containerPort: 80                                 │
│                         │          │ apiVersion: apps/v1                                             │
│                         │          │ kind: Deployment                                                │
│                         │          │                                                                 │
└─────────────────────────┴──────────┴─────────────────────────────────────────────────────────────────┘


┌─────────────────────────────────────────────────────────────────────────────────────────────────────┐
│ Plan summary for provider k8s                                                                       │
├─────────────────────────────────────────────────────────────────────────────────────────────────────┤
│ DEPLOY RESOURCES                                                                                    │
├────────────────────┬────────────────────────────────────────────────────────────────────────────────┤
│ Namespace          │ myapp                                                                          │
├────────────────────┼────────────────────────────────────────────────────────────────────────────────┤
│ Service            │ myapp::nginx-service                                                           │
├────────────────────┼────────────────────────────────────────────────────────────────────────────────┤
│ Deployment         │ myapp::nginx-deployment                                                        │
└────────────────────┴────────────────────────────────────────────────────────────────────────────────┘
✔ Are you sure to deploy 3 resources, 3 types on 1 provider? … yes
Deploying resources on 1 provider: k8s
✓ k8s
  ✓ Initialising
  ✓ Deploying
    ✓ Namespace 1/1
    ✓ Service 1/1
    ✓ Deployment 1/1
3 resources deployed of 3 types and 1 provider
Running OnDeployedGlobal resources on 1 provider: k8s
Command "gc a" executed in 30s
```

In the case of the `Deployment` type manifest, **gc** will query the pod that is started by the deployment through the replica set, when one of the container's pod is ready, the deployment can proceed.

Later on, when we deal with the `Ingress` type, **gc** will wait for the load balancer to be ready.

The command `gc apply` is the equivalent of `kubectl apply -f mymanifest.yaml` but it waits for resources to be up and running, ready to serve.

We could try to run the `gc apply` or the `gc plan`, we should not expect any deployment or destruction of resources.

In the mathematical and computer science world, we could say that _apply_ (and _destroy_) commands are [idempotent](https://en.wikipedia.org/wiki/Idempotence): "property of certain operations in mathematics and computer science whereby they can be applied multiple times without changing the result beyond the initial application".

### List

Let's verify that the resources are deployed with the _gc list_ command:

A live diagram will be also generated.

```bash
gc list --our --all --graph
```

```txt
List Summary:
Provider: k8s
┌─────────────────────────────────────────────────────────────────────────────────────────────────────┐
│ k8s                                                                                                 │
├────────────────────┬────────────────────────────────────────────────────────────────────────────────┤
│ Namespace          │ myapp                                                                          │
├────────────────────┼────────────────────────────────────────────────────────────────────────────────┤
│ Service            │ myapp::nginx-service                                                           │
├────────────────────┼────────────────────────────────────────────────────────────────────────────────┤
│ Deployment         │ myapp::nginx-deployment                                                        │
├────────────────────┼────────────────────────────────────────────────────────────────────────────────┤
│ ReplicaSet         │ myapp::nginx-deployment-66cdc8d56b                                             │
├────────────────────┼────────────────────────────────────────────────────────────────────────────────┤
│ Pod                │ myapp::nginx-deployment-66cdc8d56b-4d8lz                                       │
└────────────────────┴────────────────────────────────────────────────────────────────────────────────┘
5 resources, 15 types, 1 provider
Command "gc list --our --all --graph" executed in 0s
```

![diagram-live](https://raw.githubusercontent.com/grucloud/grucloud/main/examples/k8s/tuto1/diagram-live.svg)

Notice the relationship between the Pod, ReplicaSet and Deployment.

The Deployment creates a ReplicaSet which creates a one or more Pod(s).

When quering the _k8s-api-server_ for the live resources, the pod contains information about its ReplicaSet parent, who has itself information about its parent Deployment. This allows _gc_ to find out the links between the resources.

### Post Deploy Hook

Would like to check the health of the system ? You can run the _onDeployed_ hook any time with the following command:

```sh
gc run --onDeployed
```

```txt
Running OnDeployed resources on 1 provider: k8s
Forwarding from 127.0.0.1:8081 -> 80
Forwarding from [::1]:8081 -> 80
Handling connection for 8081
✓ k8s
  ✓ Initialising
  ✓ default::onDeployed
    ✓ exec: 'kubectl --namespace myapp port-forward svc/nginx-service 8081:80', check web server at http://localhost:8081
Command "gc run --onDeployed" executed in 5s
```

### Update

Now that the initial deployment is successful, some changes will be made, for instance, let's change the Nginx container version, located at [config.js](https://github.com/grucloud/grucloud/blob/main/examples/k8s/tuto1/config.js).

> Browse the list of Nginx images at https://hub.docker.com/_/nginx

Let's try the version `nginx:1.20.0-alpine`.

For a preview of the change that will be made, use the _plan_ command:

```sh
gc plan
```

```txt
Querying resources on 1 provider: k8s
✓ k8s
  ✓ Initialising
  ✓ Listing 7/7
  ✓ Querying
    ✓ Namespace 1/1
    ✓ Service 1/1
    ✓ Deployment 1/1
┌───────────────────────────────────────────────────────────────────────────────────────────────────────────────────┐
│ 1 Deployment from k8s                                                                                             │
├─────────────────────────┬──────────┬──────────────────────────────────────────────────────────────────────────────┤
│ Name                    │ Action   │ Data                                                                         │
├─────────────────────────┼──────────┼──────────────────────────────────────────────────────────────────────────────┤
│ myapp::nginx-deployment │ UPDATE   │ added:                                                                       │
│                         │          │ deleted:                                                                     │
│                         │          │ updated:                                                                     │
│                         │          │   spec:                                                                      │
│                         │          │     template:                                                                │
│                         │          │       spec:                                                                  │
│                         │          │         containers:                                                          │
│                         │          │           0:                                                                 │
│                         │          │             image: nginx:1.20.0-alpine                                       │
│                         │          │                                                                              │
└─────────────────────────┴──────────┴──────────────────────────────────────────────────────────────────────────────┘


┌──────────────────────────────────────────────────────────────────────────────────────────────────────────────────┐
│ Plan summary for provider k8s                                                                                    │
├──────────────────────────────────────────────────────────────────────────────────────────────────────────────────┤
│ DEPLOY RESOURCES                                                                                                 │
├────────────────────┬─────────────────────────────────────────────────────────────────────────────────────────────┤
│ Deployment         │ myapp::nginx-deployment                                                                     │
└────────────────────┴─────────────────────────────────────────────────────────────────────────────────────────────┘
? Are you sure to deploy 1 resource, 1 type on 1 provider? › (y/N)
```

Notice this time the action is not `CREATE` but `UPDATE`. **gc** fetched the live resources from the _kubernetes-api-server_, compared them with the target resources defined in the code, and has found out the deployment needs to be updated.

Now we can apply the change:

```sh
gc apply
```

The updated Nginx image should be up and running.

Let's double-check the state of the Nginx deployment, filtering by _type_ and _name_

```sh
gc list -t Deployment --name nginx-deployment
```

```txt
Listing resources on 1 provider: k8s
✓ k8s
  ✓ Initialising
  ✓ Listing 6/6
┌───────────────────────────────────────────────────────────────────────────────────────────────────────────────────┐
│ 1 Deployment from k8s                                                                                             │
├─────────────────────────┬──────────────────────────────────────────────────────────────────────────────────┬──────┤
│ Name                    │ Data                                                                             │ Our  │
├─────────────────────────┼──────────────────────────────────────────────────────────────────────────────────┼──────┤
│ myapp::nginx-deployment │ metadata:                                                                        │ Yes  │
│                         │   name: nginx-deployment                                                         │      │
│                         │   namespace: myapp                                                               │      │
│                         │   uid: 7c9bf366-cbf4-47d9-a7b7-e3da900b75dc                                      │      │
│                         │   resourceVersion: 7111                                                          │      │
│                         │   generation: 2                                                                  │      │
│                         │   creationTimestamp: 2021-04-28T19:51:37Z                                        │      │
│                         │   labels:                                                                        │      │
│                         │     app: nginx-label                                                             │      │
│                         │   annotations:                                                                   │      │
│                         │     CreatedByProvider: k8s                                                       │      │
│                         │     ManagedBy: GruCloud                                                          │      │
│                         │     Name: nginx-deployment                                                       │      │
│                         │     deployment.kubernetes.io/revision: 2                                         │      │
│                         │     projectName: @grucloud/example-k8s-tuto1                                     │      │
│                         │     stage: dev                                                                   │      │
│                         │ spec:                                                                            │      │
│                         │   replicas: 1                                                                    │      │
│                         │   selector:                                                                      │      │
│                         │     matchLabels:                                                                 │      │
│                         │       app: nginx-label                                                           │      │
│                         │   template:                                                                      │      │
│                         │     metadata:                                                                    │      │
│                         │       creationTimestamp: null                                                    │      │
│                         │       labels:                                                                    │      │
│                         │         app: nginx-label                                                         │      │
│                         │     spec:                                                                        │      │
│                         │       containers:                                                                │      │
│                         │         - name: nginx                                                            │      │
│                         │           image: nginx:1.20.0-alpine                                             │      │
│                         │           ports:                                                                 │      │
│                         │             - containerPort: 80                                                  │      │
│                         │               protocol: TCP                                                      │      │
│                         │           resources:                                                             │      │
│                         │           terminationMessagePath: /dev/termination-log                           │      │
│                         │           terminationMessagePolicy: File                                         │      │
│                         │           imagePullPolicy: IfNotPresent                                          │      │
│                         │       restartPolicy: Always                                                      │      │
│                         │       terminationGracePeriodSeconds: 30                                          │      │
│                         │       dnsPolicy: ClusterFirst                                                    │      │
│                         │       securityContext:                                                           │      │
│                         │       schedulerName: default-scheduler                                           │      │
│                         │   strategy:                                                                      │      │
│                         │     type: RollingUpdate                                                          │      │
│                         │     rollingUpdate:                                                               │      │
│                         │       maxUnavailable: 25%                                                        │      │
│                         │       maxSurge: 25%                                                              │      │
│                         │   revisionHistoryLimit: 10                                                       │      │
│                         │   progressDeadlineSeconds: 600                                                   │      │
│                         │ status:                                                                          │      │
│                         │   observedGeneration: 2                                                          │      │
│                         │   replicas: 1                                                                    │      │
│                         │   updatedReplicas: 1                                                             │      │
│                         │   readyReplicas: 1                                                               │      │
│                         │   availableReplicas: 1                                                           │      │
│                         │   conditions:                                                                    │      │
│                         │     - type: Available                                                            │      │
│                         │       status: True                                                               │      │
│                         │       lastUpdateTime: 2021-04-28T19:51:39Z                                       │      │
│                         │       lastTransitionTime: 2021-04-28T19:51:39Z                                   │      │
│                         │       reason: MinimumReplicasAvailable                                           │      │
│                         │       message: Deployment has minimum availability.                              │      │
│                         │     - type: Progressing                                                          │      │
│                         │       status: True                                                               │      │
│                         │       lastUpdateTime: 2021-04-28T20:03:08Z                                       │      │
│                         │       lastTransitionTime: 2021-04-28T19:51:37Z                                   │      │
│                         │       reason: NewReplicaSetAvailable                                             │      │
│                         │       message: ReplicaSet "nginx-deployment-675bd9f4f7" has successfully progre… │      │
│                         │                                                                                  │      │
└─────────────────────────┴──────────────────────────────────────────────────────────────────────────────────┴──────┘


List Summary:
Provider: k8s
┌──────────────────────────────────────────────────────────────────────────────────────────────────────────────────┐
│ k8s                                                                                                              │
├────────────────────┬─────────────────────────────────────────────────────────────────────────────────────────────┤
│ Deployment         │ myapp::nginx-deployment                                                                     │
└────────────────────┴─────────────────────────────────────────────────────────────────────────────────────────────┘
1 resource, 5 types, 1 provider
Command "gc list -t Deployment --name nginx-deployment" executed in 0s
```

Great, as expected, the new version has been updated.

### Destroy

To destroy the resources allocated in the right order:

```bash
gc destroy
```

```txt
┌──────────────────────────────────────────────────────────────────────────────────────────────────────────────────┐
│ Destroy summary for provider k8s                                                                                 │
├────────────────────┬─────────────────────────────────────────────────────────────────────────────────────────────┤
│ Namespace          │ myapp                                                                                       │
├────────────────────┼─────────────────────────────────────────────────────────────────────────────────────────────┤
│ Service            │ myapp::nginx-service                                                                        │
├────────────────────┼─────────────────────────────────────────────────────────────────────────────────────────────┤
│ Deployment         │ myapp::nginx-deployment                                                                     │
└────────────────────┴─────────────────────────────────────────────────────────────────────────────────────────────┘
✔ Are you sure to destroy 3 resources, 3 types on 1 provider? … yes
Destroying resources on 1 provider: k8s
✓ k8s
  ✓ Initialising
  ✓ Destroying
    ✓ Namespace 1/1
    ✓ Service 1/1
    ✓ Deployment 1/1
  ✓ default::onDestroyed
3 resources destroyed, 3 types on 1 provider
Running OnDestroyedGlobal resources on 1 provider: k8s
Command "gc d" executed in 1m 17s
```

At this stage, all the Kubernetes resources should have been destroyed.
We could try to run _gc destroy_ command again, nothing should be destroyed or deployed:

```sh
gc d
```

```txt
Find Deletable resources on 1 provider: k8s
✓ k8s
  ✓ Initialising
  ✓ Listing 7/7

No resources to destroy
Running OnDestroyedGlobal resources on 1 provider: k8s
Command "gc d" executed in 0s
```

As expected, the _destroy_ command is idempotent.

## Debugging

A benefit of using a general purpose programming such as Javasript, is debugging. Thanks [Visual Studio Code](https://code.visualstudio.com/) for providing such an easy way to debug Javascript application.

This example contains a vs code file called [launch.json](https://github.com/grucloud/grucloud/blob/main/examples/k8s/tuto1/.vscode/launch.json), which defines various debug targets for `gc apply`, `gc destroy` and so on.

## Conclusion

This tutorial described how to deploy, list, and destroy Kubernetes manifests from Javascript code.
In this case, a namespace, a service, and a deployment.

What's next? Let's see how to deploy a [full stack application on minikube](https://github.com/grucloud/grucloud/tree/main/examples/starhackit/minikube).

Ready to try Kubernetes on EKS, the Amazon Elastic Kubernetes Service? Have a look at the project [full stack application on EKS](https://github.com/grucloud/grucloud/tree/main/examples/starhackit/eks-lean).

Maybe you prefer using [kops](https://kops.sigs.k8s.io/) to set up your cluster? The tutorial [Setup Kops on AWS with Grucloud](https://dev.to/fredericheem/setup-kops-on-aws-with-grucloud-oia) explains how to automate the _kops_ setup

Are you looking to install the _cert manager_, _web ui dashboard_, _prometheus_, and more? Browse the [GruCloud K8s Modules](https://www.grucloud.com/docs/k8s/K8sModules) and find out how to install and use these npm packages into your code.
