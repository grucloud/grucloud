---
id: ResourceAssociation
title: Resource Association
---

Provides a [RAM Resource Association](https://console.aws.amazon.com/ram/home?#Home:)

```js
exports.createResources = () => [
  {
    type: "ResourceAssociation",
    group: "RAM",
    properties: ({}) => ({
      external: false,
    }),
    dependencies: ({}) => ({
      resourceShare: "ipam-org-share",
      ipamPool: "private_org_ipam_scope",
    }),
  },
  {
    type: "ResourceAssociation",
    group: "RAM",
    properties: ({}) => ({
      external: false,
    }),
    dependencies: ({}) => ({
      resourceShare: "r53r-org-share",
      resolverRule: "root-env",
    }),
  },
  {
    type: "ResourceAssociation",
    group: "RAM",
    properties: ({}) => ({
      external: false,
    }),
    dependencies: ({}) => ({
      resourceShare: "tgw-org-share",
      transitGateway: "Org_TGW_dev",
    }),
  },
];
```

### Examples

- [simple example](https://github.com/grucloud/grucloud/tree/main/examples/aws/RAM/resource-share)
- [aws-network-hub](https://github.com/grucloud/grucloud/tree/main/examples/aws/aws-samples/aws-network-hub-for-terraform)s

### Properties

- [AssociateResourceShareCommandInput](https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/clients/client-ram/interfaces/associateresourcesharecommandinput.html)

### Dependencies

### Used By

### List

```sh
gc l -t ResourceAssociation
```

```txt

```
