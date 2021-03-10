## Starhackit on Kubernetes

These infrastructure code deploy [starhackit](https://github.com/FredericHeem/starhackit), a full stack application based on React, Node and SQL.

At the moment, it can be deployed on various providers such as [AWS EKS](./aws) and [minikube](./minikube).

All infrastructures uses a shared code to create the deployments, stateful sets, config maps and so on in [k8sStackBase.js](./base/k8sStackBase.js).

Each of them have their own ingresses and additional resources.
