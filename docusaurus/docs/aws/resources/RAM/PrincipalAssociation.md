---
id: PrincipalAssociation
title: Principal Association
---

Provides a [RAM Principal Association](https://console.aws.amazon.com/ram/home?#Home:)

```js
exports.createResources = () => [
  {
    type: "PrincipalAssociation",
    group: "RAM",
    properties: ({}) => ({
      external: false,
    }),
    dependencies: ({}) => ({
      resourceShare: "ipam-org-share",
      organisation: "fred@mail.com",
    }),
  },
];
```

### Examples

- [simple example](https://github.com/grucloud/grucloud/tree/main/examples/aws/RAM/resource-share)
- [aws-network-hub](https://github.com/grucloud/grucloud/tree/main/examples/aws/aws-samples/aws-network-hub-for-terraform)

### Properties

- [AssociateResourceShareCommandInput](https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/clients/client-ram/interfaces/associateresourcesharecommandinput.html)

### Dependencies

- [Resource Share](./ResourceShare.md)
- [Organisation](../Organisations/Organisation.md)

### Used By

### List

```sh
gc l -t PrincipalAssociation
```

```txt

```
