---
id: DeliveryStream
title: DeliveryStream
---

Manages an [Firehose Delivery Stream](https://console.aws.amazon.com/firehose/home?#/streams).

## Sample code

```js
exports.createResources = () => [];
```

## Properties

- [CreateDeliveryStreamCommandInput](https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/clients/client-firehose/interfaces/createdeliverystreamcommandinput.html)

## Dependencies

- [IAM Role](../IAM/Role.md)

## Used By

- [CloudWatchLogs Subscription Filter](../CloudWatchLogs/SubscriptionFilter.md)
- [ElastiCache Cluster](../ElastiCache/Cluster.md)
- [MSK ClusterV2](../MSK/ClusterV2.md)

## Full Examples

- [Step function invoking a Glue job](https://github.com/grucloud/grucloud/tree/main/examples/aws/Firehose/firehose-delivery-stream)

## List

The delivery stream can be filtered with the _Firehose::DeliveryStream_ type:

```sh
gc l -t Firehose::DeliveryStream
```

```txt

```
