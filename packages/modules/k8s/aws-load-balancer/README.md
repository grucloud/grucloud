# AWS Load Balancer Controller for Kubernetes

Integrate the [Aws load balancer controller](https://kubernetes-sigs.github.io/aws-load-balancer-controller/latest/) with GruCloud.

## Update manifest version

Eventually edit the manifest version in the _package.json_ at the field **.scripts.download-manifest**.

Download the manifest file locally

```
npm run download-manifest
```

## Code Generation

The load balancer controler manifest is transformed into javascript code using the **k8s-manifest2code** tool:

```
npm run gen-code
```

This commands creates the **resource.js** file containing all the resources.

## Workflow

This module depends on the [cert-manager](../cert-manager/README.md) which install Custom Resource Definition, aka CRD
