---
id: CloudServicesUpdateDomainUpdateDomain
title: CloudServicesUpdateDomainUpdateDomain
---
Provides a **CloudServicesUpdateDomainUpdateDomain** from the **Compute** group
## Examples
### Update Cloud Service to specified Domain
```js
provider.Compute.makeCloudServicesUpdateDomainUpdateDomain({
  name: "myCloudServicesUpdateDomainUpdateDomain",
  dependencies: ({ resources }) => ({
    resourceGroup: resources.Resources.ResourceGroup["myResourceGroup"],
    cloudService: resources.Compute.CloudService["myCloudService"],
  }),
});

```
## Dependencies
- [ResourceGroup](../Resources/ResourceGroup.md)
- [CloudService](../Compute/CloudService.md)
## Swagger Schema
```js
{
  description: 'Defines an update domain for the cloud service.',
  type: 'object',
  properties: {
    id: { description: 'Resource Id', type: 'string', readOnly: true },
    name: { description: 'Resource Name', type: 'string', readOnly: true }
  }
}
```
## Misc
The resource version is `2021-03-01`.

The Swagger schema used to generate this documentation can be found [here](https://github.com/Azure/azure-rest-api-specs/tree/main/specification/compute/resource-manager/Microsoft.Compute/stable/2021-03-01/cloudService.json).
