---
id: WebAppHostNameBinding
title: WebAppHostNameBinding
---
Provides a **WebAppHostNameBinding** from the **Web** group
## Examples
## Dependencies
- [ResourceGroup](../Resources/ResourceGroup.md)
- [WebApp](../Web/WebApp.md)
## Swagger Schema
```json
{
  description: 'A hostname binding object.',
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
      description: 'HostNameBinding resource specific properties',
      type: 'object',
      properties: {
        siteName: {
          description: 'App Service app name.',
          type: 'string',
          'x-ms-mutability': [ 'create', 'read' ]
        },
        domainId: {
          description: 'Fully qualified ARM domain resource URI.',
          type: 'string',
          'x-ms-mutability': [ 'create', 'read' ]
        },
        azureResourceName: {
          description: 'Azure resource name.',
          type: 'string',
          'x-ms-mutability': [ 'create', 'read' ]
        },
        azureResourceType: {
          description: 'Azure resource type.',
          enum: [ 'Website', 'TrafficManager' ],
          type: 'string',
          'x-ms-enum': { name: 'AzureResourceType', modelAsString: false },
          'x-ms-mutability': [ 'create', 'read' ]
        },
        customHostNameDnsRecordType: {
          description: 'Custom DNS record type.',
          enum: [ 'CName', 'A' ],
          type: 'string',
          'x-ms-enum': { name: 'CustomHostNameDnsRecordType', modelAsString: false },
          'x-ms-mutability': [ 'create', 'read' ]
        },
        hostNameType: {
          description: 'Hostname type.',
          enum: [ 'Verified', 'Managed' ],
          type: 'string',
          'x-ms-enum': { name: 'HostNameType', modelAsString: false },
          'x-ms-mutability': [ 'create', 'read' ]
        },
        sslState: {
          description: 'SSL type',
          enum: [ 'Disabled', 'SniEnabled', 'IpBasedEnabled' ],
          type: 'string',
          'x-ms-enum': { name: 'SslState', modelAsString: false },
          'x-ms-mutability': [ 'create', 'read' ]
        },
        thumbprint: {
          description: 'SSL certificate thumbprint',
          type: 'string',
          'x-ms-mutability': [ 'create', 'read' ]
        },
        virtualIP: {
          description: 'Virtual IP address assigned to the hostname if IP based SSL is enabled.',
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
