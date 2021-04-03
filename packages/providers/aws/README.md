# Grucloud AWS provider

The package implements the [GruCloud AWS provider](https://www.npmjs.com/package/@grucloud/provider-aws)

Visit the [Aws Requirements](../../../docusaurus/docs/aws/AwsRequirements.md) to prepare for the [AWS Getting Started Guide](../../../docusaurus/docs/aws/AwsGettingStarted.md)

### Examples

- [EC2](../../../examples/aws/ec2/README.md), [EC2 with VPC](../../../examples/aws/ec2-vpc/README.md), [EBS Volume attached to EC2](../../../examples/aws/volumes/README.md)
- [IAM](../../../examples/aws/iam/README.md)
- [S3](../../../examples/aws/s3/README.md), [S3 Simple](../../../examples/aws/s3-simple/README.md), [S3 Multiple](../../../examples/aws/s3-multiple/README.md)
- [HTTPS Website with CloudFront](../../../examples/aws/website-https/README.md)
- [EKS: Elastic Kubernetes Service](../../../examples/aws/eks/README.md)
- [Route53: hosted zone and record](../../../examples/aws/route53/README.md)

### Resources

- ACM: [Certificate](../../../docusaurus/docs/aws/resources/ACM/AcmCertificate.md)
- CloudFront: [Distribution](../../../docusaurus/docs/aws/resources/CloudFront/CloudFrontDistribution.md)
- EC2: [EC2](../../../docusaurus/docs/aws/resources/EC2/EC2.md), [ElasticIpAddress](../../../docusaurus/docs/aws/resources/EC2/ElasticIpAddress.md), [InternetGateway](../../../docusaurus/docs/aws/resources/EC2/InternetGateway.md), [KeyPair](../../../docusaurus/docs/aws/resources/EC2/KeyPair.md), [NatGateway](../../../docusaurus/docs/aws/resources/EC2/NatGateway.md), [RouteTables](../../../docusaurus/docs/aws/resources/EC2/RouteTables.md), [Route](../../../docusaurus/docs/aws/resources/EC2/Route.md), [SecurityGroup](../../../docusaurus/docs/aws/resources/EC2/SecurityGroup.md), [Subnet](../../../docusaurus/docs/aws/resources/EC2/Subnet.md), [Volume](../../../docusaurus/docs/aws/resources/EC2/Volume.md), [Vpc](../../../docusaurus/docs/aws/resources/EC2/Vpc.md)
- IAM: [IamInstanceProfile](../../../docusaurus/docs/aws/resources/IAM/IamInstanceProfile.md), [IamGroup](../../../docusaurus/docs/aws/resources/IAM/IamGroup.md), [IamOpenIDConnectProvider](../../../docusaurus/docs/aws/resources/IAM/IamOpenIDConnectProvider.md), [IamPolicy](../../../docusaurus/docs/aws/resources/IAM/IamPolicy.md), [IamRole](../../../docusaurus/docs/aws/resources/IAM/IamRole.md), [IamUser](../../../docusaurus/docs/aws/resources/IAM/IamUser.md)
- Route53: [HostedZone](../../../docusaurus/docs/aws/resources/Route53/Route53HostedZone.md), [Route53Record](../../../docusaurus/docs/aws/resources/Route53/Route53Record.md)
- Route53Domain: [Route53Domain](../../../docusaurus/docs/aws/resources/Route53Domain/Route53Domain.md)
- S3: [S3Bucket](../../../docusaurus/docs/aws/resources/S3/S3Bucket.md), [S3Object](../../../docusaurus/docs/aws/resources/S3/S3Object.md)
- EKS: [Cluster](../../../docusaurus/docs/aws/resources/EKS/EksCluster.md), [NodeGroup](../../../docusaurus/docs/aws/resources/EKS/EksNodeGroup.md)

### Modules

- [@grucloud/module-aws-certificate](https://www.npmjs.com/package/@grucloud/module-aws-certificate): Create a certificate and a Route53 record for validation.
- [@grucloud/module-aws-eks](https://www.npmjs.com/package/@grucloud/module-aws-eks): Contains all the resources required to launch an Elastic Kubernetes Service.
