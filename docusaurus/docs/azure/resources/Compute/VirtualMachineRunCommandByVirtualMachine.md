---
id: VirtualMachineRunCommandByVirtualMachine
title: VirtualMachineRunCommandByVirtualMachine
---
Provides a **VirtualMachineRunCommandByVirtualMachine** from the **Compute** group
## Examples
### Create or update a run command.
```js
exports.createResources = () => [
  {
    type: "VirtualMachineRunCommandByVirtualMachine",
    group: "Compute",
    name: "myVirtualMachineRunCommandByVirtualMachine",
    properties: () => ({
      location: "West US",
      properties: {
        source: { script: "Write-Host Hello World!" },
        parameters: [
          { name: "param1", value: "value1" },
          { name: "param2", value: "value2" },
        ],
        asyncExecution: false,
        runAsUser: "user1",
        runAsPassword: "<runAsPassword>",
        timeoutInSeconds: 3600,
      },
    }),
    dependencies: ({}) => ({
      resourceGroup: "myResourceGroup",
      vm: "myVirtualMachine",
    }),
  },
];

```
## Dependencies
- [ResourceGroup](../Resources/ResourceGroup.md)
- [VirtualMachine](../Compute/VirtualMachine.md)
## Swagger Schema
```js
{
  properties: {
    properties: {
      'x-ms-client-flatten': true,
      properties: {
        source: {
          description: 'The source of the run command script.',
          properties: {
            script: {
              type: 'string',
              description: 'Specifies the script content to be executed on the VM.'
            },
            scriptUri: {
              type: 'string',
              description: 'Specifies the script download location.'
            },
            commandId: {
              type: 'string',
              description: 'Specifies a commandId of predefined built-in script.'
            }
          }
        },
        parameters: {
          type: 'array',
          items: {
            properties: {
              name: {
                type: 'string',
                description: 'The run command parameter name.'
              },
              value: {
                type: 'string',
                description: 'The run command parameter value.'
              }
            },
            required: [ 'name', 'value' ],
            description: 'Describes the properties of a run command parameter.'
          },
          'x-ms-identifiers': [ 'name' ],
          description: 'The parameters used by the script.'
        },
        protectedParameters: {
          type: 'array',
          items: {
            properties: {
              name: {
                type: 'string',
                description: 'The run command parameter name.'
              },
              value: {
                type: 'string',
                description: 'The run command parameter value.'
              }
            },
            required: [ 'name', 'value' ],
            description: 'Describes the properties of a run command parameter.'
          },
          'x-ms-identifiers': [ 'name' ],
          description: 'The parameters used by the script.'
        },
        asyncExecution: {
          type: 'boolean',
          description: 'Optional. If set to true, provisioning will complete as soon as the script starts and will not wait for script to complete.',
          default: false
        },
        runAsUser: {
          type: 'string',
          description: 'Specifies the user account on the VM when executing the run command.'
        },
        runAsPassword: {
          type: 'string',
          description: 'Specifies the user account password on the VM when executing the run command.'
        },
        timeoutInSeconds: {
          type: 'integer',
          format: 'int32',
          description: 'The timeout in seconds to execute the run command.'
        },
        outputBlobUri: {
          type: 'string',
          description: 'Specifies the Azure storage blob where script output stream will be uploaded.'
        },
        errorBlobUri: {
          type: 'string',
          description: 'Specifies the Azure storage blob where script error stream will be uploaded.'
        },
        provisioningState: {
          readOnly: true,
          type: 'string',
          description: 'The provisioning state, which only appears in the response.'
        },
        instanceView: {
          readOnly: true,
          description: 'The virtual machine run command instance view.',
          properties: {
            executionState: {
              type: 'string',
              description: 'Script execution status.',
              enum: [
                'Unknown',
                'Pending',
                'Running',
                'Failed',
                'Succeeded',
                'TimedOut',
                'Canceled'
              ],
              'x-ms-enum': { name: 'ExecutionState', modelAsString: true }
            },
            executionMessage: {
              type: 'string',
              description: 'Communicate script configuration errors or execution messages.'
            },
            exitCode: {
              type: 'integer',
              format: 'int32',
              description: 'Exit code returned from script execution.'
            },
            output: { type: 'string', description: 'Script output stream.' },
            error: { type: 'string', description: 'Script error stream.' },
            startTime: {
              type: 'string',
              format: 'date-time',
              description: 'Script start time.'
            },
            endTime: {
              type: 'string',
              format: 'date-time',
              description: 'Script end time.'
            },
            statuses: {
              type: 'array',
              items: {
                properties: {
                  code: { type: 'string', description: 'The status code.' },
                  level: {
                    type: 'string',
                    description: 'The level code.',
                    enum: [ 'Info', 'Warning', 'Error' ],
                    'x-ms-enum': { name: 'StatusLevelTypes', modelAsString: false }
                  },
                  displayStatus: {
                    type: 'string',
                    description: 'The short localizable label for the status.'
                  },
                  message: {
                    type: 'string',
                    description: 'The detailed status message, including for alerts and error messages.'
                  },
                  time: {
                    type: 'string',
                    format: 'date-time',
                    description: 'The time of the status.'
                  }
                },
                description: 'Instance view status.'
              },
              'x-ms-identifiers': [],
              description: 'The resource status information.'
            }
          }
        }
      },
      description: 'Describes the properties of a Virtual Machine run command.'
    }
  },
  allOf: [
    {
      description: 'The Resource model definition.',
      properties: {
        id: { readOnly: true, type: 'string', description: 'Resource Id' },
        name: {
          readOnly: true,
          type: 'string',
          description: 'Resource name'
        },
        type: {
          readOnly: true,
          type: 'string',
          description: 'Resource type'
        },
        location: { type: 'string', description: 'Resource location' },
        tags: {
          type: 'object',
          additionalProperties: { type: 'string' },
          description: 'Resource tags'
        }
      },
      required: [ 'location' ],
      'x-ms-azure-resource': true
    }
  ],
  description: 'Describes a Virtual Machine run command.'
}
```
## Misc
The resource version is `2022-03-01`.

The Swagger schema used to generate this documentation can be found [here](https://github.com/Azure/azure-rest-api-specs/tree/main/specification/compute/resource-manager/Microsoft.Compute/ComputeRP/stable/2022-03-01/runCommand.json).
