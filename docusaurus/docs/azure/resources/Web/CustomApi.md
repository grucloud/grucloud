---
id: CustomApi
title: CustomApi
---
Provides a **CustomApi** from the **Web** group
## Examples
### Replace a custom API
```js
provider.Web.makeCustomApi({
  name: "myCustomApi",
  properties: () => ({
    properties: {
      capabilities: [],
      description: "",
      displayName: "testCustomApi",
      iconUri: "/testIcon.svg",
      apiDefinitions: {
        originalSwaggerUrl: "https://tempuri.org/swagger.json",
        swagger: {},
      },
      apiType: "Rest",
    },
    id: "/subscriptions/34adfa4f-cedf-4dc0-ba29-b6d1a69ab345/resourceGroups/testResourceGroup/providers/Microsoft.Web/customApis/testCustomApi",
  }),
  dependencies: ({}) => ({ resourceGroup: "myResourceGroup" }),
});

```
## Dependencies
- [ResourceGroup](../Resources/ResourceGroup.md)
## Swagger Schema
```js
{
  type: 'object',
  description: 'A custom API',
  additionalProperties: false,
  properties: {
    properties: {
      type: 'object',
      description: 'Custom API properties',
      additionalProperties: false,
      properties: {
        connectionParameters: {
          description: 'Connection parameters',
          type: 'object',
          additionalProperties: {
            description: 'Connection provider parameters',
            type: 'object',
            properties: {
              type: {
                description: 'Type of the parameter',
                enum: [
                  'string',
                  'securestring',
                  'secureobject',
                  'int',
                  'bool',
                  'object',
                  'array',
                  'oauthSetting',
                  'connection'
                ],
                type: 'string',
                'x-ms-enum': {
                  name: 'ConnectionParameterType',
                  modelAsString: false
                }
              },
              oAuthSettings: {
                description: 'OAuth settings for the connection provider',
                type: 'object',
                properties: {
                  identityProvider: { description: 'Identity provider', type: 'string' },
                  clientId: {
                    description: 'Resource provider client id',
                    type: 'string'
                  },
                  clientSecret: {
                    description: 'Client Secret needed for OAuth',
                    type: 'string'
                  },
                  scopes: {
                    description: 'OAuth scopes',
                    type: 'array',
                    items: { type: 'string' }
                  },
                  redirectUrl: { description: 'Url', type: 'string' },
                  properties: {
                    type: 'object',
                    description: 'Read only properties for this oauth setting.'
                  },
                  customParameters: {
                    description: 'OAuth parameters key is the name of parameter',
                    type: 'object',
                    additionalProperties: {
                      description: 'OAuth settings for the API',
                      type: 'object',
                      properties: {
                        value: {
                          description: 'Value of the setting',
                          type: 'string'
                        },
                        options: {
                          type: 'object',
                          description: 'Options available to this parameter'
                        },
                        uiDefinition: {
                          type: 'object',
                          description: 'UI definitions per culture as caller can specify the culture'
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        },
        runtimeUrls: {
          type: 'array',
          description: 'Runtime URLs',
          items: { type: 'string' }
        },
        capabilities: {
          type: 'array',
          description: 'The custom API capabilities',
          items: { type: 'string' }
        },
        swagger: {
          type: 'object',
          description: 'The JSON representation of the swagger'
        },
        brandColor: { type: 'string', description: 'Brand color' },
        description: { type: 'string', description: 'The custom API description' },
        displayName: { type: 'string', description: 'The display name' },
        iconUri: { type: 'string', description: 'The icon URI' },
        backendService: {
          type: 'object',
          description: 'The API backend service',
          additionalProperties: false,
          properties: {
            serviceUrl: { type: 'string', description: 'The service URL' }
          }
        },
        apiDefinitions: {
          type: 'object',
          description: 'API Definitions',
          additionalProperties: false,
          properties: {
            originalSwaggerUrl: { type: 'string', description: 'The original swagger URL' },
            modifiedSwaggerUrl: { type: 'string', description: 'The modified swagger URL' }
          }
        },
        apiType: {
          type: 'string',
          description: 'The API type',
          enum: [ 'NotSpecified', 'Rest', 'Soap' ],
          'x-ms-enum': { name: 'ApiType', modelAsString: true }
        },
        wsdlDefinition: {
          type: 'object',
          description: 'The WSDL definition',
          additionalProperties: false,
          properties: {
            url: { type: 'string', description: 'The WSDL URL' },
            content: { type: 'string', description: 'The WSDL content' },
            service: {
              type: 'object',
              description: 'The service with name and endpoint names',
              additionalProperties: false,
              required: [ 'qualifiedName' ],
              properties: {
                qualifiedName: {
                  description: "The service's qualified name",
                  type: 'string'
                },
                endpointQualifiedNames: {
                  type: 'array',
                  description: "List of the endpoints' qualified names",
                  items: { type: 'string' }
                }
              }
            },
            importMethod: {
              type: 'string',
              description: 'The WSDL import method',
              enum: [ 'NotSpecified', 'SoapToRest', 'SoapPassThrough' ],
              'x-ms-enum': { name: 'WsdlImportMethod', modelAsString: true }
            }
          }
        }
      }
    }
  },
  allOf: [
    {
      description: 'A resource',
      type: 'object',
      additionalProperties: false,
      properties: {
        id: { description: 'Resource id', type: 'string', readOnly: true },
        name: {
          description: 'Resource name',
          type: 'string',
          readOnly: true
        },
        type: {
          description: 'Resource type',
          type: 'string',
          readOnly: true
        },
        location: { description: 'Resource location', type: 'string' },
        etag: { description: 'Resource ETag', type: 'string' },
        tags: {
          type: 'object',
          description: 'Resource tags',
          additionalProperties: { type: 'string' },
          example: { SampleTagName: 'SampleTagValue' }
        }
      },
      'x-ms-azure-resource': true
    }
  ]
}
```
## Misc
The resource version is `2016-06-01`.

The Swagger schema used to generate this documentation can be found [here](https://github.com/Azure/azure-rest-api-specs/tree/main/specification/web/resource-manager/Microsoft.Web/stable/2016-06-01/logicAppsManagementClient.json).
