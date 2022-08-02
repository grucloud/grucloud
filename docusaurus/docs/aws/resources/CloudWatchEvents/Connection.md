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

## Used By

- [ApiDestination](./ApiDestination.md)

## Full Examples

- [eventbridge-api-destinations webhook-site](https://github.com/grucloud/grucloud/tree/main/examples/aws/serverless-patterns/eventbridge-api-destinations/1-webhook-site)
- [eventbridge-api-destinations zendesk](https://github.com/grucloud/grucloud/tree/main/examples/aws/serverless-patterns/eventbridge-api-destinations/5-zendesk)

## List

The connections can be filtered with the _Connection_ type:

```sh
gc l -t Connection
```

```txt

```
