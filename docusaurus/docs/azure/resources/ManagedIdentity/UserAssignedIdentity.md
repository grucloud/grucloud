---
id: UserAssignedIdentity
title: UserAssignedIdentity
---
Provides a **UserAssignedIdentity** from the **ManagedIdentity** group
## Examples
### IdentityCreate
```js
provider.ManagedIdentity.makeUserAssignedIdentity({
  name: "myUserAssignedIdentity",
  properties: () => ({
    location: "eastus",
    tags: { key1: "value1", key2: "value2" },
  }),
  dependencies: ({ resources }) => ({
    resourceGroup: resources.Resources.ResourceGroup["myResourceGroup"],
  }),
});

```
## Dependencies
- [ResourceGroup](../Resources/ResourceGroup.md)
## Misc
The resource version is `2018-11-30`.

The Swagger schema used to generate this documentation can be found [here](https://github.com/Azure/azure-rest-api-specs/tree/main/specification/msi/resource-manager/Microsoft.ManagedIdentity/stable/2018-11-30/ManagedIdentity.json).
