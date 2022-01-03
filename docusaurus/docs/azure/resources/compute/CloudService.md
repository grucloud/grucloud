---
id: CloudService
title: CloudService
---
Provides a **CloudService** from the **Compute** group
## Examples
### Create New Cloud Service with Single Role
```js
provider.Compute.makeCloudService({
  name: "myCloudService",
  properties: () => ({
    location: "westus",
    properties: {
      networkProfile: {
        loadBalancerConfigurations: [
          {
            properties: {
              frontendIPConfigurations: [
                {
                  properties: {
                    publicIPAddress: {
                      id: "/subscriptions/{subscription-id}/resourceGroups/ConstosoRG/providers/Microsoft.Network/publicIPAddresses/myPublicIP",
                    },
                  },
                  name: "myfe",
                },
              ],
            },
            name: "myLoadBalancer",
          },
        ],
      },
      roleProfile: {
        roles: [
          {
            sku: { name: "Standard_D1_v2", capacity: 1, tier: "Standard" },
            name: "ContosoFrontend",
          },
        ],
      },
      configuration: "{ServiceConfiguration}",
      packageUrl: "{PackageUrl}",
      upgradeMode: "Auto",
    },
  }),
  dependencies: ({ resources }) => ({
    resourceGroup: resources.Resources.ResourceGroup["myResourceGroup"],
  }),
});

```

### Create New Cloud Service with Single Role and RDP Extension
```js
provider.Compute.makeCloudService({
  name: "myCloudService",
  properties: () => ({
    properties: {
      extensionProfile: {
        extensions: [
          {
            properties: {
              type: "RDP",
              autoUpgradeMinorVersion: false,
              protectedSettings:
                "<PrivateConfig><Password>{password}</Password></PrivateConfig>",
              publisher: "Microsoft.Windows.Azure.Extensions",
              settings:
                "<PublicConfig><UserName>UserAzure</UserName><Expiration>10/22/2021 15:05:45</Expiration></PublicConfig>",
              typeHandlerVersion: "1.2.1",
            },
            name: "RDPExtension",
          },
        ],
      },
      networkProfile: {
        loadBalancerConfigurations: [
          {
            properties: {
              frontendIPConfigurations: [
                {
                  properties: {
                    publicIPAddress: {
                      id: "/subscriptions/{subscription-id}/resourceGroups/ConstosoRG/providers/Microsoft.Network/publicIPAddresses/contosopublicip",
                    },
                  },
                  name: "contosofe",
                },
              ],
            },
            name: "contosolb",
          },
        ],
      },
      roleProfile: {
        roles: [
          {
            sku: { name: "Standard_D1_v2", capacity: 1, tier: "Standard" },
            name: "ContosoFrontend",
          },
        ],
      },
      configuration: "{ServiceConfiguration}",
      packageUrl: "{PackageUrl}",
      upgradeMode: "Auto",
    },
    location: "westus",
  }),
  dependencies: ({ resources }) => ({
    resourceGroup: resources.Resources.ResourceGroup["myResourceGroup"],
  }),
});

```

### Create New Cloud Service with Multiple Roles
```js
provider.Compute.makeCloudService({
  name: "myCloudService",
  properties: () => ({
    properties: {
      networkProfile: {
        loadBalancerConfigurations: [
          {
            properties: {
              frontendIPConfigurations: [
                {
                  properties: {
                    publicIPAddress: {
                      id: "/subscriptions/{subscription-id}/resourceGroups/ConstosoRG/providers/Microsoft.Network/publicIPAddresses/contosopublicip",
                    },
                  },
                  name: "contosofe",
                },
              ],
            },
            name: "contosolb",
          },
        ],
      },
      roleProfile: {
        roles: [
          {
            sku: { name: "Standard_D1_v2", capacity: 1, tier: "Standard" },
            name: "ContosoFrontend",
          },
          {
            sku: { name: "Standard_D1_v2", capacity: 1, tier: "Standard" },
            name: "ContosoBackend",
          },
        ],
      },
      configuration: "{ServiceConfiguration}",
      packageUrl: "{PackageUrl}",
      upgradeMode: "Auto",
    },
    location: "westus",
  }),
  dependencies: ({ resources }) => ({
    resourceGroup: resources.Resources.ResourceGroup["myResourceGroup"],
  }),
});

```

### Create New Cloud Service with Single Role and Certificate from Key Vault
```js
provider.Compute.makeCloudService({
  name: "myCloudService",
  properties: () => ({
    location: "westus",
    properties: {
      networkProfile: {
        loadBalancerConfigurations: [
          {
            properties: {
              frontendIPConfigurations: [
                {
                  properties: {
                    publicIPAddress: {
                      id: "/subscriptions/{subscription-id}/resourceGroups/ConstosoRG/providers/Microsoft.Network/publicIPAddresses/contosopublicip",
                    },
                  },
                  name: "contosofe",
                },
              ],
            },
            name: "contosolb",
          },
        ],
      },
      osProfile: {
        secrets: [
          {
            sourceVault: {
              id: "/subscriptions/{subscription-id}/resourceGroups/ConstosoRG/providers/Microsoft.KeyVault/vaults/{keyvault-name}",
            },
            vaultCertificates: [
              {
                certificateUrl:
                  "https://{keyvault-name}.vault.azure.net:443/secrets/ContosoCertificate/{secret-id}",
              },
            ],
          },
        ],
      },
      roleProfile: {
        roles: [
          {
            sku: { name: "Standard_D1_v2", capacity: 1, tier: "Standard" },
            name: "ContosoFrontend",
          },
        ],
      },
      configuration: "{ServiceConfiguration}",
      packageUrl: "{PackageUrl}",
      upgradeMode: "Auto",
    },
  }),
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
  description: 'Describes the cloud service.',
  type: 'object',
  properties: {
    id: { description: 'Resource Id.', type: 'string', readOnly: true },
    name: { description: 'Resource name.', type: 'string', readOnly: true },
    type: { description: 'Resource type.', type: 'string', readOnly: true },
    location: { description: 'Resource location.', type: 'string' },
    tags: {
      description: 'Resource tags.',
      type: 'object',
      additionalProperties: { type: 'string' }
    },
    properties: {
      description: 'Cloud service properties',
      type: 'object',
      properties: {
        packageUrl: {
          description: 'Specifies a URL that refers to the location of the service package in the Blob service. The service package URL can be Shared Access Signature (SAS) URI from any storage account.\r\n' +
            'This is a write-only property and is not returned in GET calls.',
          type: 'string'
        },
        configuration: {
          description: 'Specifies the XML service configuration (.cscfg) for the cloud service.',
          type: 'string'
        },
        configurationUrl: {
          description: 'Specifies a URL that refers to the location of the service configuration in the Blob service. The service package URL  can be Shared Access Signature (SAS) URI from any storage account.\r\n' +
            'This is a write-only property and is not returned in GET calls.',
          type: 'string'
        },
        startCloudService: {
          description: '(Optional) Indicates whether to start the cloud service immediately after it is created. The default value is `true`.\r\n' +
            'If false, the service model is still deployed, but the code is not run immediately. Instead, the service is PoweredOff until you call Start, at which time the service will be started. A deployed service still incurs charges, even if it is poweredoff.',
          type: 'boolean'
        },
        allowModelOverride: {
          description: '(Optional) Indicates whether the role sku properties (roleProfile.roles.sku) specified in the model/template should override the role instance count and vm size specified in the .cscfg and .csdef respectively.\r\n' +
            'The default value is `false`.',
          type: 'boolean'
        },
        upgradeMode: {
          description: 'Update mode for the cloud service. Role instances are allocated to update domains when the service is deployed. Updates can be initiated manually in each update domain or initiated automatically in all update domains.\r\n' +
            'Possible Values are <br /><br />**Auto**<br /><br />**Manual** <br /><br />**Simultaneous**<br /><br />\r\n' +
            'If not specified, the default value is Auto. If set to Manual, PUT UpdateDomain must be called to apply the update. If set to Auto, the update is automatically applied to each update domain in sequence.',
          enum: [ 'Auto', 'Manual', 'Simultaneous' ],
          type: 'string',
          'x-ms-enum': { name: 'CloudServiceUpgradeMode', modelAsString: true }
        },
        roleProfile: {
          description: 'Describes the role profile for the cloud service.',
          type: 'object',
          properties: {
            roles: {
              description: 'List of roles for the cloud service.',
              type: 'array',
              items: {
                description: 'Describes the role properties.',
                type: 'object',
                properties: {
                  name: { description: 'Resource name.', type: 'string' },
                  sku: {
                    description: 'Describes the cloud service role sku.',
                    type: 'object',
                    properties: {
                      name: [Object],
                      tier: [Object],
                      capacity: [Object]
                    }
                  }
                }
              }
            }
          }
        },
        osProfile: {
          description: 'Describes the OS profile for the cloud service.',
          type: 'object',
          properties: {
            secrets: {
              description: 'Specifies set of certificates that should be installed onto the role instances.',
              type: 'array',
              items: {
                description: 'Describes a set of certificates which are all in the same Key Vault.',
                type: 'object',
                properties: {
                  sourceVault: {
                    type: 'object',
                    properties: { id: [Object] },
                    'x-ms-azure-resource': true,
                    description: 'The relative URL of the Key Vault containing all of the certificates in VaultCertificates.'
                  },
                  vaultCertificates: {
                    description: 'The list of key vault references in SourceVault which contain certificates.',
                    type: 'array',
                    items: {
                      description: 'Describes a single certificate reference in a Key Vault, and where the certificate should reside on the role instance.',
                      type: 'object',
                      properties: [Object]
                    }
                  }
                }
              }
            }
          }
        },
        networkProfile: {
          description: 'Network Profile for the cloud service.',
          type: 'object',
          properties: {
            loadBalancerConfigurations: {
              description: 'List of Load balancer configurations. Cloud service can have up to two load balancer configurations, corresponding to a Public Load Balancer and an Internal Load Balancer.',
              type: 'array',
              items: {
                description: 'Describes the load balancer configuration.',
                type: 'object',
                properties: {
                  id: { description: 'Resource Id', type: 'string' },
                  name: {
                    description: 'The name of the Load balancer',
                    type: 'string'
                  },
                  properties: {
                    description: 'Properties of the load balancer configuration.',
                    type: 'object',
                    properties: { frontendIPConfigurations: [Object] },
                    required: [ 'frontendIPConfigurations' ]
                  }
                },
                required: [ 'name', 'properties' ]
              }
            },
            swappableCloudService: {
              type: 'object',
              properties: { id: { description: 'Resource Id', type: 'string' } },
              'x-ms-azure-resource': true,
              description: 'The id reference of the cloud service containing the target IP with which the subject cloud service can perform a swap. This property cannot be updated once it is set. The swappable cloud service referred by this id must be present otherwise an error will be thrown.'
            }
          }
        },
        extensionProfile: {
          description: 'Describes a cloud service extension profile.',
          type: 'object',
          properties: {
            extensions: {
              description: 'List of extensions for the cloud service.',
              type: 'array',
              items: {
                description: 'Describes a cloud service Extension.',
                type: 'object',
                properties: {
                  name: {
                    description: 'The name of the extension.',
                    type: 'string'
                  },
                  properties: {
                    description: 'Extension Properties.',
                    type: 'object',
                    properties: {
                      publisher: [Object],
                      type: [Object],
                      typeHandlerVersion: [Object],
                      autoUpgradeMinorVersion: [Object],
                      settings: [Object],
                      protectedSettings: [Object],
                      protectedSettingsFromKeyVault: [Object],
                      forceUpdateTag: [Object],
                      provisioningState: [Object],
                      rolesAppliedTo: [Object]
                    }
                  }
                }
              }
            }
          }
        },
        provisioningState: {
          description: 'The provisioning state, which only appears in the response.',
          type: 'string',
          readOnly: true
        },
        uniqueId: {
          description: 'The unique identifier for the cloud service.',
          type: 'string',
          readOnly: true
        }
      }
    }
  },
  'x-ms-azure-resource': true,
  required: [ 'location' ]
}
```
## Misc
The resource version is `2021-03-01`.

The Swagger schema used to generate this documentation can be found [here](https://github.com/Azure/azure-rest-api-specs/tree/main/specification/compute/resource-manager/Microsoft.Compute/stable/2021-03-01/cloudService.json).
