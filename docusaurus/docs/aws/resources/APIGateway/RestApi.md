---
id: RestApi
title: RestApi
---

Manages an [API Gateway RestAPI](https://console.aws.amazon.com/apigateway/main/apis).

## Sample code

```js
exports.createResources = () => [
  {
    type: "RestApi",
    group: "APIGateway",
    name: "PetStore",
    properties: ({}) => ({
      apiKeySource: "HEADER",
      endpointConfiguration: {
        types: ["REGIONAL"],
      },
      schemaFile: "PetStore.oas30.json",
      deployment: {
        stageName: "dev",
      },
    }),
  },
];
```

## Properties

The property _schemaFile_ specifies the Swagger 2.0 or OpenAPI 3.0 api specification.

Every time a new schema is modified and updated, a new deployment is created with property [deployment](https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/clients/client-api-gateway/interfaces/createdeploymentcommandinput.html)

The remaining input properties:

- [createRestApi input](https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/clients/client-api-gateway/interfaces/createrestapicommandinput.html)

## Used By

- [Authorizer](./Authorizer.md)
- [Stage](./Stage.md)

## Full Examples

- [RestAPI with Lambda](https://github.com/grucloud/grucloud/tree/main/examples/aws/api-gateway/restapi-lambda)

## List

The RestApis can be filtered with the _RestApi_ type:

```sh
gc l -t RestApi
```

```txt
Listing resources on 1 provider: aws
✓ aws
  ✓ Initialising
  ✓ Listing 1/1
┌───────────────────────────────────────────────────────────────────────────────────────────────────────────────┐
│ 1 APIGateway::RestApi from aws                                                                                │
├───────────────────────────────────────────────────────────────────────────────────────────────────────────────┤
│ name: PetStore                                                                                                │
│ managedByUs: Yes                                                                                              │
│ live:                                                                                                         │
│   id: j55ho2k105                                                                                              │
│   name: PetStore                                                                                              │
│   description: Your first API with Amazon API Gateway. This is a sample API that integrates via HTTP with ou… │
│   createdDate: 2021-10-08T19:43:13.000Z                                                                       │
│   apiKeySource: HEADER                                                                                        │
│   endpointConfiguration:                                                                                      │
│     types:                                                                                                    │
│       - "REGIONAL"                                                                                            │
│   tags:                                                                                                       │
│     Name: PetStore                                                                                            │
│     gc-created-by-provider: aws                                                                               │
│     gc-managed-by: grucloud                                                                                   │
│     gc-project-name: @grucloud/example-aws-api-gateway-restapi-lambda                                         │
│     gc-stage: dev                                                                                             │
│   disableExecuteApiEndpoint: false                                                                            │
│   deployments:                                                                                                │
│     - id: msuo33                                                                                              │
│       createdDate: 2021-10-08T19:43:18.000Z                                                                   │
│   schema:                                                                                                     │
│     openapi: 3.0.1                                                                                            │
│     info:                                                                                                     │
│       description: Your first API with Amazon API Gateway. This is a sample API that integrates via HTTP wit… │
│       title: PetStore                                                                                         │
│     paths:                                                                                                    │
│       /:                                                                                                      │
│         get:                                                                                                  │
│           responses:                                                                                          │
│             200:                                                                                              │
│               description: 200 response                                                                       │
│               headers:                                                                                        │
│                 Content-Type:                                                                                 │
│                   type: string                                                                                │
│           x-amazon-apigateway-integration:                                                                    │
│             type: MOCK                                                                                        │
│             requestTemplates:                                                                                 │
│               application/json: {"statusCode": 200}                                                           │
│             passthroughBehavior: WHEN_NO_MATCH                                                                │
│             responses:                                                                                        │
│               default:                                                                                        │
│                 statusCode: 200                                                                               │
│                 responseParameters:                                                                           │
│                   method.response.header.Content-Type: 'text/html'                                            │
│                 responseTemplates:                                                                            │
│                   text/html: <html>                                                                           │
│     <head>                                                                                                    │
│         <style>                                                                                               │
│         body {                                                                                                │
│             color: #333;                                                                                      │
│             font-family: Sans-serif;                                                                          │
│             max-width: 800px;                                                                                 │
│             margin: auto;                                                                                     │
│         }                                                                                                     │
│         </style>                                                                                              │
│     </head>                                                                                                   │
│     <body>                                                                                                    │
│         <h1>Welcome to your Pet Store API</h1>                                                                │
│         <p>                                                                                                   │
│             You have successfully deployed your first API. You are seeing this HTML page because the <code>G… │
│         </p>                                                                                                  │
│         <p>                                                                                                   │
│             The Pet Store API contains the <code>/pets</code> and <code>/pets/{petId}</code> resources. By m… │
│         </p>                                                                                                  │
│         <p>                                                                                                   │
│             You can use a REST client such as <a href="https://www.getpostman.com/" target="_blank">Postman<… │
│         </p>                                                                                                  │
│         <pre>                                                                                                 │
│ {                                                                                                             │
│     "type" : "cat",                                                                                           │
│     "price" : 123.11                                                                                          │
│ }                                                                                                             │
│         </pre>                                                                                                │
│     </body>                                                                                                   │
│ </html>                                                                                                       │
│       /pets:                                                                                                  │
│         get:                                                                                                  │
│           parameters:                                                                                         │
│             - name: page                                                                                      │
│               in: query                                                                                       │
│               required: true                                                                                  │
│               schema:                                                                                         │
│                 type: string                                                                                  │
│             - name: type                                                                                      │
│               in: query                                                                                       │
│               required: true                                                                                  │
│               schema:                                                                                         │
│                 type: string                                                                                  │
│           responses:                                                                                          │
│             200:                                                                                              │
│               description: 200 response                                                                       │
│               headers:                                                                                        │
│                 Access-Control-Allow-Origin:                                                                  │
│                   type: string                                                                                │
│               content:                                                                                        │
│                 application/json:                                                                             │
│                   schema:                                                                                     │
│                     $ref: #/components/schema/Pets                                                            │
│           x-amazon-apigateway-integration:                                                                    │
│             type: HTTP                                                                                        │
│             httpMethod: GET                                                                                   │
│             uri: http://petstore.execute-api.eu-west-2.amazonaws.com/petstore/pets                            │
│             requestParameters:                                                                                │
│               integration.request.querystring.page: method.request.querystring.page                           │
│               integration.request.querystring.type: method.request.querystring.type                           │
│             passthroughBehavior: WHEN_NO_MATCH                                                                │
│             responses:                                                                                        │
│               default:                                                                                        │
│                 statusCode: 200                                                                               │
│                 responseParameters:                                                                           │
│                   method.response.header.Access-Control-Allow-Origin: '*'                                     │
│         options:                                                                                              │
│           responses:                                                                                          │
│             200:                                                                                              │
│               description: 200 response                                                                       │
│               headers:                                                                                        │
│                 Access-Control-Allow-Headers:                                                                 │
│                   type: string                                                                                │
│                 Access-Control-Allow-Methods:                                                                 │
│                   type: string                                                                                │
│                 Access-Control-Allow-Origin:                                                                  │
│                   type: string                                                                                │
│               content:                                                                                        │
│                 application/json:                                                                             │
│                   schema:                                                                                     │
│                     $ref: #/components/schema/Empty                                                           │
│           x-amazon-apigateway-integration:                                                                    │
│             type: MOCK                                                                                        │
│             requestTemplates:                                                                                 │
│               application/json: {"statusCode": 200}                                                           │
│             passthroughBehavior: WHEN_NO_MATCH                                                                │
│             responses:                                                                                        │
│               default:                                                                                        │
│                 statusCode: 200                                                                               │
│                 responseParameters:                                                                           │
│                   method.response.header.Access-Control-Allow-Headers: 'Content-Type,X-Amz-Date,Authorizatio… │
│                   method.response.header.Access-Control-Allow-Methods: 'POST,GET,OPTIONS'                     │
│                   method.response.header.Access-Control-Allow-Origin: '*'                                     │
│         post:                                                                                                 │
│           operationId: CreatePet                                                                              │
│           requestBody:                                                                                        │
│             content:                                                                                          │
│               application/json:                                                                               │
│                 schema:                                                                                       │
│                   $ref: #/components/schemas/NewPet                                                           │
│             required: true                                                                                    │
│           responses:                                                                                          │
│             200:                                                                                              │
│               description: 200 response                                                                       │
│               headers:                                                                                        │
│                 Access-Control-Allow-Origin:                                                                  │
│                   type: string                                                                                │
│               content:                                                                                        │
│                 application/json:                                                                             │
│                   schema:                                                                                     │
│                     $ref: #/components/schema/NewPetResponse                                                  │
│           x-amazon-apigateway-integration:                                                                    │
│             type: HTTP                                                                                        │
│             httpMethod: POST                                                                                  │
│             uri: http://petstore.execute-api.eu-west-2.amazonaws.com/petstore/pets                            │
│             passthroughBehavior: WHEN_NO_MATCH                                                                │
│             responses:                                                                                        │
│               default:                                                                                        │
│                 statusCode: 200                                                                               │
│                 responseParameters:                                                                           │
│                   method.response.header.Access-Control-Allow-Origin: '*'                                     │
│       /pets/{petId}:                                                                                          │
│         get:                                                                                                  │
│           operationId: GetPet                                                                                 │
│           parameters:                                                                                         │
│             - name: petId                                                                                     │
│               in: path                                                                                        │
│               required: true                                                                                  │
│               schema:                                                                                         │
│                 type: string                                                                                  │
│           responses:                                                                                          │
│             200:                                                                                              │
│               description: 200 response                                                                       │
│               headers:                                                                                        │
│                 Access-Control-Allow-Origin:                                                                  │
│                   type: string                                                                                │
│               content:                                                                                        │
│                 application/json:                                                                             │
│                   schema:                                                                                     │
│                     $ref: #/components/schema/Pet                                                             │
│           x-amazon-apigateway-integration:                                                                    │
│             type: HTTP                                                                                        │
│             httpMethod: GET                                                                                   │
│             uri: http://petstore.execute-api.eu-west-2.amazonaws.com/petstore/pets/{petId}                    │
│             requestParameters:                                                                                │
│               integration.request.path.petId: method.request.path.petId                                       │
│             passthroughBehavior: WHEN_NO_MATCH                                                                │
│             responses:                                                                                        │
│               default:                                                                                        │
│                 statusCode: 200                                                                               │
│                 responseParameters:                                                                           │
│                   method.response.header.Access-Control-Allow-Origin: '*'                                     │
│         options:                                                                                              │
│           parameters:                                                                                         │
│             - name: petId                                                                                     │
│               in: path                                                                                        │
│               required: true                                                                                  │
│               type: string                                                                                    │
│           responses:                                                                                          │
│             200:                                                                                              │
│               description: 200 response                                                                       │
│               headers:                                                                                        │
│                 Access-Control-Allow-Headers:                                                                 │
│                   type: string                                                                                │
│                 Access-Control-Allow-Methods:                                                                 │
│                   type: string                                                                                │
│                 Access-Control-Allow-Origin:                                                                  │
│                   type: string                                                                                │
│               content:                                                                                        │
│                 application/json:                                                                             │
│                   schema:                                                                                     │
│                     $ref: #/components/schema/Empty                                                           │
│           x-amazon-apigateway-integration:                                                                    │
│             type: MOCK                                                                                        │
│             requestTemplates:                                                                                 │
│               application/json: {"statusCode": 200}                                                           │
│             passthroughBehavior: WHEN_NO_MATCH                                                                │
│             responses:                                                                                        │
│               default:                                                                                        │
│                 statusCode: 200                                                                               │
│                 responseParameters:                                                                           │
│                   method.response.header.Access-Control-Allow-Headers: 'Content-Type,X-Amz-Date,Authorizatio… │
│                   method.response.header.Access-Control-Allow-Methods: 'GET,OPTIONS'                          │
│                   method.response.header.Access-Control-Allow-Origin: '*'                                     │
│     components:                                                                                               │
│       schemas:                                                                                                │
│         Empty:                                                                                                │
│           type: object                                                                                        │
│         NewPet:                                                                                               │
│           type: object                                                                                        │
│           properties:                                                                                         │
│             type:                                                                                             │
│               $ref: #/components/PetType                                                                      │
│             price:                                                                                            │
│               type: number                                                                                    │
│         NewPetResponse:                                                                                       │
│           type: object                                                                                        │
│           properties:                                                                                         │
│             pet:                                                                                              │
│               $ref: #/components/Pet                                                                          │
│             message:                                                                                          │
│               type: string                                                                                    │
│         Pet:                                                                                                  │
│           type: object                                                                                        │
│           properties:                                                                                         │
│             id:                                                                                               │
│               type: integer                                                                                   │
│             type:                                                                                             │
│               type: string                                                                                    │
│             price:                                                                                            │
│               type: number                                                                                    │
│         Pets:                                                                                                 │
│           type: array                                                                                         │
│           items:                                                                                              │
│             $ref: #/components/Pet                                                                            │
│         PetType:                                                                                              │
│           type: string                                                                                        │
│           enum:                                                                                               │
│             - "dog"                                                                                           │
│             - "cat"                                                                                           │
│             - "fish"                                                                                          │
│             - "bird"                                                                                          │
│             - "gecko"                                                                                         │
│                                                                                                               │
└───────────────────────────────────────────────────────────────────────────────────────────────────────────────┘


List Summary:
Provider: aws
┌──────────────────────────────────────────────────────────────────────────────────────────────────────────────┐
│ aws                                                                                                          │
├─────────────────────┬────────────────────────────────────────────────────────────────────────────────────────┤
│ APIGateway::RestApi │ PetStore                                                                               │
└─────────────────────┴────────────────────────────────────────────────────────────────────────────────────────┘
1 resource, 1 type, 1 provider
```
