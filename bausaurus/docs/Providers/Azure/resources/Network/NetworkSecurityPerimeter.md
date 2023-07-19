---
id: NetworkSecurityPerimeter
title: NetworkSecurityPerimeter
---
Provides a **NetworkSecurityPerimeter** from the **Network** group
## Examples
### Put Network Security Perimeter
```js
provider.Network.makeNetworkSecurityPerimeter({
  name: "myNetworkSecurityPerimeter",
  properties: () => ({
    properties: {
      displayName: "TestNetworkSecurityPerimeter",
      description: "Description of TestNetworkSecurityPerimeter",
    },
  }),
  dependencies: ({ resources }) => ({
    adminRule: resources.Network.AdminRule["myAdminRule"],
  }),
});

```
## Dependencies
- [AdminRule](../Network/AdminRule.md)
## Misc
The resource version is `2021-03-01-preview`.

The Swagger schema used to generate this documentation can be found [here](https://github.com/Azure/azure-rest-api-specs/tree/main/specification/network/resource-manager/Microsoft.Network/preview/2021-03-01-preview/networkSecurityPerimeter.json).
