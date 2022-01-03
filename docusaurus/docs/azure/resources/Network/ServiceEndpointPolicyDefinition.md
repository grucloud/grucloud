---
id: ServiceEndpointPolicyDefinition
title: ServiceEndpointPolicyDefinition
---
Provides a **ServiceEndpointPolicyDefinition** from the **Network** group
## Examples
### Create service endpoint policy definition
```js
provider.Network.makeServiceEndpointPolicyDefinition({
  name: "myServiceEndpointPolicyDefinition",
  properties: () => ({
    properties: {
      description: "Storage Service EndpointPolicy Definition",
      service: "Microsoft.Storage",
      serviceResources: [
        "/subscriptions/subid1",
        "/subscriptions/subid1/resourceGroups/storageRg",
        "/subscriptions/subid1/resourceGroups/storageRg/providers/Microsoft.Storage/storageAccounts/stAccount",
      ],
    },
  }),
  dependencies: ({ resources }) => ({
    resourceGroup: resources.Resources.ResourceGroup["myResourceGroup"],
    serviceEndpointPolicy:
      resources.Network.ServiceEndpointPolicy["myServiceEndpointPolicy"],
  }),
});

```
## Dependencies
- [ResourceGroup](../Resources/ResourceGroup.md)
- [ServiceEndpointPolicy](../Network/ServiceEndpointPolicy.md)
## Misc
The resource version is `2021-05-01`.

The Swagger schema used to generate this documentation can be found [here](https://github.com/Azure/azure-rest-api-specs/tree/main/specification/network/resource-manager/Microsoft.Network/stable/2021-05-01/serviceEndpointPolicy.json).
