---
id: Broker
title: Broker
---

Manages a [Amazon MQ Broker](https://console.aws.amazon.com/amazon-mq/home).

## Sample code

```js
exports.createResources = () => [];
```

## Properties

- [CreateBrokerCommandInput](https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/clients/client-mq/interfaces/createbrokercommandinput.html)

## Dependencies

- [EC2 Security Group](../EC2/SecurityGroup.md)
- [EC2 Subnet](../EC2/Subnet.md)
- [Firehose Delivery Stream](../Firehose/DeliveryStream.md)
- [KMS Key](../KMS/Key.md)
- [MSK Configuration](./Configuration.md)
- [S3 Bucket](../S3/Bucket.md)

## Used By

## Full Examples

- [mq simple](https://github.com/grucloud/grucloud/tree/main/examples/aws/MQ/mq-simple)

## List

```sh
gc l -t MQ::Broker
```

```txt

```
