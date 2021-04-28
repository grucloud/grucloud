# GruCloud Module for the K8s Cert Manager

Integrate the [jetstack cert-manager](https://github.com/jetstack/cert-manager/) with GruCloud.

## How to use this module

```sh
npm i @grucloud/module-k8s-cert-manager
```

Require the package [@grucloud/module-k8s-cert-manager](https://www.npmjs.com/package/@grucloud/module-k8s-cert-manager)

```js
const CertManager = require("@grucloud/module-k8s-cert-manager");
```

The _CertManager_ exposes these functions:

- _createResources_
- _config_
- _loadManifest_

> _loadManifest_ will tell the K8s provider about the Cert Manager CRDs.

```js
const createStack = async ({ stackAws }) => {
  const provider = K8sProvider({
    configs: [require("./configK8s"), CertManager.config],
    manifests: await CertManager.loadManifest(),
  });

  const certManagerResources = await CertManager.createResources({
    provider,
  });

  return { provider, resources: certManagerResources };
};
```

## Contributing

The cert-manager manifest is transformed into javascript code using the [k8s-manifest2code](https://www.npmjs.com/package/@grucloud/k8s-manifest2code) tool:

### Change the version

Change the Cert Manager version in the `download-manifest` script located in [package.json](./package.json).

> Found the latest version at https://github.com/jetstack/cert-manager/tags

### Download the new manifet

This script calls _curl_ wit the right options:

```
npm run download-manifest
```

### Generate resources.js

The _gen-code_ script is a wrapper around [k8s-manifest2code](https://www.npmjs.com/package/@grucloud/k8s-manifest2code). The manifest _cert-manager.yaml_ previously downloaded is transformed into _resource.js_ which exports the _createResource_ function.

```
npm run gen-code
```
