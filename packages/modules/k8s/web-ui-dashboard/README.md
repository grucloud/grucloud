# GruCloud module for the Kubernetes Web UI Dashboard

This GruCloud module allows to deploy the [Kubernetes Web UI Dashboard](https://kubernetes.io/docs/tasks/access-application-cluster/web-ui-dashboard/)

The offical dashboard k8s manifest is downloaded, the k8s-manifest2code generates the GruCloud code from that manifest.

## How to consume this module

```sh
npm i @grucloud/module-k8s-web-ui-dashboard
```

In your _iac.js_ file, import the package:

```js
const Dashboard = require("@grucloud/module-k8s-web-ui-dashboard");
```

Invoke the _createResources_ function with a K8sProvider instance

```js
const dashboardResources = await Dashboard.createResources({ provider });
```

## Examples

Have a look at the [example](https://github.com/grucloud/grucloud/tree/main/packages/modules/k8s/web-ui-dashboard/example)
