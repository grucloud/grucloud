---
id: FederatedIdentityCredential
title: FederatedIdentityCredential
---
Provides a **FederatedIdentityCredential** from the **ManagedIdentity** group
## Examples
### FederatedIdentityCredentialCreate
```js
exports.createResources = () => [
  {
    type: "FederatedIdentityCredential",
    group: "ManagedIdentity",
    name: "myFederatedIdentityCredential",
    properties: () => ({
      properties: {
        issuer: "https://oidc.prod-aks.azure.com/IssuerGUID",
        subject: "system:serviceaccount:ns:svcaccount",
        audiences: ["api://AzureADTokenExchange"],
      },
    }),
    dependencies: ({}) => ({
      resourceGroup: "myResourceGroup",
      resource: "myUserAssignedIdentity",
    }),
  },
];

```
## Dependencies
- [ResourceGroup](../Resources/ResourceGroup.md)
- [UserAssignedIdentity](../ManagedIdentity/UserAssignedIdentity.md)
## Swagger Schema
```js
{
  type: 'object',
  properties: {
    properties: {
      'x-ms-client-flatten': true,
      description: 'The properties associated with the federated identity credential.',
      type: 'object',
      title: 'Federated identity credential properties.',
      required: [ 'issuer', 'subject', 'audiences' ],
      properties: {
        issuer: {
          type: 'string',
          format: 'uri',
          description: 'The URL of the issuer to be trusted.'
        },
        subject: {
          type: 'string',
          description: 'The identifier of the external identity.'
        },
        audiences: {
          type: 'array',
          items: { type: 'string' },
          description: 'The list of audiences that can appear in the issued token.'
        }
      }
    }
  },
  allOf: [
    {
      title: 'Proxy Resource',
      description: 'The resource model definition for a Azure Resource Manager proxy resource. It will not have tags and a location',
      type: 'object',
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
            }
          },
          'x-ms-azure-resource': true
        }
      ]
    }
  ],
  description: 'Describes a federated identity credential.'
}
```
## Misc
The resource version is `2022-01-31-preview`.

The Swagger schema used to generate this documentation can be found [here](https://github.com/Azure/azure-rest-api-specs/tree/main/specification/msi/resource-manager/Microsoft.ManagedIdentity/preview/2022-01-31-preview/ManagedIdentity.json).
