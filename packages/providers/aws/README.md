# Grucloud AWS provider

The package implements the [GruCloud AWS provider](https://www.npmjs.com/package/@grucloud/provider-aws)

Visit the [Aws Requirements](https://grucloud.com/docs/aws/AwsRequirements) to prepare for the [AWS Getting Started Guide](https://grucloud.com/docs/aws/AwsGettingStarted)

### Examples

- [EC2](https://github.com/grucloud/grucloud/tree/main/examples/aws/ec2), [EC2 with VPC](https://github.com/grucloud/grucloud/tree/main/examples/aws/ec2-vpc), [EBS Volume attached to EC2](https://github.com/grucloud/grucloud/tree/main/examples/aws/volume)
- [IAM](https://github.com/grucloud/grucloud/tree/main/examples/aws/iam)
- [S3](https://github.com/grucloud/grucloud/tree/main/examples/aws/s3), [S3 Simple](https://github.com/grucloud/grucloud/tree/main/examples/aws/s3-simple), [S3 Multiple](https://github.com/grucloud/grucloud/tree/main/examples/aws/s3-multiple)
- [HTTPS Website with CloudFront](https://github.com/grucloud/grucloud/tree/main/examples/aws/website-https)
- [Route53: hosted zone and record](https://github.com/grucloud/grucloud/tree/main/examples/aws/route53)

### Resources

- ACM: [Certificate](https://grucloud.com/docs/aws/resources/ACM/AcmCertificate)
- CloudFront: [Distribution](https://grucloud.com/docs/aws/resources/CloudFront/CloudFrontDistribution)
- EC2: [EC2](https://grucloud.com/docs/aws/resources/EC2/EC2), [ElasticIpAddress](https://grucloud.com/docs/aws/resources/EC2/ElasticIpAddress), [InternetGateway](https://grucloud.com/docs/aws/resources/EC2/InternetGateway), [KeyPair](https://grucloud.com/docs/aws/resources/EC2/KeyPair), [NatGateway](https://grucloud.com/docs/aws/resources/EC2/NatGateway), [RouteTables](https://grucloud.com/docs/aws/resources/EC2/RouteTables), [Route](https://grucloud.com/docs/aws/resources/EC2/Route), [SecurityGroup](https://grucloud.com/docs/aws/resources/EC2/SecurityGroup), [Subnet](https://grucloud.com/docs/aws/resources/EC2/Subnet), [Volume](https://grucloud.com/docs/aws/resources/EC2/Volume), [Vpc](https://grucloud.com/docs/aws/resources/EC2/Vpc)
- IAM: [IamInstanceProfile](https://grucloud.com/docs/aws/resources/IAM/IamInstanceProfile), [IamGroup](https://grucloud.com/docs/aws/resources/IAM/IamGroup), [IamOpenIDConnectProvider](https://grucloud.com/docs/aws/resources/IAM/IamOpenIDConnectProvider), [IamPolicy](https://grucloud.com/docs/aws/resources/IAM/IamPolicy), [IamRole](https://grucloud.com/docs/aws/resources/IAM/IamRole), [IamUser](https://grucloud.com/docs/aws/resources/IAM/IamUser)
- Route53: [HostedZone](https://grucloud.com/docs/aws/resources/Route53/Route53HostedZone), [Route53Record](https://grucloud.com/docs/aws/resources/Route53/Route53Record)
- Route53Domain: [Route53Domain](https://grucloud.com/docs/aws/resources/Route53Domain/Route53Domain)
- S3: [S3Bucket](https://grucloud.com/docs/aws/resources/S3/S3Bucket), [S3Object](https://grucloud.com/docs/aws/resources/S3/S3Object)
- EKS: [Cluster](https://grucloud.com/docs/aws/resources/EKS/EksCluster), [NodeGroup](https://grucloud.com/docs/aws/resources/EKS/EksNodeGroup)
- ELB: [Load Balancer](https://grucloud.com/docs/aws/resources/ELB/Loadbalancer),

### Modules

- [@grucloud/module-aws-certificate](https://www.npmjs.com/package/@grucloud/module-aws-certificate): Create a certificate and a Route53 record for validation.
- [@grucloud/module-aws-eks](https://www.npmjs.com/package/@grucloud/module-aws-eks): Contains all the resources required to launch an Elastic Kubernetes Service.
