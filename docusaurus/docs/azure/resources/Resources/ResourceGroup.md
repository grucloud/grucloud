---
id: ResourceGroup
title: Resource Group
---

A container for other resources:

```js
const resourceGroup = provider.makeResourceGroup({
  name: `resource-group`,
});
```

### Examples

- [basic example](https://github.com/grucloud/grucloud/blob/main/examples/azure/Compute/vm/resources.js)

### Properties

- [all properties](https://docs.microsoft.com/en-us/rest/api/apimanagement/2019-12-01/apimanagementservice/createorupdate#request-body)

### Used By

- [VirtualNetwork](../Network/VirtualNetwork.md)
- [SecurityGroup](../Network/SecurityGroup.md)
- [NetworkInterface](../Network/NetworkInterface.md)
- [PublicIpAddress](../Network/PublicIPAddress.md)
- [VirtualMachine](../Compute/VirtualMachine.md)
