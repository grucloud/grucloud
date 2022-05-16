---
id: ManagedEnvironment
title: ManagedEnvironment
---
Provides a **ManagedEnvironment** from the **App** group
## Examples
### Create environments
```js
exports.createResources = () => [
  {
    type: "ManagedEnvironment",
    group: "App",
    name: "myManagedEnvironment",
    properties: () => ({
      location: "East US",
      properties: {
        daprAIConnectionString:
          "InstrumentationKey=00000000-0000-0000-0000-000000000000;IngestionEndpoint=https://northcentralus-0.in.applicationinsights.azure.com/",
        appLogsConfiguration: {
          logAnalyticsConfiguration: {
            customerId: "string",
            sharedKey: "string",
          },
        },
        zoneRedundant: true,
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
  description: 'An environment for hosting container apps',
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
      description: 'Managed environment resource specific properties',
      type: 'object',
      properties: {
        provisioningState: {
          description: 'Provisioning state of the Environment.',
          enum: [
            'Succeeded',
            'Failed',
            'Canceled',
            'Waiting',
            'InitializationInProgress',
            'InfrastructureSetupInProgress',
            'InfrastructureSetupComplete',
            'ScheduledForDelete',
            'UpgradeRequested',
            'UpgradeFailed'
          ],
          type: 'string',
          readOnly: true,
          'x-ms-enum': { name: 'EnvironmentProvisioningState', modelAsString: true }
        },
        daprAIInstrumentationKey: {
          type: 'string',
          description: 'Azure Monitor instrumentation key used by Dapr to export Service to Service communication telemetry',
          'x-ms-mutability': [ 'create', 'read' ],
          'x-ms-secret': true
        },
        daprAIConnectionString: {
          type: 'string',
          description: 'Application Insights connection string used by Dapr to export Service to Service communication telemetry',
          'x-ms-mutability': [ 'create', 'read' ],
          'x-ms-secret': true
        },
        vnetConfiguration: {
          description: 'Vnet configuration for the environment',
          type: 'object',
          properties: {
            internal: {
              type: 'boolean',
              description: 'Boolean indicating the environment only has an internal load balancer. These environments do not have a public static IP resource, must provide ControlPlaneSubnetResourceId and AppSubnetResourceId if enabling this property',
              'x-ms-mutability': [ 'create', 'read' ]
            },
            infrastructureSubnetId: {
              type: 'string',
              description: 'Resource ID of a subnet for infrastructure components. This subnet must be in the same VNET as the subnet defined in runtimeSubnetId. Must not overlap with any other provided IP ranges.',
              'x-ms-mutability': [ 'create', 'read' ]
            },
            runtimeSubnetId: {
              type: 'string',
              description: 'Resource ID of a subnet that Container App containers are injected into. This subnet must be in the same VNET as the subnet defined in infrastructureSubnetId. Must not overlap with any other provided IP ranges.',
              'x-ms-mutability': [ 'create', 'read' ]
            },
            dockerBridgeCidr: {
              type: 'string',
              description: 'CIDR notation IP range assigned to the Docker bridge, network. Must not overlap with any other provided IP ranges.',
              'x-ms-mutability': [ 'create', 'read' ]
            },
            platformReservedCidr: {
              type: 'string',
              description: 'IP range in CIDR notation that can be reserved for environment infrastructure IP addresses. Must not overlap with any other provided IP ranges.',
              'x-ms-mutability': [ 'create', 'read' ]
            },
            platformReservedDnsIP: {
              type: 'string',
              description: ' An IP address from the IP range defined by platformReservedCidr that will be reserved for the internal DNS server.',
              'x-ms-mutability': [ 'create', 'read' ]
            }
          }
        },
        deploymentErrors: {
          description: 'Any errors that occurred during deployment or deployment validation',
          type: 'string',
          readOnly: true
        },
        defaultDomain: {
          description: 'Default Domain Name for the cluster',
          type: 'string',
          readOnly: true
        },
        staticIp: {
          description: 'Static IP of the Environment',
          type: 'string',
          readOnly: true
        },
        appLogsConfiguration: {
          description: 'Cluster configuration which enables the log daemon to export\n' +
            'app logs to a destination. Currently only "log-analytics" is\n' +
            'supported',
          type: 'object',
          properties: {
            destination: { description: 'Logs destination', type: 'string' },
            logAnalyticsConfiguration: {
              description: 'Log Analytics configuration',
              type: 'object',
              properties: {
                customerId: {
                  description: 'Log analytics customer id',
                  type: 'string'
                },
                sharedKey: {
                  description: 'Log analytics customer key',
                  type: 'string',
                  'x-ms-mutability': [ 'create', 'update' ],
                  'x-ms-secret': true
                }
              }
            }
          }
        },
        zoneRedundant: {
          description: 'Whether or not this Managed Environment is zone-redundant.',
          type: 'boolean',
          'x-ms-mutability': [ 'create', 'read' ]
        }
      },
      'x-ms-client-flatten': true
    }
  }
}
```
## Misc
The resource version is `2022-03-01`.

The Swagger schema used to generate this documentation can be found [here](https://github.com/Azure/azure-rest-api-specs/tree/main/specification/app/resource-manager/Microsoft.App/stable/2022-03-01/ManagedEnvironments.json).
