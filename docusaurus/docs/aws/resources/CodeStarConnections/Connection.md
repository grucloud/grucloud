---
id: Connection
title: Connection
---

Manages an [AWS CodeStarConnections Connection](https://docs.aws.amazon.com/codestar-connections/latest/APIReference/Welcome.html).

## Sample code

```js
exports.createResources = () => [
  {
    type: "Connection",
    group: "CodeStarConnections",
    properties: ({}) => ({
      ConnectionName: "myconn",
      ProviderType: "GitHub",
    }),
  },
];
```

## Dependencies

- [CodeStarConnections Host](./Host.md)

## Used By

- [CodePipeline Pipeline](../CodePipeline/Pipeline.md)

## Properties

- [CreateConnectionCommandInput](https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/clients/client-codestar-connections/interfaces/createconnectioncommandinput.html)

## Full Examples

- [codepipeline-simple](https://github.com/grucloud/grucloud/tree/main/examples/aws/CodeConnection/codepipeline-simple)

## List

The connections can be filtered with the _CodeStarConnections::Connection_ type:

```sh
gc l -t CodeStarConnections::Connection
```

```txt
Listing resources on 1 provider: aws
✓ aws us-east-1
  ✓ Initialising
  ✓ Listing 1/1
┌─────────────────────────────────────────────────────────────────────────────────────────┐
│ 1 CodeStarConnections::Connection from aws                                              │
├─────────────────────────────────────────────────────────────────────────────────────────┤
│ name: myconn                                                                            │
│ managedByUs: Yes                                                                        │
│ live:                                                                                   │
│   ConnectionArn: arn:aws:codestar-connections:us-east-1:840541460064:connection/6ba9de… │
│   ConnectionName: myconn                                                                │
│   ConnectionStatus: AVAILABLE                                                           │
│   OwnerAccountId: 840541460064                                                          │
│   ProviderType: GitHub                                                                  │
│                                                                                         │
└─────────────────────────────────────────────────────────────────────────────────────────┘


List Summary:
Provider: aws
┌────────────────────────────────────────────────────────────────────────────────────────┐
│ aws                                                                                    │
├─────────────────────────────────┬──────────────────────────────────────────────────────┤
│ CodeStarConnections::Connection │ myconn                                               │
└─────────────────────────────────┴──────────────────────────────────────────────────────┘
1 resource, 1 type, 1 provider
Command "gc l -t CodeStarConnections::Connection" executed in 4s, 117 MB
```
