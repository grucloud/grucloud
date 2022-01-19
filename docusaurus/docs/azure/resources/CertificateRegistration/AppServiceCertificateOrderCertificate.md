---
id: AppServiceCertificateOrderCertificate
title: AppServiceCertificateOrderCertificate
---
Provides a **AppServiceCertificateOrderCertificate** from the **CertificateRegistration** group
## Examples
## Dependencies
- [ResourceGroup](../Resources/ResourceGroup.md)
- [AppServiceCertificateOrder](../CertificateRegistration/AppServiceCertificateOrder.md)
## Swagger Schema
```js
{
  description: 'Key Vault container ARM resource for a certificate that is purchased through Azure.',
  type: 'object',
  allOf: [
    {
      description: 'Azure resource. This resource is tracked in Azure Resource Manager',
      required: [ 'location' ],
      type: 'object',
      properties: {
        id: { description: 'Resource Id.', type: 'string', readOnly: true },
        name: {
          description: 'Resource Name.',
          type: 'string',
          readOnly: true
        },
        kind: { description: 'Kind of resource.', type: 'string' },
        location: { description: 'Resource Location.', type: 'string' },
        type: {
          description: 'Resource type.',
          type: 'string',
          readOnly: true
        },
        tags: {
          description: 'Resource tags.',
          type: 'object',
          additionalProperties: { type: 'string' }
        }
      },
      'x-ms-azure-resource': true
    }
  ],
  properties: {
    properties: {
      description: 'Key Vault container for a certificate that is purchased through Azure.',
      type: 'object',
      properties: {
        keyVaultId: { description: 'Key Vault resource Id.', type: 'string' },
        keyVaultSecretName: { description: 'Key Vault secret name.', type: 'string' },
        provisioningState: {
          description: 'Status of the Key Vault secret.',
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
            'ExternalPrivateKey',
            'Unknown'
          ],
          type: 'string',
          readOnly: true,
          'x-ms-enum': { name: 'KeyVaultSecretStatus', modelAsString: false }
        }
      },
      'x-ms-client-flatten': true
    }
  }
}
```
## Misc
The resource version is `2021-03-01`.

The Swagger schema used to generate this documentation can be found [here](https://github.com/Azure/azure-rest-api-specs/tree/main/specification/web/resource-manager/Microsoft.CertificateRegistration/stable/2021-03-01/AppServiceCertificateOrders.json).
