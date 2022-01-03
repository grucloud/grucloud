---
id: Certificate
title: Certificate
---
Provides a **Certificate** from the **Web** group
## Examples
### Create Or Update Certificate
```js
provider.Web.makeCertificate({
  name: "myCertificate",
  properties: () => ({
    location: "East US",
    properties: { hostNames: ["ServerCert"], password: "<password>" },
  }),
  dependencies: ({ resources }) => ({
    resourceGroup: resources.Resources.ResourceGroup["myResourceGroup"],
  }),
});

```
## Dependencies
- [ResourceGroup](../Resources/ResourceGroup.md)
## Misc
The resource version is `2021-02-01`.

The Swagger schema used to generate this documentation can be found [here](https://github.com/Azure/azure-rest-api-specs/tree/main/specification/web/resource-manager/Microsoft.Web/stable/2021-02-01/Certificates.json).
