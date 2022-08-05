---
id: Connection
title: Connection
---

Manages an Event Bridge [Connection](https://console.aws.amazon.com/events/home?#/eventbuses).

## Sample code

```js
exports.createResources = () => [
  {
    type: "Connection",
    group: "CloudWatchEvents",
    properties: ({}) => ({
      AuthParameters: {
        ApiKeyAuthParameters: {
          ApiKeyName: "MyWebhook",
          ApiKeyValue: process.env.MY_CONNECTION_DV_MV_GG2ST_EXZ_API_KEY_VALUE,
        },
      },
      AuthorizationType: "API_KEY",
      Description: "My connection with an API key",
      Name: "MyConnection-dvMVGg2stExz",
    }),
  },
];
```

## Properties

- [CreateConnectionCommandInput](https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/clients/client-cloudwatch-events/interfaces/createconnectioncommandinput.html)

## Dependencies

- [SecretsManager Secret](../SecretsManager/Secret.md)

## Used By

- [ApiDestination](./ApiDestination.md)

## Full Examples

- [eventbridge-api-destinations webhook-site](https://github.com/grucloud/grucloud/tree/main/examples/aws/serverless-patterns/eventbridge-api-destinations/1-webhook-site)
- [eventbridge-api-destinations zendesk](https://github.com/grucloud/grucloud/tree/main/examples/aws/serverless-patterns/eventbridge-api-destinations/5-zendesk)

## List

The connections can be filtered with the _CloudWatchEvents::Connection_ type:

```sh
gc l -t CloudWatchEvents::Connection
```

```txt
Listing resources on 1 provider: aws
✓ aws us-east-1
  ✓ Initialising
  ✓ Listing 1/1
┌──────────────────────────────────────────────────────────────────────────────────────────┐
│ 1 CloudWatchEvents::Connection from aws                                                  │
├──────────────────────────────────────────────────────────────────────────────────────────┤
│ name: MyConnection-dvMVGg2stExz                                                          │
│ managedByUs: Yes                                                                         │
│ live:                                                                                    │
│   AuthParameters:                                                                        │
│     ApiKeyAuthParameters:                                                                │
│       ApiKeyName: MyWebhook                                                              │
│   AuthorizationType: API_KEY                                                             │
│   ConnectionArn: arn:aws:events:us-east-1:840541460064:connection/MyConnection-dvMVGg2s… │
│   ConnectionState: AUTHORIZED                                                            │
│   CreationTime: 2022-08-05T11:37:09.000Z                                                 │
│   Description: My connection with an API key                                             │
│   LastAuthorizedTime: 2022-08-05T11:37:09.000Z                                           │
│   LastModifiedTime: 2022-08-05T11:37:09.000Z                                             │
│   Name: MyConnection-dvMVGg2stExz                                                        │
│   SecretArn: arn:aws:secretsmanager:us-east-1:840541460064:secret:events!connection/MyC… │
│                                                                                          │
└──────────────────────────────────────────────────────────────────────────────────────────┘


List Summary:
Provider: aws
┌─────────────────────────────────────────────────────────────────────────────────────────┐
│ aws                                                                                     │
├──────────────────────────────┬──────────────────────────────────────────────────────────┤
│ CloudWatchEvents::Connection │ MyConnection-dvMVGg2stExz                                │
└──────────────────────────────┴──────────────────────────────────────────────────────────┘
1 resource, 1 type, 1 provider
Command "gc l -t CloudWatchEvents::Connection" executed in 4s, 100 MB
```
