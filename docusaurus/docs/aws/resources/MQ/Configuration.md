---
id: Configuration
title: Configuration
---

Manages a [Amazon MQ Configuration](https://console.aws.amazon.com/amazon-mq/home#/configurations).

## Sample code

```js
exports.createResources = () => [
  {
    type: "Configuration",
    group: "MSK",
    properties: ({}) => ({
      ServerProperties:
        "auto.create.topics.enable=false\ndefault.replication.factor=3\nmin.insync.replicas=2\nnum.io.threads=8\nnum.network.threads=5\nnum.partitions=1\nnum.replica.fetchers=2\nreplica.lag.time.max.ms=30000\nsocket.receive.buffer.bytes=102400\nsocket.request.max.bytes=104857600\nsocket.send.buffer.bytes=102400\nunclean.leader.election.enable=true\nzookeeper.session.timeout.ms=18000\n",
      Name: "my-configuration",
    }),
  },
];
```

## Properties

- [CreateConfigurationCommandInput](https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/clients/client-mq/interfaces/createconfigurationcommandinput.html)

## Dependencies

## Used By

- [MQ Broker](../MQ/Broker.md)

## Full Examples

- [mq simple](https://github.com/grucloud/grucloud/tree/main/examples/aws/MQ/mq-simple)

## List

```sh
gc l -t MQ::Configuration
```

```txt

```
