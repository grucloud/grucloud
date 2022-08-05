---
id: Fleet
title: Fleet
---
Provides a **Fleet** from the **ContainerService** group
## Examples
### Creates or update a fleet resource
```js
exports.createResources = () => [
  {
    type: "Fleet",
    group: "ContainerService",
    name: "myFleet",
    properties: () => ({
      tags: { tier: "production", archv2: "" },
      location: "East US",
      properties: { hubProfile: { dnsPrefix: "dnsprefix1" } },
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
  type: 'object',
  properties: {
    etag: { type: 'string', readOnly: true, description: 'Resource Etag.' },
    properties: {
      description: 'Properties of a Fleet.',
      'x-ms-client-flatten': true,
      type: 'object',
      properties: {
        hubProfile: {
          description: "The FleetHubProfile configures the Fleet's hub.",
          type: 'object',
          properties: {
            dnsPrefix: {
              type: 'string',
              'x-ms-mutability': [ 'read', 'create' ],
              description: 'DNS prefix used to create the FQDN for the Fleet hub.'
            },
            fqdn: {
              readOnly: true,
              type: 'string',
              description: 'The FQDN of the Fleet hub.'
            },
            kubernetesVersion: {
              readOnly: true,
              type: 'string',
              description: 'The Kubernetes version of the Fleet hub.'
            }
          }
        },
        provisioningState: {
          readOnly: true,
          type: 'string',
          'x-ms-enum': { name: 'FleetProvisioningState', modelAsString: true },
          enum: [
            'Succeeded',
            'Failed',
            'Canceled',
            'Creating',
            'Deleting',
            'Updating'
          ],
          description: 'The provisioning state of the last accepted operation.'
        }
      }
    }
  },
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
  description: 'The Fleet resource which contains multiple Kubernetes clusters as its members.'
}
```
## Misc
The resource version is `2022-06-02-preview`.

The Swagger schema used to generate this documentation can be found [here](https://github.com/Azure/azure-rest-api-specs/tree/main/specification/containerservice/resource-manager/Microsoft.ContainerService/preview/2022-06-02-preview/fleets.json).
