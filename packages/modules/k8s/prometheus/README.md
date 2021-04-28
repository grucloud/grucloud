# GruCloud module for Prometheus

This GruCloud module allows to deploy [Prometheus](https://prometheus.io/)

## How to consume this module

```sh
npm i @grucloud/module-k8s-prometheus
```

In your _iac.js_ file, import the package:

```js
const PostgresOperator = require("@grucloud/module-k8s-prometheus");
```

Invoke the _createResources_ function with a K8sProvider instance

```js
const prometheusResources = await Prometheus.createResources({
  provider,
});
```

## Examples

Have a look at the [example](https://github.com/grucloud/grucloud/tree/main/packages/modules/k8s/prometheus/example)

## Release a new version

Modify the manifest version from the _download-manifest_ scripts sections of the _package.json_.

Run the `download-manifest` npm script:

```sh
npm run download-manifest
```

Run the _k8s-manifest2code_ to generate the new _resource.js_:

```
npm run gen-code
```

Ready for testing ? Go to the [example](./example/README.md)
