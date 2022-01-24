---
id: WebAppScmAllowed
title: WebAppScmAllowed
---
Provides a **WebAppScmAllowed** from the **Web** group
## Examples
### Update SCM Allowed
```js
provider.Web.makeWebAppScmAllowed({
  name: "myWebAppScmAllowed",
  properties: () => ({ properties: { allow: true } }),
  dependencies: ({ resources }) => ({
    resourceGroup: resources.Resources.ResourceGroup["myResourceGroup"],
    name: resources.Web.Site["mySite"],
  }),
});

```
## Dependencies
- [ResourceGroup](../Resources/ResourceGroup.md)
- [Site](../Web/Site.md)
## Swagger Schema
```js
{
  description: 'Publishing Credentials Policies parameters.',
  type: 'object',
  allOf: [
    {
      description: 'Azure proxy only resource. This resource is not tracked by Azure Resource Manager.',
      type: 'object',
      properties: {
        id: { description: 'Resource Id.', type: 'string', readOnly: true },
        name: {
          description: 'Resource Name.',
          type: 'string',
          readOnly: true
        },
        kind: { description: 'Kind of resource.', type: 'string' },
        type: {
          description: 'Resource type.',
          type: 'string',
          readOnly: true
        }
      },
      'x-ms-azure-resource': true
    }
  ],
  properties: {
    properties: {
      description: 'CsmPublishingCredentialsPoliciesEntity resource specific properties',
      required: [ 'allow' ],
      type: 'object',
      properties: {
        allow: {
          description: '<code>true</code> to allow access to a publishing method; otherwise, <code>false</code>.',
          type: 'boolean'
        }
      },
      'x-ms-client-flatten': true
    }
  }
}
```
## Misc
The resource version is `2021-03-01`.

The Swagger schema used to generate this documentation can be found [here](https://github.com/Azure/azure-rest-api-specs/tree/main/specification/web/resource-manager/Microsoft.Web/stable/2021-03-01/WebApps.json).
