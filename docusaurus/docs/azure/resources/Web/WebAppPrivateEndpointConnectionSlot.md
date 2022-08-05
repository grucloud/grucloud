---
id: WebAppPrivateEndpointConnectionSlot
title: WebAppPrivateEndpointConnectionSlot
---
Provides a **WebAppPrivateEndpointConnectionSlot** from the **Web** group
## Examples
### Approves or rejects a private endpoint connection for a site.
```js
exports.createResources = () => [
  {
    type: "WebAppPrivateEndpointConnectionSlot",
    group: "Web",
    name: "myWebAppPrivateEndpointConnectionSlot",
    properties: () => ({
      properties: {
        privateLinkServiceConnectionState: {
          status: "Approved",
          description: "Approved by admin.",
          actionsRequired: "",
        },
      },
    }),
    dependencies: ({}) => ({
      resourceGroup: "myResourceGroup",
      name: "myWebApp",
      slot: "myWebAppSlot",
    }),
  },
];

```
## Dependencies
- [ResourceGroup](../Resources/ResourceGroup.md)
- [WebApp](../Web/WebApp.md)
- [WebAppSlot](../Web/WebAppSlot.md)
## Swagger Schema
```js
{
  description: 'Private Endpoint Connection Approval ARM resource.',
  type: 'object',
  allOf: [
    {
      description: 'Azure proxy only resource. This resource is not tracked by Azure Resource Manager.',
      type: 'object',
      properties: {
        id: { description: 'Resource Id.', type: 'string', readOnly: true },
        name: {
          description: 'Resource Name.',
          type: 'string',
          readOnly: true
        },
        kind: { description: 'Kind of resource.', type: 'string' },
        type: {
          description: 'Resource type.',
          type: 'string',
          readOnly: true
        }
      },
      'x-ms-azure-resource': true
    }
  ],
  properties: {
    properties: {
      description: 'Core resource properties',
      type: 'object',
      'x-ms-client-flatten': true,
      properties: {
        privateLinkServiceConnectionState: {
          description: 'The state of a private link connection',
          type: 'object',
          properties: {
            status: {
              description: 'Status of a private link connection',
              type: 'string'
            },
            description: {
              description: 'Description of a private link connection',
              type: 'string'
            },
            actionsRequired: {
              description: 'ActionsRequired for a private link connection',
              type: 'string'
            }
          }
        }
      }
    }
  }
}
```
## Misc
The resource version is `2022-03-01`.

The Swagger schema used to generate this documentation can be found [here](https://github.com/Azure/azure-rest-api-specs/tree/main/specification/web/resource-manager/Microsoft.Web/stable/2022-03-01/WebApps.json).
