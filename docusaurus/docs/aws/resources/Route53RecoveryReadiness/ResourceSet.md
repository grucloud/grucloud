---
id: ResourceSet
title: Resource Set
---

Provides [Route53 Recovery Readiness Resource Set](https://us-west-2.console.aws.amazon.com/route53recovery/home#/readiness/resource-sets)

## Examples

```js
exports.createResources = () => [
  {
    type: "ResourceSet",
    group: "Route53RecoveryReadiness",
    properties: ({ getId }) => ({
      ResourceSetName: "dynamodb",
      ResourceSetType: "AWS::DynamoDB::Table",
      Resources: [
        {
          ReadinessScopes: [
            `${getId({
              type: "Cell",
              group: "Route53RecoveryReadiness",
              name: "my-recoverygroup-cell1",
            })}`,
          ],
          ResourceArn: `${getId({
            type: "Table",
            group: "DynamoDB",
            name: "my-table",
          })}`,
        },
      ],
    }),
    dependencies: ({}) => ({
      cells: ["my-recoverygroup-cell1"],
      dynamoDBTable: "my-table",
    }),
  },
];
```

## Source Code Examples

- [simple example](https://github.com/grucloud/grucloud/blob/main/examples/aws/Route53RecoveryReadiness/route53-recovery-readiness)

## Properties

- [CreateResourceSetCommandInput](https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/clients/client-route53-recovery-readiness/interfaces/createresourcesetcommandinput.html)

## Dependencies

- [APIGateway Stage](../APIGateway/Stage.md)
- [ApiGatewayV2 Stage](../ApiGatewayV2/Stage.md)
- [AutoScalingGroup](../AutoScaling/AutoScalingGroup.md)
- [CloudWatch MetricAlarm](../CloudWatch/MetricAlarm.md)
- [DynamoDB Table](../DynamoDB/Table.md)
- [EC2 CustomerGateway](../EC2/CustomerGateway.md)
- [EC2 Volume](../EC2/Volume.md)
- [EC2 Vpc](../EC2/Vpc.md)
- [EC2 VpnConnection](../EC2/VpnConnection.md)
- [EC2 VpnGateway](../EC2/VpnGateway.md)
- [ElasticLoadBalancingV2 LoadBalancer](../ElasticLoadBalancingV2/LoadBalancer.md)
- [Lambda Function](../Lambda/Function.md)
- [RDS DBCluster](../RDS/DBCluster.md)
- [Route53 HealthCheck](../Route53/HealthCheck.md)
- [SQS Queue](../SQS/Queue.md)
- [SNS Topic](../SNS/Topic.md)
- [SNS Subscription](../SNS/Subscription.md)

## Used By

- [ReadinessCheck](./ReadinessCheck.md)

## List

List the endpoints with the **Route53RecoveryReadiness::ResourceSet** filter:

```sh
gc list -t Route53RecoveryReadiness::ResourceSet
```

```txt
Listing resources on 1 provider: aws
✓ aws us-east-1
  ✓ Initialising
  ✓ Listing 1/1
┌─────────────────────────────────────────────────────────────────────────────────┐
│ 1 Route53RecoveryReadiness::ResourceSet from aws                                │
├─────────────────────────────────────────────────────────────────────────────────┤
│ name: dynamodb                                                                  │
│ managedByUs: Yes                                                                │
│ live:                                                                           │
│   ResourceSetArn: arn:aws:route53-recovery-readiness::840541460064:resource-se… │
│   ResourceSetName: dynamodb                                                     │
│   ResourceSetType: AWS::DynamoDB::Table                                         │
│   Resources:                                                                    │
│     -                                                                           │
│       ReadinessScopes:                                                          │
│         - "arn:aws:route53-recovery-readiness::840541460064:cell/my-recoverygr… │
│       ResourceArn: arn:aws:dynamodb:us-east-1:840541460064:table/my-table       │
│   Tags:                                                                         │
│                                                                                 │
└─────────────────────────────────────────────────────────────────────────────────┘


List Summary:
Provider: aws
┌────────────────────────────────────────────────────────────────────────────────┐
│ aws                                                                            │
├───────────────────────────────────────┬────────────────────────────────────────┤
│ Route53RecoveryReadiness::ResourceSet │ dynamodb                               │
└───────────────────────────────────────┴────────────────────────────────────────┘
1 resource, 1 type, 1 provider
Command "gc list -t Route53RecoveryReadiness::ResourceSet" executed in 5s, 111 MB
```
