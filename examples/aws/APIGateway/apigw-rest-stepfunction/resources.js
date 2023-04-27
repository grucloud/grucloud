// Generated by 'gc gencode'
const {} = require("rubico");
const {} = require("rubico/x");

exports.createResources = () => [
  {
    type: "RestApi",
    group: "APIGateway",
    properties: ({ config }) => ({
      apiKeySource: "HEADER",
      endpointConfiguration: {
        types: ["REGIONAL"],
      },
      name: "sam-app-api",
      schema: {
        openapi: "3.0.1",
        info: {
          title: "sam-app-api",
          version: "1",
        },
        paths: {
          "/": {
            post: {
              responses: {
                200: {
                  description: "200 response",
                  content: {
                    "application/json": {
                      schema: {
                        $ref: "#/components/schemas/Empty",
                      },
                    },
                  },
                },
              },
              "x-amazon-apigateway-integration": {
                credentials: `arn:aws:iam::${config.accountId()}:role/sam-app/sam-app-ApiGatewayStepFunctionsRole-1N0DEXSEOPMRW`,
                httpMethod: "POST",
                passthroughBehavior: "WHEN_NO_TEMPLATES",
                requestTemplates: {
                  "application/json": `#set($data = $util.escapeJavaScript($input.json('$'))) 
{ 
  "input": "$data", 
  "stateMachineArn": "arn:aws:states:${
    config.region
  }:${config.accountId()}:stateMachine:WaitableStateMachine-ouygzTBZ7yWu"
}`,
                },
                type: "AWS",
                uri: `arn:aws:apigateway:${config.region}:states:action/StartExecution`,
                responses: {
                  default: {
                    statusCode: "200",
                  },
                },
              },
            },
          },
        },
        components: {
          schemas: {
            Empty: {
              title: "Empty Schema",
              type: "object",
            },
            Error: {
              title: "Error Schema",
              type: "object",
              properties: {
                message: {
                  type: "string",
                },
              },
            },
          },
        },
      },
      deployment: {
        stageName: "dev",
      },
    }),
    dependencies: ({}) => ({
      roles: ["sam-app-ApiGatewayStepFunctionsRole-1N0DEXSEOPMRW"],
    }),
  },
  {
    type: "Stage",
    group: "APIGateway",
    properties: ({}) => ({
      stageName: "dev",
    }),
    dependencies: ({}) => ({
      restApi: "sam-app-api",
    }),
  },
  {
    type: "Role",
    group: "IAM",
    properties: ({ config }) => ({
      RoleName: "sam-app-ApiGatewayStepFunctionsRole-1N0DEXSEOPMRW",
      Path: "/sam-app/",
      AssumeRolePolicyDocument: {
        Version: "2012-10-17",
        Statement: [
          {
            Sid: "AllowApiGatewayServiceToAssumeRole",
            Effect: "Allow",
            Principal: {
              Service: "apigateway.amazonaws.com",
            },
            Action: "sts:AssumeRole",
          },
        ],
      },
      Policies: [
        {
          PolicyDocument: {
            Version: "2012-10-17",
            Statement: [
              {
                Action: ["states:StartExecution"],
                Resource: [
                  `arn:aws:states:${
                    config.region
                  }:${config.accountId()}:stateMachine:WaitableStateMachine-ouygzTBZ7yWu`,
                ],
                Effect: "Allow",
              },
            ],
          },
          PolicyName: "CallStepFunctions",
        },
      ],
    }),
  },
  {
    type: "Role",
    group: "IAM",
    properties: ({ config }) => ({
      RoleName: "sam-app-WaitableStateMachineRole-OWUCFZYWKOXA",
      AssumeRolePolicyDocument: {
        Version: "2012-10-17",
        Statement: [
          {
            Effect: "Allow",
            Principal: {
              Service: "states.amazonaws.com",
            },
            Action: "sts:AssumeRole",
          },
        ],
      },
      Policies: [
        {
          PolicyDocument: {
            Statement: [
              {
                Action: [
                  "dynamodb:PutItem",
                  "dynamodb:UpdateItem",
                  "dynamodb:BatchWriteItem",
                ],
                Resource: [
                  `arn:aws:dynamodb:${
                    config.region
                  }:${config.accountId()}:table/sam-app-StatusTable-1KWUO9MA1C77T`,
                  `arn:aws:dynamodb:${
                    config.region
                  }:${config.accountId()}:table/sam-app-StatusTable-1KWUO9MA1C77T/index/*`,
                ],
                Effect: "Allow",
              },
            ],
          },
          PolicyName: "WaitableStateMachineRolePolicy0",
        },
      ],
    }),
  },
  {
    type: "StateMachine",
    group: "StepFunctions",
    properties: ({}) => ({
      definition: {
        Comment: "An example of the Amazon States Language using wait states",
        StartAt: "SetInitialStatus",
        States: {
          SetInitialStatus: {
            Type: "Task",
            Resource: "arn:aws:states:::dynamodb:putItem",
            Parameters: {
              TableName: "sam-app-StatusTable-1KWUO9MA1C77T",
              Item: {
                Id: {
                  "S.$": "$.Id",
                },
                ProcessStatus: {
                  S: "STARTING",
                },
                LastUpdated: {
                  "S.$": "$$.State.EnteredTime",
                },
              },
            },
            Retry: [
              {
                ErrorEquals: ["States.TaskFailed"],
                IntervalSeconds: 20,
                MaxAttempts: 5,
                BackoffRate: 10,
              },
            ],
            Next: "WaitUntil",
            OutputPath: "$",
          },
          WaitUntil: {
            Type: "Wait",
            TimestampPath: "$.StartTimestamp",
            Next: "SetFinalStatus",
            OutputPath: "$",
          },
          SetFinalStatus: {
            Type: "Task",
            Resource: "arn:aws:states:::dynamodb:updateItem",
            Parameters: {
              TableName: "sam-app-StatusTable-1KWUO9MA1C77T",
              Key: {
                Id: {
                  "S.$": "$.Id",
                },
              },
              UpdateExpression:
                "SET ProcessStatus = :newStatus, LastUpdated = :newTimestamp",
              ExpressionAttributeValues: {
                ":newStatus": {
                  S: "COMPLETED",
                },
                ":newTimestamp": {
                  "S.$": "$$.State.EnteredTime",
                },
              },
            },
            Retry: [
              {
                ErrorEquals: ["States.TaskFailed"],
                IntervalSeconds: 20,
                MaxAttempts: 5,
                BackoffRate: 10,
              },
            ],
            End: true,
          },
        },
      },
      name: "WaitableStateMachine-ouygzTBZ7yWu",
    }),
    dependencies: ({}) => ({
      role: "sam-app-WaitableStateMachineRole-OWUCFZYWKOXA",
    }),
  },
];
