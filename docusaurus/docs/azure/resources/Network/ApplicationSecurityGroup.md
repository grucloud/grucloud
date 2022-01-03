---
id: ApplicationSecurityGroup
title: ApplicationSecurityGroup
---
Provides a **ApplicationSecurityGroup** from the **Network** group
## Examples
### Create application security group
```js
provider.Network.makeApplicationSecurityGroup({
  name: "myApplicationSecurityGroup",
  properties: () => ({ location: "westus", properties: {} }),
  dependencies: ({ resources }) => ({
    resourceGroup: resources.Resources.ResourceGroup["myResourceGroup"],
  }),
});

```
## Dependencies
- [ResourceGroup](../Resources/ResourceGroup.md)
## Misc
The resource version is `2021-05-01`.

The Swagger schema used to generate this documentation can be found [here](https://github.com/Azure/azure-rest-api-specs/tree/main/specification/network/resource-manager/Microsoft.Network/stable/2021-05-01/applicationSecurityGroup.json).
