---
id: VirtualMachineExtension
title: VirtualMachineExtension
---
Provides a **VirtualMachineExtension** from the **Compute** group
## Examples
### VirtualMachineExtensions_CreateOrUpdate_MaximumSet_Gen
```js
exports.createResources = () => [
  {
    type: "VirtualMachineExtension",
    group: "Compute",
    name: "myVirtualMachineExtension",
    properties: () => ({
      location: "westus",
      properties: {
        autoUpgradeMinorVersion: true,
        publisher: "extPublisher",
        type: "extType",
        typeHandlerVersion: "1.2",
        suppressFailures: true,
        settings: {},
        forceUpdateTag: "a",
        enableAutomaticUpgrade: true,
        protectedSettings: {},
        instanceView: {
          name: "aaaaaaaaaaaaaaaaa",
          type: "aaaaaaaaa",
          typeHandlerVersion: "aaaaaaaaaaaaaaaaaaaaaaaaaa",
          substatuses: [
            {
              code: "aaaaaaaaaaaaaaaaaaaaaaa",
              level: "Info",
              displayStatus: "aaaaaa",
              message: "a",
              time: "2021-11-30T12:58:26.522Z",
            },
          ],
          statuses: [
            {
              code: "aaaaaaaaaaaaaaaaaaaaaaa",
              level: "Info",
              displayStatus: "aaaaaa",
              message: "a",
              time: "2021-11-30T12:58:26.522Z",
            },
          ],
        },
      },
      tags: { key9183: "aa" },
    }),
    dependencies: ({}) => ({
      resourceGroup: "myResourceGroup",
      vm: "myVirtualMachine",
    }),
  },
];

```

### VirtualMachineExtensions_CreateOrUpdate_MinimumSet_Gen
```js
exports.createResources = () => [
  {
    type: "VirtualMachineExtension",
    group: "Compute",
    name: "myVirtualMachineExtension",
    properties: () => ({ location: "westus" }),
    dependencies: ({}) => ({
      resourceGroup: "myResourceGroup",
      vm: "myVirtualMachine",
    }),
  },
];

```
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
              'x-ms-identifiers': [],
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
              'x-ms-identifiers': [],
              description: 'The resource status information.'
            }
          }
        },
        suppressFailures: {
          type: 'boolean',
          description: 'Indicates whether failures stemming from the extension will be suppressed (Operational failures such as not connecting to the VM will not be suppressed regardless of this value). The default is false.'
        },
        protectedSettingsFromKeyVault: {
          type: 'object',
          description: 'The extensions protected settings that are passed by reference, and consumed from key vault'
        }
      },
      description: 'Describes the properties of a Virtual Machine Extension.'
    }
  },
  allOf: [
    {
      type: 'object',
      description: 'The Resource model definition with location property as optional.',
      properties: {
        location: { type: 'string', description: 'Resource location' },
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
        tags: {
          type: 'object',
          additionalProperties: { type: 'string' },
          description: 'Resource tags'
        }
      },
      'x-ms-azure-resource': true
    }
  ],
  description: 'Describes a Virtual Machine Extension.'
}
```
## Misc
The resource version is `2022-03-01`.

The Swagger schema used to generate this documentation can be found [here](https://github.com/Azure/azure-rest-api-specs/tree/main/specification/Microsoft.Compute/ComputeRP/stable/2022-03-01/ComputeRP/virtualMachine.json).
