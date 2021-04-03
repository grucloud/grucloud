# GruCloud example for the Kubernetes Web UI Dashboard

This GruCloud example allows to deploy the [Kubernetes Web UI Dashboard](https://kubernetes.io/docs/tasks/access-application-cluster/web-ui-dashboard/)

## Usage

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
