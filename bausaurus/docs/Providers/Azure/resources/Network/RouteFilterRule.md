---
id: RouteFilterRule
title: RouteFilterRule
---
Provides a **RouteFilterRule** from the **Network** group
## Examples
### RouteFilterRuleCreate
```js
exports.createResources = () => [
  {
    type: "RouteFilterRule",
    group: "Network",
    name: "myRouteFilterRule",
    properties: () => ({
      properties: {
        access: "Allow",
        routeFilterRuleType: "Community",
        communities: ["12076:5030", "12076:5040"],
      },
    }),
    dependencies: ({}) => ({
      resourceGroup: "myResourceGroup",
      routeFilter: "myRouteFilter",
    }),
  },
];

```
## Dependencies
- [ResourceGroup](../Resources/ResourceGroup.md)
- [RouteFilter](../Network/RouteFilter.md)
## Swagger Schema
```json
{
  properties: {
    properties: {
      'x-ms-client-flatten': true,
      description: 'Properties of the route filter rule.',
      required: [ 'access', 'routeFilterRuleType', 'communities' ],
      properties: {
        access: {
          description: 'The access type of the rule.',
          type: 'string',
          enum: [ 'Allow', 'Deny' ],
          'x-ms-enum': { name: 'Access', modelAsString: true }
        },
        routeFilterRuleType: {
          type: 'string',
          description: 'The rule type of the rule.',
          enum: [ 'Community' ],
          'x-ms-enum': { name: 'RouteFilterRuleType', modelAsString: true }
        },
        communities: {
          type: 'array',
          items: { type: 'string' },
          description: "The collection for bgp community values to filter on. e.g. ['12076:5010','12076:5020']."
        },
        provisioningState: {
          readOnly: true,
          description: 'The provisioning state of the route filter rule resource.',
          type: 'string',
          enum: [ 'Succeeded', 'Updating', 'Deleting', 'Failed' ],
          'x-ms-enum': { name: 'ProvisioningState', modelAsString: true }
        }
      }
    },
    name: {
      type: 'string',
      description: 'The name of the resource that is unique within a resource group. This name can be used to access the resource.'
    },
    location: { type: 'string', description: 'Resource location.' },
    etag: {
      type: 'string',
      readOnly: true,
      description: 'A unique read-only string that changes whenever the resource is updated.'
    }
  },
  allOf: [
    {
      properties: { id: { type: 'string', description: 'Resource ID.' } },
      description: 'Reference to another subresource.',
      'x-ms-azure-resource': true
    }
  ],
  description: 'Route Filter Rule Resource.'
}
```
## Misc
The resource version is `2022-01-01`.

The Swagger schema used to generate this documentation can be found [here](https://github.com/Azure/azure-rest-api-specs/tree/main/specification/network/resource-manager/Microsoft.Network/stable/2022-01-01/routeFilter.json).
