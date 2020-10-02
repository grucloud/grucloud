---
id: PublicIpAddress
title: Public Ip Address
---

Provides a Public Ip Address:

```js
const publicIpAddress = await provider.makePublicIpAddress({
  name: `ip`,
  dependencies: {
    resourceGroup,
  },
  properties: () => ({
    properties: {
      publicIPAllocationMethod: "Dynamic",
    },
  }),
});
```

### Examples

- [basic example](https://github.com/grucloud/grucloud/blob/master/examples/azure/iac.js#L58)

### Properties

- [all properties](https://docs.microsoft.com/en-us/rest/api/virtualnetwork/publicipaddresses/createorupdate#request-body)

### Dependencies

- [ResourceGroup](./ResourceGroup)

### Used By

- [NetworkInterface](./NetworkInterface)
