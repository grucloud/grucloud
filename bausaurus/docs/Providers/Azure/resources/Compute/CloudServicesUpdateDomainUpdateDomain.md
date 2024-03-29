---
id: CloudServicesUpdateDomainUpdateDomain
title: CloudServicesUpdateDomainUpdateDomain
---
Provides a **CloudServicesUpdateDomainUpdateDomain** from the **Compute** group
## Examples
### Update Cloud Service to specified Domain
```js
exports.createResources = () => [
  {
    type: "CloudServicesUpdateDomainUpdateDomain",
    group: "Compute",
    name: "myCloudServicesUpdateDomainUpdateDomain",
    dependencies: ({}) => ({
      resourceGroup: "myResourceGroup",
      cloudService: "myCloudService",
    }),
  },
];

```
## Dependencies
- [ResourceGroup](../Resources/ResourceGroup.md)
- [CloudService](../Compute/CloudService.md)
## Swagger Schema
```json
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
The resource version is `2022-04-04`.

The Swagger schema used to generate this documentation can be found [here](https://github.com/Azure/azure-rest-api-specs/tree/main/specification/compute/resource-manager/Microsoft.Compute/CloudserviceRP/stable/2022-04-04/cloudService.json).
