# GruClouf module for the AWS Load Balancer

GruCloud module for managing AWS Looad Balancer and associated resources.
It is an alternative to the AWS Load Balancer Controller, which runs on the k8s cluster and also creates and manages the AWS Load Balancer and other resources.

## Module Dependencies

- [@grucloud/module-aws-vpc](https://www.npmjs.com/package/@grucloud/module-aws-vpc)
- [@grucloud/module-aws-eks](https://www.npmjs.com/package/@grucloud/module-aws-eks)
- [@grucloud/module-aws-certificate](https://www.npmjs.com/package/@grucloud/module-aws-certificate)

## Resources

- [LoadBalancer]
- [TargetGroup]
- [Listener]
- [ListenerRule]
