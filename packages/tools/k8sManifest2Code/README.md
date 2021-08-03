# K8s Manifest to GruCloud Code

This code generator takes any kubernetes YAML manifests and creates the corresponding resources written with the GruCloud Javascript SDK.

Currently used to create the following kubernetes modules:

- [Cert Manager](https://www.npmjs.com/package/@grucloud/module-k8s-cert-manager)
- [Aws Load Balancer Controller](https://www.npmjs.com/package/@grucloud/module-k8s-aws-load-balancer-controller)
- [Web Ui Dashboard](https://github.com/grucloud/grucloud/tree/main/packages/modules/k8s/web-ui-dashboard)
- [Crunchy Postgres Operator](https://github.com/grucloud/grucloud/tree/main/packages/modules/k8s/crunchy-postgres)
- [Prometheus](https://github.com/grucloud/grucloud/tree/main/packages/modules/k8s/prometheus)

> **k8s-manifest2code** supports reading from a single file, recursively from a directory, and from HTTPS.

# Tutorial: How to create a Kubernetes Module with k8s-manifest2code

We'll create a [web ui dashboard](https://kubernetes.io/docs/tasks/access-application-cluster/web-ui-dashboard/) grucloud module and its example with the help of the **k8s-manifest2code** generator.

## Create the module-k8s-dashboard project

```sh
mkdir web-ui-dashboard
cd web-ui-dashboard
```

Let's create a _package.json_ for this module:

- in the particular case the package name is _@grucloud/example-module-k8s-web-ui-dashboard_
- the entry point should be the generated file _resources.js_

```sh
npm init
```

## Install the dependencies:

```
npm install @grucloud/core @grucloud/provider-k8s @grucloud/k8s-manifest2code
```

## Npm scripts

We'll add 2 npm scripts in the package.json.

- `download-manifest`: downloads the manifest locally and name it _web-ui-dashboard.yaml_.
- `gen-code`: generate the GruCloud code _resource.js_ from this manifest with _k8s-manifest2code_.

We found out the manifest URL from the [official documentation 'deploying-the-dashboard-ui'](https://kubernetes.io/docs/tasks/access-application-cluster/web-ui-dashboard/#deploying-the-dashboard-ui)

```json
// package.json
  "scripts": {
    "download-manifest": "curl -L -o web-ui-dashboard.yaml https://raw.githubusercontent.com/kubernetes/dashboard/v2.0.0/aio/deploy/recommended.yaml",
    "gen-code": "k8s-manifest2code --input web-ui-dashboard.yaml"
  },
```

### Download the manifest

Download the manifest with:

```
npm run download-manifest
```

Check to content of **_web-ui-dashboard.yaml_**, you are supposed to find a set of K8s resources such as Namespace, ServiceAccount, Service, Secret, Config Map, Role, RoleBinding, Deployment, etc ....

### Generate the code

Generate the GruCloud source code from the k8s manifest:

```
npm run gen-code
```

Check the **resources.js** to find out which resources will be set up.

## Create an example project

```
mkdir example
cd example
```

Let's create a _package.json_, in the case the package name is _@grucloud/example-module-k8s-web-ui-dashboard_:

```
npm init
```

## Install the dependencies:

```
npm install @grucloud/core @grucloud/provider-k8s @grucloud/example-module-k8s-web-ui-dashboard
```

## Create the iac.js file

It is now time to create a K8s provider and uses the generated **createResources** function from package _@grucloud/module-k8s-web-ui-dashboard_

```js
// iac.js
const { K8sProvider } = require("@grucloud/provider-k8s");
const { createResources } = require("../resources");

exports.createStack = async ({ createProvider }) => {
  const provider = createProvider(K8sProvider, { config: require("./config") });
  const resources = await createResources({ provider });
  return { provider, resources };
};
```

## Deploying

Ensure your cluster is running and execute:

```sh
gc apply
```

```
┌──────────────────────────────────────────────────────────────────────────────────────────────┐
│ Plan summary for provider k8s                                                                │
├──────────────────────────────────────────────────────────────────────────────────────────────┤
│ DEPLOY RESOURCES                                                                             │
├────────────────────┬─────────────────────────────────────────────────────────────────────────┤
│ ServiceAccount     │ kubernetes-dashboard                                                    │
├────────────────────┼─────────────────────────────────────────────────────────────────────────┤
│ Service            │ kubernetes-dashboard, dashboard-metrics-scraper                         │
├────────────────────┼─────────────────────────────────────────────────────────────────────────┤
│ Secret             │ kubernetes-dashboard-certs, kubernetes-dashboard-csrf                   │
├────────────────────┼─────────────────────────────────────────────────────────────────────────┤
│ ConfigMap          │ kubernetes-dashboard-settings                                           │
├────────────────────┼─────────────────────────────────────────────────────────────────────────┤
│ Role               │ kubernetes-dashboard                                                    │
├────────────────────┼─────────────────────────────────────────────────────────────────────────┤
│ ClusterRole        │ kubernetes-dashboard                                                    │
├────────────────────┼─────────────────────────────────────────────────────────────────────────┤
│ RoleBinding        │ kubernetes-dashboard                                                    │
├────────────────────┼─────────────────────────────────────────────────────────────────────────┤
│ ClusterRoleBinding │ kubernetes-dashboard                                                    │
├────────────────────┼─────────────────────────────────────────────────────────────────────────┤
│ Deployment         │ kubernetes-dashboard, dashboard-metrics-scraper                         │
└────────────────────┴─────────────────────────────────────────────────────────────────────────┘
? Are you sure to deploy 12 resources, 9 types on 1 provider? › (y/N)
Deploying resources on 1 provider: k8s
✓ k8s
  ✓ Initialising
  ✓ Deploying
    ✓ ServiceAccount 1/1
    ✓ Service 2/2
    ✓ Secret 2/2
    ✓ ConfigMap 1/1
    ✓ Role 1/1
    ✓ ClusterRole 1/1
    ✓ RoleBinding 1/1
    ✓ ClusterRoleBinding 1/1
    ✓ Deployment 2/2
12 resources deployed of 9 types and 1 provider
Command "gc apply" executed in 52s
```

The Web Ui Dashboard should be up and running. GruCloud waits for all the resources to up. For instance, a deployment is considered up if one of the container's pod started by the deployment is running.
