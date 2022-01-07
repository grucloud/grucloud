---
id: CertificateOrder
title: CertificateOrder
---
Provides a **CertificateOrder** from the **Web** group
## Examples
## Dependencies
- [ResourceGroup](../Resources/ResourceGroup.md)
## Swagger Schema
```js
{
  description: 'Certificate purchase order',
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
        certificates: {
          description: 'State of the Key Vault secret',
          type: 'object',
          additionalProperties: {
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
                  keyVaultId: {
                    description: 'Key Vault Csm resource Id',
                    type: 'string'
                  },
                  keyVaultSecretName: {
                    description: 'Key Vault secret name',
                    type: 'string'
                  },
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
                    'x-ms-enum': {
                      name: 'KeyVaultSecretStatus',
                      modelAsString: false
                    }
                  }
                },
                'x-ms-client-flatten': true
              }
            }
          }
        },
        distinguishedName: {
          description: 'Certificate distinguished name',
          type: 'string'
        },
        domainVerificationToken: { description: 'Domain Verification Token', type: 'string' },
        validityInYears: {
          format: 'int32',
          description: 'Duration in years (must be between 1 and 3)',
          type: 'integer'
        },
        keySize: {
          format: 'int32',
          description: 'Certificate Key Size',
          type: 'integer'
        },
        productType: {
          description: 'Certificate product type',
          enum: [
            'StandardDomainValidatedSsl',
            'StandardDomainValidatedWildCardSsl'
          ],
          type: 'string',
          'x-ms-enum': { name: 'CertificateProductType', modelAsString: false }
        },
        autoRenew: { description: 'Auto renew', type: 'boolean' },
        provisioningState: {
          description: 'Status of certificate order',
          enum: [
            'Succeeded',
            'Failed',
            'Canceled',
            'InProgress',
            'Deleting'
          ],
          type: 'string',
          'x-ms-enum': { name: 'ProvisioningState', modelAsString: false }
        },
        status: {
          description: 'Current order status',
          enum: [
            'Pendingissuance',
            'Issued',
            'Revoked',
            'Canceled',
            'Denied',
            'Pendingrevocation',
            'PendingRekey',
            'Unused',
            'Expired',
            'NotSubmitted'
          ],
          type: 'string',
          'x-ms-enum': { name: 'CertificateOrderStatus', modelAsString: false }
        },
        signedCertificate: {
          description: 'Signed certificate',
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
                version: {
                  format: 'int32',
                  description: 'Version',
                  type: 'integer'
                },
                serialNumber: { description: 'Serial Number', type: 'string' },
                thumbprint: { description: 'Thumbprint', type: 'string' },
                subject: { description: 'Subject', type: 'string' },
                notBefore: {
                  format: 'date-time',
                  description: 'Valid from',
                  type: 'string'
                },
                notAfter: {
                  format: 'date-time',
                  description: 'Valid to',
                  type: 'string'
                },
                signatureAlgorithm: { description: 'Signature Algorithm', type: 'string' },
                issuer: { description: 'Issuer', type: 'string' },
                rawData: { description: 'Raw certificate data', type: 'string' }
              },
              'x-ms-client-flatten': true
            }
          }
        },
        csr: {
          description: 'Last CSR that was created for this order',
          type: 'string'
        },
        intermediate: {
          description: 'Intermediate certificate',
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
                version: {
                  format: 'int32',
                  description: 'Version',
                  type: 'integer'
                },
                serialNumber: { description: 'Serial Number', type: 'string' },
                thumbprint: { description: 'Thumbprint', type: 'string' },
                subject: { description: 'Subject', type: 'string' },
                notBefore: {
                  format: 'date-time',
                  description: 'Valid from',
                  type: 'string'
                },
                notAfter: {
                  format: 'date-time',
                  description: 'Valid to',
                  type: 'string'
                },
                signatureAlgorithm: { description: 'Signature Algorithm', type: 'string' },
                issuer: { description: 'Issuer', type: 'string' },
                rawData: { description: 'Raw certificate data', type: 'string' }
              },
              'x-ms-client-flatten': true
            }
          }
        },
        root: {
          description: 'Root certificate',
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
                version: {
                  format: 'int32',
                  description: 'Version',
                  type: 'integer'
                },
                serialNumber: { description: 'Serial Number', type: 'string' },
                thumbprint: { description: 'Thumbprint', type: 'string' },
                subject: { description: 'Subject', type: 'string' },
                notBefore: {
                  format: 'date-time',
                  description: 'Valid from',
                  type: 'string'
                },
                notAfter: {
                  format: 'date-time',
                  description: 'Valid to',
                  type: 'string'
                },
                signatureAlgorithm: { description: 'Signature Algorithm', type: 'string' },
                issuer: { description: 'Issuer', type: 'string' },
                rawData: { description: 'Raw certificate data', type: 'string' }
              },
              'x-ms-client-flatten': true
            }
          }
        },
        serialNumber: {
          description: 'Current serial number of the certificate',
          type: 'string'
        },
        lastCertificateIssuanceTime: {
          format: 'date-time',
          description: 'Certificate last issuance time',
          type: 'string'
        },
        expirationTime: {
          format: 'date-time',
          description: 'Certificate expiration time',
          type: 'string'
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
