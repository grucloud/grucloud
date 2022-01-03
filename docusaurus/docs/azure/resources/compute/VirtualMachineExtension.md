---
id: VirtualMachineExtension
title: VirtualMachineExtension
---
Provides a **VirtualMachineExtension** from the **Compute** group
## Examples
## Dependencies
- [ResourceGroup](../Resources/ResourceGroup.md)
- [VirtualMachine](../Compute/VirtualMachine.md)
## Swagger Schema
```js
{
  properties: {
    properties: {
      'x-ms-client-flatten': true,
      properties: {
        forceUpdateTag: {
          type: 'string',
          description: 'How the extension handler should be forced to update even if the extension configuration has not changed.'
        },
        publisher: {
          type: 'string',
          description: 'The name of the extension handler publisher.'
        },
        type: {
          type: 'string',
          description: 'Specifies the type of the extension; an example is "CustomScriptExtension".'
        },
        typeHandlerVersion: {
          type: 'string',
          description: 'Specifies the version of the script handler.'
        },
        autoUpgradeMinorVersion: {
          type: 'boolean',
          description: 'Indicates whether the extension should use a newer minor version if one is available at deployment time. Once deployed, however, the extension will not upgrade minor versions unless redeployed, even with this property set to true.'
        },
        enableAutomaticUpgrade: {
          type: 'boolean',
          description: 'Indicates whether the extension should be automatically upgraded by the platform if there is a newer version of the extension available.'
        },
        settings: {
          type: 'object',
          description: 'Json formatted public settings for the extension.'
        },
        protectedSettings: {
          type: 'object',
          description: 'The extension can contain either protectedSettings or protectedSettingsFromKeyVault or no protected settings at all.'
        },
        provisioningState: {
          readOnly: true,
          type: 'string',
          description: 'The provisioning state, which only appears in the response.'
        },
        instanceView: {
          description: 'The virtual machine extension instance view.',
          properties: {
            name: {
              type: 'string',
              description: 'The virtual machine extension name.'
            },
            type: {
              type: 'string',
              description: 'Specifies the type of the extension; an example is "CustomScriptExtension".'
            },
            typeHandlerVersion: {
              type: 'string',
              description: 'Specifies the version of the script handler.'
            },
            substatuses: {
              type: 'array',
              items: {
                properties: {
                  code: { type: 'string', description: 'The status code.' },
                  level: {
                    type: 'string',
                    description: 'The level code.',
                    enum: [ 'Info', 'Warning', 'Error' ],
                    'x-ms-enum': { name: 'StatusLevelTypes', modelAsString: false }
                  },
                  displayStatus: {
                    type: 'string',
                    description: 'The short localizable label for the status.'
                  },
                  message: {
                    type: 'string',
                    description: 'The detailed status message, including for alerts and error messages.'
                  },
                  time: {
                    type: 'string',
                    format: 'date-time',
                    description: 'The time of the status.'
                  }
                },
                description: 'Instance view status.'
              },
              description: 'The resource status information.'
            },
            statuses: {
              type: 'array',
              items: {
                properties: {
                  code: { type: 'string', description: 'The status code.' },
                  level: {
                    type: 'string',
                    description: 'The level code.',
                    enum: [ 'Info', 'Warning', 'Error' ],
                    'x-ms-enum': { name: 'StatusLevelTypes', modelAsString: false }
                  },
                  displayStatus: {
                    type: 'string',
                    description: 'The short localizable label for the status.'
                  },
                  message: {
                    type: 'string',
                    description: 'The detailed status message, including for alerts and error messages.'
                  },
                  time: {
                    type: 'string',
                    format: 'date-time',
                    description: 'The time of the status.'
                  }
                },
                description: 'Instance view status.'
              },
              description: 'The resource status information.'
            }
          }
        },
        suppressFailures: {
          type: 'boolean',
          description: 'Indicates whether failures stemming from the extension will be suppressed (Operational failures such as not connecting to the VM will not be suppressed regardless of this value). The default is false.'
        }
      },
      description: 'Describes the properties of a Virtual Machine Extension.'
    }
  },
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
        location: { type: 'string', description: 'Resource location' },
        tags: {
          type: 'object',
          additionalProperties: { type: 'string' },
          description: 'Resource tags'
        }
      },
      required: [ 'location' ],
      'x-ms-azure-resource': true
    }
  ],
  description: 'Describes a Virtual Machine Extension.'
}
```
## Misc
The resource version is `2021-07-01`.

The Swagger schema used to generate this documentation can be found [here](https://github.com/Azure/azure-rest-api-specs/tree/main/specification/compute/resource-manager/Microsoft.Compute/stable/2021-07-01/compute.json).
