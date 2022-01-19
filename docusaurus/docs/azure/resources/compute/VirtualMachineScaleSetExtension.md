---
id: VirtualMachineScaleSetExtension
title: VirtualMachineScaleSetExtension
---
Provides a **VirtualMachineScaleSetExtension** from the **Compute** group
## Examples
### VirtualMachineScaleSetExtensions_CreateOrUpdate_MaximumSet_Gen
```js
provider.Compute.makeVirtualMachineScaleSetExtension({
  name: "myVirtualMachineScaleSetExtension",
  properties: () => ({
    name: "{extension-name}",
    properties: {
      autoUpgradeMinorVersion: true,
      publisher: "{extension-Publisher}",
      type: "{extension-Type}",
      typeHandlerVersion: "{handler-version}",
      settings: {},
      forceUpdateTag: "aaaaaaaaa",
      enableAutomaticUpgrade: true,
      protectedSettings: {},
      provisionAfterExtensions: ["aa"],
      suppressFailures: true,
    },
  }),
  dependencies: ({ resources }) => ({
    resourceGroup: resources.Resources.ResourceGroup["myResourceGroup"],
    vmScaleSet:
      resources.Compute.VirtualMachineScaleSet["myVirtualMachineScaleSet"],
  }),
});

```

### VirtualMachineScaleSetExtensions_CreateOrUpdate_MinimumSet_Gen
```js
provider.Compute.makeVirtualMachineScaleSetExtension({
  name: "myVirtualMachineScaleSetExtension",
  dependencies: ({ resources }) => ({
    resourceGroup: resources.Resources.ResourceGroup["myResourceGroup"],
    vmScaleSet:
      resources.Compute.VirtualMachineScaleSet["myVirtualMachineScaleSet"],
  }),
});

```
## Dependencies
- [ResourceGroup](../Resources/ResourceGroup.md)
- [VirtualMachineScaleSet](../Compute/VirtualMachineScaleSet.md)
## Swagger Schema
```js
{
  properties: {
    name: { type: 'string', description: 'The name of the extension.' },
    type: { readOnly: true, type: 'string', description: 'Resource type' },
    properties: {
      'x-ms-client-flatten': true,
      properties: {
        forceUpdateTag: {
          type: 'string',
          description: 'If a value is provided and is different from the previous value, the extension handler will be forced to update even if the extension configuration has not changed.'
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
        provisionAfterExtensions: {
          type: 'array',
          items: { type: 'string' },
          description: 'Collection of extension names after which this extension needs to be provisioned.'
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
      description: 'Describes the properties of a Virtual Machine Scale Set Extension.'
    }
  },
  allOf: [
    {
      properties: {
        id: { readOnly: true, type: 'string', description: 'Resource Id' }
      },
      'x-ms-azure-resource': true
    }
  ],
  description: 'Describes a Virtual Machine Scale Set Extension.'
}
```
## Misc
The resource version is `2021-11-01`.

The Swagger schema used to generate this documentation can be found [here](https://github.com/Azure/azure-rest-api-specs/tree/main/specification/compute/resource-manager/Microsoft.Compute/stable/2021-11-01/compute.json).
