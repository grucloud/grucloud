---
id: WebACLCloudFront
title: WebACL CloudFront
---

Manage a [WAFv2 WebACL](https://console.aws.amazon.com/wafv2/homev2/web-acls) for CloudFront.

## Example

Create a WebACL:

```js
exports.createResources = () => [
  {
    type: "WebACLCloudFront",
    group: "WAFv2",
    properties: ({}) => ({
      Capacity: 0,
      DefaultAction: {
        Allow: {},
      },
      ManagedByFirewallManager: false,
      Name: "webacl-cloudfront",
      Rules: [],
      VisibilityConfig: {
        CloudWatchMetricsEnabled: true,
        MetricName: "webacl-cloudfront",
        SampledRequestsEnabled: true,
      },
      Scope: "CLOUDFRONT",
    }),
  },
];
```

## Code Examples

- [WebACL with CloudFront](https://github.com/grucloud/grucloud/blob/main/examples/aws/WAFv2/wafv2-cloudfront)

## Used By

- [CloudFront Distribution](../CloudFront/Distribution.md)

## Properties

- [CreateWebACLCommandInput](https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/clients/client-wafv2/interfaces/createwebaclcommandinput.html)

## List

```sh
gc l -t WAFv2::WebACLCloudFront
```

```txt
Listing resources on 1 provider: aws
✓ aws us-east-1
  ✓ Initialising
  ✓ Listing 1/1
┌───────────────────────────────────────────────────────────────────────────┐
│ 1 WAFv2::WebACLCloudFront from aws                                        │
├───────────────────────────────────────────────────────────────────────────┤
│ name: webacl-cloudfront                                                   │
│ managedByUs: Yes                                                          │
│ live:                                                                     │
│   ARN: arn:aws:wafv2:us-east-1:840541460064:global/webacl/webacl-cloudfr… │
│   Capacity: 0                                                             │
│   DefaultAction:                                                          │
│     Allow:                                                                │
│   Description:                                                            │
│   Id: cdb1455e-bcea-4787-9cf9-a982c6f2c08b                                │
│   LabelNamespace: awswaf:840541460064:webacl:webacl-cloudfront:           │
│   ManagedByFirewallManager: false                                         │
│   Name: webacl-cloudfront                                                 │
│   Rules: []                                                               │
│   VisibilityConfig:                                                       │
│     CloudWatchMetricsEnabled: true                                        │
│     MetricName: webacl-cloudfront                                         │
│     SampledRequestsEnabled: true                                          │
│   Tags:                                                                   │
│     - Key: gc-created-by-provider                                         │
│       Value: aws                                                          │
│     - Key: gc-managed-by                                                  │
│       Value: grucloud                                                     │
│     - Key: gc-project-name                                                │
│       Value: wafv2-cloudfront                                             │
│     - Key: gc-stage                                                       │
│       Value: dev                                                          │
│     - Key: Name                                                           │
│       Value: webacl-cloudfront                                            │
│   Scope: CLOUDFRONT                                                       │
│   LockToken: a6055400-250f-4b6d-991e-309ee5e44714                         │
│                                                                           │
└───────────────────────────────────────────────────────────────────────────┘


List Summary:
Provider: aws
┌──────────────────────────────────────────────────────────────────────────┐
│ aws                                                                      │
├─────────────────────────┬────────────────────────────────────────────────┤
│ WAFv2::WebACLCloudFront │ webacl-cloudfront                              │
└─────────────────────────┴────────────────────────────────────────────────┘
1 resource, 1 type, 1 provider
Command "gc l -t WAFv2::WebACLCloudFront" executed in 5s, 106 MB
```
