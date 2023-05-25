// Generated by 'gc gencode'
const {} = require("rubico");
const {} = require("rubico/x");

exports.createResources = () => [
  {
    type: "Document",
    group: "SSM",
    properties: ({}) => ({
      Content: {
        description:
          "Automation document for the invoking a lambda function v3 updated",
        mainSteps: [
          {
            action: "aws:invokeLambdaFunction",
            inputs: {
              FunctionName: "sam-app-LambdaFunction-SzMn1A4Jbksd",
              Payload: `{
 "ssm_automation_parameters":
   {
     "table_name": "{{DocumentInputTableName}}",
     "partition_key_input": "{{PartitonKeyInput}}",
     "sort_key_input":"{{SortKeyInput}}"
   }
}
`,
            },
            name: "lambda_invoke",
            onFailure: "Abort",
          },
        ],
        parameters: {
          DocumentInputTableName: {
            type: "String",
          },
          PartitonKeyInput: {
            type: "String",
          },
          SortKeyInput: {
            type: "String",
          },
        },
        schemaVersion: "0.3",
      },
      DocumentType: "Automation",
      Name: "sam-app-SsmAutomationDocument-tWpS8MDWk4RI",
      Parameters: [
        {
          Name: "DocumentInputTableName",
          Type: "String",
        },
        {
          Name: "PartitonKeyInput",
          Type: "String",
        },
        {
          Name: "SortKeyInput",
          Type: "String",
        },
      ],
      PlatformTypes: ["Windows", "Linux", "MacOS"],
    }),
  },
];