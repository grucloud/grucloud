# EKS

The purpose of this example is to deploy an kubernetes on EKS: [Elastic Kubernetes Service](https://docs.aws.amazon.com/eks/latest/userguide/what-is-eks.html)

## Resources

### EC2

- [Vpc](https://www.grucloud.com/docs/aws/resources/EC2/Vpc)
- [Subnet](https://www.grucloud.com/docs/aws/resources/EC2/Subnet)
- [SecurityGroup](https://www.grucloud.com/docs/aws/resources/EC2/SecurityGroup)
- [Elastic IP Address](https://www.grucloud.com/docs/aws/resources/EC2/ElasticIpAddress)
- [Internet Gateway](https://www.grucloud.com/docs/aws/resources/EC2/InternetGateway)
- [Nat Gateway](https://www.grucloud.com/docs/aws/resources/EC2/NatGateway)
- [Route Table](https://www.grucloud.com/docs/aws/resources/EC2/RouteTables)
- [Route](https://www.grucloud.com/docs/aws/resources/EC2/Route)

### IAM

- [Iam Policy](https://www.grucloud.com/docs/aws/resources/IAM/IamPolicyReadOnly)
- [Iam Role](https://www.grucloud.com/docs/aws/resources/IAM/IamRole)

### EKS

- [EKS Cluster](https://www.grucloud.com/docs/aws/resources/EKS/EksCluster)

## Dependency Graph

```sh
gc graph
```

![Graph](grucloud.svg)
