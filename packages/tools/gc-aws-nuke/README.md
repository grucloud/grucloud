# GruCloud AWS Nuke

`gc-aws-nuke` is a command line tool to destroy over 800 AWS resources across various regions.

## Requirements

Ensure the following are installed and configured properly:

- [Node.js](https://nodejs.org)
- [AWS CLI](https://docs.aws.amazon.com/cli/latest/userguide/getting-started-install.html)
- [AWS Secret and Access Key](https://console.aws.amazon.com/iam/home#/security_credentials)

## Installation

Install the CLI `gc-aws-nuke` globally:

```sh
npm i -g @grucloud/aws-nuke
```

## Usage

### Default Usage

Run the following command in a terminal:

```sh
gc-aws-nuke
```

This command attempts to delete the most common AWS resources, around 400. To delete all the resources, around 800, use the `-a` option,

```sh
gc-aws-nuke -a
```

### Specify regions

Specify one region:

```sh
gc-aws-nuke --regions us-east-1
```

Specify multiple regions:

```sh
gc-aws-nuke --regions us-east-1 us-west-1
```

### Specify an AWS profile

One can specify an AWS profile to use:

```sh
gc-aws-nuke --profile my-profile
```

### List the group of services

The `groups` command list the group of the most common services

```sh
gc-aws-nuke groups
```

To list all supported group of resources, use the `--all` option

```txt
gc-aws-nuke groups --all
```

```txt
AccessAnalyzer
Account
ACM
ACMPCA
Amplify
APIGateway
ApiGatewayV2
AppConfig
Appflow
AppIntegrations
ApplicationAutoScaling
ApplicationInsights
AppMesh
AppRunner
AppStream
AppSync
Aps
Athena
AuditManager
AutoScaling
AutoScalingPlans
Backup
Batch
Budgets
Cloud9
CloudFormation
CloudFront
CloudHSMV2
CloudTrail
CloudWatch
CloudWatchEvents
CloudWatchLogs
CodeArtifact
CodeBuild
CodeCommit
CodeDeploy
CodeGuruReviewer
CodePipeline
CodeStar
CodeStarConnections
CodeStarNotifications
Cognito
CognitoIdentityServiceProvider
Comprehend
Config
ControlTower
CostExplorer
CUR
DataSync
DAX
Detective
DirectConnect
DirectoryService
DMS
DocDB
DocDBElastic
DynamoDB
EC2
ECR
ECS
EFS
EKS
ElastiCache
ElasticBeanstalk
ElasticLoadBalancingV2
EMR
EMRContainers
EMRServerless
EventBridge
Evidently
Firehose
Fis
FMS
FSx
Glacier
GlobalAccelerator
Glue
Grafana
GuardDuty
IAM
IdentityStore
Imagebuilder
Inspector2
InternetMonitor
IoT
IVS
Ivschat
Kendra
Keyspaces
Kinesis
KinesisAnalyticsV2
KinesisVideo
KMS
LakeFormation
Lambda
LexModelsV2
LicenseManager
Lightsail
Location
Macie2
MediaConnect
MediaConvert
MediaLive
MediaPackage
MediaStore
MediaTailor
MemoryDB
MQ
MSK
MWAA
NetworkFirewall
NetworkManager
OAM
OpenSearch
OpenSearchServerless
Organisations
OSIS
Pinpoint
Pipes
QLDB
QuickSight
RAM
Rbin
RDS
Redshift
RedshiftServerless
Rekognition
ResilienceHub
ResourceExplorer2
ResourceGroups
RolesAnywhere
Route53
Route53Domains
Route53RecoveryControlConfig
Route53RecoveryReadiness
Route53Resolver
RUM
S3
S3Control
SageMaker
Scheduler
EventSchemas
SecretsManager
SecurityHub
ServiceCatalog
ServiceDiscovery
ServiceQuotas
SESV2
Shield
Signer
SNS
SQS
SSM
SSMContacts
SSMIncidents
SSOAdmin
StepFunctions
StorageGateway
Synthetics
TimestreamWrite
Transfer
VpcLattice
WAFv2
WorkSpaces
WorkSpacesWeb
XRay
```

### Help

```sh
gc-aws-nuke --help
```

```txt
Options:
  -V, --version                output the version number
  -p, --profile <string>       the AWS profile (default: "default")
  -r, --regions <string...>    regions, for instance us-east-1
  -a, --includeAllResources    Destroy all known services
  --includeGroups <string...>  include only the group of services, for instance EC2, RDS, ECS, SSM
  -h, --help                   display help for command

Commands:
  groups|g [options]           List the group of services
  nuke                         Destroy the resources
  help [command]               display help for command
```
