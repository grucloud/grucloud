---
id: CacheParameterGroup
title: CacheParameterGroup
---

Manages an [ElastiCache Parameter Group](https://console.aws.amazon.com/elasticache/home#/parameter-groups).

## Sample code

```js
exports.createResources = () => [
  {
    type: "CacheParameterGroup",
    group: "ElastiCache",
    properties: ({}) => ({
      CacheParameterGroupName: "my-parameter-group",
      CacheParameterGroupFamily: "redis6.x",
      Description: "My Parameter Group",
      Tags: [
        {
          Key: "mykey",
          Value: "myvalue",
        },
      ],
    }),
  },
];
```

## Properties

- [CreateCacheParameterGroupCommandInput](https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/clients/client-elasticache/interfaces/createcacheparametergroupcommandinput.html)

## Used By

- [ElastiCache Cluster](../ElastiCache/CacheCluster.md)

## Full Examples

- [elasticache simple](https://github.com/grucloud/grucloud/tree/main/examples/aws/ElastiCache/elasticache-simple)

## List

```sh
gc l -t ElastiCache::CacheParameterGroup
```

```txt

```
