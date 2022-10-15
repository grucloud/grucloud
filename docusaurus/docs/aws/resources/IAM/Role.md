---
id: Role
title: Role
---

Provides an [Iam Role](https://console.aws.amazon.com/iamv2/home#/roles)

## Sampke Code

### Role with a pre-defined AWS policy

Create an Iam Role and attach an pre-defined AWS Policy

```js
exports.createResources = () => [
  {
    type: "Role",
    group: "IAM",
    name: "ecsInstanceRole",
    properties: ({}) => ({
      Path: "/",
      AssumeRolePolicyDocument: {
        Version: "2008-10-17",
        Statement: [
          {
            Sid: "",
            Effect: "Allow",
            Principal: {
              Service: "ec2.amazonaws.com",
            },
            Action: "sts:AssumeRole",
          },
        ],
      },
      AttachedPolicies: [
        {
          PolicyName: "AmazonEC2ContainerServiceforEC2Role",
          PolicyArn:
            "arn:aws:iam::aws:policy/service-role/AmazonEC2ContainerServiceforEC2Role",
        },
      ],
    }),
];
```

### Attach a user defined policy to a role

Create an Iam Role and attach an user-defined AWS Policy

```js
exports.createResources = () => [
  {
    type: "Role",
    group: "IAM",
    name: "lambda-role",
    properties: ({}) => ({
      Path: "/",
      AssumeRolePolicyDocument: {
        Version: "2012-10-17",
        Statement: [
          {
            Sid: "",
            Effect: "Allow",
            Principal: {
              Service: "lambda.amazonaws.com",
            },
            Action: "sts:AssumeRole",
          },
        ],
      },
    }),
    dependencies: () => ({
      policies: ["lambda-policy"],
    }),
  },
  {
    type: "Policy",
    group: "IAM",
    name: "lambda-policy",
    properties: ({}) => ({
      PolicyDocument: {
        Version: "2012-10-17",
        Statement: [
          {
            Action: ["logs:*"],
            Effect: "Allow",
            Resource: "*",
          },
        ],
      },
      Path: "/",
      Description: "Allow logs",
    }),
  },
];
```

### Add an inline policy to a role

```js
exports.createResources = () => [
  {
    type: "Role",
    group: "IAM",
    properties: ({}) => ({
      RoleName: "lambda-role",
      AssumeRolePolicyDocument: {
        Version: "2012-10-17",
        Statement: [
          {
            Sid: "",
            Effect: "Allow",
            Principal: {
              Service: "lambda.amazonaws.com",
            },
            Action: "sts:AssumeRole",
          },
        ],
      },
      Policies: [
        {
          PolicyDocument: {
            Version: "2012-10-17",
            Statement: [
              {
                Action: "dynamodb:*",
                Resource: [
                  "arn:aws:dynamodb:eu-west-2:1234567890:table/AppsyncCdkAppStack-CDKNotesTable254A7FD1-3MPG6DUNDCO9",
                ],
                Effect: "Allow",
              },
            ],
          },
          PolicyName: "AppSyncNotesHandlerServiceRoleDefaultPolicy12C70C4F",
        },
      ],
    }),
    dependencies: () => ({
      policies: ["lambda-policy"],
    }),
  },
];
```

### Add a role to an instance profile

```js
exports.createResources = () => [
  {
    type: "Role",
    group: "IAM",
    properties: ({}) => ({
      RoleName: "role-ecs",
      Path: "/",
      AssumeRolePolicyDocument: {
        Version: "2012-10-17",
        Statement: [
          {
            Effect: "Allow",
            Principal: {
              Service: "ec2.amazonaws.com",
            },
            Action: "sts:AssumeRole",
          },
        ],
      },
    }),
  },
  {
    type: "InstanceProfile",
    group: "IAM",
    name: "role-ecs",
    dependencies: () => ({
      roles: ["role-ecs"],
    }),
  },
];
```

### Properties

- [CreateRoleCommandInput](https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/clients/client-iam/interfaces/createrolecommandinput.html)

### Dependencies

- [IAM Policy](./Policy.md)
- [IAM OpenIDConnectProvider](./OpenIDConnectProvider.md)
- [DynamoDB Table](../DynamoDB/Table.md)
- [SQS Queue](../SQS/Queue.md)
- [SNS Topic](../SNS/Topic.md)
- [EFS FileSystem](../EFS/FileSystem.md)
- [EFS AccessPoint](../EFS/AccessPoint.md)

### Used By

- [APIGateway Account](../APIGateway/Account.md)
- [APIGateway RestApi](../APIGateway/RestApi.md)
- [ApiGatewayV2 Integration](../ApiGatewayV2/Integration.md)
- [AppConfig Configuration Profile](./ConfigurationProfile.md)
- [AutoScaling AutoScalingGroup](../AutoScaling/AutoScalingGroup.md)
- [AppRunner Service](../AppRunner/Service.md)
- [AppSync DataSource](../AppSync/DataSource.md)
- [AppSync GraphqlApi](../AppSync/GraphqlApi.md)
- [Batch ComputeEnvironment](../Batch/ComputeEnvironment.md)
- [CloudFormation Stack](../CloudFormation/Stack.md)
- [CloudTrail Trail](../CloudTrail/Trail.md)
- [CloudWatchEvents Target](../CloudWatchEvents/Target.md)
- [CloudWatchLogs SubscriptionFilter](../CloudWatchLogs/SubscriptionFilter.md)
- [CodeBuild Project](../CodeBuild/Project.md)
- [CodeDeploy Application](../CodeDeploy/Application.md)
- [CodePipeline Pipeline](../CodePipeline/Pipeline.md)
- [EC2 Flow Logs ](../EC2/FlowLogs.md)
- [EC2 Vpc Endpoint](../EC2/VpcEndpoint.md)
- [ECS TaskDefinition](../ECS/TaskDefinition.md)
- [EKS Cluster](../EKS/Cluster.md)
- [EKS NodeGroup](../EKS/NodeGroup.md)
- [Firehose DeliveryStream](../Firehose/DeliveryStream.md)
- [IAM Instance Profile](./InstanceProfile.md)
- [Lambda Function](../Lambda/Function.md)
- [Glue Job](../Glue/Job.md)
- [RDS DBInstance](../RDS/DBInstance.md)
- [RDS DBCluster](../RDS/DBCluster.md)
- [RDS DBProxy](../RDS/DBProxy.md)
- [SSM Document](../SSM/Document.md)
- [StepFunctions StateMachine](../StepFunctions/StateMachine.md)

### Examples

- [APIGateway restapi-lambda](https://github.com/grucloud/grucloud/blob/main/examples/aws/APIGateway/restapi-lambda)
- [ApiGatewayV2 http-lambda](https://github.com/grucloud/grucloud/blob/main/examples/aws/ApiGatewayV2/http-lambda)
- [apigw-http-api-eventbridge](https://github.com/grucloud/grucloud/tree/main/examples/aws/serverless-patterns/apigw-http-api-eventbridge)
- [AppRunner apprunner-simple](https://github.com/grucloud/grucloud/blob/main/examples/aws/AppRunner/apprunner-simple)
- [aws-cdk-examples/application-load-balancer-fargate-service]((https://github.com/grucloud/grucloud/tree/main/examples/aws/aws-cdk-examples/application-load-balancer-fargate-service)
- [AppSync graphql](https://github.com/grucloud/grucloud/blob/main/examples/aws/AppSync/graphql)
- [serverless-patterns appsync-eventbridge](https://github.com/grucloud/grucloud/tree/main/examples/aws/serverless-patterns/appsync-eventbridge)
- [CodeBuild codebuild-simple](https://github.com/grucloud/grucloud/tree/main/examples/aws/CodeBuild/codebuild-simple)
- [Codedeploy codedeploy-ecs](https://github.com/grucloud/grucloud/tree/main/examples/aws/CodeDeploy/codedeploy-ecs)
- [CodePipeline code-pipeline-ecr](https://github.com/grucloud/grucloud/tree/main/examples/aws/CodePipeline/code-pipeline-ecr)
- [EC2 flow logs on vpc](https://github.com/grucloud/grucloud/blob/main/examples/aws/EC2/flow-logs/flow-logs-vpc)
- [EKS simple](https://github.com/grucloud/grucloud/tree/main/examples/aws/EKS/eks-simple)
- [Step function invoking a Glue job](https://github.com/grucloud/grucloud/tree/main/examples/aws/Firehose/firehose-delivery-stream)
- [IAM simple example](https://github.com/grucloud/grucloud/blob/main/examples/aws/IAM/iam)
- [RDS aurora-v2](https://github.com/grucloud/grucloud/blob/main/examples/aws/RDS/aurora-v2)
- [apigw-http-api-lambda-rds-proxy](https://github.com/grucloud/grucloud/tree/main/examples/aws/serverless-patterns/apigw-http-api-lambda-rds-proxy)
- [StepFunctions send item to dynamoDB](https://github.com/grucloud/grucloud/tree/main/examples/aws/serverless-patterns/sfn-dynamodb)

### List

```sh
gc list -t IAM::Role
```

```sh
Listing resources on 1 provider: aws
✓ aws
  ✓ Initialising
  ✓ Listing 1/1
┌────────────────────────────────────────────────────────────────────────────────────────┐
│ 3 iam::Role from aws                                                                   │
├────────────────────────────────────────────────────────────────────────────────────────┤
│ name: role-cluster                                                                     │
│ managedByUs: Yes                                                                       │
│ live:                                                                                  │
│   Path: /                                                                              │
│   RoleName: role-cluster                                                               │
│   RoleId: AROA4HNBM2ZQBIII7KZ4Z                                                        │
│   Arn: arn:aws:iam::840541460064:role/role-cluster                                     │
│   CreateDate: 2021-07-21T13:29:11.000Z                                                 │
│   AssumeRolePolicyDocument:                                                            │
│     Version: 2012-10-17                                                                │
│     Statement:                                                                         │
│       - Effect: Allow                                                                  │
│         Principal:                                                                     │
│           Service: eks.amazonaws.com                                                   │
│         Action: sts:AssumeRole                                                         │
│   MaxSessionDuration: 3600                                                             │
│   Tags:                                                                                │
│     - Key: Name                                                                        │
│       Value: role-cluster                                                              │
│     - Key: gc-managed-by                                                               │
│       Value: grucloud                                                                  │
│     - Key: gc-created-by-provider                                                      │
│       Value: aws                                                                       │
│     - Key: gc-stage                                                                    │
│       Value: dev                                                                       │
│     - Key: gc-project-name                                                             │
│       Value: @grucloud/example-module-aws-load-balancer-controller                     │
│     - Key: gc-namespace                                                                │
│       Value: EKS                                                                       │
│   InstanceProfiles: []                                                                 │
│   AttachedPolicies:                                                                    │
│     - PolicyName: AmazonEKSClusterPolicy                                               │
│       PolicyArn: arn:aws:iam::aws:policy/AmazonEKSClusterPolicy                        │
│     - PolicyName: AmazonEKSVPCResourceController                                       │
│       PolicyArn: arn:aws:iam::aws:policy/AmazonEKSVPCResourceController                │
│   Policies: []                                                                         │
│                                                                                        │
├────────────────────────────────────────────────────────────────────────────────────────┤
│ name: role-load-balancer                                                               │
│ managedByUs: Yes                                                                       │
│ live:                                                                                  │
│   Path: /                                                                              │
│   RoleName: role-load-balancer                                                         │
│   RoleId: AROA4HNBM2ZQH2RLTJRCD                                                        │
│   Arn: arn:aws:iam::840541460064:role/role-load-balancer                               │
│   CreateDate: 2021-07-21T13:39:48.000Z                                                 │
│   AssumeRolePolicyDocument:                                                            │
│     Version: 2012-10-17                                                                │
│     Statement:                                                                         │
│       - Effect: Allow                                                                  │
│         Principal:                                                                     │
│           Federated: arn:aws:iam::840541460064:oidc-provider/oidc.eks.eu-west-2.amazo… │
│         Action: sts:AssumeRoleWithWebIdentity                                          │
│         Condition:                                                                     │
│           StringEquals:                                                                │
│             oidc.eks.eu-west-2.amazonaws.com/id/9377E3CCC52850A5BC4BEF6D012643E6:aud:… │
│   MaxSessionDuration: 3600                                                             │
│   Tags:                                                                                │
│     - Key: Name                                                                        │
│       Value: role-load-balancer                                                        │
│     - Key: gc-managed-by                                                               │
│       Value: grucloud                                                                  │
│     - Key: gc-created-by-provider                                                      │
│       Value: aws                                                                       │
│     - Key: gc-stage                                                                    │
│       Value: dev                                                                       │
│     - Key: gc-project-name                                                             │
│       Value: @grucloud/example-module-aws-load-balancer-controller                     │
│     - Key: gc-namespace                                                                │
│       Value: LoadBalancerControllerRole                                                │
│   AttachedPolicies:                                                                    │
│     - PolicyName: AWSLoadBalancerControllerIAMPolicy                                   │
│       PolicyArn: arn:aws:iam::840541460064:policy/AWSLoadBalancerControllerIAMPolicy   │
│   InstanceProfiles: []                                                                 │
│   Policies: []                                                                         │
│                                                                                        │
├────────────────────────────────────────────────────────────────────────────────────────┤
│ name: role-node-group                                                                  │
│ managedByUs: Yes                                                                       │
│ live:                                                                                  │
│   Path: /                                                                              │
│   RoleName: role-node-group                                                            │
│   RoleId: AROA4HNBM2ZQAQEEDNKMM                                                        │
│   Arn: arn:aws:iam::840541460064:role/role-node-group                                  │
│   CreateDate: 2021-07-21T13:29:11.000Z                                                 │
│   AssumeRolePolicyDocument:                                                            │
│     Version: 2012-10-17                                                                │
│     Statement:                                                                         │
│       - Effect: Allow                                                                  │
│         Principal:                                                                     │
│           Service: ec2.amazonaws.com                                                   │
│         Action: sts:AssumeRole                                                         │
│   MaxSessionDuration: 3600                                                             │
│   Tags:                                                                                │
│     - Key: Name                                                                        │
│       Value: role-node-group                                                           │
│     - Key: gc-managed-by                                                               │
│       Value: grucloud                                                                  │
│     - Key: gc-created-by-provider                                                      │
│       Value: aws                                                                       │
│     - Key: gc-stage                                                                    │
│       Value: dev                                                                       │
│     - Key: gc-project-name                                                             │
│       Value: @grucloud/example-module-aws-load-balancer-controller                     │
│     - Key: gc-namespace                                                                │
│       Value: EKS                                                                       │
│   AttachedPolicies:                                                                    │
│     - PolicyName: AmazonEKSWorkerNodePolicy                                            │
│       PolicyArn: arn:aws:iam::aws:policy/AmazonEKSWorkerNodePolicy                     │
│     - PolicyName: AmazonEC2ContainerRegistryReadOnly                                   │
│       PolicyArn: arn:aws:iam::aws:policy/AmazonEC2ContainerRegistryReadOnly            │
│     - PolicyName: AmazonEKS_CNI_Policy                                                 │
│       PolicyArn: arn:aws:iam::aws:policy/AmazonEKS_CNI_Policy                          │
│   Policies: []                                                                         │
│   InstanceProfiles:                                                                    │
│     - InstanceProfileName: eks-b6bd64a5-a3dc-30a8-b4a5-f6a7fd37e90d                    │
│       InstanceProfileId: AIPA4HNBM2ZQACXAPZ3H7                                         │
│       Arn: arn:aws:iam::840541460064:instance-profile/eks-b6bd64a5-a3dc-30a8-b4a5-f6a… │
│       Path: /                                                                          │
│                                                                                        │
└────────────────────────────────────────────────────────────────────────────────────────┘


List Summary:
Provider: aws
┌───────────────────────────────────────────────────────────────────────────────────┐
│ aws                                                                               │
├────────────────────────────────┬──────────────────────────────────────────────────┤
│ iam::Role                      │ role-cluster                                     │
│                                │ role-load-balancer                               │
│                                │ role-node-group                                  │
└────────────────────────────────┴──────────────────────────────────────────────────┘
3 resources, 2 types, 1 provider
Command "gc l -t Role" executed in 5s
```
