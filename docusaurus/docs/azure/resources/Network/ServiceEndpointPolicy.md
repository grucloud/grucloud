---
id: ServiceEndpointPolicy
title: ServiceEndpointPolicy
---
Provides a **ServiceEndpointPolicy** from the **Network** group
## Examples
### Create service endpoint policy
```js
provider.Network.makeServiceEndpointPolicy({
  name: "myServiceEndpointPolicy",
  properties: () => ({ location: "westus" }),
  dependencies: ({ resources }) => ({
    resourceGroup: resources.Resources.ResourceGroup["myResourceGroup"],
  }),
});

```

### Create service endpoint policy with definition
```js
provider.Network.makeServiceEndpointPolicy({
  name: "myServiceEndpointPolicy",
  properties: () => ({
    location: "westus",
    properties: {
      serviceEndpointPolicyDefinitions: [
        {
          name: "StorageServiceEndpointPolicyDefinition",
          properties: {
            description: "Storage Service EndpointPolicy Definition",
            service: "Microsoft.Storage",
            serviceResources: [
              "/subscriptions/subid1",
              "/subscriptions/subid1/resourceGroups/storageRg",
              "/subscriptions/subid1/resourceGroups/storageRg/providers/Microsoft.Storage/storageAccounts/stAccount",
            ],
          },
        },
      ],
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
The resource version is `2021-05-01`.

The Swagger schema used to generate this documentation can be found [here](https://github.com/Azure/azure-rest-api-specs/tree/main/specification/network/resource-manager/Microsoft.Network/stable/2021-05-01/serviceEndpointPolicy.json).
