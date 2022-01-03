---
id: SshPublicKey
title: SshPublicKey
---
Provides a **SshPublicKey** from the **Compute** group
## Examples
### Create a new SSH public key resource.
```js
provider.Compute.makeSshPublicKey({
  name: "mySshPublicKey",
  properties: () => ({
    location: "westus",
    properties: { publicKey: "{ssh-rsa public key}" },
  }),
  dependencies: ({ resources }) => ({
    resourceGroup: resources.Resources.ResourceGroup["myResourceGroup"],
  }),
});

```
## Dependencies
- [ResourceGroup](../Resources/ResourceGroup.md)
## Misc
The resource version is `2021-07-01`.

The Swagger schema used to generate this documentation can be found [here](https://github.com/Azure/azure-rest-api-specs/tree/main/specification/compute/resource-manager/Microsoft.Compute/stable/2021-07-01/compute.json).
