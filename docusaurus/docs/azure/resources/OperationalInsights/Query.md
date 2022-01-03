---
id: Query
title: Query
---
Provides a **Query** from the **OperationalInsights** group
## Examples
### QueryPut
```js
provider.OperationalInsights.makeQuery({
  name: "myQuery",
  properties: () => ({
    properties: {
      displayName: "Exceptions - New in the last 24 hours",
      description: "my description",
      body: "let newExceptionsTimeRange = 1d;\nlet timeRangeToCheckBefore = 7d;\nexceptions\n| where timestamp < ago(timeRangeToCheckBefore)\n| summarize count() by problemId\n| join kind= rightanti (\nexceptions\n| where timestamp >= ago(newExceptionsTimeRange)\n| extend stack = tostring(details[0].rawStack)\n| summarize count(), dcount(user_AuthenticatedId), min(timestamp), max(timestamp), any(stack) by problemId  \n) on problemId \n| order by  count_ desc\n",
      related: { categories: ["analytics"] },
      tags: { "my-label": ["label1"], "my-other-label": ["label2"] },
    },
  }),
  dependencies: ({ resources }) => ({
    resourceGroup: resources.Resources.ResourceGroup["myResourceGroup"],
    queryPack: resources.OperationalInsights.QueryPack["myQueryPack"],
  }),
});

```
## Dependencies
- [ResourceGroup](../Resources/ResourceGroup.md)
- [QueryPack](../OperationalInsights/QueryPack.md)
## Swagger Schema
```js
{
  properties: {
    properties: {
      'x-ms-client-flatten': true,
      description: 'Properties that define an Log Analytics QueryPack-Query resource.',
      'x-ms-azure-resource': true,
      properties: {
        id: {
          type: 'string',
          description: 'The unique ID of your application. This field cannot be changed.',
          readOnly: true
        },
        displayName: {
          type: 'string',
          readOnly: false,
          description: 'Unique display name for your query within the Query Pack.'
        },
        timeCreated: {
          type: 'string',
          readOnly: true,
          description: 'Creation Date for the Log Analytics Query, in ISO 8601 format.',
          format: 'date-time'
        },
        timeModified: {
          type: 'string',
          readOnly: true,
          description: 'Last modified date of the Log Analytics Query, in ISO 8601 format.',
          format: 'date-time'
        },
        author: {
          type: 'string',
          readOnly: true,
          description: 'Object Id of user creating the query.'
        },
        description: {
          type: 'string',
          readOnly: false,
          description: 'Description of the query.'
        },
        body: {
          type: 'string',
          readOnly: false,
          description: 'Body of the query.'
        },
        related: {
          description: 'The related metadata items for the function.',
          type: 'object',
          properties: {
            categories: {
              description: 'The related categories for the function.',
              type: 'array',
              items: { type: 'string' }
            },
            resourceTypes: {
              description: 'The related resource types for the function.',
              type: 'array',
              items: { type: 'string' }
            },
            solutions: {
              description: 'The related Log Analytics solutions for the function.',
              type: 'array',
              items: { type: 'string' }
            }
          }
        },
        tags: {
          description: 'Tags associated with the query.',
          type: 'object',
          additionalProperties: { type: 'array', items: { type: 'string' } }
        },
        properties: {
          type: 'object',
          description: 'Additional properties that can be set for the query.'
        }
      },
      required: [ 'body', 'displayName' ]
    }
  },
  allOf: [
    {
      properties: {
        id: {
          type: 'string',
          readOnly: true,
          description: 'Azure resource Id'
        },
        name: {
          type: 'string',
          readOnly: true,
          description: 'Azure resource name'
        },
        type: {
          type: 'string',
          readOnly: true,
          description: 'Azure resource type'
        },
        systemData: {
          readOnly: true,
          description: 'Read only system data',
          type: 'object',
          properties: {
            createdBy: {
              type: 'string',
              description: 'An identifier for the identity that created the resource'
            },
            createdByType: {
              description: 'The type of identity that created the resource',
              type: 'string',
              enum: [ 'user', 'application', 'managedIdentity', 'key' ],
              'x-ms-enum': { name: 'IdentityType', modelAsString: true }
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
              description: 'The timestamp of resource creation (UTC)'
            },
            lastModifiedBy: {
              type: 'string',
              description: 'An identifier for the identity that last modified the resource'
            },
            lastModifiedByType: {
              description: 'The type of identity that last modified the resource',
              type: 'string',
              enum: [ 'user', 'application', 'managedIdentity', 'key' ],
              'x-ms-enum': { name: 'IdentityType', modelAsString: true }
            },
            lastModifiedAt: {
              type: 'string',
              format: 'date-time',
              description: 'The timestamp of resource last modification (UTC)'
            }
          }
        }
      },
      description: 'An Azure resource QueryPack-Query object'
    }
  ],
  description: 'A Log Analytics QueryPack-Query definition.',
  'x-ms-azure-resource': true
}
```
## Misc
The resource version is `2019-09-01-preview`.

The Swagger schema used to generate this documentation can be found [here](https://github.com/Azure/azure-rest-api-specs/tree/main/specification/operationalinsights/resource-manager/Microsoft.OperationalInsights/preview/2019-09-01-preview/QueryPackQueries_API.json).
