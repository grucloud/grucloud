---
id: Route
title: Route
---
Provides a **Route** from the **Network** group
## Examples
### Create route
```js
provider.Network.makeRoute({
  name: "myRoute",
  properties: () => ({
    properties: {
      addressPrefix: "10.0.3.0/24",
      nextHopType: "VirtualNetworkGateway",
    },
  }),
  dependencies: ({ resources }) => ({
    resourceGroup: resources.Resources.ResourceGroup["myResourceGroup"],
    routeTable: resources.Network.RouteTable["myRouteTable"],
  }),
});

```
## Dependencies
- [ResourceGroup](../Resources/ResourceGroup.md)
- [RouteTable](../Network/RouteTable.md)
## Swagger Schema
```js
{
  properties: {
    properties: {
      'x-ms-client-flatten': true,
      description: 'Properties of the route.',
      properties: {
        addressPrefix: {
          type: 'string',
          description: 'The destination CIDR to which the route applies.'
        },
        nextHopType: {
          description: 'The type of Azure hop the packet should be sent to.',
          type: 'string',
          enum: [
            'VirtualNetworkGateway',
            'VnetLocal',
            'Internet',
            'VirtualAppliance',
            'None'
          ],
          'x-ms-enum': { name: 'RouteNextHopType', modelAsString: true }
        },
        nextHopIpAddress: {
          type: 'string',
          description: 'The IP address packets should be forwarded to. Next hop values are only allowed in routes where the next hop type is VirtualAppliance.'
        },
        provisioningState: {
          readOnly: true,
          description: 'The provisioning state of the route resource.',
          type: 'string',
          enum: [ 'Succeeded', 'Updating', 'Deleting', 'Failed' ],
          'x-ms-enum': { name: 'ProvisioningState', modelAsString: true }
        },
        hasBgpOverride: {
          type: 'boolean',
          description: 'A value indicating whether this route overrides overlapping BGP routes regardless of LPM.'
        }
      },
      required: [ 'nextHopType' ]
    },
    name: {
      type: 'string',
      description: 'The name of the resource that is unique within a resource group. This name can be used to access the resource.'
    },
    etag: {
      readOnly: true,
      type: 'string',
      description: 'A unique read-only string that changes whenever the resource is updated.'
    },
    type: { type: 'string', description: 'The type of the resource.' }
  },
  allOf: [
    {
      properties: { id: { type: 'string', description: 'Resource ID.' } },
      description: 'Reference to another subresource.',
      'x-ms-azure-resource': true
    }
  ],
  description: 'Route resource.'
}
```
## Misc
The resource version is `2021-05-01`.

The Swagger schema used to generate this documentation can be found [here](https://github.com/Azure/azure-rest-api-specs/tree/main/specification/network/resource-manager/Microsoft.Network/stable/2021-05-01/routeTable.json).
