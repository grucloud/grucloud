module.exports = ({ stage }) => ({
  projectName: "api-gateway-restapi-lambda",
  APIGateway: {
    RestApi: {
      petStore: {
        name: "PetStore",
        properties: {
          description:
            "Your first API with Amazon API Gateway. This is a sample API that integrates via HTTP with our demo Pet Store endpoints",
          apiKeySource: "HEADER",
          endpointConfiguration: {
            types: ["REGIONAL"],
          },
          disableExecuteApiEndpoint: false,
        },
      },
    },
    Authorizer: {
      myAuthorizer: {
        name: "my-authorizer",
      },
    },
    Model: {
      empty: {
        name: "Empty",
        properties: {
          schema: {
            type: "object",
          },
          contentType: "application/json",
        },
      },
      newPet: {
        name: "NewPet",
        properties: {
          schema: {
            type: "object",
            properties: {
              type: {
                $ref: "https://apigateway.amazonaws.com/restapis/ersnowmgbk/models/PetType",
              },
              price: {
                type: "number",
              },
            },
          },
          contentType: "application/json",
        },
      },
      newPetResponse: {
        name: "NewPetResponse",
        properties: {
          schema: {
            type: "object",
            properties: {
              pet: {
                $ref: "https://apigateway.amazonaws.com/restapis/ersnowmgbk/models/Pet",
              },
              message: {
                type: "string",
              },
            },
          },
          contentType: "application/json",
        },
      },
      pet: {
        name: "Pet",
        properties: {
          schema: {
            type: "object",
            properties: {
              id: {
                type: "integer",
              },
              type: {
                type: "string",
              },
              price: {
                type: "number",
              },
            },
          },
          contentType: "application/json",
        },
      },
      pets: {
        name: "Pets",
        properties: {
          schema: {
            type: "array",
            items: {
              $ref: "https://apigateway.amazonaws.com/restapis/ersnowmgbk/models/Pet",
            },
          },
          contentType: "application/json",
        },
      },
      petType: {
        name: "PetType",
        properties: {
          schema: {
            type: "string",
            enum: ["dog", "cat", "fish", "bird", "gecko"],
          },
          contentType: "application/json",
        },
      },
    },
    Resource: {
      petStore: {
        name: "PetStore_/",
      },
      petStorePets: {
        name: "PetStore_/pets",
      },
      petStorePetsPetId: {
        name: "PetStore_/pets/{petId}",
      },
    },
    Method: {
      createPet: {
        name: "CreatePet",
        properties: {
          httpMethod: "POST",
          authorizationType: "NONE",
          apiKeyRequired: false,
          methodResponses: {
            200: {
              statusCode: "200",
              responseParameters: {
                "method.response.header.Access-Control-Allow-Origin": false,
              },
              responseModels: {
                "application/json": "NewPetResponse",
              },
            },
          },
          methodIntegration: {
            type: "HTTP",
            httpMethod: "POST",
            connectionType: "INTERNET",
            passthroughBehavior: "WHEN_NO_MATCH",
            timeoutInMillis: 29000,
            cacheKeyParameters: [],
            integrationResponses: {
              200: {
                statusCode: "200",
                responseParameters: {
                  "method.response.header.Access-Control-Allow-Origin": "'*'",
                },
              },
            },
          },
          description: "",
        },
      },
      getPet: {
        name: "GetPet",
        properties: {
          httpMethod: "GET",
          authorizationType: "NONE",
          apiKeyRequired: false,
          methodResponses: {
            200: {
              statusCode: "200",
              responseParameters: {
                "method.response.header.Access-Control-Allow-Origin": false,
              },
              responseModels: {
                "application/json": "Pet",
              },
            },
          },
          methodIntegration: {
            type: "HTTP",
            httpMethod: "GET",
            connectionType: "INTERNET",
            requestParameters: {
              "integration.request.path.petId": "method.request.path.petId",
            },
            passthroughBehavior: "WHEN_NO_MATCH",
            timeoutInMillis: 29000,
            cacheKeyParameters: [],
            integrationResponses: {
              200: {
                statusCode: "200",
                responseParameters: {
                  "method.response.header.Access-Control-Allow-Origin": "'*'",
                },
              },
            },
          },
          description: "",
        },
      },
      petStoreGet: {
        name: "PetStore_/_GET",
        properties: {
          httpMethod: "GET",
          authorizationType: "NONE",
          apiKeyRequired: false,
          methodResponses: {
            200: {
              statusCode: "200",
              responseParameters: {
                "method.response.header.Content-Type": false,
              },
            },
          },
          methodIntegration: {
            type: "MOCK",
            requestTemplates: {
              "application/json": '{"statusCode": 200}',
            },
            passthroughBehavior: "WHEN_NO_MATCH",
            timeoutInMillis: 29000,
            cacheKeyParameters: [],
            integrationResponses: {
              200: {
                statusCode: "200",
                responseParameters: {
                  "method.response.header.Content-Type": "'text/html'",
                },
                responseTemplates: {
                  "text/html":
                    '<html>\n    <head>\n        <style>\n        body {\n            color: #333;\n            font-family: Sans-serif;\n            max-width: 800px;\n            margin: auto;\n        }\n        </style>\n    </head>\n    <body>\n        <h1>Welcome to your Pet Store API</h1>\n        <p>\n            You have successfully deployed your first API. You are seeing this HTML page because the <code>GET</code> method to the root resource of your API returns this content as a Mock integration.\n        </p>\n        <p>\n            The Pet Store API contains the <code>/pets</code> and <code>/pets/{petId}</code> resources. By making a <a href="/$context.stage/pets/" target="_blank"><code>GET</code> request</a> to <code>/pets</code> you can retrieve a list of Pets in your API. If you are looking for a specific pet, for example the pet with ID 1, you can make a <a href="/$context.stage/pets/1" target="_blank"><code>GET</code> request</a> to <code>/pets/1</code>.\n        </p>\n        <p>\n            You can use a REST client such as <a href="https://www.getpostman.com/" target="_blank">Postman</a> to test the <code>POST</code> methods in your API to create a new pet. Use the sample body below to send the <code>POST</code> request:\n        </p>\n        <pre>\n{\n    "type" : "cat",\n    "price" : 123.11\n}\n        </pre>\n    </body>\n</html>',
                },
              },
            },
          },
          description: "",
        },
      },
      petStorePetsGet: {
        name: "PetStore_/pets_GET",
        properties: {
          httpMethod: "GET",
          authorizationType: "AWS_IAM",
          apiKeyRequired: false,
          methodResponses: {
            200: {
              statusCode: "200",
              responseParameters: {
                "method.response.header.Access-Control-Allow-Origin": false,
              },
              responseModels: {
                "application/json": "Pets",
              },
            },
          },
          methodIntegration: {
            type: "HTTP",
            httpMethod: "GET",
            connectionType: "INTERNET",
            requestParameters: {
              "integration.request.querystring.page":
                "method.request.querystring.page",
              "integration.request.querystring.type":
                "method.request.querystring.type",
            },
            passthroughBehavior: "WHEN_NO_MATCH",
            timeoutInMillis: 29000,
            cacheKeyParameters: [],
            integrationResponses: {
              200: {
                statusCode: "200",
                responseParameters: {
                  "method.response.header.Access-Control-Allow-Origin": "'*'",
                },
              },
            },
          },
          description: "",
        },
      },
    },
    Stage: {
      dev: {
        name: "dev",
      },
    },
  },
});
