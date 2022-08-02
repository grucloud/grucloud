// Generated by 'gc gencode'
const {} = require("rubico");
const {} = require("rubico/x");

exports.createResources = () => [
  {
    type: "RestApi",
    group: "APIGateway",
    properties: ({ config }) => ({
      name: "rest-api-eb-fOaf",
      apiKeySource: "HEADER",
      endpointConfiguration: {
        types: ["EDGE"],
      },
      schema: {
        openapi: "3.0.1",
        info: {
          description: "serverlessland eb integration",
          title: "rest-api-eb-fOaf",
          version: "1",
        },
        paths: {
          "/": {},
          "/orders": {
            post: {
              parameters: [
                {
                  name: "Content-Type",
                  in: "header",
                  required: false,
                  schema: {
                    type: "string",
                  },
                },
                {
                  name: "X-Amz-Target",
                  in: "header",
                  required: false,
                  schema: {
                    type: "string",
                  },
                },
              ],
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
                credentials: `arn:aws:iam::${config.accountId()}:role/ApiGatewayEventBridgeRole`,
                httpMethod: "POST",
                passthroughBehavior: "WHEN_NO_TEMPLATES",
                requestTemplates: {
                  "application/json":
                    '#set($context.requestOverride.header.X-Amz-Target = "AWSEvents.PutEvents")\n#set($context.requestOverride.header.Content-Type = "application/x-amz-json-1.1")            \n#set($inputRoot = $input.path(\'$\')) \n{ \n  "Entries": [\n    #foreach($elem in $inputRoot.items)\n    {\n      "Detail": "$util.escapeJavaScript($elem.Detail).replaceAll("\\\\\'","\'")",\n      "DetailType": "$elem.DetailType",\n      "EventBusName": "MyIntegrationCustomBus",\n      "Source":"$elem.Source"\n    }#if($foreach.hasNext),#end\n    #end\n  ]\n            \n}\n',
                },
                type: "AWS",
                uri: `arn:aws:apigateway:${config.region}:events:action/PutEvents`,
                responses: {
                  default: {
                    responseTemplates: {
                      "application/json":
                        "  #set($inputRoot = $input.path('$'))\n{\n}\n",
                    },
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
      roles: ["ApiGatewayEventBridgeRole"],
    }),
  },
  {
    type: "Stage",
    group: "APIGateway",
    properties: ({}) => ({
      stageName: "dev",
    }),
    dependencies: ({}) => ({
      restApi: "rest-api-eb-fOaf",
    }),
  },
  {
    type: "EventBus",
    group: "CloudWatchEvents",
    properties: ({}) => ({
      Name: "MyIntegrationCustomBus",
    }),
  },
  {
    type: "Rule",
    group: "CloudWatchEvents",
    properties: ({ config }) => ({
      Description: "default catch all",
      EventPattern: {
        account: [`${config.accountId()}`],
      },
      Name: "catch_all",
      State: "ENABLED",
    }),
    dependencies: ({}) => ({
      eventBus: "MyIntegrationCustomBus",
    }),
  },
  {
    type: "Target",
    group: "CloudWatchEvents",
    properties: ({}) => ({
      Id: "terraform-20220414090055513200000002",
    }),
    dependencies: ({}) => ({
      rule: "catch_all",
      logGroup:
        "/aws/events/MyIntegrationCustomBus/MyIntegrationCustomBus-catch_all",
    }),
  },
  {
    type: "LogGroup",
    group: "CloudWatchLogs",
    properties: ({}) => ({
      logGroupName:
        "/aws/events/MyIntegrationCustomBus/MyIntegrationCustomBus-catch_all",
      retentionInDays: 7,
    }),
  },
  {
    type: "Role",
    group: "IAM",
    properties: ({}) => ({
      RoleName: "ApiGatewayEventBridgeRole",
      AssumeRolePolicyDocument: {
        Version: "2012-10-17",
        Statement: [
          {
            Sid: "",
            Effect: "Allow",
            Principal: {
              Service: `apigateway.amazonaws.com`,
            },
            Action: "sts:AssumeRole",
          },
        ],
      },
    }),
    dependencies: ({}) => ({
      policies: ["EBPutEvents"],
    }),
  },
  {
    type: "Policy",
    group: "IAM",
    properties: ({ getId }) => ({
      PolicyName: "EBPutEvents",
      PolicyDocument: {
        Statement: [
          {
            Action: "events:PutEvents",
            Effect: "Allow",
            Resource: `${getId({
              type: "EventBus",
              group: "CloudWatchEvents",
              name: "MyIntegrationCustomBus",
            })}`,
          },
        ],
        Version: "2012-10-17",
      },
      Path: "/",
    }),
    dependencies: ({}) => ({
      eventBus: "MyIntegrationCustomBus",
    }),
  },
];
