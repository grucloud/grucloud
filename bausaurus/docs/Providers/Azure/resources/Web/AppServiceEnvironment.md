---
id: AppServiceEnvironment
title: AppServiceEnvironment
---
Provides a **AppServiceEnvironment** from the **Web** group
## Examples
### Create or update an App Service Environment.
```js
exports.createResources = () => [
  {
    type: "AppServiceEnvironment",
    group: "Web",
    name: "myAppServiceEnvironment",
    properties: () => ({
      kind: "Asev3",
      location: "South Central US",
      properties: {
        virtualNetwork: {
          id: "/subscriptions/34adfa4f-cedf-4dc0-ba29-b6d1a69ab345/resourceGroups/test-rg/providers/Microsoft.Network/virtualNetworks/test-vnet/subnets/delegated",
        },
      },
    }),
    dependencies: ({}) => ({
      resourceGroup: "myResourceGroup",
      virtualNetwork: "myVirtualNetwork",
      appServiceEnvironmentAseCustomDnsSuffixConfiguration:
        "myAppServiceEnvironmentAseCustomDnsSuffixConfiguration",
      appServiceEnvironmentAseV3NetworkingConfiguration:
        "myAppServiceEnvironmentAseV3NetworkingConfiguration",
    }),
  },
];

```
## Dependencies
- [ResourceGroup](../Resources/ResourceGroup.md)
- [VirtualNetwork](../Network/VirtualNetwork.md)
- [AppServiceEnvironmentAseCustomDnsSuffixConfiguration](../Web/AppServiceEnvironmentAseCustomDnsSuffixConfiguration.md)
- [AppServiceEnvironmentAseV3NetworkingConfiguration](../Web/AppServiceEnvironmentAseV3NetworkingConfiguration.md)
## Swagger Schema
```json
{
  description: 'App Service Environment ARM resource.',
  type: 'object',
  allOf: [
    {
      description: 'Azure resource. This resource is tracked in Azure Resource Manager',
      required: [ 'location' ],
      type: 'object',
      properties: {
        id: { description: 'Resource Id.', type: 'string', readOnly: true },
        name: {
          description: 'Resource Name.',
          type: 'string',
          readOnly: true
        },
        kind: { description: 'Kind of resource.', type: 'string' },
        location: { description: 'Resource Location.', type: 'string' },
        type: {
          description: 'Resource type.',
          type: 'string',
          readOnly: true
        },
        tags: {
          description: 'Resource tags.',
          type: 'object',
          additionalProperties: { type: 'string' }
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
      required: [ 'virtualNetwork' ],
      properties: {
        provisioningState: {
          description: 'Provisioning state of the App Service Environment.',
          enum: [
            'Succeeded',
            'Failed',
            'Canceled',
            'InProgress',
            'Deleting'
          ],
          type: 'string',
          readOnly: true,
          'x-ms-enum': { name: 'ProvisioningState', modelAsString: false }
        },
        status: {
          description: 'Current status of the App Service Environment.',
          enum: [ 'Preparing', 'Ready', 'Scaling', 'Deleting' ],
          type: 'string',
          readOnly: true,
          'x-ms-enum': { name: 'HostingEnvironmentStatus', modelAsString: false }
        },
        virtualNetwork: {
          description: 'Description of the Virtual Network.',
          required: [ 'id' ],
          type: 'object',
          properties: {
            id: {
              description: 'Resource id of the Virtual Network.',
              type: 'string'
            },
            name: {
              description: 'Name of the Virtual Network (read-only).',
              type: 'string',
              readOnly: true
            },
            type: {
              description: 'Resource type of the Virtual Network (read-only).',
              type: 'string',
              readOnly: true
            },
            subnet: {
              description: 'Subnet within the Virtual Network.',
              type: 'string'
            }
          }
        },
        internalLoadBalancingMode: {
          description: 'Specifies which endpoints to serve internally in the Virtual Network for the App Service Environment.',
          enum: [ 'None', 'Web', 'Publishing', 'Web, Publishing' ],
          type: 'string',
          'x-ms-enum': { name: 'LoadBalancingMode', modelAsString: true }
        },
        multiSize: {
          description: 'Front-end VM size, e.g. "Medium", "Large".',
          type: 'string'
        },
        multiRoleCount: {
          format: 'int32',
          description: 'Number of front-end instances.',
          type: 'integer',
          readOnly: true
        },
        ipsslAddressCount: {
          format: 'int32',
          description: 'Number of IP SSL addresses reserved for the App Service Environment.',
          type: 'integer'
        },
        dnsSuffix: {
          description: 'DNS suffix of the App Service Environment.',
          type: 'string'
        },
        maximumNumberOfMachines: {
          format: 'int32',
          description: 'Maximum number of VMs in the App Service Environment.',
          type: 'integer',
          readOnly: true
        },
        frontEndScaleFactor: {
          format: 'int32',
          description: 'Scale factor for front-ends.',
          type: 'integer'
        },
        suspended: {
          description: '<code>true</code> if the App Service Environment is suspended; otherwise, <code>false</code>. The environment can be suspended, e.g. when the management endpoint is no longer available\n' +
            ' (most likely because NSG blocked the incoming traffic).',
          type: 'boolean',
          readOnly: true
        },
        clusterSettings: {
          description: 'Custom settings for changing the behavior of the App Service Environment.',
          type: 'array',
          items: {
            description: 'Name value pair.',
            type: 'object',
            properties: {
              name: { description: 'Pair name.', type: 'string' },
              value: { description: 'Pair value.', type: 'string' }
            }
          },
          'x-ms-identifiers': [ 'name' ]
        },
        userWhitelistedIpRanges: {
          description: 'User added ip ranges to whitelist on ASE db',
          type: 'array',
          items: { type: 'string' }
        },
        hasLinuxWorkers: {
          description: 'Flag that displays whether an ASE has linux workers or not',
          type: 'boolean',
          readOnly: true
        },
        upgradePreference: {
          description: 'Upgrade Preference',
          default: 'None',
          enum: [ 'None', 'Early', 'Late', 'Manual' ],
          type: 'string',
          'x-ms-enum': {
            name: 'UpgradePreference',
            modelAsString: true,
            values: [
              {
                value: 'None',
                description: 'No preference on when this App Service Environment will be upgraded'
              },
              {
                value: 'Early',
                description: "This App Service Environment will be upgraded before others in the same region that have Upgrade Preference 'Late'"
              },
              {
                value: 'Late',
                description: "This App Service Environment will be upgraded after others in the same region that have Upgrade Preference 'Early'"
              },
              {
                value: 'Manual',
                description: 'ASEv3 only. Once an upgrade is available, this App Service Environment will wait 10 days for the upgrade to be manually initiated. After 10 days the upgrade will begin automatically'
              }
            ]
          }
        },
        dedicatedHostCount: {
          format: 'int32',
          description: 'Dedicated Host Count',
          type: 'integer'
        },
        zoneRedundant: {
          description: 'Whether or not this App Service Environment is zone-redundant.',
          type: 'boolean'
        },
        customDnsSuffixConfiguration: {
          description: 'Full view of the custom domain suffix configuration for ASEv3.',
          type: 'object',
          allOf: [
            {
              description: 'Azure proxy only resource. This resource is not tracked by Azure Resource Manager.',
              type: 'object',
              properties: {
                id: {
                  description: 'Resource Id.',
                  type: 'string',
                  readOnly: true
                },
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
              description: 'CustomDnsSuffixConfiguration resource specific properties',
              type: 'object',
              properties: {
                provisioningState: {
                  enum: [ 'Succeeded', 'Failed', 'Degraded', 'InProgress' ],
                  type: 'string',
                  readOnly: true,
                  'x-ms-enum': {
                    name: 'CustomDnsSuffixProvisioningState',
                    modelAsString: false
                  }
                },
                provisioningDetails: { type: 'string', readOnly: true },
                dnsSuffix: {
                  description: 'The default custom domain suffix to use for all sites deployed on the ASE.',
                  type: 'string'
                },
                certificateUrl: {
                  description: 'The URL referencing the Azure Key Vault certificate secret that should be used as the default SSL/TLS certificate for sites with the custom domain suffix.',
                  type: 'string'
                },
                keyVaultReferenceIdentity: {
                  description: 'The user-assigned identity to use for resolving the key vault certificate reference. If not specified, the system-assigned ASE identity will be used if available.',
                  type: 'string'
                }
              },
              'x-ms-client-flatten': true
            }
          }
        },
        networkingConfiguration: {
          description: 'Full view of networking configuration for an ASE.',
          type: 'object',
          allOf: [
            {
              description: 'Azure proxy only resource. This resource is not tracked by Azure Resource Manager.',
              type: 'object',
              properties: {
                id: {
                  description: 'Resource Id.',
                  type: 'string',
                  readOnly: true
                },
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
              description: 'AseV3NetworkingConfiguration resource specific properties',
              type: 'object',
              properties: {
                windowsOutboundIpAddresses: {
                  type: 'array',
                  items: { type: 'string' },
                  readOnly: true
                },
                linuxOutboundIpAddresses: {
                  type: 'array',
                  items: { type: 'string' },
                  readOnly: true
                },
                externalInboundIpAddresses: {
                  type: 'array',
                  items: { type: 'string' },
                  readOnly: true
                },
                internalInboundIpAddresses: {
                  type: 'array',
                  items: { type: 'string' },
                  readOnly: true
                },
                allowNewPrivateEndpointConnections: {
                  description: 'Property to enable and disable new private endpoint connection creation on ASE',
                  type: 'boolean'
                },
                ftpEnabled: {
                  description: 'Property to enable and disable FTP on ASEV3',
                  type: 'boolean'
                },
                remoteDebugEnabled: {
                  description: 'Property to enable and disable Remote Debug on ASEV3',
                  type: 'boolean'
                },
                inboundIpAddressOverride: {
                  description: 'Customer provided Inbound IP Address. Only able to be set on Ase create.',
                  type: 'string'
                }
              },
              'x-ms-client-flatten': true
            }
          }
        },
        upgradeAvailability: {
          description: 'Whether an upgrade is available for this App Service Environment.',
          enum: [ 'None', 'Ready' ],
          type: 'string',
          readOnly: true,
          'x-ms-enum': {
            name: 'UpgradeAvailability',
            modelAsString: true,
            values: [
              {
                value: 'None',
                description: 'No upgrade is currently available for this App Service Environment'
              },
              {
                value: 'Ready',
                description: 'An upgrade is ready to be manually initiated on this App Service Environment'
              }
            ]
          }
        }
      }
    }
  }
}
```
## Misc
The resource version is `2022-03-01`.

The Swagger schema used to generate this documentation can be found [here](https://github.com/Azure/azure-rest-api-specs/tree/main/specification/web/resource-manager/Microsoft.Web/stable/2022-03-01/AppServiceEnvironments.json).
