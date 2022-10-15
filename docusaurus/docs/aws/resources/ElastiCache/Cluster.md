---
id: Cluster
title: Cluster
---

Manages an [ElastiCache Cluster](https://console.aws.amazon.com/elasticache/home#/).

## Sample code

```js
exports.createResources = () => [];
```

## Properties

- [CreateCacheClusterCommandInput](https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/clients/client-elasticache/interfaces/createcacheclustercommandinput.html)

## Dependencies

- [CloudWatchLogs LogGroup](../CloudWatchLogs/LogGroup.md)
- [EC2 Security Group](../EC2/SecurityGroup.md)
- [ElastiCache Parameter Group](./ParameterGroup.md)
- [ElastiCache Subnet Group](./SubnetGroup.md)
- [Firehose Delivery Stream](../Firehose/DeliveryStream.md)
- [SNS Topic](../SNS/Topic.md)

## Full Examples

- [elasticache simple](https://github.com/grucloud/grucloud/tree/main/examples/aws/ElastiCache/elasticache-simple)

## List

```sh
gc l -t ElastiCache::Cluster
```

```txt

```
