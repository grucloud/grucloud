---
id: ArchiveRule
title: Archive Rule
---

Manages an [IAM Access Analyzer Archive Rule](https://console.aws.amazon.com/access-analyzer/home).

## Sample code

```js
exports.createResources = () => [
  {
    type: "ArchiveRule",
    group: "AccessAnalyzer",
    properties: ({}) => ({
      filter: {
        isPublic: {
          eq: ["false"],
        },
      },
      ruleName: "ArchiveRule-public",
    }),
    dependencies: ({}) => ({
      analyzer: "ConsoleAnalyzer",
    }),
  },
];
```

## Properties

- [CreateArchiveRuleCommandInput](https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/clients/client-accessanalyzer/interfaces/createarchiverulecommandinput.html)

## Full Examples

- [accessanalyzer-simple](https://github.com/grucloud/grucloud/tree/main/examples/aws/AccessArchiveRule/accessanalyzer-simple)

## Dependencies

- [AcccessAnalyzer Analyzer](./Analyzer.md)

## List

```sh
gc l -t AccessAnalyzer::ArchiveRule
```

```txt
Listing resources on 1 provider: aws
✓ aws us-east-1
  ✓ Initialising
  ✓ Listing 2/2
┌──────────────────────────────────────────────────────────────────────────┐
│ 1 AccessAnalyzer::ArchiveRule from aws                                   │
├──────────────────────────────────────────────────────────────────────────┤
│ name: ConsoleAnalyzer::ArchiveRule-public                                │
│ managedByUs: NO                                                          │
│ live:                                                                    │
│   createdAt: 2022-11-05T14:22:11.000Z                                    │
│   filter:                                                                │
│     isPublic:                                                            │
│       eq:                                                                │
│         - "false"                                                        │
│   ruleName: ArchiveRule-public                                           │
│   updatedAt: 2022-11-05T14:22:11.000Z                                    │
│   analyzerName: ConsoleAnalyzer                                          │
│                                                                          │
└──────────────────────────────────────────────────────────────────────────┘


List Summary:
Provider: aws
┌─────────────────────────────────────────────────────────────────────────┐
│ aws                                                                     │
├─────────────────────────────┬───────────────────────────────────────────┤
│ AccessAnalyzer::ArchiveRule │ ConsoleAnalyzer::ArchiveRule-public       │
└─────────────────────────────┴───────────────────────────────────────────┘
1 resource, 1 type, 1 provider
Command "gc l -t AccessAnalyzer::ArchiveRule" executed in 2s, 110 MB
```
