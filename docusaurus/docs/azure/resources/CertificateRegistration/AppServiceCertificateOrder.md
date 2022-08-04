---
id: AppServiceCertificateOrder
title: AppServiceCertificateOrder
---
Provides a **AppServiceCertificateOrder** from the **CertificateRegistration** group
## Examples
### Create Certificate order
```js
exports.createResources = () => [
  {
    type: "AppServiceCertificateOrder",
    group: "CertificateRegistration",
    name: "myAppServiceCertificateOrder",
    properties: () => ({
      location: "Global",
      properties: {
        certificates: {
          SampleCertName1: {
            keyVaultId:
              "/subscriptions/34adfa4f-cedf-4dc0-ba29-b6d1a69ab345/resourcegroups/testrg123/providers/microsoft.keyvault/vaults/SamplevaultName",
            keyVaultSecretName: "SampleSecretName1",
          },
          SampleCertName2: {
            keyVaultId:
              "/subscriptions/34adfa4f-cedf-4dc0-ba29-b6d1a69ab345/resourcegroups/testrg123/providers/microsoft.keyvault/vaults/SamplevaultName",
            keyVaultSecretName: "SampleSecretName2",
          },
        },
        distinguishedName: "CN=SampleCustomDomain.com",
        validityInYears: 2,
        keySize: 2048,
        productType: "StandardDomainValidatedSsl",
        autoRenew: true,
      },
    }),
    dependencies: ({}) => ({ resourceGroup: "myResourceGroup" }),
  },
];

```
## Dependencies
- [ResourceGroup](../Resources/ResourceGroup.md)
## Swagger Schema
```js
{
  description: 'SSL certificate purchase order.',
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
      description: 'AppServiceCertificateOrder resource specific properties',
      required: [ 'productType' ],
      type: 'object',
      properties: {
        certificates: {
          description: 'State of the Key Vault secret.',
          type: 'object',
          additionalProperties: {
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
            }
          }
        },
        distinguishedName: {
          description: 'Certificate distinguished name.',
          type: 'string',
          'x-ms-mutability': [ 'create', 'read' ]
        },
        domainVerificationToken: {
          description: 'Domain verification token.',
          type: 'string',
          readOnly: true
        },
        validityInYears: {
          format: 'int32',
          description: 'Duration in years (must be 1).',
          default: 1,
          type: 'integer',
          'x-ms-mutability': [ 'create', 'read' ]
        },
        keySize: {
          format: 'int32',
          description: 'Certificate key size.',
          default: 2048,
          type: 'integer',
          'x-ms-mutability': [ 'create', 'read' ]
        },
        productType: {
          description: 'Certificate product type.',
          enum: [
            'StandardDomainValidatedSsl',
            'StandardDomainValidatedWildCardSsl'
          ],
          type: 'string',
          'x-ms-enum': { name: 'CertificateProductType', modelAsString: false },
          'x-ms-mutability': [ 'create', 'read' ]
        },
        autoRenew: {
          description: '<code>true</code> if the certificate should be automatically renewed when it expires; otherwise, <code>false</code>.',
          default: true,
          type: 'boolean'
        },
        provisioningState: {
          description: 'Status of certificate order.',
          enum: [
            'Succeeded',
            'Failed',
            'Canceled',
            'InProgress',
            'Deleting'
          ],
          type: 'string',
          readOnly: true,
          'x-ms-enum': { name: 'ProvisioningState', modelAsString: false }
        },
        status: {
          description: 'Current order status.',
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
          readOnly: true,
          'x-ms-enum': { name: 'CertificateOrderStatus', modelAsString: false }
        },
        signedCertificate: {
          description: 'Signed certificate.',
          readOnly: true,
          type: 'object',
          properties: {
            version: {
              format: 'int32',
              description: 'Certificate Version.',
              type: 'integer',
              readOnly: true
            },
            serialNumber: {
              description: 'Certificate Serial Number.',
              type: 'string',
              readOnly: true
            },
            thumbprint: {
              description: 'Certificate Thumbprint.',
              type: 'string',
              readOnly: true
            },
            subject: {
              description: 'Certificate Subject.',
              type: 'string',
              readOnly: true
            },
            notBefore: {
              format: 'date-time',
              description: 'Date Certificate is valid from.',
              type: 'string',
              readOnly: true
            },
            notAfter: {
              format: 'date-time',
              description: 'Date Certificate is valid to.',
              type: 'string',
              readOnly: true
            },
            signatureAlgorithm: {
              description: 'Certificate Signature algorithm.',
              type: 'string',
              readOnly: true
            },
            issuer: {
              description: 'Certificate Issuer.',
              type: 'string',
              readOnly: true
            },
            rawData: {
              description: 'Raw certificate data.',
              type: 'string',
              readOnly: true
            }
          }
        },
        csr: {
          description: 'Last CSR that was created for this order.',
          type: 'string',
          'x-ms-mutability': [ 'create', 'read' ]
        },
        intermediate: {
          description: 'Intermediate certificate.',
          readOnly: true,
          type: 'object',
          properties: {
            version: {
              format: 'int32',
              description: 'Certificate Version.',
              type: 'integer',
              readOnly: true
            },
            serialNumber: {
              description: 'Certificate Serial Number.',
              type: 'string',
              readOnly: true
            },
            thumbprint: {
              description: 'Certificate Thumbprint.',
              type: 'string',
              readOnly: true
            },
            subject: {
              description: 'Certificate Subject.',
              type: 'string',
              readOnly: true
            },
            notBefore: {
              format: 'date-time',
              description: 'Date Certificate is valid from.',
              type: 'string',
              readOnly: true
            },
            notAfter: {
              format: 'date-time',
              description: 'Date Certificate is valid to.',
              type: 'string',
              readOnly: true
            },
            signatureAlgorithm: {
              description: 'Certificate Signature algorithm.',
              type: 'string',
              readOnly: true
            },
            issuer: {
              description: 'Certificate Issuer.',
              type: 'string',
              readOnly: true
            },
            rawData: {
              description: 'Raw certificate data.',
              type: 'string',
              readOnly: true
            }
          }
        },
        root: {
          description: 'Root certificate.',
          readOnly: true,
          type: 'object',
          properties: {
            version: {
              format: 'int32',
              description: 'Certificate Version.',
              type: 'integer',
              readOnly: true
            },
            serialNumber: {
              description: 'Certificate Serial Number.',
              type: 'string',
              readOnly: true
            },
            thumbprint: {
              description: 'Certificate Thumbprint.',
              type: 'string',
              readOnly: true
            },
            subject: {
              description: 'Certificate Subject.',
              type: 'string',
              readOnly: true
            },
            notBefore: {
              format: 'date-time',
              description: 'Date Certificate is valid from.',
              type: 'string',
              readOnly: true
            },
            notAfter: {
              format: 'date-time',
              description: 'Date Certificate is valid to.',
              type: 'string',
              readOnly: true
            },
            signatureAlgorithm: {
              description: 'Certificate Signature algorithm.',
              type: 'string',
              readOnly: true
            },
            issuer: {
              description: 'Certificate Issuer.',
              type: 'string',
              readOnly: true
            },
            rawData: {
              description: 'Raw certificate data.',
              type: 'string',
              readOnly: true
            }
          }
        },
        serialNumber: {
          description: 'Current serial number of the certificate.',
          type: 'string',
          readOnly: true
        },
        lastCertificateIssuanceTime: {
          format: 'date-time',
          description: 'Certificate last issuance time.',
          type: 'string',
          readOnly: true
        },
        expirationTime: {
          format: 'date-time',
          description: 'Certificate expiration time.',
          type: 'string',
          readOnly: true
        },
        isPrivateKeyExternal: {
          description: '<code>true</code> if private key is external; otherwise, <code>false</code>.',
          type: 'boolean',
          readOnly: true
        },
        appServiceCertificateNotRenewableReasons: {
          description: 'Reasons why App Service Certificate is not renewable at the current moment.',
          type: 'array',
          items: {
            enum: [
              'RegistrationStatusNotSupportedForRenewal',
              'ExpirationNotInRenewalTimeRange',
              'SubscriptionNotActive'
            ],
            type: 'string',
            'x-ms-enum': { name: 'ResourceNotRenewableReason', modelAsString: true }
          },
          readOnly: true
        },
        nextAutoRenewalTimeStamp: {
          format: 'date-time',
          description: 'Time stamp when the certificate would be auto renewed next',
          type: 'string',
          readOnly: true
        },
        contact: {
          description: 'Contact info',
          readOnly: true,
          type: 'object',
          properties: {
            email: { type: 'string' },
            nameFirst: { type: 'string' },
            nameLast: { type: 'string' },
            phone: { type: 'string' }
          }
        }
      },
      'x-ms-client-flatten': true
    }
  }
}
```
## Misc
The resource version is `2022-03-01`.

The Swagger schema used to generate this documentation can be found [here](https://github.com/Azure/azure-rest-api-specs/tree/main/specification/web/resource-manager/Microsoft.CertificateRegistration/stable/2022-03-01/AppServiceCertificateOrders.json).
