---
id: WebACL
title: WebACL
---

Manage a [WAFv2 WebACL](https://console.aws.amazon.com/wafv2/homev2/web-acls).

## Example

Create a WebACL:

```js
exports.createResources = () => [
  {
    type: "WebACL",
    group: "WAFv2",
    properties: ({}) => ({
      Capacity: 1,
      DefaultAction: {
        Allow: {},
      },
      ManagedByFirewallManager: false,
      Name: "my-waf",
      Rules: [
        {
          Action: {
            Block: {},
          },
          Name: "russia",
          Priority: 0,
          Statement: {
            GeoMatchStatement: {
              CountryCodes: ["RU"],
            },
          },
          VisibilityConfig: {
            CloudWatchMetricsEnabled: true,
            MetricName: "russia",
            SampledRequestsEnabled: true,
          },
        },
      ],
      VisibilityConfig: {
        CloudWatchMetricsEnabled: true,
        MetricName: "my-waf",
        SampledRequestsEnabled: true,
      },
      Scope: "REGIONAL",
    }),
  },
];
```

## Code Examples

- [WebACL with REST Api Gateway](https://github.com/grucloud/grucloud/blob/main/examples/aws/WAFv2/wafv2-apigateway-rest)
- [WebACL with Graphql](https://github.com/grucloud/grucloud/blob/main/examples/aws/WAFv2/wafv2-graphql)
- [WebACL with Load Balancer](https://github.com/grucloud/grucloud/blob/main/examples/aws/WAFv2/wafv2-loadbalancer)
- [WebACL with CloudFront](https://github.com/grucloud/grucloud/blob/main/examples/aws/WAFv2/wafv2-cloudfront)

## Used By

- [WebACLAssociation](./WebACLAssociation.md)

## Properties

- [CreateWebACLCommandInput](https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/clients/client-wafv2/interfaces/createwebaclcommandinput.html)

## List

```sh
gc l -t WAFv2::WebACL
```

```txt
Listing resources on 1 provider: aws
✓ aws us-east-1
  ✓ Initialising
  ✓ Listing 1/1
┌───────────────────────────────────────────────────────────────────────────────────────────┐
│ 1 WAFv2::WebACL from aws                                                                  │
├───────────────────────────────────────────────────────────────────────────────────────────┤
│ name: my-webacl                                                                           │
│ managedByUs: Yes                                                                          │
│ live:                                                                                     │
│   ARN: arn:aws:wafv2:us-east-1:840541460064:regional/webacl/my-webacl/3d58abea-cbb3-47b6… │
│   Capacity: 1                                                                             │
│   DefaultAction:                                                                          │
│     Allow:                                                                                │
│   Description:                                                                            │
│   Id: 3d58abea-cbb3-47b6-8619-b413c133561f                                                │
│   LabelNamespace: awswaf:840541460064:webacl:my-webacl:                                   │
│   ManagedByFirewallManager: false                                                         │
│   Name: my-webacl                                                                         │
│   Rules:                                                                                  │
│     - Action:                                                                             │
│         Block:                                                                            │
│       Name: russia                                                                        │
│       Priority: 0                                                                         │
│       Statement:                                                                          │
│         GeoMatchStatement:                                                                │
│           CountryCodes:                                                                   │
│             - "RU"                                                                        │
│       VisibilityConfig:                                                                   │
│         CloudWatchMetricsEnabled: true                                                    │
│         MetricName: russia                                                                │
│         SampledRequestsEnabled: true                                                      │
│   VisibilityConfig:                                                                       │
│     CloudWatchMetricsEnabled: true                                                        │
│     MetricName: my-webacl                                                                 │
│     SampledRequestsEnabled: true                                                          │
│   Tags:                                                                                   │
│     - Key: gc-created-by-provider                                                         │
│       Value: aws                                                                          │
│     - Key: gc-managed-by                                                                  │
│       Value: grucloud                                                                     │
│     - Key: gc-project-name                                                                │
│       Value: wafv2-apigateway-rest                                                        │
│     - Key: gc-stage                                                                       │
│       Value: dev                                                                          │
│     - Key: Name                                                                           │
│       Value: my-webacl                                                                    │
│   Scope: REGIONAL                                                                         │
│   LockToken: 946d0498-82aa-459c-b6a4-7ea528c7273b                                         │
│                                                                                           │
└───────────────────────────────────────────────────────────────────────────────────────────┘


List Summary:
Provider: aws
┌──────────────────────────────────────────────────────────────────────────────────────────┐
│ aws                                                                                      │
├───────────────┬──────────────────────────────────────────────────────────────────────────┤
│ WAFv2::WebACL │ my-webacl                                                                │
└───────────────┴──────────────────────────────────────────────────────────────────────────┘
1 resource, 1 type, 1 provider
Command "gc l -t WAFv2::WebACL" executed in 5s, 111 MB
```
