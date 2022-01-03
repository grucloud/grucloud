---
id: CertificateOrderCertificate
title: CertificateOrderCertificate
---
Provides a **CertificateOrderCertificate** from the **Web** group
## Examples
## Dependencies
- [ResourceGroup](../Resources/ResourceGroup.md)
- [AppServiceCertificateOrder](../CertificateRegistration/AppServiceCertificateOrder.md)
## Swagger Schema
```js
{
  description: 'Class representing the Key Vault container for certificate purchased through Azure',
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
        keyVaultId: { description: 'Key Vault Csm resource Id', type: 'string' },
        keyVaultSecretName: { description: 'Key Vault secret name', type: 'string' },
        provisioningState: {
          description: 'Status of the Key Vault secret',
          enum: [
            'Initialized',
            'WaitingOnCertificateOrder',
            'Succeeded',
            'CertificateOrderFailed',
            'OperationNotPermittedOnKeyVault',
            'AzureServiceUnauthorizedToAccessKeyVault',
            'KeyVaultDoesNotExist',
            'KeyVaultSecretDoesNotExist',
            'UnknownError',
            'Unknown'
          ],
          type: 'string',
          'x-ms-enum': { name: 'KeyVaultSecretStatus', modelAsString: false }
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
