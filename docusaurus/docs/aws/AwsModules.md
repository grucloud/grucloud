---
id: AwsModules
title: Aws Modules
---

Modules encapsulates the creation of a set of related resources for a given functionality.

Below is a list of official modules for the AWS provider:

- [@grucloud/module-aws-certificate](https://www.npmjs.com/package/@grucloud/module-aws-certificate): Create a certificate and a Route53 record for validation.
- [@grucloud/module-aws-vpc](https://www.npmjs.com/package/@grucloud/module-aws-vpc): Contains the base resources required to create an Elastic Kubernetes Service.
- [@grucloud/module-aws-eks](https://www.npmjs.com/package/@grucloud/module-aws-eks): Contains all the resources required to launch an Elastic Kubernetes Service.
- [@grucloud/module-aws-load-balancer](https://www.npmjs.com/package/@grucloud/module-aws-load-balancer): Manages a load balancer, target groups, listeners and rules.

- [@grucloud/module-aws-load-balancer-controller](https://www.npmjs.com/package/@grucloud/module-aws-load-balancer-controller): Defines policy and role for the [AWS Load Balancer Controller](https://docs.aws.amazon.com/eks/latest/userguide/aws-load-balancer-controller.html)

### Aws Certificate Module

![Aws Certificate Module](https://raw.githubusercontent.com/grucloud/grucloud/main/packages/modules/aws/certificate/example/diagram-target.svg)

### Aws VPC Module

![Aws Vpc Module](https://raw.githubusercontent.com/grucloud/grucloud/main/packages/modules/aws/vpc/example/diagram-target.svg)

### Aws EKS Module

![Aws EKS Module](https://raw.githubusercontent.com/grucloud/grucloud/main/packages/modules/aws/eks/example/diagram-target.svg)

### Aws Load Balancer Module

![Aws Load Balancer Module](https://raw.githubusercontent.com/grucloud/grucloud/main/packages/modules/aws/load-balancer/example/diagram-target.svg)
