---
id: ConfigurationPolicyGroup
title: ConfigurationPolicyGroup
---
Provides a **ConfigurationPolicyGroup** from the **Network** group
## Examples
### ConfigurationPolicyGroupPut
```js
exports.createResources = () => [
  {
    type: "ConfigurationPolicyGroup",
    group: "Network",
    name: "myConfigurationPolicyGroup",
    properties: () => ({
      properties: {
        isDefault: true,
        priority: 0,
        policyMembers: [
          {
            name: "policy1",
            attributeType: "RadiusAzureGroupId",
            attributeValue: "6ad1bd08",
          },
          {
            name: "policy2",
            attributeType: "CertificateGroupId",
            attributeValue: "red.com",
          },
        ],
      },
    }),
    dependencies: ({}) => ({
      resourceGroup: "myResourceGroup",
      vpnServerConfiguration: "myVpnServerConfiguration",
    }),
  },
];

```
## Dependencies
- [ResourceGroup](../Resources/ResourceGroup.md)
- [VpnServerConfiguration](../Network/VpnServerConfiguration.md)
## Swagger Schema
```js
{
  type: 'object',
  properties: {
    properties: {
      'x-ms-client-flatten': true,
      description: 'Properties of the VpnServerConfigurationPolicyGroup.',
      type: 'object',
      properties: {
        isDefault: {
          type: 'boolean',
          description: 'Shows if this is a Default VpnServerConfigurationPolicyGroup or not.'
        },
        priority: {
          type: 'integer',
          format: 'int32',
          description: 'Priority for VpnServerConfigurationPolicyGroup.'
        },
        policyMembers: {
          type: 'array',
          items: {
            properties: {
              name: {
                type: 'string',
                description: 'Name of the VpnServerConfigurationPolicyGroupMember.'
              },
              attributeType: {
                type: 'string',
                description: 'The Vpn Policy member attribute type.',
                enum: [
                  'CertificateGroupId',
                  'AADGroupId',
                  'RadiusAzureGroupId'
                ],
                'x-ms-enum': {
                  name: 'VpnPolicyMemberAttributeType',
                  modelAsString: true
                }
              },
              attributeValue: {
                type: 'string',
                description: 'The value of Attribute used for this VpnServerConfigurationPolicyGroupMember.'
              }
            },
            description: 'VpnServerConfiguration PolicyGroup member',
            type: 'object'
          },
          description: 'Multiple PolicyMembers for VpnServerConfigurationPolicyGroup.',
          'x-ms-identifiers': []
        },
        p2SConnectionConfigurations: {
          type: 'array',
          readOnly: true,
          items: {
            properties: { id: { type: 'string', description: 'Resource ID.' } },
            description: 'Reference to another subresource.',
            'x-ms-azure-resource': true
          },
          description: 'List of references to P2SConnectionConfigurations.'
        },
        provisioningState: {
          readOnly: true,
          description: 'The provisioning state of the VpnServerConfigurationPolicyGroup resource.',
          type: 'string',
          enum: [ 'Succeeded', 'Updating', 'Deleting', 'Failed' ],
          'x-ms-enum': { name: 'ProvisioningState', modelAsString: true }
        }
      }
    },
    etag: {
      type: 'string',
      readOnly: true,
      description: 'A unique read-only string that changes whenever the resource is updated.'
    },
    name: {
      type: 'string',
      description: 'The name of the resource that is unique within a resource group. This name can be used to access the resource.'
    },
    type: { readOnly: true, type: 'string', description: 'Resource type.' }
  },
  allOf: [
    {
      properties: { id: { type: 'string', description: 'Resource ID.' } },
      description: 'Reference to another subresource.',
      'x-ms-azure-resource': true
    }
  ],
  description: 'VpnServerConfigurationPolicyGroup Resource.'
}
```
## Misc
The resource version is `2022-01-01`.

The Swagger schema used to generate this documentation can be found [here](https://github.com/Azure/azure-rest-api-specs/tree/main/specification/network/resource-manager/Microsoft.Network/stable/2022-01-01/virtualWan.json).
