---
id: Stage
title: Stage
---

Manages an [Api Gateway V2 Stage](https://console.aws.amazon.com/apigateway/main/apis).

## Sample code

```js
provider.ApiGatewayV2.makeStage({
  name: "my-api-stage-dev",
  properties: ({ config }) => ({
    AccessLogSettings: {
      Format:
        '$context.identity.sourceIp - - [$context.requestTime] "$context.httpMethod $context.routeKey $context.protocol" $context.status $context.responseLength $context.requestId',
    },
  }),
  dependencies: ({ resources }) => ({
    api: resources.ApiGatewayV2.Api.myApi,
    logGroup: resources.CloudWatchLogs.LogGroup.lgHttpTest,
  }),
});
```

## Properties

- [create properties](https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/ApiGatewayV2.html#createStage-property)

## Dependencies

- [API](./Api.md)
- [CloudWatch LogGroup](../CloudWatchLogs/CloudWatchLogGroup.md)

## Used By

- [Deployment](./ApiGatewayV2Deployment)

## Full Examples

- [Http with Lambda](https://github.com/grucloud/grucloud/tree/main/examples/aws/api-gateway-v2/http-lambda)

## List

The Stages can be filtered with the _ApiGatewayV2::Stage_ type:

```sh
gc l -t ApiGatewayV2::Stage
```

```txt
Listing resources on 1 provider: aws
✓ aws
  ✓ Initialising
  ✓ Listing 3/3
┌────────────────────────────────────────────────────────────────────────────────────┐
│ 1 ApiGatewayV2::Stage from aws                                                     │
├────────────────────────────────────────────────────────────────────────────────────┤
│ name: my-api-stage-dev                                                             │
│ managedByUs: Yes                                                                   │
│ live:                                                                              │
│   AccessLogSettings:                                                               │
│     DestinationArn: arn:aws:logs:eu-west-2:840541460064:log-group:lg-http-test     │
│     Format: $context.identity.sourceIp - - [$context.requestTime] "$context.httpM… │
│   CreatedDate: 2021-10-14T17:37:16.000Z                                            │
│   DefaultRouteSettings:                                                            │
│     DetailedMetricsEnabled: false                                                  │
│   DeploymentId: icit03                                                             │
│   LastUpdatedDate: 2021-10-14T17:37:41.000Z                                        │
│   RouteSettings:                                                                   │
│   StageName: my-api-stage-dev                                                      │
│   StageVariables:                                                                  │
│   Tags:                                                                            │
│     gc-managed-by: grucloud                                                        │
│     gc-project-name: @grucloud/example-aws-api-gateway-lambda                      │
│     gc-stage: dev                                                                  │
│     gc-created-by-provider: aws                                                    │
│     Name: my-api-stage-dev                                                         │
│   ApiId: 7a38wlw431                                                                │
│                                                                                    │
└────────────────────────────────────────────────────────────────────────────────────┘


List Summary:
Provider: aws
┌───────────────────────────────────────────────────────────────────────────────────┐
│ aws                                                                               │
├─────────────────────┬─────────────────────────────────────────────────────────────┤
│ ApiGatewayV2::Stage │ my-api-stage-dev                                            │
└─────────────────────┴─────────────────────────────────────────────────────────────┘
1 resource, 1 type, 1 provider
Command "gc l -t ApiGatewayV2::Stage" executed in 6s
```
