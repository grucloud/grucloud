---
id: VpcLink
title: Vpc Link
---

Manages an [Api Gateway Vpc Link](https://console.aws.amazon.com/apigateway/main/vpc-links/list).

## Sample code

```js
exports.createResources = () => [
  {
    type: "VpcLink",
    group: "ApiGatewayV2",
    properties: () => ({
      Name: "APIGWVpcLinkToPrivateHTTPEndpoint",
    }),
    dependencies: () => ({
      subnets: [
        "vpclink-ex-subnet-private1-us-east-1a",
        "vpclink-ex-subnet-private2-us-east-1b",
      ],
    }),
  },
];
```

## Properties

- [CreateVpcLinkRequest](https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/clients/client-apigatewayv2/modules/createvpclinkrequest.html)

## Dependencies

- [Subnet](../EC2/Subnet.md)
- [Security Group](../EC2/SecurityGroup.md)

## Full Examples

- [serverless-patterns apigw-fargate-cdk](https://github.com/grucloud/grucloud/tree/main/examples/aws/serverless-patterns/apigw-fargate-cdk)

- [serverless-patterns apigw-vpclink-pvt-alb](https://github.com/grucloud/grucloud/tree/main/examples/aws/serverless-patterns/apigw-vpclink-pvt-alb)

## List

The voc links can be filtered with the _ApiGatewayV2::VpcLink_ type:

```sh
gc l -t ApiGatewayV2::VpcLink
```

```txt
Listing resources on 1 provider: aws
✓ aws
  ✓ Initialising
  ✓ Listing 1/1
┌──────────────────────────────────────────────────────────────────────┐
│ 1 ApiGatewayV2::VpcLink from aws                                     │
├──────────────────────────────────────────────────────────────────────┤
│ name: APIGWVpcLinkToPrivateHTTPEndpoint                              │
│ managedByUs: Yes                                                     │
│ live:                                                                │
│   CreatedDate: 2022-04-05T22:13:41.000Z                              │
│   Name: APIGWVpcLinkToPrivateHTTPEndpoint                            │
│   SecurityGroupIds: []                                               │
│   SubnetIds:                                                         │
│     - "subnet-0ac827558cf456898"                                     │
│     - "subnet-02f1c00b0494f7c24"                                     │
│   Tags:                                                              │
│   VpcLinkId: 6pbmwg                                                  │
│   VpcLinkStatus: AVAILABLE                                           │
│   VpcLinkStatusMessage: VPC link is ready to route traffic           │
│   VpcLinkVersion: V2                                                 │
│                                                                      │
└──────────────────────────────────────────────────────────────────────┘


List Summary:
Provider: aws
┌─────────────────────────────────────────────────────────────────────┐
│ aws                                                                 │
├───────────────────────┬─────────────────────────────────────────────┤
│ ApiGatewayV2::VpcLink │ APIGWVpcLinkToPrivateHTTPEndpoint           │
└───────────────────────┴─────────────────────────────────────────────┘
1 resource, 1 type, 1 provider
Command "gc l -t VpcLink" executed in 5s, 184 MB
```
