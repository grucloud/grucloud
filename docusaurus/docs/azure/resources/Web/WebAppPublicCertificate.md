---
id: WebAppPublicCertificate
title: WebAppPublicCertificate
---
Provides a **WebAppPublicCertificate** from the **Web** group
## Examples
## Dependencies
- [ResourceGroup](../Resources/ResourceGroup.md)
- [WebApp](../Web/WebApp.md)
## Swagger Schema
```js
{
  description: 'Public certificate object',
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
      description: 'PublicCertificate resource specific properties',
      type: 'object',
      properties: {
        blob: {
          format: 'byte',
          description: 'Public Certificate byte array',
          type: 'string'
        },
        publicCertificateLocation: {
          description: 'Public Certificate Location',
          enum: [ 'CurrentUserMy', 'LocalMachineMy', 'Unknown' ],
          type: 'string',
          'x-ms-enum': { name: 'PublicCertificateLocation', modelAsString: false }
        },
        thumbprint: {
          description: 'Certificate Thumbprint',
          type: 'string',
          readOnly: true
        }
      },
      'x-ms-client-flatten': true
    }
  }
}
```
## Misc
The resource version is `2022-03-01`.

The Swagger schema used to generate this documentation can be found [here](https://github.com/Azure/azure-rest-api-specs/tree/main/specification/web/resource-manager/Microsoft.Web/stable/2022-03-01/WebApps.json).
