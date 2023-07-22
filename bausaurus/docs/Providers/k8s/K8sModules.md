---
id: K8sModules
title: Kubernetes Modules
---

A Module is a collection of resources packaged with **npm**, the node package manager. These modules can be imported and be used in your project:

- [@grucloud/module-k8s-cert-manager](https://www.npmjs.com/package/@grucloud/module-k8s-cert-manager): provides a set of kubernetes resources to manage SSL certificates, a dependency of the _Amazon Load Balancer Controller_.
- [@grucloud/module-k8s-load-balancer](https://www.npmjs.com/package/@grucloud/module-k8s-aws-load-balancer): Automates the [Amazon Load Balancer Controller](https://docs.aws.amazon.com/eks/latest/userguide/aws-load-balancer-controller.html)
- [@grucloud/module-k8s-postgres](https://www.npmjs.com/package/@grucloud/module-k8s-postgres): Defines resources to setup a [Postgres](https://www.postgresql.org/) database.
- [@grucloud/module-k8s-redis](https://www.npmjs.com/package/@grucloud/module-k8s-redis): Defines resources to setup [Redis](https://redis.io/).
- [@grucloud/module-k8s-web-ui-dashboard](https://www.npmjs.com/package/@grucloud/module-k8s-web-ui-dashboard): Setup the [Kubernetes Web Ui Dashboard](https://kubernetes.io/docs/tasks/access-application-cluster/web-ui-dashboard/)
- [@grucloud/module-k8s-prometheus](https://www.npmjs.com/package/@grucloud/module-k8s-prometheus): Monitoring with [Prometheus](https://prometheus.io)
- [@grucloud/module-k8s-crunchy-postgres](https://www.npmjs.com/package/@grucloud/module-k8s-crunchy-postgres): Manages the [Crunchy Data Postgres Operator](https://github.com/CrunchyData/postgres-operator)

See the [k8s examples](./K8sExamples) how on to consume these modules in your project.
