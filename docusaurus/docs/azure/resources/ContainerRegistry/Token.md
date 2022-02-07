---
id: Token
title: Token
---
Provides a **Token** from the **ContainerRegistry** group
## Examples
### TokenCreate
```js
provider.ContainerRegistry.makeToken({
  name: "myToken",
  properties: () => ({
    properties: {
      scopeMapId:
        "/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/myResourceGroup/providers/Microsoft.ContainerRegistry/registries/myRegistry/scopeMaps/myScopeMap",
      status: "disabled",
      credentials: {
        certificates: [
          {
            name: "certificate1",
            encodedPemCertificate:
              "LS0tLS1CRUdJTiBDRVJUSUZJQ0FURS0tLS0tCk1JSUc3akNDQk5hZ0F3SUJBZ0lURmdBQlR3UVpyZGdmdmhxdzBnQUFBQUZQQkRBTkJna3Foa2lHOXcwQkFRc0YKQURDQml6RUxNQWtHQTFVRUJoTUNWVk14RXpBUkJnTlZCQWdUQ2xkaGMyaHBibWQwYjI0eEVEQU9CZ05WQkFjVApCMUpsWkcxdmJtUXhIakFjQmdOVkJBb1RGVTFwWTNKdmMyOW1kQ0JEYjNKd2IzSmhkR2x2YmpFVk1CTUdBMVVFCkN4TU1UV2xqY205emIyWjBJRWxVTVI0d0hBWURWUVFERXhWTmFXTnliM052Wm5RZ1NWUWdWRXhUSUVOQklEUXcKSGhjTk1UZ3dOREV5TWpJek1qUTRXaGNOTWpBd05ERXlNakl6TWpRNFdqQTVNVGN3TlFZRFZRUURFeTV6WlhKMgphV05sWTJ4cFpXNTBZMlZ5ZEMxd1lYSjBibVZ5TG0xaGJtRm5aVzFsYm5RdVlYcDFjbVV1WTI5dE1JSUJJakFOCkJna3Foa2lHOXcwQkFRRUZBQU9DQVE4QU1JSUJDZ0tDQVFFQTBSYjdJcHpxMmR4emhhbVpyS1ZDakMzeTQyYlYKUnNIY2pCUTFuSDBHZ1puUDhXeDZDSE1mWThybkVJQzRLeVRRYkJXVzhnNXlmc3NSQ0ZXbFpxYjR6SkRXS0pmTgpGSmNMUm9LNnhwTktZYVZVTkVlT25IdUxHYTM0ZlA0VjBFRjZybzdvbkRLME5zanhjY1dZVzRNVXVzc0xrQS94CkUrM2RwU1REdk1KcjJoWUpsVnFDcVR6blQvbmZaVUZzQUVEQnp5MUpOOHZiZDlIR2czc2Myd0x4dk95cFJOc0gKT1V3V2pmN2xzWWZleEVlcWkzY29EeHc2alpLVWEyVkdsUnBpTkowMjhBQitYSi9TU1FVNVBsd0JBbU9TT3ovRApGY0NKdGpPZlBqU1NKckFIQVV3SHU3RzlSV05JTFBwYU9zQ1J5eitETE5zNGpvNlEvUUg4d1lManJRSURBUUFCCm80SUNtakNDQXBZd0N3WURWUjBQQkFRREFnU3dNQjBHQTFVZEpRUVdNQlFHQ0NzR0FRVUZCd01DQmdnckJnRUYKQlFjREFUQWRCZ05WSFE0RUZnUVVlbEdkVVJrZzJoSFFOWEQ4WUc4L3drdjJVT0F3SHdZRFZSMGpCQmd3Rm9BVQplbnVNd2Mvbm9Nb2MxR3Y2KytFend3OGFvcDB3Z2F3R0ExVWRId1NCcERDQm9UQ0JucUNCbTZDQm1JWkxhSFIwCmNEb3ZMMjF6WTNKc0xtMXBZM0p2YzI5bWRDNWpiMjB2Y0d0cEwyMXpZMjl5Y0M5amNtd3ZUV2xqY205emIyWjAKSlRJd1NWUWxNakJVVEZNbE1qQkRRU1V5TURRdVkzSnNoa2xvZEhSd09pOHZZM0pzTG0xcFkzSnZjMjltZEM1agpiMjB2Y0d0cEwyMXpZMjl5Y0M5amNtd3ZUV2xqY205emIyWjBKVEl3U1ZRbE1qQlVURk1sTWpCRFFTVXlNRFF1ClkzSnNNSUdGQmdnckJnRUZCUWNCQVFSNU1IY3dVUVlJS3dZQkJRVUhNQUtHUldoMGRIQTZMeTkzZDNjdWJXbGoKY205emIyWjBMbU52YlM5d2Eya3ZiWE5qYjNKd0wwMXBZM0p2YzI5bWRDVXlNRWxVSlRJd1ZFeFRKVEl3UTBFbApNakEwTG1OeWREQWlCZ2dyQmdFRkJRY3dBWVlXYUhSMGNEb3ZMMjlqYzNBdWJYTnZZM053TG1OdmJUQStCZ2tyCkJnRUVBWUkzRlFjRU1UQXZCaWNyQmdFRUFZSTNGUWlIMm9aMWcrN1pBWUxKaFJ1QnRaNWhoZlRyWUlGZGhOTGYKUW9Mbmszb0NBV1FDQVIwd1RRWURWUjBnQkVZd1JEQkNCZ2tyQmdFRUFZSTNLZ0V3TlRBekJnZ3JCZ0VGQlFjQwpBUlluYUhSMGNEb3ZMM2QzZHk1dGFXTnliM052Wm5RdVkyOXRMM0JyYVM5dGMyTnZjbkF2WTNCek1DY0dDU3NHCkFRUUJnamNWQ2dRYU1CZ3dDZ1lJS3dZQkJRVUhBd0l3Q2dZSUt3WUJCUVVIQXdFd09RWURWUjBSQkRJd01JSXUKYzJWeWRtbGpaV05zYVdWdWRHTmxjblF0Y0dGeWRHNWxjaTV0WVc1aFoyVnRaVzUwTG1GNmRYSmxMbU52YlRBTgpCZ2txaGtpRzl3MEJBUXNGQUFPQ0FnRUFIVXIzbk1vdUI5WWdDUlRWYndUTllIS2RkWGJkSW1GUXNDYys4T1g1CjE5c0N6dFFSR05iSXEwVW1Ba01MbFVvWTIxckh4ZXdxU2hWczFhL2RwaFh5Tk1pcUdaU2QzU1BtYzZscitqUFQKNXVEREs0MUlWeXN0K2VUNlpyazFvcCtMVmdkeS9EU2lyNzVqcWZFY016bS82bU8rNnFNeWRLTWtVYmM5K3JHVwphUkpUcjRWUUdIRmEwNEIwZVZpNUd4MG9pL2RpZDNSaXg2aXJMMjFJSGEwYjN6c1hzZHpHU0R2K3hqL2Q2S0l4Ckdrd2FhYmZvU1NoQnFqaFNlQ0VyZXFlb1RpYjljdGw0MGRVdUp3THl4bjhHS2N6K3AvMEJUOEIxU3lYK01OQ2wKY0pkMjVtMjhLajY2TGUxOEVyeFlJYXZJVGVGa3Y2eGZjdkEvcHladDdPaU41QTlGQk1IUmpQK1kyZ2tvdjMrcQpISFRUZG4xNnlRajduNit3YlFHNGVleXc0YisyQkRLcUxNVFU2ZmlSQ3ZPM2FPZVBLSFVNN3R4b1FidWl6Z3NzCkNiMzl3QnJOTEZsMkJLQ1RkSCtkSU9oZVJiSkZvbmlwOGRPOUVFZWdSSG9lQW54ZUlYTFBrdXMzTzEvZjRhNkIKWHQ3RG5BUm8xSzJmeEp3VXRaU2MvR3dFSjU5NzlnRXlEa3pDZEVsLzdpWE9QZXVjTXhlM2xVM2pweUtsNERUaApjSkJqQytqNGpLWTFrK1U4b040aGdqYnJISUx6Vnd2eU15OU5KS290U3BMSjQxeHdPOHlGangxalFTT3Bxc0N1ClFhUFUvTjhSZ0hxWjBGTkFzS3dNUmZ6WmdXanRCNzRzYUVEdk5jVmNuNFhCQnFNSG0ydHo2Uzk3d3kxZGt0cTgKSE5BPQotLS0tLUVORCBDRVJUSUZJQ0FURS0tLS0tCg==",
          },
        ],
      },
    },
  }),
  dependencies: ({}) => ({
    resourceGroup: "myResourceGroup",
    scopeMap: "myScopeMap",
    registry: "myRegistry",
  }),
});

```
## Dependencies
- [ResourceGroup](../Resources/ResourceGroup.md)
- [ScopeMap](../ContainerRegistry/ScopeMap.md)
- [Registry](../ContainerRegistry/Registry.md)
## Swagger Schema
```js
{
  description: 'An object that represents a token for a container registry.',
  type: 'object',
  allOf: [
    {
      description: 'The resource model definition for a ARM proxy resource. It will have everything other than required location and tags.',
      properties: {
        id: {
          description: 'The resource ID.',
          type: 'string',
          readOnly: true
        },
        name: {
          description: 'The name of the resource.',
          type: 'string',
          readOnly: true
        },
        type: {
          description: 'The type of the resource.',
          type: 'string',
          readOnly: true
        },
        systemData: {
          description: 'Metadata pertaining to creation and last modification of the resource.',
          type: 'object',
          readOnly: true,
          properties: {
            createdBy: {
              description: 'The identity that created the resource.',
              type: 'string'
            },
            createdByType: {
              description: 'The type of identity that created the resource.',
              enum: [ 'User', 'Application', 'ManagedIdentity', 'Key' ],
              type: 'string',
              'x-ms-enum': { name: 'createdByType', modelAsString: true }
            },
            createdAt: {
              format: 'date-time',
              description: 'The timestamp of resource creation (UTC).',
              type: 'string'
            },
            lastModifiedBy: {
              description: 'The identity that last modified the resource.',
              type: 'string'
            },
            lastModifiedByType: {
              description: 'The type of identity that last modified the resource.',
              enum: [ 'User', 'Application', 'ManagedIdentity', 'Key' ],
              type: 'string',
              'x-ms-enum': { name: 'lastModifiedByType', modelAsString: true }
            },
            lastModifiedAt: {
              format: 'date-time',
              description: 'The timestamp of resource modification (UTC).',
              type: 'string'
            }
          }
        }
      },
      'x-ms-azure-resource': true
    }
  ],
  properties: {
    properties: {
      description: 'The properties of the token.',
      'x-ms-client-flatten': true,
      type: 'object',
      properties: {
        creationDate: {
          format: 'date-time',
          description: 'The creation date of scope map.',
          type: 'string',
          readOnly: true
        },
        provisioningState: {
          description: 'Provisioning state of the resource.',
          enum: [
            'Creating',
            'Updating',
            'Deleting',
            'Succeeded',
            'Failed',
            'Canceled'
          ],
          type: 'string',
          readOnly: true,
          'x-ms-enum': { name: 'ProvisioningState', modelAsString: true }
        },
        scopeMapId: {
          description: 'The resource ID of the scope map to which the token will be associated with.',
          type: 'string'
        },
        credentials: {
          description: 'The credentials that can be used for authenticating the token.',
          type: 'object',
          properties: {
            certificates: {
              type: 'array',
              items: {
                description: 'The properties of a certificate used for authenticating a token.',
                type: 'object',
                properties: {
                  name: {
                    enum: [ 'certificate1', 'certificate2' ],
                    type: 'string',
                    'x-ms-enum': {
                      name: 'TokenCertificateName',
                      modelAsString: true
                    }
                  },
                  expiry: {
                    format: 'date-time',
                    description: 'The expiry datetime of the certificate.',
                    type: 'string'
                  },
                  thumbprint: {
                    description: 'The thumbprint of the certificate.',
                    type: 'string'
                  },
                  encodedPemCertificate: {
                    description: 'Base 64 encoded string of the public certificate1 in PEM format that will be used for authenticating the token.',
                    type: 'string'
                  }
                }
              }
            },
            passwords: {
              type: 'array',
              items: {
                description: 'The password that will be used for authenticating the token of a container registry.',
                type: 'object',
                properties: {
                  creationTime: {
                    format: 'date-time',
                    description: 'The creation datetime of the password.',
                    type: 'string'
                  },
                  expiry: {
                    format: 'date-time',
                    description: 'The expiry datetime of the password.',
                    type: 'string'
                  },
                  name: {
                    description: 'The password name "password1" or "password2"',
                    enum: [ 'password1', 'password2' ],
                    type: 'string',
                    'x-ms-enum': { name: 'TokenPasswordName', modelAsString: true }
                  },
                  value: {
                    description: 'The password value.',
                    type: 'string',
                    readOnly: true
                  }
                }
              }
            }
          }
        },
        status: {
          description: 'The status of the token example enabled or disabled.',
          enum: [ 'enabled', 'disabled' ],
          type: 'string',
          'x-ms-enum': { name: 'TokenStatus', modelAsString: true }
        }
      }
    }
  }
}
```
## Misc
The resource version is `2021-12-01-preview`.

The Swagger schema used to generate this documentation can be found [here](https://github.com/Azure/azure-rest-api-specs/tree/main/specification/containerregistry/resource-manager/Microsoft.ContainerRegistry/preview/2021-12-01-preview/containerregistry.json).
