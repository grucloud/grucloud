---
id: DaprComponent
title: DaprComponent
---
Provides a **DaprComponent** from the **App** group
## Examples
### Create or update dapr component
```js
exports.createResources = () => [
  {
    type: "DaprComponent",
    group: "App",
    name: "myDaprComponent",
    properties: () => ({
      properties: {
        componentType: "state.azure.cosmosdb",
        version: "v1",
        ignoreErrors: false,
        initTimeout: "50s",
        secrets: [{ name: "masterkey", value: "keyvalue" }],
        metadata: [
          { name: "url", value: "<COSMOS-URL>" },
          { name: "database", value: "itemsDB" },
          { name: "collection", value: "items" },
          { name: "masterkey", secretRef: "masterkey" },
        ],
        scopes: ["container-app-1", "container-app-2"],
      },
    }),
    dependencies: ({}) => ({
      resourceGroup: "myResourceGroup",
      environment: "myManagedEnvironment",
    }),
  },
];

```
## Dependencies
- [ResourceGroup](../Resources/ResourceGroup.md)
- [ManagedEnvironment](../App/ManagedEnvironment.md)
## Swagger Schema
```json
{
  description: 'Dapr Component.',
  type: 'object',
  allOf: [
    {
      title: 'Proxy Resource',
      description: 'The resource model definition for a Azure Resource Manager proxy resource. It will not have tags and a location',
      type: 'object',
      allOf: [
        {
          title: 'Resource',
          description: 'Common fields that are returned in the response for all Azure Resource Manager resources',
          type: 'object',
          properties: {
            id: {
              readOnly: true,
              type: 'string',
              description: 'Fully qualified resource ID for the resource. Ex - /subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/{resourceProviderNamespace}/{resourceType}/{resourceName}'
            },
            name: {
              readOnly: true,
              type: 'string',
              description: 'The name of the resource'
            },
            type: {
              readOnly: true,
              type: 'string',
              description: 'The type of the resource. E.g. "Microsoft.Compute/virtualMachines" or "Microsoft.Storage/storageAccounts"'
            },
            systemData: {
              readOnly: true,
              type: 'object',
              description: 'Azure Resource Manager metadata containing createdBy and modifiedBy information.',
              properties: {
                createdBy: {
                  type: 'string',
                  description: 'The identity that created the resource.'
                },
                createdByType: {
                  type: 'string',
                  description: 'The type of identity that created the resource.',
                  enum: [ 'User', 'Application', 'ManagedIdentity', 'Key' ],
                  'x-ms-enum': { name: 'createdByType', modelAsString: true }
                },
                createdAt: {
                  type: 'string',
                  format: 'date-time',
                  description: 'The timestamp of resource creation (UTC).'
                },
                lastModifiedBy: {
                  type: 'string',
                  description: 'The identity that last modified the resource.'
                },
                lastModifiedByType: {
                  type: 'string',
                  description: 'The type of identity that last modified the resource.',
                  enum: [ 'User', 'Application', 'ManagedIdentity', 'Key' ],
                  'x-ms-enum': { name: 'createdByType', modelAsString: true }
                },
                lastModifiedAt: {
                  type: 'string',
                  format: 'date-time',
                  description: 'The timestamp of resource last modification (UTC)'
                }
              }
            }
          },
          'x-ms-azure-resource': true
        }
      ]
    }
  ],
  properties: {
    properties: {
      description: 'Dapr Component resource specific properties',
      type: 'object',
      properties: {
        componentType: { description: 'Component type', type: 'string' },
        version: { description: 'Component version', type: 'string' },
        ignoreErrors: {
          description: 'Boolean describing if the component errors are ignores',
          type: 'boolean'
        },
        initTimeout: { description: 'Initialization timeout', type: 'string' },
        secrets: {
          description: 'Collection of secrets used by a Dapr component',
          type: 'array',
          items: {
            description: 'Secret definition.',
            type: 'object',
            properties: {
              name: { description: 'Secret Name.', type: 'string' },
              value: {
                description: 'Secret Value.',
                type: 'string',
                'x-ms-mutability': [ 'create', 'update' ],
                'x-ms-secret': true
              }
            }
          },
          'x-ms-identifiers': [ 'name' ]
        },
        metadata: {
          description: 'Component metadata',
          type: 'array',
          items: {
            description: 'Dapr component metadata.',
            type: 'object',
            properties: {
              name: {
                description: 'Metadata property name.',
                type: 'string'
              },
              value: {
                description: 'Metadata property value.',
                type: 'string'
              },
              secretRef: {
                description: 'Name of the Dapr Component secret from which to pull the metadata property value.',
                type: 'string'
              }
            }
          },
          'x-ms-identifiers': [ 'name' ]
        },
        scopes: {
          description: 'Names of container apps that can use this Dapr component',
          type: 'array',
          items: { type: 'string' }
        }
      },
      'x-ms-client-flatten': true
    }
  }
}
```
## Misc
The resource version is `2022-03-01`.

The Swagger schema used to generate this documentation can be found [here](https://github.com/Azure/azure-rest-api-specs/tree/main/specification/app/resource-manager/Microsoft.App/stable/2022-03-01/DaprComponents.json).
