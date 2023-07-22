---
id: Analyzer
title: Analyzer
---

Manages an [IAM Access Analyzer](https://console.aws.amazon.com/access-analyzer/home).

## Sample code

```js
exports.createResources = () => [
  {
    type: "Analyzer",
    group: "AcessAnalyzer",
    properties: ({}) => ({
      analyzerName: "ConsoleAnalyzer",
      type: "ACCOUNT",
    }),
  },
];
```

## Properties

- [CreateAnalyzerCommandInput](https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/clients/client-accessanalyzer/interfaces/createanalyzercommandinput.html)

## Full Examples

- [accessanalyzer-simple](https://github.com/grucloud/grucloud/tree/main/examples/aws/AccessAnalyzer/accessanalyzer-simple)

## Used by

- [AcccessAnalyzer ArchiveRule](./ArchiveRule.md)

## List

```sh
gc l -t AccessAnalyzer::Analyzer
```

```txt
Listing resources on 1 provider: aws
✓ aws us-east-1
  ✓ Initialising
  ✓ Listing 1/1
┌─────────────────────────────────────────────────────────────────────────────┐
│ 1 AccessAnalyzer::Analyzer from aws                                         │
├─────────────────────────────────────────────────────────────────────────────┤
│ name: ConsoleAnalyzer                                                       │
│ managedByUs: Yes                                                            │
│ live:                                                                       │
│   analyzerName: ConsoleAnalyzer                                             │
│   arn: arn:aws:access-analyzer:us-east-1:840541460064:analyzer/ConsoleAnal… │
│   createdAt: 2022-11-05T13:32:08.000Z                                       │
│   lastResourceAnalyzed: arn:aws:sns:us-east-1:840541460064:topic-elasticac… │
│   lastResourceAnalyzedAt: 2022-11-05T13:32:08.723Z                          │
│   status: ACTIVE                                                            │
│   tags:                                                                     │
│     gc-managed-by: grucloud                                                 │
│     gc-project-name: accessanalyzer-simple                                  │
│     gc-stage: dev                                                           │
│     gc-created-by-provider: aws                                             │
│     Name: ConsoleAnalyzer                                                   │
│   type: ACCOUNT                                                             │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘


List Summary:
Provider: aws
┌────────────────────────────────────────────────────────────────────────────┐
│ aws                                                                        │
├──────────────────────────┬─────────────────────────────────────────────────┤
│ AccessAnalyzer::Analyzer │ ConsoleAnalyzer                                 │
└──────────────────────────┴─────────────────────────────────────────────────┘
1 resource, 1 type, 1 provider
Command "gc l -t AccessAnalyzer::Analyzer" executed in 3s, 110 MB
```
