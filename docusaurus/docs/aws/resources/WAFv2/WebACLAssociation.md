---
id: WebACLAssociation
title: Web ACLAssociation
---

Manage a [WAFv2 WebACLAssociation](https://console.aws.amazon.com/wafv2/homev2/web-acls).

## Example

### Graphql Api

Associate a Graphql Api with a WebACL:

```js
exports.createResources = () => [
  {
    type: "WebACLAssociation",
    group: "WAFv2",
    dependencies: ({}) => ({
      webAcl: "my-waf",
      graphql: "cdk-notes-appsync-api",
    }),
  },
];
```

### Rest Api Gateway

Associate a Rest Api Gateway stage with a WebACL:

```js
exports.createResources = () => [
  {
    type: "WebACLAssociation",
    group: "WAFv2",
    dependencies: ({}) => ({
      webAcl: "my-webacl",
      apiGatewayStage: "dev",
    }),
  },
];
```

### Load Balancer

Associate a load balancer with a WebACL:

```js
exports.createResources = () => [
  {
    type: "WebACLAssociation",
    group: "WAFv2",
    dependencies: ({}) => ({
      webAcl: "my-webacl",
      loadBalancer: "alb",
    }),
  },
];
```

## Code Examples

- [WebACL with REST Api Gateway](https://github.com/grucloud/grucloud/blob/main/examples/aws/WAFv2/wafv2-apigateway-rest)
- [WebACL with Graphql](https://github.com/grucloud/grucloud/blob/main/examples/aws/WAFv2/wafv2-graphql)
- [WebACL with Load Balancer](https://github.com/grucloud/grucloud/blob/main/examples/aws/WAFv2/wafv2-loadbalancer)

## Dependencies

- [WebACL](./WebACL.md)
- [ApiGateway Stage](../APIGateway/Stage.md)
- [AppSync Graphqlapi](../AppSync/GraphqlApi.md)
- [ELBv2 LoadBalancer](../ElasticLoadBalancingV2/Listener.md)

## Properties

- [AssociateWebACLCommandInput](https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/clients/client-wafv2/interfaces/associatewebaclcommandinput.html)

## List

```sh
gc l -t WAFv2::WebACLAssociation
```

```txt
Listing resources on 1 provider: aws
✓ aws us-east-1
  ✓ Initialising
  ✓ Listing 7/7
┌───────────────────────────────────────────────────────────────────────────────────────────┐
│ 1 WAFv2::WebACLAssociation from aws                                                       │
├───────────────────────────────────────────────────────────────────────────────────────────┤
│ name: webacl-assoc::arn:aws:wafv2:us-east-1:840541460064:regional/webacl/my-webacl/3d58a… │
│ managedByUs: NO                                                                           │
│ live:                                                                                     │
│   WebACLArn: arn:aws:wafv2:us-east-1:840541460064:regional/webacl/my-webacl/3d58abea-cbb… │
│   ResourceArn: arn:aws:apigateway:us-east-1::/restapis/6h9sdenxbj/stages/dev              │
│                                                                                           │
└───────────────────────────────────────────────────────────────────────────────────────────┘


List Summary:
Provider: aws
┌──────────────────────────────────────────────────────────────────────────────────────────┐
│ aws                                                                                      │
├──────────────────────────┬───────────────────────────────────────────────────────────────┤
│ WAFv2::WebACLAssociation │ webacl-assoc::arn:aws:wafv2:us-east-1:840541460064:regional/… │
└──────────────────────────┴───────────────────────────────────────────────────────────────┘
1 resource, 1 type, 1 provider
Command "gc l -t WAFv2::WebACLAssociation" executed in 6s, 122 MB
```
