---
id: OpenShiftManagedCluster
title: OpenShiftManagedCluster
---
Provides a **OpenShiftManagedCluster** from the **ContainerService** group
## Examples
### Create/Update OpenShift Managed Cluster
```js
provider.ContainerService.makeOpenShiftManagedCluster({
  name: "myOpenShiftManagedCluster",
  properties: () => ({
    location: "location1",
    tags: { tier: "production", archv2: "" },
    properties: {
      openShiftVersion: "v3.11",
      networkProfile: { vnetCidr: "10.0.0.0/8" },
      masterPoolProfile: {
        name: "master",
        count: 3,
        vmSize: "Standard_D4s_v3",
        osType: "Linux",
        subnetCidr: "10.0.0.0/24",
      },
      agentPoolProfiles: [
        {
          name: "infra",
          role: "infra",
          count: 2,
          vmSize: "Standard_D4s_v3",
          osType: "Linux",
          subnetCidr: "10.0.0.0/24",
        },
        {
          name: "compute",
          role: "compute",
          count: 4,
          vmSize: "Standard_D4s_v3",
          osType: "Linux",
          subnetCidr: "10.0.0.0/24",
        },
      ],
      routerProfiles: [{ name: "default" }],
      authProfile: {
        identityProviders: [
          {
            name: "Azure AD",
            provider: {
              kind: "AADIdentityProvider",
              clientId: "clientId",
              secret: "secret",
              tenantId: "tenantId",
              customerAdminGroupId: "customerAdminGroupId",
            },
          },
        ],
      },
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
The resource version is `2019-04-30`.

The Swagger schema used to generate this documentation can be found [here](https://github.com/Azure/azure-rest-api-specs/tree/main/specification/containerservice/resource-manager/Microsoft.ContainerService/stable/2019-04-30/openShiftManagedClusters.json).
