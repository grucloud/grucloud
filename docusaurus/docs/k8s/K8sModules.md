---
id: K8sModules
title: Module
---

A Module is a collection of resources packaged with **npm**, the node package manager. These modules can be imported and be used in your project.

- [Cert Manager](https://github.com/grucloud/grucloud/tree/main/packages/modules/k8s/cert-manager): provides a set of kubernetes resources to manage SSL certificates, a dependency of the **Amazon Load Balancer Controller**.
- [Amazon Load Balancer Controller](https://github.com/grucloud/grucloud/tree/main/packages/modules/k8s/aws-load-balancer): Creates and destroys Amazon Load Balancer, Listener and TargetGroup.
- [Postgres](https://github.com/grucloud/grucloud/tree/main/packages/modules/k8s/postgres): Defines resources to setup a Postgres database.
- [Redis](https://github.com/grucloud/grucloud/tree/main/packages/modules/k8s/redis): Defines resources to setup Redis.

See the [k8s examples](./K8sExamples) how on to consume these modules in your project.
