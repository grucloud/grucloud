// Generated by 'gc gencode'
const {} = require("rubico");
const {} = require("rubico/x");

exports.createResources = () => [
  {
    type: "RestApi",
    group: "APIGateway",
    properties: ({}) => ({
      apiKeySource: "HEADER",
      description: "HTTP Integration REST API demo",
      endpointConfiguration: {
        types: ["EDGE"],
      },
      name: "apigw-rest-api-http-integration",
      schema: {
        openapi: "3.0.1",
        info: {
          description: "HTTP Integration REST API demo",
          title: "apigw-rest-api-http-integration",
          version: "1",
        },
        paths: {
          "/": {
            get: {
              "x-amazon-apigateway-integration": {
                httpMethod: "GET",
                passthroughBehavior: "WHEN_NO_MATCH",
                type: "HTTP_PROXY",
                uri: "https://api.grucloud.org",
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
        stageName: "Prod",
      },
    }),
  },
  {
    type: "Stage",
    group: "APIGateway",
    properties: ({}) => ({
      stageName: "Prod",
    }),
    dependencies: ({}) => ({
      restApi: "apigw-rest-api-http-integration",
    }),
  },
];
