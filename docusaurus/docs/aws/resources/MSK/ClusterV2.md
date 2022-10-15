---
id: ClusterV2
title: ClusterV2
---

Manages a [MSK Cluster V2](https://console.aws.amazon.com/msk/home#/home).

## Sample code

```js
exports.createResources = () => [];
```

## Properties

- [CreateClusterV2CommandInput](https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/clients/client-kafka/interfaces/createclusterv2commandinput.html)

## Dependencies

- [EC2 Security Group](../EC2/SecurityGroup.md)
- [EC2 Subnet](../EC2/Subnet.md)
- [Firehose Delivery Stream](../Firehose/DeliveryStream.md)
- [KMS Key](../KMS/Key.md)
- [MSK Configuration](./Configuration.md)
- [S3 Bucket](../S3/Bucket.md)

## Used By

## Full Examples

- [msk v2 simple](https://github.com/grucloud/grucloud/tree/main/examples/aws/MSK/msk-serverless-simple)

## List

```sh
gc l -t MSK::ClusterV2
```

```txt

```
