---
id: Firewall
title: Firewall
---

Manages a [Firewall](https://cloud.google.com/vpc/docs/firewalls)

Allow ingress traffic from anywhere to SSH and HTTP/HTTPS:

```js
provider.compute.makeFirewall({
  name: `firewall-22-80-433-${stage}`,
  properties: () => ({
    allowed: [
      {
        IPProtocol: "tcp",
        ports: ["22", "80", "433"],
      },
    ],
  }),
});
```

Allow ping from anywhere:

```js
provider.compute.makeFirewall({
  name: `firewall-icmp-${stage}`,
  properties: () => ({
    allowed: [
      {
        IPProtocol: "icmp",
      },
    ],
  }),
});
```

### Examples

- [basic example](https://github.com/grucloud/grucloud/blob/main/examples/google/vm/iac.js)
- [full example](https://github.com/grucloud/grucloud/blob/main/examples/google/vm-network/iac.js)

### Properties

- [all properties](https://cloud.google.com/compute/docs/reference/rest/v1/firewalls/insert)

### Dependencies

- [Network](./Network.md)
