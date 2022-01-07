---
id: Secret
title: Secret
---
Provides a **Secret** from the **KeyVault** group
## Examples
### Create a secret
```js
provider.KeyVault.makeSecret({
  name: "mySecret",
  properties: () => ({ properties: { value: "secret-value" } }),
  dependencies: ({ resources }) => ({
    resourceGroup: resources.Resources.ResourceGroup["myResourceGroup"],
    vault: resources.KeyVault.Vault["myVault"],
  }),
});

```
## Dependencies
- [ResourceGroup](../Resources/ResourceGroup.md)
- [Vault](../KeyVault/Vault.md)
## Swagger Schema
```js
{
  properties: {
    tags: {
      type: 'object',
      additionalProperties: { type: 'string' },
      description: 'The tags that will be assigned to the secret. '
    },
    properties: {
      description: 'Properties of the secret',
      properties: {
        value: {
          type: 'string',
          description: "The value of the secret. NOTE: 'value' will never be returned from the service, as APIs using this model are is intended for internal use in ARM deployments. Users should use the data-plane REST service for interaction with vault secrets."
        },
        contentType: {
          type: 'string',
          description: 'The content type of the secret.'
        },
        attributes: {
          description: 'The attributes of the secret.',
          allOf: [
            {
              properties: {
                enabled: {
                  type: 'boolean',
                  description: 'Determines whether the object is enabled.'
                },
                nbf: {
                  'x-ms-client-name': 'NotBefore',
                  type: 'integer',
                  format: 'unixtime',
                  description: 'Not before date in seconds since 1970-01-01T00:00:00Z.'
                },
                exp: {
                  'x-ms-client-name': 'Expires',
                  type: 'integer',
                  format: 'unixtime',
                  description: 'Expiry date in seconds since 1970-01-01T00:00:00Z.'
                },
                created: {
                  type: 'integer',
                  format: 'unixtime',
                  readOnly: true,
                  description: 'Creation time in seconds since 1970-01-01T00:00:00Z.'
                },
                updated: {
                  type: 'integer',
                  format: 'unixtime',
                  readOnly: true,
                  description: 'Last updated time in seconds since 1970-01-01T00:00:00Z.'
                }
              },
              description: 'The object attributes managed by the KeyVault service.',
              type: 'object'
            }
          ],
          type: 'object'
        },
        secretUri: {
          type: 'string',
          description: 'The URI to retrieve the current version of the secret.',
          readOnly: true
        },
        secretUriWithVersion: {
          type: 'string',
          description: 'The URI to retrieve the specific version of the secret.',
          readOnly: true
        }
      },
      type: 'object'
    }
  },
  description: 'Parameters for creating or updating a secret',
  required: [ 'properties' ],
  'x-ms-azure-resource': true,
  type: 'object'
}
```
## Misc
The resource version is `2021-06-01-preview`.

The Swagger schema used to generate this documentation can be found [here](https://github.com/Azure/azure-rest-api-specs/tree/main/specification/keyvault/resource-manager/Microsoft.KeyVault/preview/2021-06-01-preview/secrets.json).
