---
id: PacketCapture
title: PacketCapture
---
Provides a **PacketCapture** from the **Network** group
## Examples
### Create packet capture
```js
exports.createResources = () => [
  {
    type: "PacketCapture",
    group: "Network",
    name: "myPacketCapture",
    properties: () => ({
      properties: {
        target:
          "/subscriptions/subid/resourceGroups/rg2/providers/Microsoft.Compute/virtualMachines/vm1",
        bytesToCapturePerPacket: 10000,
        totalBytesPerSession: 100000,
        timeLimitInSeconds: 100,
        storageLocation: {
          storageId:
            "/subscriptions/subid/resourceGroups/rg2/providers/Microsoft.Storage/storageAccounts/pcstore",
          storagePath:
            "https://mytestaccountname.blob.core.windows.net/capture/pc1.cap",
          filePath: "D:\\capture\\pc1.cap",
        },
        filters: [
          { protocol: "TCP", localIPAddress: "10.0.0.4", localPort: "80" },
        ],
      },
    }),
    dependencies: ({}) => ({
      resourceGroup: "myResourceGroup",
      networkWatcher: "myNetworkWatcher",
    }),
  },
];

```
## Dependencies
- [ResourceGroup](../Resources/ResourceGroup.md)
- [NetworkWatcher](../Network/NetworkWatcher.md)
## Swagger Schema
```json
{
  properties: {
    properties: {
      'x-ms-client-flatten': true,
      description: 'Properties of the packet capture.',
      properties: {
        target: {
          type: 'string',
          description: 'The ID of the targeted resource, only AzureVM and AzureVMSS as target type are currently supported.'
        },
        scope: {
          description: 'A list of AzureVMSS instances which can be included or excluded to run packet capture. If both included and excluded are empty, then the packet capture will run on all instances of AzureVMSS.',
          type: 'object',
          properties: {
            include: {
              type: 'array',
              description: 'List of AzureVMSS instances to run packet capture on.',
              items: { type: 'string' }
            },
            exclude: {
              type: 'array',
              description: 'List of AzureVMSS instances which has to be excluded from the AzureVMSS from running packet capture.',
              items: { type: 'string' }
            }
          }
        },
        targetType: {
          description: 'Target type of the resource provided.',
          type: 'string',
          enum: [ 'AzureVM', 'AzureVMSS' ],
          'x-ms-enum': { name: 'PacketCaptureTargetType', modelAsString: false }
        },
        bytesToCapturePerPacket: {
          type: 'integer',
          format: 'int64',
          minimum: 0,
          maximum: 4294967295,
          default: 0,
          description: 'Number of bytes captured per packet, the remaining bytes are truncated.'
        },
        totalBytesPerSession: {
          type: 'integer',
          format: 'int64',
          minimum: 0,
          maximum: 4294967295,
          default: 1073741824,
          description: 'Maximum size of the capture output.'
        },
        timeLimitInSeconds: {
          type: 'integer',
          format: 'int32',
          minimum: 0,
          maximum: 18000,
          default: 18000,
          description: 'Maximum duration of the capture session in seconds.'
        },
        storageLocation: {
          description: 'The storage location for a packet capture session.',
          properties: {
            storageId: {
              type: 'string',
              description: 'The ID of the storage account to save the packet capture session. Required if no local file path is provided.'
            },
            storagePath: {
              type: 'string',
              description: 'The URI of the storage path to save the packet capture. Must be a well-formed URI describing the location to save the packet capture.'
            },
            filePath: {
              type: 'string',
              description: 'A valid local path on the targeting VM. Must include the name of the capture file (*.cap). For linux virtual machine it must start with /var/captures. Required if no storage ID is provided, otherwise optional.'
            }
          }
        },
        filters: {
          type: 'array',
          items: {
            properties: {
              protocol: {
                type: 'string',
                enum: [ 'TCP', 'UDP', 'Any' ],
                'x-ms-enum': { name: 'PcProtocol', modelAsString: true },
                default: 'Any',
                description: 'Protocol to be filtered on.'
              },
              localIPAddress: {
                type: 'string',
                description: 'Local IP Address to be filtered on. Notation: "127.0.0.1" for single address entry. "127.0.0.1-127.0.0.255" for range. "127.0.0.1;127.0.0.5"? for multiple entries. Multiple ranges not currently supported. Mixing ranges with multiple entries not currently supported. Default = null.'
              },
              remoteIPAddress: {
                type: 'string',
                description: 'Local IP Address to be filtered on. Notation: "127.0.0.1" for single address entry. "127.0.0.1-127.0.0.255" for range. "127.0.0.1;127.0.0.5;" for multiple entries. Multiple ranges not currently supported. Mixing ranges with multiple entries not currently supported. Default = null.'
              },
              localPort: {
                type: 'string',
                description: 'Local port to be filtered on. Notation: "80" for single port entry."80-85" for range. "80;443;" for multiple entries. Multiple ranges not currently supported. Mixing ranges with multiple entries not currently supported. Default = null.'
              },
              remotePort: {
                type: 'string',
                description: 'Remote port to be filtered on. Notation: "80" for single port entry."80-85" for range. "80;443;" for multiple entries. Multiple ranges not currently supported. Mixing ranges with multiple entries not currently supported. Default = null.'
              }
            },
            description: 'Filter that is applied to packet capture request. Multiple filters can be applied.'
          },
          description: 'A list of packet capture filters.'
        }
      },
      required: [ 'target', 'storageLocation' ]
    }
  },
  required: [ 'properties' ],
  description: 'Parameters that define the create packet capture operation.'
}
```
## Misc
The resource version is `2022-01-01`.

The Swagger schema used to generate this documentation can be found [here](https://github.com/Azure/azure-rest-api-specs/tree/main/specification/network/resource-manager/Microsoft.Network/stable/2022-01-01/networkWatcher.json).
