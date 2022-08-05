---
id: Key
title: Key
---
Provides a **Key** from the **KeyVault** group
## Examples
### Create a key
```js
exports.createResources = () => [
  {
    type: "Key",
    group: "KeyVault",
    name: "myKey",
    properties: () => ({ properties: { kty: "RSA" } }),
    dependencies: ({}) => ({
      resourceGroup: "myResourceGroup",
      vault: "myVault",
    }),
  },
];

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
      description: 'The tags that will be assigned to the key.'
    },
    properties: {
      description: 'The properties of the key to be created.',
      properties: {
        attributes: {
          description: 'The attributes of the key.',
          properties: {
            enabled: {
              type: 'boolean',
              description: 'Determines whether or not the object is enabled.'
            },
            nbf: {
              'x-ms-client-name': 'NotBefore',
              type: 'integer',
              format: 'int64',
              description: 'Not before date in seconds since 1970-01-01T00:00:00Z.'
            },
            exp: {
              'x-ms-client-name': 'Expires',
              type: 'integer',
              format: 'int64',
              description: 'Expiry date in seconds since 1970-01-01T00:00:00Z.'
            },
            created: {
              type: 'integer',
              format: 'int64',
              readOnly: true,
              description: 'Creation time in seconds since 1970-01-01T00:00:00Z.'
            },
            updated: {
              type: 'integer',
              format: 'int64',
              readOnly: true,
              description: 'Last updated time in seconds since 1970-01-01T00:00:00Z.'
            },
            recoveryLevel: {
              type: 'string',
              description: "The deletion recovery level currently in effect for the object. If it contains 'Purgeable', then the object can be permanently deleted by a privileged user; otherwise, only the system can purge the object at the end of the retention interval.",
              enum: [
                'Purgeable',
                'Recoverable+Purgeable',
                'Recoverable',
                'Recoverable+ProtectedSubscription'
              ],
              'x-ms-enum': { name: 'DeletionRecoveryLevel', modelAsString: true },
              readOnly: true,
              'x-nullable': false
            },
            exportable: {
              type: 'boolean',
              description: 'Indicates if the private key can be exported.'
            }
          },
          type: 'object'
        },
        kty: {
          type: 'string',
          minLength: 1,
          description: 'The type of the key. For valid values, see JsonWebKeyType.',
          enum: [ 'EC', 'EC-HSM', 'RSA', 'RSA-HSM' ],
          'x-ms-enum': { name: 'JsonWebKeyType', modelAsString: true }
        },
        keyOps: {
          type: 'array',
          items: {
            type: 'string',
            description: 'The permitted JSON web key operations of the key. For more information, see JsonWebKeyOperation.',
            enum: [
              'encrypt', 'decrypt',
              'sign',    'verify',
              'wrapKey', 'unwrapKey',
              'import',  'release'
            ],
            'x-ms-enum': { name: 'JsonWebKeyOperation', modelAsString: true }
          }
        },
        keySize: {
          type: 'integer',
          format: 'int32',
          description: 'The key size in bits. For example: 2048, 3072, or 4096 for RSA.'
        },
        curveName: {
          type: 'string',
          description: 'The elliptic curve name. For valid values, see JsonWebKeyCurveName.',
          enum: [ 'P-256', 'P-384', 'P-521', 'P-256K' ],
          'x-ms-enum': { name: 'JsonWebKeyCurveName', modelAsString: true }
        },
        keyUri: {
          type: 'string',
          description: 'The URI to retrieve the current version of the key.',
          readOnly: true
        },
        keyUriWithVersion: {
          type: 'string',
          description: 'The URI to retrieve the specific version of the key.',
          readOnly: true
        },
        rotationPolicy: {
          description: 'Key rotation policy in response. It will be used for both output and input. Omitted if empty',
          properties: {
            attributes: {
              description: 'The attributes of key rotation policy.',
              properties: {
                created: {
                  type: 'integer',
                  format: 'int64',
                  readOnly: true,
                  description: 'Creation time in seconds since 1970-01-01T00:00:00Z.'
                },
                updated: {
                  type: 'integer',
                  format: 'int64',
                  readOnly: true,
                  description: 'Last updated time in seconds since 1970-01-01T00:00:00Z.'
                },
                expiryTime: {
                  type: 'string',
                  description: "The expiration time for the new key version. It should be in ISO8601 format. Eg: 'P90D', 'P1Y'."
                }
              },
              type: 'object'
            },
            lifetimeActions: {
              type: 'array',
              items: {
                properties: {
                  trigger: {
                    description: 'The trigger of key rotation policy lifetimeAction.',
                    properties: {
                      timeAfterCreate: {
                        type: 'string',
                        description: "The time duration after key creation to rotate the key. It only applies to rotate. It will be in ISO 8601 duration format. Eg: 'P90D', 'P1Y'."
                      },
                      timeBeforeExpiry: {
                        type: 'string',
                        description: "The time duration before key expiring to rotate or notify. It will be in ISO 8601 duration format. Eg: 'P90D', 'P1Y'."
                      }
                    },
                    type: 'object'
                  },
                  action: {
                    description: 'The action of key rotation policy lifetimeAction.',
                    properties: {
                      type: {
                        type: 'string',
                        description: 'The type of action.',
                        enum: [ 'rotate', 'notify' ],
                        'x-ms-enum': {
                          name: 'KeyRotationPolicyActionType',
                          modelAsString: false
                        }
                      }
                    },
                    type: 'object'
                  }
                },
                type: 'object'
              },
              description: 'The lifetimeActions for key rotation action.'
            }
          },
          type: 'object'
        },
        release_policy: {
          description: 'Key release policy in response. It will be used for both output and input. Omitted if empty',
          properties: {
            contentType: {
              description: 'Content type and version of key release policy',
              type: 'string',
              default: 'application/json; charset=utf-8'
            },
            data: {
              description: 'Blob encoding the policy rules under which the key can be released.',
              type: 'string',
              format: 'base64url'
            }
          },
          type: 'object'
        }
      },
      type: 'object'
    }
  },
  description: 'The parameters used to create a key.',
  required: [ 'properties' ],
  'x-ms-azure-resource': true,
  type: 'object'
}
```
## Misc
The resource version is `2022-07-01`.

The Swagger schema used to generate this documentation can be found [here](https://github.com/Azure/azure-rest-api-specs/tree/main/specification/keyvault/resource-manager/Microsoft.KeyVault/stable/2022-07-01/keys.json).
