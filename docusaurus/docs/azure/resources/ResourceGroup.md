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

- [basic example](https://github.com/grucloud/grucloud/blob/main/examples/azure/vm/iac.js#9)

### Properties

- [all properties](https://docs.microsoft.com/en-us/rest/api/apimanagement/2019-12-01/apimanagementservice/createorupdate#request-body)

### Used By

- [VirtualNetwork](./VirtualNetwork)
- [SecurityGroup](./SecurityGroup)
- [NetworkInterface](./NetworkInterface)
- [PublicIpAddress](./PublicIpAddress)
- [VirtualMachine](./VirtualMachine)
