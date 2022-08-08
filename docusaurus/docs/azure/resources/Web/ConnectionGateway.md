---
id: ConnectionGateway
title: ConnectionGateway
---
Provides a **ConnectionGateway** from the **Web** group
## Examples
### Replace a connection gateway definition
```js
exports.createResources = () => [
  {
    type: "ConnectionGateway",
    group: "Web",
    name: "myConnectionGateway",
    properties: () => ({
      properties: {
        connectionGatewayInstallation: {
          id: "/subscriptions/34adfa4f-cedf-4dc0-ba29-b6d1a69ab345/providers/Microsoft.Web/locations/westus/connectionGatewayInstallations/865dccd1-5d5c-45fe-b5a0-249d4de4134c",
        },
        contactInformation: ["test123@microsoft.com"],
        displayName: "test123",
        machineName: "TEST123",
        status: "Installed",
        backendUri: "https://WABI-WEST-US-redirect.analysis.windows.net",
      },
      id: "/subscriptions/34adfa4f-cedf-4dc0-ba29-b6d1a69ab345/resourceGroups/testResourceGroup/providers/Microsoft.Web/connectionGateways/test123",
    }),
    dependencies: ({}) => ({
      resourceGroup: "myResourceGroup",
      connection: "myConnection",
    }),
  },
];

```
## Dependencies
- [ResourceGroup](../Resources/ResourceGroup.md)
- [Connection](../Web/Connection.md)
## Swagger Schema
```js
{
  description: 'The gateway definition',
  type: 'object',
  additionalProperties: false,
  properties: {
    properties: {
      properties: {
        connectionGatewayInstallation: {
          description: 'The gateway installation reference',
          type: 'object',
          properties: {
            location: {
              description: 'Resource reference location',
              type: 'string'
            },
            name: { description: 'Resource reference name', type: 'string' }
          },
          allOf: [
            {
              type: 'object',
              'x-abstract': true,
              additionalProperties: false,
              properties: {
                id: {
                  description: 'Resource reference id',
                  type: 'string'
                },
                type: {
                  description: 'Resource reference type',
                  type: 'string'
                }
              }
            }
          ]
        },
        contactInformation: {
          description: 'The gateway admin',
          type: 'array',
          items: { type: 'string' }
        },
        displayName: { description: 'The gateway display name', type: 'string' },
        description: { description: 'The gateway description', type: 'string' },
        machineName: {
          description: 'The machine name of the gateway',
          type: 'string'
        },
        status: { description: 'The gateway status', type: 'object' },
        backendUri: { description: 'The URI of the backend', type: 'string' }
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
