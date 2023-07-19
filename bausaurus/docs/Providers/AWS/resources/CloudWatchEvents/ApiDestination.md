---
id: ApiDestination
title: Api Destination
---

Manages an Event Bridge [Api Destination](https://console.aws.amazon.com/events/home?#/eventbuses).

## Sample code

```js
exports.createResources = () => [
  {
    type: "ApiDestination",
    group: "CloudWatchEvents",
    properties: ({}) => ({
      HttpMethod: "POST",
      InvocationEndpoint: "https://grucloud.com",
      InvocationRateLimitPerSecond: 300,
      Name: "my-api",
    }),
    dependencies: () => ({
      connection: "MyConnection-dvMVGg2stExz",
    }),
  },
];
```

## Properties

- [CreateApiDestinationCommandInput](https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/clients/client-cloudwatch-events/interfaces/createapidestinationcommandinput.html)

## Dependencies

- [CloudWatchEvents Connection](./Connection.md)

## Used By

- [CloudWatchEvents Target](./Target.md)

## Full Examples

- [eventbridge-api-destinations webhook-site](https://github.com/grucloud/grucloud/tree/main/examples/aws/serverless-patterns/eventbridge-api-destinations/1-webhook-site)

## List

The event buses can be filtered with the `CloudWatchEvents::ApiDestination` type:

```sh
gc l -t CloudWatchEvents::ApiDestination
```

```txt
Listing resources on 1 provider: aws
✓ aws us-east-1
  ✓ Initialising
  ✓ Listing 2/2
┌──────────────────────────────────────────────────────────────────────────────────────────┐
│ 1 CloudWatchEvents::ApiDestination from aws                                              │
├──────────────────────────────────────────────────────────────────────────────────────────┤
│ name: my-api                                                                             │
│ managedByUs: Yes                                                                         │
│ live:                                                                                    │
│   ApiDestinationArn: arn:aws:events:us-east-1:840541460064:api-destination/my-api/3c373… │
│   ApiDestinationState: ACTIVE                                                            │
│   ConnectionArn: arn:aws:events:us-east-1:840541460064:connection/MyConnection-dvMVGg2s… │
│   CreationTime: 2022-08-05T11:37:11.000Z                                                 │
│   HttpMethod: POST                                                                       │
│   InvocationEndpoint: https://grucloud.com                                               │
│   InvocationRateLimitPerSecond: 300                                                      │
│   LastModifiedTime: 2022-08-05T11:37:11.000Z                                             │
│   Name: my-api                                                                           │
│                                                                                          │
└──────────────────────────────────────────────────────────────────────────────────────────┘


List Summary:
Provider: aws
┌─────────────────────────────────────────────────────────────────────────────────────────┐
│ aws                                                                                     │
├──────────────────────────────────┬──────────────────────────────────────────────────────┤
│ CloudWatchEvents::ApiDestination │ my-api                                               │
└──────────────────────────────────┴──────────────────────────────────────────────────────┘
1 resource, 1 type, 1 provider
Command "gc l -t CloudWatchEvents::ApiDestination" executed in 7s, 102 MB
```
