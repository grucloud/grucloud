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
## Misc
The resource version is `2021-03-01`.

The Swagger schema used to generate this documentation can be found [here](https://github.com/Azure/azure-rest-api-specs/tree/main/specification/compute/resource-manager/Microsoft.Compute/stable/2021-03-01/cloudService.json).
