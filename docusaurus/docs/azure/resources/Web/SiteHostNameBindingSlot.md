---
id: SiteHostNameBindingSlot
title: SiteHostNameBindingSlot
---
Provides a **SiteHostNameBindingSlot** from the **Web** group
## Examples
## Dependencies
- [ResourceGroup](../Resources/ResourceGroup.md)
- [Domain](../DomainRegistration/Domain.md)
- [Site](../Web/Site.md)
- [SiteSlot](../Web/SiteSlot.md)
## Swagger Schema
```js
{
  description: 'A host name binding object',
  type: 'object',
  allOf: [
    {
      required: [ 'location' ],
      properties: {
        id: { description: 'Resource Id', type: 'string' },
        name: { description: 'Resource Name', type: 'string' },
        kind: { description: 'Kind of resource', type: 'string' },
        location: { description: 'Resource Location', type: 'string' },
        type: { description: 'Resource type', type: 'string' },
        tags: {
          description: 'Resource tags',
          type: 'object',
          additionalProperties: { type: 'string' }
        }
      },
      'x-ms-azure-resource': true
    }
  ],
  properties: {
    properties: {
      properties: {
        name: { description: 'Hostname', type: 'string' },
        siteName: { description: 'Web app name', type: 'string' },
        domainId: {
          description: 'Fully qualified ARM domain resource URI',
          type: 'string'
        },
        azureResourceName: { description: 'Azure resource name', type: 'string' },
        azureResourceType: {
          description: 'Azure resource type',
          enum: [ 'Website', 'TrafficManager' ],
          type: 'string',
          'x-ms-enum': { name: 'AzureResourceType', modelAsString: false }
        },
        customHostNameDnsRecordType: {
          description: 'Custom DNS record type',
          enum: [ 'CName', 'A' ],
          type: 'string',
          'x-ms-enum': { name: 'CustomHostNameDnsRecordType', modelAsString: false }
        },
        hostNameType: {
          description: 'Host name type',
          enum: [ 'Verified', 'Managed' ],
          type: 'string',
          'x-ms-enum': { name: 'HostNameType', modelAsString: false }
        }
      },
      'x-ms-client-flatten': true
    }
  }
}
```
## Misc
The resource version is `2015-08-01`.

The Swagger schema used to generate this documentation can be found [here](https://github.com/Azure/azure-rest-api-specs/tree/main/specification/web/resource-manager/Microsoft.Web/stable/2015-08-01/service.json).
