---
id: Document
title: Document
---

Manage a [System Manager Document](https://console.aws.amazon.com/systems-manager/automation/execute).

## Example

Create a document:

```js
exports.createResources = () => [
  {
    type: "Document",
    group: "SSM",
    properties: ({}) => ({
      Content: {
        schemaVersion: "0.3",
        description: "Automation document for the invoking a lambda function",
        parameters: {
          SortKeyInput: {
            type: "String",
          },
          PartitonKeyInput: {
            type: "String",
          },
          DocumentInputTableName: {
            type: "String",
          },
        },
        mainSteps: [
          {
            inputs: {
              FunctionName: "sam-app-LambdaFunction-QDYroyPbEfQ2",
              Payload:
                '{\n "ssm_automation_parameters":\n   {\n     "table_name": "{{DocumentInputTableName}}",\n     "partition_key_input": "{{PartitonKeyInput}}",\n     "sort_key_input":"{{SortKeyInput}}"\n   }\n}\n',
            },
            name: "lambda_invoke",
            action: "aws:invokeLambdaFunction",
            onFailure: "Abort",
          },
        ],
      },
      DocumentType: "Automation",
      Name: "sam-app-SsmAutomationDocument-FSUirGoJvvgN",
    }),
    dependencies: ({}) => ({
      role: "sam-app-AutomationExecutionRole-1AG1YFJPV5DRK",
    }),
];
```

## Code Examples

- [systems-manager-automation-to-lambda](https://github.com/grucloud/grucloud/blob/main/examples/aws/serverless-patterns/systems-manager-automation-to-lambda)

## Properties

- [CreateDocumentCommandInput](https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/clients/client-ssm/interfaces/createdocumentcommandinput.html)

## Dependencies

- [IAM Role](../IAM/Role.md)
- [Lamda Function](../Lambda/Function.md)

## List

```sh
gc l -t SSM::Document
```

```txt
Listing resources on 1 provider: aws
✓ aws us-east-1
  ✓ Initialising
  ✓ Listing 1/1
┌──────────────────────────────────────────────────────────────────────────────────────────────┐
│ 1 SSM::Document from aws                                                                     │
├──────────────────────────────────────────────────────────────────────────────────────────────┤
│ name: sam-app-SsmAutomationDocument-FSUirGoJvvgN                                             │
│ managedByUs: Yes                                                                             │
│ live:                                                                                        │
│   Content:                                                                                   │
│     schemaVersion: 0.3                                                                       │
│     description: Automation document for the invoking a lambda function                      │
│     assumeRole: arn:aws:iam::840541460064:role/sam-app-AutomationExecutionRole-1AG1YFJPV5DRK │
│     parameters:                                                                              │
│       SortKeyInput:                                                                          │
│         type: String                                                                         │
│       PartitonKeyInput:                                                                      │
│         type: String                                                                         │
│       DocumentInputTableName:                                                                │
│         type: String                                                                         │
│     mainSteps:                                                                               │
│       - inputs:                                                                              │
│           FunctionName: sam-app-LambdaFunction-QDYroyPbEfQ2                                  │
│           Payload: {                                                                         │
│  "ssm_automation_parameters":                                                                │
│    {                                                                                         │
│      "table_name": "{{DocumentInputTableName}}",                                             │
│      "partition_key_input": "{{PartitonKeyInput}}",                                          │
│      "sort_key_input":"{{SortKeyInput}}"                                                     │
│    }                                                                                         │
│ }                                                                                            │
│                                                                                              │
│         name: lambda_invoke                                                                  │
│         action: aws:invokeLambdaFunction                                                     │
│         onFailure: Abort                                                                     │
│   CreatedDate: 2022-08-08T20:00:54.102Z                                                      │
│   DocumentFormat: JSON                                                                       │
│   DocumentType: Automation                                                                   │
│   DocumentVersion: 1                                                                         │
│   Name: sam-app-SsmAutomationDocument-FSUirGoJvvgN                                           │
│   Tags:                                                                                      │
│     - Key: gc-created-by-provider                                                            │
│       Value: aws                                                                             │
│     - Key: gc-managed-by                                                                     │
│       Value: grucloud                                                                        │
│     - Key: gc-project-name                                                                   │
│       Value: systems-manager-automation-to-lambda                                            │
│     - Key: gc-stage                                                                          │
│       Value: dev                                                                             │
│     - Key: Name                                                                              │
│       Value: sam-app-SsmAutomationDocument-FSUirGoJvvgN                                      │
│                                                                                              │
└──────────────────────────────────────────────────────────────────────────────────────────────┘


List Summary:
Provider: aws
┌─────────────────────────────────────────────────────────────────────────────────────────────┐
│ aws                                                                                         │
├───────────────┬─────────────────────────────────────────────────────────────────────────────┤
│ SSM::Document │ sam-app-SsmAutomationDocument-FSUirGoJvvgN                                  │
└───────────────┴─────────────────────────────────────────────────────────────────────────────┘
1 resource, 1 type, 1 provider
Command "gc l -t Document" executed in 4s, 110 MB
```
