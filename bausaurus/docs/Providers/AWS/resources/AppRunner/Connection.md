---
id: Connection
title: Connection
---

Provides an AppRunner Connection.

## Examples

### Create a AppRunner service from a docker image

```js
exports.createResources = () => [
  {
    type: "Connection",
    group: "AppRunner",
    properties: ({}) => ({
      ConnectionName: "github",
      ProviderType: "GITHUB",
    }),
  },
];
```

## Source Code Examples

- [apprunner-github](https://github.com/grucloud/grucloud/blob/main/examples/aws/AppRunner/apprunner-github/resources.js)

## Properties

- [CreateConnectionCommandInput](https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/clients/client-apprunner/interfaces/createconnectioncommandinput.html)

## Used By

- [AppRunner Service](./Service.md)

## List

The list of AppRunner services can be displayed and filtered with the type **Connection**:

```sh
gc list -t AppRunner::Connection
```

```txt
Listing resources on 1 provider: aws
✓ aws
  ✓ Initialising
  ✓ Listing 1/1
┌───────────────────────────────────────────────────────────────┐
│ 1 AppRunner::Connection from aws                              │
├───────────────────────────────────────────────────────────────┤
│ name: github                                                  │
│ managedByUs: Yes                                              │
│ live:                                                         │
│   ConnectionName: github                                      │
│   ConnectionArn: arn:aws:apprunner:us-east-1:840541460064:co… │
│   ProviderType: GITHUB                                        │
│   Status: AVAILABLE                                           │
│   CreatedAt: 2022-02-16T14:36:50.000Z                         │
│                                                               │
└───────────────────────────────────────────────────────────────┘


List Summary:
Provider: aws
┌──────────────────────────────────────────────────────────────┐
│ aws                                                          │
├───────────────────────┬──────────────────────────────────────┤
│ AppRunner::Connection │ github                               │
└───────────────────────┴──────────────────────────────────────┘
1 resource, 1 type, 1 provider
Command "gc l -t Connection" executed in 3s
```
