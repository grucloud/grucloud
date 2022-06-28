---
id: Task
title: Task
---

Manages an [ECS Task](https://console.aws.amazon.com/ecs/home?#).

## Sample code

```js
exports.createResources = () => [{}];
```

## Properties

- [RunTaskCommandInput](https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/clients/client-ecs/interfaces/runtaskcommandinput.html)

## Used By

- [CloudWatchEvent Target](../CloudWatchEvents/Target.md)

## Full Examples

## List

The ECS services can be filtered with the _Task_ type:

```sh
gc l -t Task
```
