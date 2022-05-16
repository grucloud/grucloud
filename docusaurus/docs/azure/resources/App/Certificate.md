---
id: Certificate
title: Certificate
---
Provides a **Certificate** from the **App** group
## Examples
### Create or Update Certificate
```js
exports.createResources = () => [
  {
    type: "Certificate",
    group: "App",
    name: "myCertificate",
    properties: () => ({
      location: "East US",
      properties: {
        password: "private key password",
        value: "PFX-or-PEM-blob",
      },
    }),
    dependencies: ({}) => ({
      resourceGroup: "myResourceGroup",
      environment: "myManagedEnvironment",
    }),
  },
];

```
## Dependencies
- [ResourceGroup](../Resources/ResourceGroup.md)
- [ManagedEnvironment](../App/ManagedEnvironment.md)
## Swagger Schema
```js
{
  description: 'Certificate used for Custom Domain bindings of Container Apps in a Managed Environment',
  type: 'object',
  allOf: [
    {
      title: 'Tracked Resource',
      description: "The resource model definition for an Azure Resource Manager tracked top level resource which has 'tags' and a 'location'",
      type: 'object',
      properties: {
        tags: {
          type: 'object',
          additionalProperties: { type: 'string' },
          'x-ms-mutability': [ 'read', 'create', 'update' ],
          description: 'Resource tags.'
        },
        location: {
          type: 'string',
          'x-ms-mutability': [ 'read', 'create' ],
          description: 'The geo-location where the resource lives'
        }
      },
      required: [ 'location' ],
      allOf: [
        {
          title: 'Resource',
          description: 'Common fields that are returned in the response for all Azure Resource Manager resources',
          type: 'object',
          properties: {
            id: {
              readOnly: true,
              type: 'string',
              description: 'Fully qualified resource ID for the resource. Ex - /subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/{resourceProviderNamespace}/{resourceType}/{resourceName}'
            },
            name: {
              readOnly: true,
              type: 'string',
              description: 'The name of the resource'
            },
            type: {
              readOnly: true,
              type: 'string',
              description: 'The type of the resource. E.g. "Microsoft.Compute/virtualMachines" or "Microsoft.Storage/storageAccounts"'
            },
            systemData: {
              readOnly: true,
              type: 'object',
              description: 'Azure Resource Manager metadata containing createdBy and modifiedBy information.',
              properties: {
                createdBy: {
                  type: 'string',
                  description: 'The identity that created the resource.'
                },
                createdByType: {
                  type: 'string',
                  description: 'The type of identity that created the resource.',
                  enum: [ 'User', 'Application', 'ManagedIdentity', 'Key' ],
                  'x-ms-enum': { name: 'createdByType', modelAsString: true }
                },
                createdAt: {
                  type: 'string',
                  format: 'date-time',
                  description: 'The timestamp of resource creation (UTC).'
                },
                lastModifiedBy: {
                  type: 'string',
                  description: 'The identity that last modified the resource.'
                },
                lastModifiedByType: {
                  type: 'string',
                  description: 'The type of identity that last modified the resource.',
                  enum: [ 'User', 'Application', 'ManagedIdentity', 'Key' ],
                  'x-ms-enum': { name: 'createdByType', modelAsString: true }
                },
                lastModifiedAt: {
                  type: 'string',
                  format: 'date-time',
                  description: 'The timestamp of resource last modification (UTC)'
                }
              }
            }
          },
          'x-ms-azure-resource': true
        }
      ]
    }
  ],
  properties: {
    properties: {
      description: 'Certificate resource specific properties',
      type: 'object',
      properties: {
        provisioningState: {
          description: 'Provisioning state of the certificate.',
          enum: [
            'Succeeded',
            'Failed',
            'Canceled',
            'DeleteFailed',
            'Pending'
          ],
          type: 'string',
          readOnly: true,
          'x-ms-enum': { name: 'CertificateProvisioningState', modelAsString: true }
        },
        password: {
          description: 'Certificate password.',
          type: 'string',
          'x-ms-mutability': [ 'create' ],
          'x-ms-secret': true
        },
        subjectName: {
          description: 'Subject name of the certificate.',
          type: 'string',
          readOnly: true
        },
        value: {
          format: 'byte',
          description: 'PFX or PEM blob',
          type: 'string',
          'x-ms-mutability': [ 'create' ],
          'x-ms-secret': true
        },
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
        publicKeyHash: {
          description: 'Public key hash.',
          type: 'string',
          readOnly: true
        }
      }
    }
  },
  'x-ms-client-flatten': true
}
```
## Misc
The resource version is `2022-03-01`.

The Swagger schema used to generate this documentation can be found [here](https://github.com/Azure/azure-rest-api-specs/tree/main/specification/app/resource-manager/Microsoft.App/stable/2022-03-01/ManagedEnvironments.json).
