---
id: CustomIPPrefix
title: CustomIPPrefix
---
Provides a **CustomIPPrefix** from the **Network** group
## Examples
### Create custom IP prefix allocation method
```js
provider.Network.makeCustomIPPrefix({
  name: "myCustomIPPrefix",
  properties: () => ["1"],
  dependencies: ({ resources }) => ({
    resourceGroup: resources.Resources.ResourceGroup["myResourceGroup"],
  }),
});

```
## Dependencies
- [ResourceGroup](../Resources/ResourceGroup.md)
## Swagger Schema
```js
{
  properties: {
    extendedLocation: {
      description: 'The extended location of the custom IP prefix.',
      properties: {
        name: {
          type: 'string',
          description: 'The name of the extended location.'
        },
        type: {
          description: 'The type of the extended location.',
          type: 'string',
          enum: [ 'EdgeZone' ],
          'x-ms-enum': { name: 'ExtendedLocationTypes', modelAsString: true }
        }
      }
    },
    properties: {
      'x-ms-client-flatten': true,
      description: 'Custom IP prefix properties.',
      properties: {
        cidr: {
          type: 'string',
          description: 'The prefix range in CIDR notation. Should include the start address and the prefix length.'
        },
        signedMessage: {
          type: 'string',
          description: 'Signed message for WAN validation.'
        },
        authorizationMessage: {
          type: 'string',
          description: 'Authorization message for WAN validation.'
        },
        customIpPrefixParent: {
          description: 'The Parent CustomIpPrefix for IPv6 /64 CustomIpPrefix.',
          properties: { id: { type: 'string', description: 'Resource ID.' } },
          'x-ms-azure-resource': true
        },
        childCustomIpPrefixes: {
          readOnly: true,
          type: 'array',
          items: {
            properties: { id: { type: 'string', description: 'Resource ID.' } },
            description: 'Reference to another subresource.',
            'x-ms-azure-resource': true
          },
          description: 'The list of all Children for IPv6 /48 CustomIpPrefix.'
        },
        commissionedState: {
          type: 'string',
          description: 'The commissioned state of the Custom IP Prefix.',
          enum: [
            'Provisioning',
            'Provisioned',
            'Commissioning',
            'Commissioned',
            'Decommissioning',
            'Deprovisioning'
          ],
          'x-ms-enum': { name: 'CommissionedState', modelAsString: true }
        },
        publicIpPrefixes: {
          readOnly: true,
          type: 'array',
          items: {
            properties: { id: { type: 'string', description: 'Resource ID.' } },
            description: 'Reference to another subresource.',
            'x-ms-azure-resource': true
          },
          description: 'The list of all referenced PublicIpPrefixes.'
        },
        resourceGuid: {
          readOnly: true,
          type: 'string',
          description: 'The resource GUID property of the custom IP prefix resource.'
        },
        failedReason: {
          readOnly: true,
          type: 'string',
          description: 'The reason why resource is in failed state.'
        },
        provisioningState: {
          readOnly: true,
          description: 'The provisioning state of the custom IP prefix resource.',
          type: 'string',
          enum: [ 'Succeeded', 'Updating', 'Deleting', 'Failed' ],
          'x-ms-enum': { name: 'ProvisioningState', modelAsString: true }
        }
      }
    },
    etag: {
      readOnly: true,
      type: 'string',
      description: 'A unique read-only string that changes whenever the resource is updated.'
    },
    zones: {
      type: 'array',
      items: { type: 'string' },
      description: 'A list of availability zones denoting the IP allocated for the resource needs to come from.'
    }
  },
  allOf: [
    {
      properties: {
        id: { type: 'string', description: 'Resource ID.' },
        name: {
          readOnly: true,
          type: 'string',
          description: 'Resource name.'
        },
        type: {
          readOnly: true,
          type: 'string',
          description: 'Resource type.'
        },
        location: { type: 'string', description: 'Resource location.' },
        tags: {
          type: 'object',
          additionalProperties: { type: 'string' },
          description: 'Resource tags.'
        }
      },
      description: 'Common resource representation.',
      'x-ms-azure-resource': true
    }
  ],
  description: 'Custom IP prefix resource.'
}
```
## Misc
The resource version is `2021-05-01`.

The Swagger schema used to generate this documentation can be found [here](https://github.com/Azure/azure-rest-api-specs/tree/main/specification/network/resource-manager/Microsoft.Network/stable/2021-05-01/customIpPrefix.json).
