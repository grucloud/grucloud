---
id: ObjectReplicationPolicy
title: ObjectReplicationPolicy
---
Provides a **ObjectReplicationPolicy** from the **Storage** group
## Examples
### StorageAccountCreateObjectReplicationPolicyOnDestination
```js
exports.createResources = () => [
  {
    type: "ObjectReplicationPolicy",
    group: "Storage",
    name: "myObjectReplicationPolicy",
    properties: () => ({
      properties: {
        sourceAccount: "src1122",
        destinationAccount: "dst112",
        rules: [
          {
            sourceContainer: "scont139",
            destinationContainer: "dcont139",
            filters: { prefixMatch: ["blobA", "blobB"] },
          },
        ],
      },
    }),
    dependencies: ({}) => ({
      resourceGroup: "myResourceGroup",
      account: "myStorageAccount",
    }),
  },
];

```

### StorageAccountCreateObjectReplicationPolicyOnSource
```js
exports.createResources = () => [
  {
    type: "ObjectReplicationPolicy",
    group: "Storage",
    name: "myObjectReplicationPolicy",
    properties: () => ({
      properties: {
        sourceAccount: "src1122",
        destinationAccount: "dst112",
        rules: [
          {
            ruleId: "d5d18a48-8801-4554-aeaa-74faf65f5ef9",
            sourceContainer: "scont139",
            destinationContainer: "dcont139",
            filters: {
              prefixMatch: ["blobA", "blobB"],
              minCreationTime: "2020-02-19T16:05:00Z",
            },
          },
        ],
      },
    }),
    dependencies: ({}) => ({
      resourceGroup: "myResourceGroup",
      account: "myStorageAccount",
    }),
  },
];

```

### StorageAccountUpdateObjectReplicationPolicyOnDestination
```js
exports.createResources = () => [
  {
    type: "ObjectReplicationPolicy",
    group: "Storage",
    name: "myObjectReplicationPolicy",
    properties: () => ({
      properties: {
        sourceAccount: "src1122",
        destinationAccount: "dst112",
        rules: [
          {
            ruleId: "d5d18a48-8801-4554-aeaa-74faf65f5ef9",
            sourceContainer: "scont139",
            destinationContainer: "dcont139",
            filters: { prefixMatch: ["blobA", "blobB"] },
          },
          { sourceContainer: "scont179", destinationContainer: "dcont179" },
        ],
      },
    }),
    dependencies: ({}) => ({
      resourceGroup: "myResourceGroup",
      account: "myStorageAccount",
    }),
  },
];

```

### StorageAccountUpdateObjectReplicationPolicyOnSource
```js
exports.createResources = () => [
  {
    type: "ObjectReplicationPolicy",
    group: "Storage",
    name: "myObjectReplicationPolicy",
    properties: () => ({
      properties: {
        sourceAccount: "src1122",
        destinationAccount: "dst112",
        rules: [
          {
            ruleId: "d5d18a48-8801-4554-aeaa-74faf65f5ef9",
            sourceContainer: "scont139",
            destinationContainer: "dcont139",
            filters: { prefixMatch: ["blobA", "blobB"] },
          },
          {
            ruleId: "cfbb4bc2-8b60-429f-b05a-d1e0942b33b2",
            sourceContainer: "scont179",
            destinationContainer: "dcont179",
          },
        ],
      },
    }),
    dependencies: ({}) => ({
      resourceGroup: "myResourceGroup",
      account: "myStorageAccount",
    }),
  },
];

```
## Dependencies
- [ResourceGroup](../Resources/ResourceGroup.md)
- [StorageAccount](../Storage/StorageAccount.md)
## Swagger Schema
```json
{
  properties: {
    properties: {
      'x-ms-client-flatten': true,
      description: 'Returns the Storage Account Object Replication Policy.',
      properties: {
        policyId: {
          readOnly: true,
          type: 'string',
          description: 'A unique id for object replication policy.'
        },
        enabledTime: {
          readOnly: true,
          type: 'string',
          format: 'date-time',
          description: 'Indicates when the policy is enabled on the source account.'
        },
        sourceAccount: {
          type: 'string',
          description: 'Required. Source account name. It should be full resource id if allowCrossTenantReplication set to false.'
        },
        destinationAccount: {
          type: 'string',
          description: 'Required. Destination account name. It should be full resource id if allowCrossTenantReplication set to false.'
        },
        rules: {
          type: 'array',
          items: {
            properties: {
              ruleId: {
                type: 'string',
                description: 'Rule Id is auto-generated for each new rule on destination account. It is required for put policy on source account.'
              },
              sourceContainer: {
                type: 'string',
                description: 'Required. Source container name.'
              },
              destinationContainer: {
                type: 'string',
                description: 'Required. Destination container name.'
              },
              filters: {
                description: 'Optional. An object that defines the filter set.',
                properties: {
                  prefixMatch: {
                    type: 'array',
                    items: { type: 'string' },
                    description: 'Optional. Filters the results to replicate only blobs whose names begin with the specified prefix.'
                  },
                  minCreationTime: {
                    type: 'string',
                    description: "Blobs created after the time will be replicated to the destination. It must be in datetime format 'yyyy-MM-ddTHH:mm:ssZ'. Example: 2020-02-19T16:05:00Z"
                  }
                }
              }
            },
            required: [ 'sourceContainer', 'destinationContainer' ],
            description: 'The replication policy rule between two containers.'
          },
          description: 'The storage account object replication rules.'
        }
      },
      required: [ 'sourceAccount', 'destinationAccount' ]
    }
  },
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
  ],
  description: 'The replication policy between two storage accounts. Multiple rules can be defined in one policy.'
}
```
## Misc
The resource version is `2022-05-01`.

The Swagger schema used to generate this documentation can be found [here](https://github.com/Azure/azure-rest-api-specs/tree/main/specification/storage/resource-manager/Microsoft.Storage/stable/2022-05-01/storage.json).
