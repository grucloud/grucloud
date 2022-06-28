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
    name: "my-api",
    properties: ({}) => ({
      HttpMethod: "POST",
      InvocationEndpoint: "https://grucloud.com",
      InvocationRateLimitPerSecond: 300,
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

The event buses can be filtered with the _ApiDestination_ type:

```sh
gc l -t ApiDestination
```

```txt

```
