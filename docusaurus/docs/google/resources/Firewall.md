---
id: Firewall
title: Firewall
---

Manages a [Firewall](https://cloud.google.com/vpc/docs/firewalls)

```js
const firewall = await provider.makeFirewall({
  name: "firewall-web-dev",
  dependencies: { network },
  properties: () => ({
    allowed: [
      {
        IPProtocol: "TCP",
        ports: [80, 433],
      },
    ],
  }),
});
```

### Examples

- [basic example](https://github.com/FredericHeem/grucloud/blob/master/examples/google/iac.js)

### Properties

- [all properties](https://cloud.google.com/compute/docs/reference/rest/v1/firewalls/insert)

### Dependencies

- [Network](./Network)
