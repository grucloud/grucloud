---
id: NetworkVirtualAppliance
title: NetworkVirtualAppliance
---
Provides a **NetworkVirtualAppliance** from the **Network** group
## Examples
### Create NetworkVirtualAppliance
```js
provider.Network.makeNetworkVirtualAppliance({
  name: "myNetworkVirtualAppliance",
  properties: () => ({
    tags: { key1: "value1" },
    identity: {
      type: "UserAssigned",
      userAssignedIdentities: {
        "/subscriptions/subid/resourcegroups/rg1/providers/Microsoft.ManagedIdentity/userAssignedIdentities/identity1":
          {},
      },
    },
    location: "West US",
    properties: {
      nvaSku: {
        vendor: "Cisco SDWAN",
        bundledScaleUnit: "1",
        marketPlaceVersion: "12.1",
      },
      virtualHub: {
        id: "/subscriptions/subid/resourceGroups/rg1/providers/Microsoft.Network/virtualHubs/hub1",
      },
      bootStrapConfigurationBlobs: [
        "https://csrncvhdstorage1.blob.core.windows.net/csrncvhdstoragecont/csrbootstrapconfig",
      ],
      cloudInitConfigurationBlobs: [
        "https://csrncvhdstorage1.blob.core.windows.net/csrncvhdstoragecont/csrcloudinitconfig",
      ],
      virtualApplianceAsn: 10000,
    },
  }),
  dependencies: ({ resources }) => ({
    resourceGroup: resources.Resources.ResourceGroup["myResourceGroup"],
    managedIdentities: [
      resources.ManagedIdentity.UserAssignedIdentity["myUserAssignedIdentity"],
    ],
    virtualHub: resources.Network.VirtualHub["myVirtualHub"],
  }),
});

```
## Dependencies
- [ResourceGroup](../Resources/ResourceGroup.md)
- [UserAssignedIdentity](../ManagedIdentity/UserAssignedIdentity.md)
- [VirtualHub](../Network/VirtualHub.md)
## Swagger Schema
```js
{
  properties: {
    properties: {
      'x-ms-client-flatten': true,
      description: 'Properties of the Network Virtual Appliance.',
      properties: {
        nvaSku: {
          readOnly: false,
          description: 'Network Virtual Appliance SKU.',
          properties: {
            vendor: {
              type: 'string',
              readOnly: false,
              description: 'Virtual Appliance Vendor.'
            },
            bundledScaleUnit: {
              type: 'string',
              readOnly: false,
              description: 'Virtual Appliance Scale Unit.'
            },
            marketPlaceVersion: {
              type: 'string',
              readOnly: false,
              description: 'Virtual Appliance Version.'
            }
          }
        },
        addressPrefix: {
          type: 'string',
          readOnly: true,
          description: 'Address Prefix.'
        },
        bootStrapConfigurationBlobs: {
          type: 'array',
          readOnly: false,
          description: 'BootStrapConfigurationBlobs storage URLs.',
          items: { type: 'string' }
        },
        virtualHub: {
          readOnly: false,
          description: 'The Virtual Hub where Network Virtual Appliance is being deployed.',
          properties: { id: { type: 'string', description: 'Resource ID.' } },
          'x-ms-azure-resource': true
        },
        cloudInitConfigurationBlobs: {
          type: 'array',
          readOnly: false,
          description: 'CloudInitConfigurationBlob storage URLs.',
          items: { type: 'string' }
        },
        cloudInitConfiguration: {
          type: 'string',
          readOnly: false,
          description: 'CloudInitConfiguration string in plain text.'
        },
        virtualApplianceAsn: {
          type: 'integer',
          readOnly: false,
          format: 'int64',
          minimum: 0,
          maximum: 4294967295,
          description: 'VirtualAppliance ASN.'
        },
        sshPublicKey: {
          type: 'string',
          readOnly: false,
          description: 'Public key for SSH login.'
        },
        virtualApplianceNics: {
          type: 'array',
          readOnly: true,
          description: 'List of Virtual Appliance Network Interfaces.',
          items: {
            properties: {
              name: {
                type: 'string',
                readOnly: true,
                description: 'NIC name.'
              },
              publicIpAddress: {
                type: 'string',
                readOnly: true,
                description: 'Public IP address.'
              },
              privateIpAddress: {
                type: 'string',
                readOnly: true,
                description: 'Private IP address.'
              }
            },
            description: 'Network Virtual Appliance NIC properties.'
          }
        },
        virtualApplianceSites: {
          type: 'array',
          readOnly: true,
          description: 'List of references to VirtualApplianceSite.',
          items: {
            properties: { id: { type: 'string', description: 'Resource ID.' } },
            description: 'Reference to another subresource.',
            'x-ms-azure-resource': true
          }
        },
        inboundSecurityRules: {
          type: 'array',
          readOnly: true,
          description: 'List of references to InboundSecurityRules.',
          items: {
            properties: { id: { type: 'string', description: 'Resource ID.' } },
            description: 'Reference to another subresource.',
            'x-ms-azure-resource': true
          }
        },
        provisioningState: {
          description: 'The provisioning state of the resource.',
          readOnly: true,
          type: 'string',
          enum: [ 'Succeeded', 'Updating', 'Deleting', 'Failed' ],
          'x-ms-enum': { name: 'ProvisioningState', modelAsString: true }
        }
      }
    },
    identity: {
      description: 'The service principal that has read access to cloud-init and config blob.',
      properties: {
        principalId: {
          readOnly: true,
          type: 'string',
          description: 'The principal id of the system assigned identity. This property will only be provided for a system assigned identity.'
        },
        tenantId: {
          readOnly: true,
          type: 'string',
          description: 'The tenant id of the system assigned identity. This property will only be provided for a system assigned identity.'
        },
        type: {
          type: 'string',
          description: "The type of identity used for the resource. The type 'SystemAssigned, UserAssigned' includes both an implicitly created identity and a set of user assigned identities. The type 'None' will remove any identities from the virtual machine.",
          enum: [
            'SystemAssigned',
            'UserAssigned',
            'SystemAssigned, UserAssigned',
            'None'
          ],
          'x-ms-enum': { name: 'ResourceIdentityType', modelAsString: false }
        },
        userAssignedIdentities: {
          type: 'object',
          additionalProperties: {
            type: 'object',
            properties: {
              principalId: {
                readOnly: true,
                type: 'string',
                description: 'The principal id of user assigned identity.'
              },
              clientId: {
                readOnly: true,
                type: 'string',
                description: 'The client id of user assigned identity.'
              }
            }
          },
          description: "The list of user identities associated with resource. The user identity dictionary key references will be ARM resource ids in the form: '/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.ManagedIdentity/userAssignedIdentities/{identityName}'."
        }
      }
    },
    etag: {
      type: 'string',
      readOnly: true,
      description: 'A unique read-only string that changes whenever the resource is updated.'
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
  description: 'NetworkVirtualAppliance Resource.'
}
```
## Misc
The resource version is `2021-05-01`.

The Swagger schema used to generate this documentation can be found [here](https://github.com/Azure/azure-rest-api-specs/tree/main/specification/network/resource-manager/Microsoft.Network/stable/2021-05-01/networkVirtualAppliance.json).
