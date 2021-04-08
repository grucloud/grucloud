# GruCloud Module the the AWS EKS

The purpose of the [module-aws-eks](https://www.npmjs.com/package/@grucloud/module-aws-vpc) is to create the resources to run an application on kubernetes with EKS: [Elastic Kubernetes Service](https://docs.aws.amazon.com/eks/latest/userguide/what-is-eks.html)

## Resources

### module-aws-vpc

This module depends on [module-aws-vpc](https://www.npmjs.com/package/@grucloud/module-aws-vpc)

### IAM

- [Iam Policy](https://www.grucloud.com/docs/aws/resources/IAM/IamPolicyReadOnly)
- [Iam Role](https://www.grucloud.com/docs/aws/resources/IAM/IamRole)

### EKS

- [EKS Cluster](https://www.grucloud.com/docs/aws/resources/EKS/EksCluster)
- [Node Group](https://www.grucloud.com/docs/aws/resources/EKS/EksNodeGroup)

## Config

The default config sets cluster name and the tags for the vpc and subnets.
These tags are required by the [Aws Load Balancer Controller](https://docs.aws.amazon.com/eks/latest/userguide/aws-load-balancer-controller.html). This load balancer controller runs on your kunernetes cluster, his role is to create and destroy [AWS load balancer](https://aws.amazon.com/elasticloadbalancing).

```js
const clusterName = "cluster";

module.exports = ({}) => ({
  eks: {
    cluster: {
      name: clusterName,
    },
  },
  vpc: {
    vpc: {
      Tags: [{ Key: `kubernetes.io/cluster/${clusterName}`, Value: "shared" }],
    },
    subnets: {
      privateTags: [
        {
          Key: `kubernetes.io/cluster/${clusterName}`,
          Value: "shared",
        },
        { Key: "kubernetes.io/role/internal-elb", Value: "1" },
      ],
      publicTags: [
        {
          Key: `kubernetes.io/cluster/${clusterName}`,
          Value: "shared",
        },
        { Key: "kubernetes.io/role/elb", Value: "1" },
      ],
    },
  },
});
```

## Dependency Graph

```sh
gc graph
```

![Graph](https://raw.githubusercontent.com/grucloud/grucloud/main/packages/modules/aws/eks/example/grucloud.svg)

## Example

Look at the [example](https://github.com/grucloud/grucloud/tree/main/packages/modules/aws/eks/example) to find out how to use this module.
