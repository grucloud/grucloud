---
id: APIGatewayRestApi
title: RestApi
---

Manages an [API Gateway RestAPI](https://console.aws.amazon.com/apigateway/main/apis).

## Sample code

```js
provider.APIGateway.makeRestApi({
  name: "PetStore",
  properties: ({ config }) => ({
    apiKeySource: "HEADER",
    endpointConfiguration: {
      types: ["REGIONAL"],
    },
    schemaFile: "PetStore.swagger.json",
    deployment: {
      stageName: "dev",
    },
  }),
});
```

## Properties

The property _schemaFile_ specifies the Swagger or OpenAPI api definition.

Every time a new schema is modified and updated, a new deployment is created with property [deployment](https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/clients/client-api-gateway/interfaces/createdeploymentcommandinput.html)

The remaining input properties:

- [createRestApi input](https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/clients/client-api-gateway/interfaces/createrestapicommandinput.html)

## Used By

- [Authorizer](./APIGatewayAuthorizer)
- [Stage](./APIGatewayStage)

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
┌─────────────────────────────────────────────────────────────────────────────────────┐
│ 1 APIGateway::RestApi from aws                                                      │
├─────────────────────────────────────────────────────────────────────────────────────┤
│ name: PetStore                                                                      │
│ managedByUs: Yes                                                                    │
│ live:                                                                               │
│   id: nkyjuu47bg                                                                    │
│   name: PetStore                                                                    │
│   description: Your first API with Amazon API Gateway. This is a sample API that i… │
│   createdDate: 2021-10-08T12:28:14.000Z                                             │
│   apiKeySource: HEADER                                                              │
│   endpointConfiguration:                                                            │
│     types:                                                                          │
│       - "REGIONAL"                                                                  │
│   tags:                                                                             │
│     Name: PetStore                                                                  │
│     gc-created-by-provider: aws                                                     │
│     gc-managed-by: grucloud                                                         │
│     gc-project-name: @grucloud/example-aws-api-gateway-restapi-lambda               │
│     gc-stage: dev                                                                   │
│   disableExecuteApiEndpoint: false                                                  │
│   deployments:                                                                      │
│     - id: w7hub9                                                                    │
│       createdDate: 2021-10-08T12:28:18.000Z                                         │
│   schema:                                                                           │
│     swagger: 2.0                                                                    │
│     info:                                                                           │
│       description: Your first API with Amazon API Gateway. This is a sample API th… │
│       title: PetStore                                                               │
│     schemes:                                                                        │
│       - "https"                                                                     │
│     paths:                                                                          │
│       /:                                                                            │
│         get:                                                                        │
│           consumes:                                                                 │
│             - "application/json"                                                    │
│           produces:                                                                 │
│             - "text/html"                                                           │
│           responses:                                                                │
│             200:                                                                    │
│               description: 200 response                                             │
│               headers:                                                              │
│                 Content-Type:                                                       │
│                   type: string                                                      │
│           x-amazon-apigateway-integration:                                          │
│             type: MOCK                                                              │
│             requestTemplates:                                                       │
│               application/json: {"statusCode": 200}                                 │
│             passthroughBehavior: WHEN_NO_MATCH                                      │
│             responses:                                                              │
│               default:                                                              │
│                 statusCode: 200                                                     │
│                 responseParameters:                                                 │
│                   method.response.header.Content-Type: 'text/html'                  │
│                 responseTemplates:                                                  │
│                   text/html: <html>                                                 │
│     <head>                                                                          │
│         <style>                                                                     │
│         body {                                                                      │
│             color: #333;                                                            │
│             font-family: Sans-serif;                                                │
│             max-width: 800px;                                                       │
│             margin: auto;                                                           │
│         }                                                                           │
│         </style>                                                                    │
│     </head>                                                                         │
│     <body>                                                                          │
│         <h1>Welcome to your Pet Store API</h1>                                      │
│         <p>                                                                         │
│             You have successfully deployed your first API. You are seeing this HTM… │
│         </p>                                                                        │
│         <p>                                                                         │
│             The Pet Store API contains the <code>/pets</code> and <code>/pets/{pet… │
│         </p>                                                                        │
│         <p>                                                                         │
│             You can use a REST client such as <a href="https://www.getpostman.com/… │
│         </p>                                                                        │
│         <pre>                                                                       │
│ {                                                                                   │
│     "type" : "cat",                                                                 │
│     "price" : 123.11                                                                │
│ }                                                                                   │
│         </pre>                                                                      │
│     </body>                                                                         │
│ </html>                                                                             │
│       /pets:                                                                        │
│         get:                                                                        │
│           consumes:                                                                 │
│             - "application/json"                                                    │
│           produces:                                                                 │
│             - "application/json"                                                    │
│           parameters:                                                               │
│             - name: page                                                            │
│               in: query                                                             │
│               required: true                                                        │
│               schema:                                                               │
│                 type: string                                                        │
│             - name: type                                                            │
│               in: query                                                             │
│               required: true                                                        │
│               schema:                                                               │
│                 type: string                                                        │
│           responses:                                                                │
│             200:                                                                    │
│               description: 200 response                                             │
│               schema:                                                               │
│                 $ref: #/definitions/Pets                                            │
│               headers:                                                              │
│                 Access-Control-Allow-Origin:                                        │
│                   type: string                                                      │
│           x-amazon-apigateway-integration:                                          │
│             type: HTTP                                                              │
│             httpMethod: GET                                                         │
│             uri: http://petstore.execute-api.eu-west-2.amazonaws.com/petstore/pets  │
│             requestParameters:                                                      │
│               integration.request.querystring.page: method.request.querystring.page │
│               integration.request.querystring.type: method.request.querystring.type │
│             passthroughBehavior: WHEN_NO_MATCH                                      │
│             responses:                                                              │
│               default:                                                              │
│                 statusCode: 200                                                     │
│                 responseParameters:                                                 │
│                   method.response.header.Access-Control-Allow-Origin: '*'           │
│         options:                                                                    │
│           consumes:                                                                 │
│             - "application/json"                                                    │
│           produces:                                                                 │
│             - "application/json"                                                    │
│           responses:                                                                │
│             200:                                                                    │
│               description: 200 response                                             │
│               schema:                                                               │
│                 $ref: #/definitions/Empty                                           │
│               headers:                                                              │
│                 Access-Control-Allow-Headers:                                       │
│                   type: string                                                      │
│                 Access-Control-Allow-Methods:                                       │
│                   type: string                                                      │
│                 Access-Control-Allow-Origin:                                        │
│                   type: string                                                      │
│           x-amazon-apigateway-integration:                                          │
│             type: MOCK                                                              │
│             requestTemplates:                                                       │
│               application/json: {"statusCode": 200}                                 │
│             passthroughBehavior: WHEN_NO_MATCH                                      │
│             responses:                                                              │
│               default:                                                              │
│                 statusCode: 200                                                     │
│                 responseParameters:                                                 │
│                   method.response.header.Access-Control-Allow-Headers: 'Content-Ty… │
│                   method.response.header.Access-Control-Allow-Methods: 'POST,GET,O… │
│                   method.response.header.Access-Control-Allow-Origin: '*'           │
│         post:                                                                       │
│           operationId: CreatePet                                                    │
│           consumes:                                                                 │
│             - "application/json"                                                    │
│           produces:                                                                 │
│             - "application/json"                                                    │
│           parameters:                                                               │
│             - in: body                                                              │
│               name: NewPet                                                          │
│               required: true                                                        │
│               schema:                                                               │
│                 $ref: #/definitions/NewPet                                          │
│           responses:                                                                │
│             200:                                                                    │
│               description: 200 response                                             │
│               schema:                                                               │
│                 $ref: #/definitions/NewPetResponse                                  │
│               headers:                                                              │
│                 Access-Control-Allow-Origin:                                        │
│                   type: string                                                      │
│           x-amazon-apigateway-integration:                                          │
│             type: HTTP                                                              │
│             httpMethod: POST                                                        │
│             uri: http://petstore.execute-api.eu-west-2.amazonaws.com/petstore/pets  │
│             passthroughBehavior: WHEN_NO_MATCH                                      │
│             responses:                                                              │
│               default:                                                              │
│                 statusCode: 200                                                     │
│                 responseParameters:                                                 │
│                   method.response.header.Access-Control-Allow-Origin: '*'           │
│       /pets/{petId}:                                                                │
│         get:                                                                        │
│           operationId: GetPet                                                       │
│           consumes:                                                                 │
│             - "application/json"                                                    │
│           produces:                                                                 │
│             - "application/json"                                                    │
│           parameters:                                                               │
│             - name: petId                                                           │
│               in: path                                                              │
│               required: true                                                        │
│               schema:                                                               │
│                 type: string                                                        │
│           responses:                                                                │
│             200:                                                                    │
│               description: 200 response                                             │
│               schema:                                                               │
│                 $ref: #/definitions/Pet                                             │
│               headers:                                                              │
│                 Access-Control-Allow-Origin:                                        │
│                   type: string                                                      │
│           x-amazon-apigateway-integration:                                          │
│             type: HTTP                                                              │
│             httpMethod: GET                                                         │
│             uri: http://petstore.execute-api.eu-west-2.amazonaws.com/petstore/pets… │
│             requestParameters:                                                      │
│               integration.request.path.petId: method.request.path.petId             │
│             passthroughBehavior: WHEN_NO_MATCH                                      │
│             responses:                                                              │
│               default:                                                              │
│                 statusCode: 200                                                     │
│                 responseParameters:                                                 │
│                   method.response.header.Access-Control-Allow-Origin: '*'           │
│         options:                                                                    │
│           consumes:                                                                 │
│             - "application/json"                                                    │
│           produces:                                                                 │
│             - "application/json"                                                    │
│           parameters:                                                               │
│             - name: petId                                                           │
│               in: path                                                              │
│               required: true                                                        │
│               type: string                                                          │
│           responses:                                                                │
│             200:                                                                    │
│               description: 200 response                                             │
│               schema:                                                               │
│                 $ref: #/definitions/Empty                                           │
│               headers:                                                              │
│                 Access-Control-Allow-Headers:                                       │
│                   type: string                                                      │
│                 Access-Control-Allow-Methods:                                       │
│                   type: string                                                      │
│                 Access-Control-Allow-Origin:                                        │
│                   type: string                                                      │
│           x-amazon-apigateway-integration:                                          │
│             type: MOCK                                                              │
│             requestTemplates:                                                       │
│               application/json: {"statusCode": 200}                                 │
│             passthroughBehavior: WHEN_NO_MATCH                                      │
│             responses:                                                              │
│               default:                                                              │
│                 statusCode: 200                                                     │
│                 responseParameters:                                                 │
│                   method.response.header.Access-Control-Allow-Headers: 'Content-Ty… │
│                   method.response.header.Access-Control-Allow-Methods: 'GET,OPTION… │
│                   method.response.header.Access-Control-Allow-Origin: '*'           │
│     definitions:                                                                    │
│       Empty:                                                                        │
│         type: object                                                                │
│       NewPet:                                                                       │
│         type: object                                                                │
│         properties:                                                                 │
│           type:                                                                     │
│             $ref: #/definitions/PetType                                             │
│           price:                                                                    │
│             type: number                                                            │
│       NewPetResponse:                                                               │
│         type: object                                                                │
│         properties:                                                                 │
│           pet:                                                                      │
│             $ref: #/definitions/Pet                                                 │
│           message:                                                                  │
│             type: string                                                            │
│       Pet:                                                                          │
│         type: object                                                                │
│         properties:                                                                 │
│           id:                                                                       │
│             type: integer                                                           │
│           type:                                                                     │
│             type: string                                                            │
│           price:                                                                    │
│             type: number                                                            │
│       Pets:                                                                         │
│         type: array                                                                 │
│         items:                                                                      │
│           $ref: #/definitions/Pet                                                   │
│       PetType:                                                                      │
│         type: string                                                                │
│         enum:                                                                       │
│           - "dog"                                                                   │
│           - "cat"                                                                   │
│           - "fish"                                                                  │
│           - "bird"                                                                  │
│           - "gecko"                                                                 │
│                                                                                     │
└─────────────────────────────────────────────────────────────────────────────────────┘


List Summary:
Provider: aws
┌────────────────────────────────────────────────────────────────────────────────────┐
│ aws                                                                                │
├─────────────────────┬──────────────────────────────────────────────────────────────┤
│ APIGateway::RestApi │ PetStore                                                     │
└─────────────────────┴──────────────────────────────────────────────────────────────┘
1 resource, 1 type, 1 provider
Command "gc l -t RestApi" executed in 4s
```
