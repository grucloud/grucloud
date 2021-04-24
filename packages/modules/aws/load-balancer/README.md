# GruCloud module for the AWS Load Balancer

GruCloud module for managing AWS Looad Balancer and associated resources.
It is an alternative to the AWS Load Balancer Controller, which runs on the k8s cluster and also creates and manages the AWS Load Balancer and other resources.

![Aws Load Balancer Module](https://raw.githubusercontent.com/grucloud/grucloud/main/packages/modules/aws/load-balancer/example/diagram-target.svg)

## Module Dependencies

- [@grucloud/module-aws-vpc](https://www.npmjs.com/package/@grucloud/module-aws-vpc)
- [@grucloud/module-aws-eks](https://www.npmjs.com/package/@grucloud/module-aws-eks)
- [@grucloud/module-aws-certificate](https://www.npmjs.com/package/@grucloud/module-aws-certificate)

## Resources

- [LoadBalancer](https://www.grucloud.com/docs/aws/resources/ELBv2/AwsLoadBalancer)
- [TargetGroup](https://www.grucloud.com/docs/aws/resources/ELBv2/AwsTargetGroup)
- [Listener](https://www.grucloud.com/docs/aws/resources/ELBv2/AwsListener)
- [ListenerRule](https://www.grucloud.com/docs/aws/resources/ELBv2/AwsListenerRule)

## Used By

This module is being used by a [full stack application on EKS](https://github.com/grucloud/grucloud/tree/main/examples/starhackit/eks-lean)
