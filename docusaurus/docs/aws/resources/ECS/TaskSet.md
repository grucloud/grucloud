---
id: Task
title: Task
---

Manages an [ECS TaskSet](https://console.aws.amazon.com/ecs/home?#).

## Sample code

```js
exports.createResources = () => [{}];
```

## Properties

- [RunTaskCommandInput](https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/clients/client-ecs/interfaces/runtaskcommandinput.html)

## Dependencies

- [Cluster](./Cluster.md)
- [Service](./Service.md)
- [TaskDefinition](./TaskDefinition.md)
- [ElasticLoadBalancingV2 TargetGroup](../ElasticLoadBalancingV2/TargetGroup.md)

## Used By

- [CloudWatchEvent Target](../CloudWatchEvents/Target.md)

## Full Examples

## List

The ECS task sets can be filtered with the _TaskSet_ type:

```sh
gc l -t TaskSet
```
