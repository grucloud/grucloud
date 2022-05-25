---
id: Certificate
title: Certificate
---
Provides a **Certificate** from the **Web** group
## Examples
### Create Or Update Certificate
```js
exports.createResources = () => [
  {
    type: "Certificate",
    group: "Web",
    name: "myCertificate",
    properties: () => ({
      location: "East US",
      properties: { hostNames: ["ServerCert"], password: "<password>" },
    }),
    dependencies: ({}) => ({
      resourceGroup: "myResourceGroup",
      hostingEnvironment: "myHostingEnvironment",
      appServicePlan: "myAppServicePlan",
    }),
  },
];

```
## Dependencies
- [ResourceGroup](../Resources/ResourceGroup.md)
- [HostingEnvironment](../Web/HostingEnvironment.md)
- [AppServicePlan](../Web/AppServicePlan.md)
## Swagger Schema
```js
{
  description: 'SSL certificate for an app.',
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
      description: 'Certificate resource specific properties',
      type: 'object',
      properties: {
        password: {
          description: 'Certificate password.',
          type: 'string',
          'x-ms-mutability': [ 'create' ]
        },
        friendlyName: {
          description: 'Friendly name of the certificate.',
          type: 'string',
          readOnly: true
        },
        subjectName: {
          description: 'Subject name of the certificate.',
          type: 'string',
          readOnly: true
        },
        hostNames: {
          description: 'Host names the certificate applies to.',
          type: 'array',
          items: { type: 'string' }
        },
        pfxBlob: { format: 'byte', description: 'Pfx blob.', type: 'string' },
        siteName: { description: 'App name.', type: 'string', readOnly: true },
        selfLink: { description: 'Self link.', type: 'string', readOnly: true },
        issuer: {
          description: 'Certificate issuer.',
          type: 'string',
          readOnly: true
        },
        issueDate: {
          format: 'date-time',
          description: 'Certificate issue Date.',
          type: 'string',
          readOnly: true
        },
        expirationDate: {
          format: 'date-time',
          description: 'Certificate expiration date.',
          type: 'string',
          readOnly: true
        },
        thumbprint: {
          description: 'Certificate thumbprint.',
          type: 'string',
          readOnly: true
        },
        valid: {
          description: 'Is the certificate valid?.',
          type: 'boolean',
          readOnly: true
        },
        cerBlob: {
          format: 'byte',
          description: 'Raw bytes of .cer file',
          type: 'string',
          readOnly: true
        },
        publicKeyHash: {
          description: 'Public key hash.',
          type: 'string',
          readOnly: true
        },
        hostingEnvironmentProfile: {
          description: 'Specification for the App Service Environment to use for the certificate.',
          readOnly: true,
          type: 'object',
          properties: {
            id: {
              description: 'Resource ID of the App Service Environment.',
              type: 'string'
            },
            name: {
              description: 'Name of the App Service Environment.',
              type: 'string',
              readOnly: true
            },
            type: {
              description: 'Resource type of the App Service Environment.',
              type: 'string',
              readOnly: true
            }
          }
        },
        keyVaultId: { description: 'Key Vault Csm resource Id.', type: 'string' },
        keyVaultSecretName: { description: 'Key Vault secret name.', type: 'string' },
        keyVaultSecretStatus: {
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
        },
        serverFarmId: {
          description: 'Resource ID of the associated App Service plan, formatted as: "/subscriptions/{subscriptionID}/resourceGroups/{groupName}/providers/Microsoft.Web/serverfarms/{appServicePlanName}".',
          type: 'string'
        },
        canonicalName: {
          description: 'CNAME of the certificate to be issued via free certificate',
          type: 'string'
        },
        domainValidationMethod: {
          description: 'Method of domain validation for free cert',
          type: 'string'
        }
      },
      'x-ms-client-flatten': true
    }
  }
}
```
## Misc
The resource version is `2021-03-01`.

The Swagger schema used to generate this documentation can be found [here](https://github.com/Azure/azure-rest-api-specs/tree/main/specification/web/resource-manager/Microsoft.Web/stable/2021-03-01/Certificates.json).
