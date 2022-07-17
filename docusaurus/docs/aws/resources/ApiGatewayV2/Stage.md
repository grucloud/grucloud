---
id: Stage
title: Stage
---

Manages an [Api Gateway V2 Stage](https://console.aws.amazon.com/apigateway/main/apis).

## Sample code

```js
exports.createResources = () => [
  {
    type: "Stage",
    group: "ApiGatewayV2",
    properties: ({}) => ({
      AccessLogSettings: {
        Format:
          '$context.identity.sourceIp - - [$context.requestTime] "$context.httpMethod $context.routeKey $context.protocol" $context.status $context.responseLength $context.requestId',
      },
      StageName: "my-api-stage-dev",
    }),
    dependencies: () => ({
      api: "my-api",
      logGroup: "lg-http-test",
    }),
  },
  { type: "LogGroup", group: "CloudWatchLogs", name: "lg-http-test" },
];
```

## Properties

- [CreateStageCommandInput](https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/clients/client-apigatewayv2/interfaces/createstagecommandinput.html)

## Dependencies

- [API](./Api.md)
- [CloudWatch LogGroup](../CloudWatchLogs/LogGroup.md)

## Used By

- [Deployment](./Deployment.md)

## Full Examples

- [Http with Lambda](https://github.com/grucloud/grucloud/tree/main/examples/aws/ApiGatewayV2/http-lambda)
- [apigw-fargate-cdk](https://github.com/grucloud/grucloud/tree/main/examples/aws/serverless-patterns/apigw-fargate-cdk)
- [apigw-http-api-eventbridge](https://github.com/grucloud/grucloud/tree/main/examples/aws/serverless-patterns/apigw-http-api-eventbridge)
- [apigw-vpclink-pvt-alb](https://github.com/grucloud/grucloud/tree/main/examples/aws/serverless-patterns/apigw-vpclink-pvt-alb)
- [apigw-vpclink-pvt-alb](https://github.com/grucloud/grucloud/tree/main/examples/aws/serverless-patterns/apigw-websocket-api-lambda)
- [cognito-httpapi](https://github.com/grucloud/grucloud/tree/main/examples/aws/serverless-patterns/cognito-httpapi)

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
