---
id: ResourceShare
title: Resource Share
---

Provides a [RAM Resource Share](https://console.aws.amazon.com/ram/home?#Home:)

```js
exports.createResources = () => [
  {
    type: "ResourceShare",
    group: "RAM",
    properties: ({}) => ({
      allowExternalPrincipals: false,
      featureSet: "STANDARD",
      name: "ipam-org-share",
    }),
  },
];
```

### Examples

- [simple example](https://github.com/grucloud/grucloud/tree/main/examples/aws/RAM/resource-share)
- [aws-network-hub](https://github.com/grucloud/grucloud/tree/main/examples/aws/aws-samples/aws-network-hub-for-terraform)

### Properties

- [CreateResourceShareCommandInput](https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/clients/client-ram/interfaces/createresourcesharecommandinput.html)

### Dependencies

### Used By

### List

```sh
gc l -t ResourceShare
```

```txt

```
