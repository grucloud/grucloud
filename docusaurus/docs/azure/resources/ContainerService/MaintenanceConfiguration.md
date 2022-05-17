---
id: MaintenanceConfiguration
title: MaintenanceConfiguration
---
Provides a **MaintenanceConfiguration** from the **ContainerService** group
## Examples
### Create/Update Maintenance Configuration
```js
exports.createResources = () => [
  {
    type: "MaintenanceConfiguration",
    group: "ContainerService",
    name: "myMaintenanceConfiguration",
    properties: () => ({
      properties: {
        timeInWeek: [{ day: "Monday", hourSlots: [1, 2] }],
        notAllowedTime: [
          { start: "2020-11-26T03:00:00Z", end: "2020-11-30T12:00:00Z" },
        ],
      },
    }),
    dependencies: ({}) => ({
      resourceGroup: "myResourceGroup",
      resource: "myManagedCluster",
    }),
  },
];

```
## Dependencies
- [ResourceGroup](../Resources/ResourceGroup.md)
- [ManagedCluster](../ContainerService/ManagedCluster.md)
## Swagger Schema
```js
{
  type: 'object',
  allOf: [
    {
      type: 'object',
      properties: {
        id: { readOnly: true, type: 'string', description: 'Resource ID.' },
        name: {
          readOnly: true,
          type: 'string',
          description: 'The name of the resource that is unique within a resource group. This name can be used to access the resource.'
        },
        type: {
          readOnly: true,
          type: 'string',
          description: 'Resource type'
        }
      },
      description: 'Reference to another subresource.',
      'x-ms-azure-resource': true
    }
  ],
  properties: {
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
    },
    properties: {
      description: 'Properties of a default maintenance configuration.',
      'x-ms-client-flatten': true,
      type: 'object',
      properties: {
        timeInWeek: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              day: {
                description: 'The day of the week.',
                type: 'string',
                enum: [
                  'Sunday',
                  'Monday',
                  'Tuesday',
                  'Wednesday',
                  'Thursday',
                  'Friday',
                  'Saturday'
                ],
                'x-ms-enum': { name: 'WeekDay', modelAsString: true }
              },
              hourSlots: {
                type: 'array',
                items: {
                  type: 'integer',
                  format: 'int32',
                  maximum: 23,
                  minimum: 0,
                  description: 'Hour in a day.'
                },
                title: 'A list of hours in the day used to identify a time range.',
                description: 'Each integer hour represents a time range beginning at 0m after the hour ending at the next hour (non-inclusive). 0 corresponds to 00:00 UTC, 23 corresponds to 23:00 UTC. Specifying [0, 1] means the 00:00 - 02:00 UTC time range.'
              }
            },
            description: 'Time in a week.'
          },
          title: 'Time slots during the week when planned maintenance is allowed to proceed.',
          description: 'If two array entries specify the same day of the week, the applied configuration is the union of times in both entries.'
        },
        notAllowedTime: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              start: {
                type: 'string',
                format: 'date-time',
                description: 'The start of a time span'
              },
              end: {
                type: 'string',
                format: 'date-time',
                description: 'The end of a time span'
              }
            },
            title: 'A time range.',
            description: 'For example, between 2021-05-25T13:00:00Z and 2021-05-25T14:00:00Z.'
          },
          description: 'Time slots on which upgrade is not allowed.'
        }
      }
    }
  },
  title: 'Planned maintenance configuration, used to configure when updates can be deployed to a Managed Cluster.',
  description: 'See [planned maintenance](https://docs.microsoft.com/azure/aks/planned-maintenance) for more information about planned maintenance.'
}
```
## Misc
The resource version is `2022-04-02-preview`.

The Swagger schema used to generate this documentation can be found [here](https://github.com/Azure/azure-rest-api-specs/tree/main/specification/containerservice/resource-manager/Microsoft.ContainerService/preview/2022-04-02-preview/managedClusters.json).
