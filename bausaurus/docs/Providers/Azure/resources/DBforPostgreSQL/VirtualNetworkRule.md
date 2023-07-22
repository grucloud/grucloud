---
id: VirtualNetworkRule
title: VirtualNetworkRule
---
Provides a **VirtualNetworkRule** from the **DBforPostgreSQL** group
## Examples
### Create or update a virtual network rule
```js
provider.DBforPostgreSQL.makeVirtualNetworkRule({
  name: "myVirtualNetworkRule",
  properties: () => ({
    properties: {
      ignoreMissingVnetServiceEndpoint: false,
      virtualNetworkSubnetId:
        "/subscriptions/ffffffff-ffff-ffff-ffff-ffffffffffff/resourceGroups/TestGroup/providers/Microsoft.Network/virtualNetworks/testvnet/subnets/testsubnet",
    },
  }),
  dependencies: ({ resources }) => ({
    resourceGroup: resources.Resources.ResourceGroup["myResourceGroup"],
    subnet: resources.Network.Subnet["mySubnet"],
    server: resources.DBforPostgreSQL.Server["myServer"],
  }),
});

```
## Dependencies
- [ResourceGroup](../Resources/ResourceGroup.md)
- [Subnet](../Network/Subnet.md)
- [Server](../DBforPostgreSQL/Server.md)
## Swagger Schema
```js
{
  description: 'A virtual network rule.',
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
            }
          },
          'x-ms-azure-resource': true
        }
      ]
    }
  ],
  properties: {
    properties: {
      description: 'Resource properties.',
      'x-ms-client-flatten': true,
      required: [ 'virtualNetworkSubnetId' ],
      type: 'object',
      properties: {
        virtualNetworkSubnetId: {
          description: 'The ARM resource id of the virtual network subnet.',
          type: 'string'
        },
        ignoreMissingVnetServiceEndpoint: {
          description: 'Create firewall rule before the virtual network has vnet service endpoint enabled.',
          type: 'boolean'
        },
        state: {
          description: 'Virtual Network Rule State',
          enum: [
            'Initializing',
            'InProgress',
            'Ready',
            'Deleting',
            'Unknown'
          ],
          type: 'string',
          readOnly: true,
          'x-ms-enum': { name: 'VirtualNetworkRuleState', modelAsString: true }
        }
      }
    }
  }
}
```
## Misc
The resource version is `2017-12-01`.

The Swagger schema used to generate this documentation can be found [here](https://github.com/Azure/azure-rest-api-specs/tree/main/specification/postgresql/resource-manager/Microsoft.DBforPostgreSQL/stable/2017-12-01/postgresql.json).
