---
id: ContainerService
title: ContainerService
---
Provides a **ContainerService** from the **ContainerService** group
## Examples
### Create/Update Container Service
```js
provider.ContainerService.makeContainerService({
  name: "myContainerService",
  properties: () => ({ location: "location1" }),
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
  allOf: [
    {
      description: 'The Resource model definition.',
      properties: {
        id: { readOnly: true, type: 'string', description: 'Resource Id' },
        name: {
          readOnly: true,
          type: 'string',
          description: 'Resource name'
        },
        type: {
          readOnly: true,
          type: 'string',
          description: 'Resource type'
        },
        location: {
          type: 'string',
          description: 'Resource location',
          'x-ms-mutability': [ 'read', 'create' ]
        },
        tags: {
          type: 'object',
          additionalProperties: { type: 'string' },
          description: 'Resource tags'
        }
      },
      required: [ 'location' ],
      'x-ms-azure-resource': true
    },
    {
      properties: {
        properties: {
          description: 'Properties of the container service.',
          'x-ms-client-flatten': true,
          properties: {
            provisioningState: {
              readOnly: true,
              type: 'string',
              description: 'The current deployment or provisioning state, which only appears in the response.'
            },
            orchestratorProfile: {
              description: 'Profile for the container service orchestrator.',
              properties: {
                orchestratorType: {
                  type: 'string',
                  enum: [
                    'Kubernetes',
                    'Swarm',
                    'DCOS',
                    'DockerCE',
                    'Custom'
                  ],
                  'x-ms-enum': {
                    name: 'ContainerServiceOrchestratorTypes',
                    modelAsString: true
                  },
                  description: 'The orchestrator to use to manage container service cluster resources. Valid values are Kubernetes, Swarm, DCOS, DockerCE and Custom.'
                },
                orchestratorVersion: {
                  type: 'string',
                  description: 'The version of the orchestrator to use. You can specify the major.minor.patch part of the actual version.For example, you can specify version as "1.6.11".'
                }
              },
              required: [ 'orchestratorType' ]
            },
            customProfile: {
              description: 'Properties to configure a custom container service cluster.',
              properties: {
                orchestrator: {
                  type: 'string',
                  description: 'The name of the custom orchestrator to use.'
                }
              },
              required: [ 'orchestrator' ]
            },
            servicePrincipalProfile: {
              description: 'Information about a service principal identity for the cluster to use for manipulating Azure APIs. Exact one of secret or keyVaultSecretRef need to be specified.',
              properties: {
                clientId: {
                  type: 'string',
                  description: 'The ID for the service principal.'
                },
                secret: {
                  type: 'string',
                  description: 'The secret password associated with the service principal in plain text.'
                },
                keyVaultSecretRef: {
                  description: 'Reference to a secret stored in Azure Key Vault.',
                  properties: {
                    vaultID: {
                      type: 'string',
                      description: 'Key vault identifier.'
                    },
                    secretName: { type: 'string', description: 'The secret name.' },
                    version: {
                      type: 'string',
                      description: 'The secret version.'
                    }
                  },
                  required: [ 'vaultID', 'secretName' ]
                }
              },
              required: [ 'clientId' ]
            },
            masterProfile: {
              description: 'Profile for the container service master.',
              properties: {
                count: {
                  type: 'integer',
                  format: 'int32',
                  enum: [ 1, 3, 5 ],
                  'x-ms-enum': { name: 'Count', modelAsString: false },
                  description: 'Number of masters (VMs) in the container service cluster. Allowed values are 1, 3, and 5. The default value is 1.',
                  default: 1
                },
                dnsPrefix: {
                  type: 'string',
                  description: 'DNS prefix to be used to create the FQDN for the master pool.'
                },
                vmSize: {
                  description: 'Size of agent VMs.',
                  type: 'string',
                  'x-ms-enum': {
                    name: 'ContainerServiceVMSizeTypes',
                    modelAsString: true
                  },
                  enum: [
                    'Standard_A1',
                    'Standard_A10',
                    'Standard_A11',
                    'Standard_A1_v2',
                    'Standard_A2',
                    'Standard_A2_v2',
                    'Standard_A2m_v2',
                    'Standard_A3',
                    'Standard_A4',
                    'Standard_A4_v2',
                    'Standard_A4m_v2',
                    'Standard_A5',
                    'Standard_A6',
                    'Standard_A7',
                    'Standard_A8',
                    'Standard_A8_v2',
                    'Standard_A8m_v2',
                    'Standard_A9',
                    'Standard_B2ms',
                    'Standard_B2s',
                    'Standard_B4ms',
                    'Standard_B8ms',
                    'Standard_D1',
                    'Standard_D11',
                    'Standard_D11_v2',
                    'Standard_D11_v2_Promo',
                    'Standard_D12',
                    'Standard_D12_v2',
                    'Standard_D12_v2_Promo',
                    'Standard_D13',
                    'Standard_D13_v2',
                    'Standard_D13_v2_Promo',
                    'Standard_D14',
                    'Standard_D14_v2',
                    'Standard_D14_v2_Promo',
                    'Standard_D15_v2',
                    'Standard_D16_v3',
                    'Standard_D16s_v3',
                    'Standard_D1_v2',
                    'Standard_D2',
                    'Standard_D2_v2',
                    'Standard_D2_v2_Promo',
                    'Standard_D2_v3',
                    'Standard_D2s_v3',
                    'Standard_D3',
                    'Standard_D32_v3',
                    'Standard_D32s_v3',
                    'Standard_D3_v2',
                    'Standard_D3_v2_Promo',
                    'Standard_D4',
                    'Standard_D4_v2',
                    'Standard_D4_v2_Promo',
                    'Standard_D4_v3',
                    'Standard_D4s_v3',
                    'Standard_D5_v2',
                    'Standard_D5_v2_Promo',
                    'Standard_D64_v3',
                    'Standard_D64s_v3',
                    'Standard_D8_v3',
                    'Standard_D8s_v3',
                    'Standard_DS1',
                    'Standard_DS11',
                    'Standard_DS11_v2',
                    'Standard_DS11_v2_Promo',
                    'Standard_DS12',
                    'Standard_DS12_v2',
                    'Standard_DS12_v2_Promo',
                    'Standard_DS13',
                    'Standard_DS13-2_v2',
                    'Standard_DS13-4_v2',
                    'Standard_DS13_v2',
                    'Standard_DS13_v2_Promo',
                    'Standard_DS14',
                    'Standard_DS14-4_v2',
                    'Standard_DS14-8_v2',
                    'Standard_DS14_v2',
                    'Standard_DS14_v2_Promo',
                    'Standard_DS15_v2',
                    'Standard_DS1_v2',
                    'Standard_DS2',
                    'Standard_DS2_v2',
                    'Standard_DS2_v2_Promo',
                    'Standard_DS3',
                    'Standard_DS3_v2',
                    'Standard_DS3_v2_Promo',
                    'Standard_DS4',
                    'Standard_DS4_v2',
                    'Standard_DS4_v2_Promo',
                    'Standard_DS5_v2',
                    'Standard_DS5_v2_Promo',
                    'Standard_E16_v3',
                    'Standard_E16s_v3',
                    'Standard_E2_v3',
                    'Standard_E2s_v3',
                    'Standard_E32-16s_v3',
                    'Standard_E32-8s_v3',
                    'Standard_E32_v3',
                    'Standard_E32s_v3',
                    'Standard_E4_v3',
                    'Standard_E4s_v3',
                    ... 74 more items
                  ]
                },
                osDiskSizeGB: {
                  description: 'OS Disk Size in GB to be used to specify the disk size for every machine in this master/agent pool. If you specify 0, it will apply the default osDisk size according to the vmSize specified.',
                  type: 'integer',
                  format: 'int32',
                  maximum: 1023,
                  minimum: 0
                },
                vnetSubnetID: {
                  description: "VNet SubnetID specifies the VNet's subnet identifier.",
                  type: 'string'
                },
                firstConsecutiveStaticIP: {
                  type: 'string',
                  description: 'FirstConsecutiveStaticIP used to specify the first static ip of masters.',
                  default: '10.240.255.5'
                },
                storageProfile: {
                  description: 'Storage profile specifies what kind of storage used. Choose from StorageAccount and ManagedDisks. Leave it empty, we will choose for you based on the orchestrator choice.',
                  type: 'string',
                  'x-ms-enum': {
                    name: 'ContainerServiceStorageProfileTypes',
                    modelAsString: true
                  },
                  enum: [ 'StorageAccount', 'ManagedDisks' ]
                },
                fqdn: {
                  readOnly: true,
                  type: 'string',
                  description: 'FQDN for the master pool.'
                }
              },
              required: [ 'dnsPrefix', 'vmSize' ]
            },
            agentPoolProfiles: {
              type: 'array',
              items: {
                properties: {
                  name: {
                    type: 'string',
                    description: 'Unique name of the agent pool profile in the context of the subscription and resource group.'
                  },
                  count: {
                    type: 'integer',
                    format: 'int32',
                    maximum: 100,
                    minimum: 1,
                    description: 'Number of agents (VMs) to host docker containers. Allowed values must be in the range of 1 to 100 (inclusive). The default value is 1. ',
                    default: 1
                  },
                  vmSize: {
                    description: 'Size of agent VMs.',
                    type: 'string',
                    'x-ms-enum': {
                      name: 'ContainerServiceVMSizeTypes',
                      modelAsString: true
                    },
                    enum: [
                      'Standard_A1',
                      'Standard_A10',
                      'Standard_A11',
                      'Standard_A1_v2',
                      'Standard_A2',
                      'Standard_A2_v2',
                      'Standard_A2m_v2',
                      'Standard_A3',
                      'Standard_A4',
                      'Standard_A4_v2',
                      'Standard_A4m_v2',
                      'Standard_A5',
                      'Standard_A6',
                      'Standard_A7',
                      'Standard_A8',
                      'Standard_A8_v2',
                      'Standard_A8m_v2',
                      'Standard_A9',
                      'Standard_B2ms',
                      'Standard_B2s',
                      'Standard_B4ms',
                      'Standard_B8ms',
                      'Standard_D1',
                      'Standard_D11',
                      'Standard_D11_v2',
                      'Standard_D11_v2_Promo',
                      'Standard_D12',
                      'Standard_D12_v2',
                      'Standard_D12_v2_Promo',
                      'Standard_D13',
                      'Standard_D13_v2',
                      'Standard_D13_v2_Promo',
                      'Standard_D14',
                      'Standard_D14_v2',
                      'Standard_D14_v2_Promo',
                      'Standard_D15_v2',
                      'Standard_D16_v3',
                      'Standard_D16s_v3',
                      'Standard_D1_v2',
                      'Standard_D2',
                      'Standard_D2_v2',
                      'Standard_D2_v2_Promo',
                      'Standard_D2_v3',
                      'Standard_D2s_v3',
                      'Standard_D3',
                      'Standard_D32_v3',
                      'Standard_D32s_v3',
                      'Standard_D3_v2',
                      'Standard_D3_v2_Promo',
                      'Standard_D4',
                      'Standard_D4_v2',
                      'Standard_D4_v2_Promo',
                      'Standard_D4_v3',
                      'Standard_D4s_v3',
                      'Standard_D5_v2',
                      'Standard_D5_v2_Promo',
                      'Standard_D64_v3',
                      'Standard_D64s_v3',
                      'Standard_D8_v3',
                      'Standard_D8s_v3',
                      'Standard_DS1',
                      'Standard_DS11',
                      'Standard_DS11_v2',
                      'Standard_DS11_v2_Promo',
                      'Standard_DS12',
                      'Standard_DS12_v2',
                      'Standard_DS12_v2_Promo',
                      'Standard_DS13',
                      'Standard_DS13-2_v2',
                      'Standard_DS13-4_v2',
                      'Standard_DS13_v2',
                      'Standard_DS13_v2_Promo',
                      'Standard_DS14',
                      'Standard_DS14-4_v2',
                      'Standard_DS14-8_v2',
                      'Standard_DS14_v2',
                      'Standard_DS14_v2_Promo',
                      'Standard_DS15_v2',
                      'Standard_DS1_v2',
                      'Standard_DS2',
                      'Standard_DS2_v2',
                      'Standard_DS2_v2_Promo',
                      'Standard_DS3',
                      'Standard_DS3_v2',
                      'Standard_DS3_v2_Promo',
                      'Standard_DS4',
                      'Standard_DS4_v2',
                      'Standard_DS4_v2_Promo',
                      'Standard_DS5_v2',
                      'Standard_DS5_v2_Promo',
                      'Standard_E16_v3',
                      'Standard_E16s_v3',
                      'Standard_E2_v3',
                      'Standard_E2s_v3',
                      'Standard_E32-16s_v3',
                      'Standard_E32-8s_v3',
                      'Standard_E32_v3',
                      'Standard_E32s_v3',
                      'Standard_E4_v3',
                      'Standard_E4s_v3',
                      ... 74 more items
                    ]
                  },
                  osDiskSizeGB: {
                    description: 'OS Disk Size in GB to be used to specify the disk size for every machine in this master/agent pool. If you specify 0, it will apply the default osDisk size according to the vmSize specified.',
                    type: 'integer',
                    format: 'int32',
                    maximum: 1023,
                    minimum: 0
                  },
                  dnsPrefix: {
                    type: 'string',
                    description: 'DNS prefix to be used to create the FQDN for the agent pool.'
                  },
                  fqdn: {
                    readOnly: true,
                    type: 'string',
                    description: 'FQDN for the agent pool.'
                  },
                  ports: {
                    type: 'array',
                    items: { type: 'integer', minimum: 1, maximum: 65535 },
                    description: 'Ports number array used to expose on this agent pool. The default opened ports are different based on your choice of orchestrator.'
                  },
                  storageProfile: {
                    description: 'Storage profile specifies what kind of storage used. Choose from StorageAccount and ManagedDisks. Leave it empty, we will choose for you based on the orchestrator choice.',
                    type: 'string',
                    'x-ms-enum': {
                      name: 'ContainerServiceStorageProfileTypes',
                      modelAsString: true
                    },
                    enum: [ 'StorageAccount', 'ManagedDisks' ]
                  },
                  vnetSubnetID: {
                    description: "VNet SubnetID specifies the VNet's subnet identifier.",
                    type: 'string'
                  },
                  osType: {
                    description: 'OsType to be used to specify os type. Choose from Linux and Windows. Default to Linux.',
                    type: 'string',
                    default: 'Linux',
                    enum: [ 'Linux', 'Windows' ],
                    'x-ms-enum': { name: 'OSType', modelAsString: true }
                  }
                },
                required: [ 'name', 'vmSize' ],
                description: 'Profile for the container service agent pool.'
              },
              description: 'Properties of the agent pool.'
            },
            windowsProfile: {
              description: 'Profile for Windows VMs in the container service cluster.',
              properties: {
                adminUsername: {
                  type: 'string',
                  description: 'The administrator username to use for Windows VMs.',
                  pattern: '^[a-zA-Z0-9]+([._]?[a-zA-Z0-9]+)*$'
                },
                adminPassword: {
                  type: 'string',
                  description: 'The administrator password to use for Windows VMs.',
                  pattern: '^(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%\\^&\\*\\(\\)])[a-zA-Z\\d!@#$%\\^&\\*\\(\\)]{12,123}$'
                }
              },
              required: [ 'adminUsername', 'adminPassword' ]
            },
            linuxProfile: {
              description: 'Profile for Linux VMs in the container service cluster.',
              properties: {
                adminUsername: {
                  type: 'string',
                  description: 'The administrator username to use for Linux VMs.',
                  pattern: '^[A-Za-z][-A-Za-z0-9_]*$'
                },
                ssh: {
                  description: 'SSH configuration for Linux-based VMs running on Azure.',
                  properties: {
                    publicKeys: {
                      type: 'array',
                      items: {
                        properties: {
                          keyData: {
                            type: 'string',
                            description: 'Certificate public key used to authenticate with VMs through SSH. The certificate must be in PEM format with or without headers.'
                          }
                        },
                        required: [ 'keyData' ],
                        description: 'Contains information about SSH certificate public key data.'
                      },
                      description: 'The list of SSH public keys used to authenticate with Linux-based VMs. Only expect one key specified.'
                    }
                  },
                  required: [ 'publicKeys' ]
                }
              },
              required: [ 'adminUsername', 'ssh' ]
            },
            diagnosticsProfile: {
              description: 'Profile for diagnostics in the container service cluster.',
              properties: {
                vmDiagnostics: {
                  description: 'Profile for diagnostics on the container service VMs.',
                  properties: {
                    enabled: {
                      type: 'boolean',
                      description: 'Whether the VM diagnostic agent is provisioned on the VM.'
                    },
                    storageUri: {
                      readOnly: true,
                      type: 'string',
                      description: 'The URI of the storage account where diagnostics are stored.'
                    }
                  },
                  required: [ 'enabled' ]
                }
              },
              required: [ 'vmDiagnostics' ]
            }
          },
          required: [ 'orchestratorProfile', 'masterProfile', 'linuxProfile' ]
        }
      }
    }
  ],
  description: 'Container service.'
}
```
## Misc
The resource version is `2017-07-01`.

The Swagger schema used to generate this documentation can be found [here](https://github.com/Azure/azure-rest-api-specs/tree/main/specification/containerservice/resource-manager/Microsoft.ContainerService/stable/2017-07-01/containerService.json).
