---
id: Webhook
title: Webhook
---
Provides a **Webhook** from the **ContainerRegistry** group
## Examples
### WebhookCreate
```js
provider.ContainerRegistry.makeWebhook({
  name: "myWebhook",
  properties: () => ({
    location: "westus",
    tags: { key: "value" },
    properties: {
      serviceUri: "http://myservice.com",
      customHeaders: {
        Authorization:
          "Basic 000000000000000000000000000000000000000000000000000",
      },
      status: "enabled",
      scope: "myRepository",
      actions: ["push"],
    },
  }),
  dependencies: ({ resources }) => ({
    resourceGroup: resources.Resources.ResourceGroup["myResourceGroup"],
    registry: resources.ContainerRegistry.Registry["myRegistry"],
  }),
});

```
## Dependencies
- [ResourceGroup](../Resources/ResourceGroup.md)
- [Registry](../ContainerRegistry/Registry.md)
## Misc
The resource version is `2021-09-01`.

The Swagger schema used to generate this documentation can be found [here](https://github.com/Azure/azure-rest-api-specs/tree/main/specification/containerregistry/resource-manager/Microsoft.ContainerRegistry/stable/2021-09-01/containerregistry.json).
