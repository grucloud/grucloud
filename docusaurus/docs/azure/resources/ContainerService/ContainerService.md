---
id: ContainerService
title: ContainerService
---
Provides a **ContainerService** from the **ContainerService** group
## Examples
### Create/Update Container Service
```js
provider.ContainerService.makeContainerService({
  name: "myContainerService",
  properties: () => ({ location: "location1" }),
  dependencies: ({ resources }) => ({
    resourceGroup: resources.Resources.ResourceGroup["myResourceGroup"],
  }),
});

```
## Dependencies
- [ResourceGroup](../Resources/ResourceGroup.md)
## Misc
The resource version is `2017-07-01`.

The Swagger schema used to generate this documentation can be found [here](https://github.com/Azure/azure-rest-api-specs/tree/main/specification/containerservice/resource-manager/Microsoft.ContainerService/stable/2017-07-01/containerService.json).
