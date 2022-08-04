---
id: AppServiceEnvironmentAseCustomDnsSuffixConfiguration
title: AppServiceEnvironmentAseCustomDnsSuffixConfiguration
---
Provides a **AppServiceEnvironmentAseCustomDnsSuffixConfiguration** from the **Web** group
## Examples
### Update ASE custom DNS suffix configuration
```js
exports.createResources = () => [
  {
    type: "AppServiceEnvironmentAseCustomDnsSuffixConfiguration",
    group: "Web",
    name: "myAppServiceEnvironmentAseCustomDnsSuffixConfiguration",
    properties: () => ({
      properties: {
        dnsSuffix: "contoso.com",
        certificateUrl: "https://test-kv.vault.azure.net/secrets/contosocert",
        keyVaultReferenceIdentity:
          "/subscriptions/34adfa4f-cedf-4dc0-ba29-b6d1a69ab345/resourcegroups/test-rg/providers/microsoft.managedidentity/userassignedidentities/test-user-mi",
      },
    }),
    dependencies: ({}) => ({
      resourceGroup: "myResourceGroup",
      name: "myAppServiceEnvironment",
    }),
  },
];

```
## Dependencies
- [ResourceGroup](../Resources/ResourceGroup.md)
- [AppServiceEnvironment](../Web/AppServiceEnvironment.md)
## Swagger Schema
```js
{
  description: 'Full view of the custom domain suffix configuration for ASEv3.',
  type: 'object',
  allOf: [
    {
      description: 'Azure proxy only resource. This resource is not tracked by Azure Resource Manager.',
      type: 'object',
      properties: {
        id: { description: 'Resource Id.', type: 'string', readOnly: true },
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
}
```
## Misc
The resource version is `2022-03-01`.

The Swagger schema used to generate this documentation can be found [here](https://github.com/Azure/azure-rest-api-specs/tree/main/specification/web/resource-manager/Microsoft.Web/stable/2022-03-01/AppServiceEnvironments.json).
