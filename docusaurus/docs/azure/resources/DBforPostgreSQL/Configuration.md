---
id: Configuration
title: Configuration
---
Provides a **Configuration** from the **DBforPostgreSQL** group
## Examples
### Update a user configuration
```js
exports.createResources = () => [
  {
    type: "Configuration",
    group: "DBforPostgreSQL",
    name: "myConfiguration",
    properties: () => ({
      properties: { value: "on", source: "user-override" },
    }),
    dependencies: ({}) => ({
      resourceGroup: "myResourceGroup",
      server: "myFlexibleServer",
    }),
  },
];

```
## Dependencies
- [ResourceGroup](../Resources/ResourceGroup.md)
- [FlexibleServer](../DBforPostgreSQL/FlexibleServer.md)
## Swagger Schema
```js
{
  properties: {
    properties: {
      'x-ms-client-flatten': true,
      description: 'The properties of a configuration.',
      properties: {
        value: { type: 'string', description: 'Value of the configuration.' },
        description: {
          type: 'string',
          readOnly: true,
          description: 'Description of the configuration.'
        },
        defaultValue: {
          type: 'string',
          readOnly: true,
          description: 'Default value of the configuration.'
        },
        dataType: {
          type: 'string',
          readOnly: true,
          description: 'Data type of the configuration.',
          enum: [ 'Boolean', 'Numeric', 'Integer', 'Enumeration' ],
          'x-ms-enum': { name: 'ConfigurationDataType', modelAsString: true }
        },
        allowedValues: {
          type: 'string',
          readOnly: true,
          description: 'Allowed values of the configuration.'
        },
        source: { type: 'string', description: 'Source of the configuration.' },
        isDynamicConfig: {
          type: 'boolean',
          readOnly: true,
          description: 'Configuration dynamic or static.'
        },
        isReadOnly: {
          type: 'boolean',
          readOnly: true,
          description: 'Configuration read-only or not.'
        },
        isConfigPendingRestart: {
          type: 'boolean',
          readOnly: true,
          description: 'Configuration is pending restart or not.'
        },
        unit: {
          type: 'string',
          readOnly: true,
          description: 'Configuration unit.'
        },
        documentationLink: {
          type: 'string',
          readOnly: true,
          description: 'Configuration documentation link.'
        }
      }
    },
    systemData: {
      readOnly: true,
      description: 'The system metadata relating to this resource.',
      type: 'object',
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
            }
          },
          'x-ms-azure-resource': true
        }
      ]
    }
  ],
  description: 'Represents a Configuration.'
}
```
## Misc
The resource version is `2021-06-01`.

The Swagger schema used to generate this documentation can be found [here](https://github.com/Azure/azure-rest-api-specs/tree/main/specification/postgresql/resource-manager/Microsoft.DBforPostgreSQL/stable/2021-06-01/postgresql.json).
