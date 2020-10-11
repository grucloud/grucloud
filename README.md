![GruCloud](./docusaurus/static/img/grucloud-logo.png "GruCloud")

**GruCloud** is an "infrastructure as code" tool.
Code your infrastructure with Javascript to deploy, manage and dispose various resources on different cloud provider such as AWS, Google Cloud and Microsoft Azure.

# Getting Started

- [AWS](./docusaurus/docs/aws/AwsGettingStarted.md)
- [Google Cloud](./docusaurus/docs/google/GoogleGettingStarted.md)
- [Microsoft Azure](./docusaurus/docs/azure/AzureGettingStarted.md)

# Providers

## Amazon Web Service

Visit the [Aws Requirements](./docusaurus/docs/aws/AwsRequirements.md) to prepare for the [AWS Getting Started Guide](./docusaurus/docs/aws/AwsGettingStarted.md)

### Examples

- [EC2](./examples/aws/ec2), [EC2 with VPC](./examples/aws/ec2-vpc)
- [IAM](./examples/aws/iam)
- [S3](./examples/aws/s3), [S3 Simple](./examples/aws/s3-simple), [S3 Multiple](./examples/aws/s3-multiple)

### Resources

- EC2: [EC2](./docusaurus/docs/aws/resources/EC2/EC2.md), [ElasticIpAddress](./docusaurus/docs/aws/resources/EC2/ElasticIpAddress.md), [InternetGateway](./docusaurus/docs/aws/resources/EC2/InternetGateway.md), [KeyPair](./docusaurus/docs/aws/resources/EC2/KeyPair.md), [RouteTables](./docusaurus/docs/aws/resources/EC2/RouteTables.md), [SecurityGroup](./docusaurus/docs/aws/resources/EC2/SecurityGroup.md), [Subnet](./docusaurus/docs/aws/resources/EC2/Subnet.md), [Vpc](./docusaurus/docs/aws/resources/EC2/Vpc.md)
- IAM: [IamInstanceProfile](./docusaurus/docs/aws/resources/IAM/IamInstanceProfile.md), [IamGroup](./docusaurus/docs/aws/resources/IAM/IamGroup.md), [IamPolicy](./docusaurus/docs/aws/resources/IAM/IamPolicy.md), [IamRole](./docusaurus/docs/aws/resources/IAM/IamRole.md), [IamUser](./docusaurus/docs/aws/resources/IAM/IamUser.md)
- S3: [S3Bucket](./docusaurus/docs/aws/resources/S3/S3Bucket.md), [S3Object](./docusaurus/docs/aws/resources/S3/S3Object.md)

## Google Cloud

Visit the [Google Cloud Requirements](./docusaurus/docs/google/GoogleRequirements.md) to prepare for the [Google Getting Started Guide](./docusaurus/docs/google/GoogleGettingStarted.md)

### Examples

- [Virtual Machine](./examples/google/vm-simple)
- [Virtual Machine with Firewall and public ip](./examples/google/vm)
- [Virtual Machine with full network](./examples/google/vm-network)

### Resources

Available Resources:

- Compute: [Address](./docusaurus/docs/google/resources/Compute/Address.md), [Firewall](./docusaurus/docs/google/resources/Compute/Firewall.md), [Network](./docusaurus/docs/google/resources/Compute/Network.md), [SubNetwork](./docusaurus/docs/google/resources/Compute/SubNetwork.md), [VmInstance](./docusaurus/docs/google/resources/Compute/VmInstance.md)
- IAM: [ServiceAccount](./docusaurus/docs/google/resources/IAM/ServiceAccount.md), [IamBinding](./docusaurus/docs/google/resources/IAM/IamBinding.md), [IamMember](./docusaurus/docs/google/resources/IAM/IamMember.md), [IamPolicy](./docusaurus/docs/google/resources/IAM/IamPolicy.md)

## Microsoft Azure

### Examples

- [Virtual Machine with network](./examples/azure/)

### Resources

Available Resources: [ResourceGroup](./docusaurus/docs/azure/resources/ResourceGroup.md), [VirtualNetwork](./docusaurus/docs/azure/resources/VirtualNetwork.md), [SecurityGroup](./docusaurus/docs/azure/resources/SecurityGroup.md), [PublicIpAddress](./docusaurus/docs/azure/resources/PublicIpAddress.md), [NetworkInterface](./docusaurus/docs/azure/resources/NetworkInterface.md), [VirtualMachine](./docusaurus/docs/azure/resources/VirtualMachine.md)

# Misc

### Console & Portal

| Provider           | Console                                           |
| ------------------ | ------------------------------------------------- |
| Google Cloud       | https://console.cloud.google.com/home/dashboard   |
| Amazon Web Service | https://console.aws.amazon.com                    |
| Microsoft Azure    | https://portal.azure.com                          |
| Scaleway           | https://console.cloud.scaleway.com/home/dashboard |
