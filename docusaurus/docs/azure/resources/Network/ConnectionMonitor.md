---
id: ConnectionMonitor
title: ConnectionMonitor
---
Provides a **ConnectionMonitor** from the **Network** group
## Examples
### Create connection monitor V1
```js
exports.createResources = () => [
  {
    type: "ConnectionMonitor",
    group: "Network",
    name: "myConnectionMonitor",
    properties: () => ({
      location: "eastus",
      properties: {
        endpoints: [
          {
            name: "source",
            resourceId:
              "/subscriptions/subid/resourceGroups/rg1/providers/Microsoft.Compute/virtualMachines/ct1",
          },
          { name: "destination", address: "bing.com" },
        ],
        testConfigurations: [
          {
            name: "tcp",
            testFrequencySec: 60,
            protocol: "Tcp",
            tcpConfiguration: { port: 80 },
          },
        ],
        testGroups: [
          {
            name: "tg",
            testConfigurations: ["tcp"],
            sources: ["source"],
            destinations: ["destination"],
          },
        ],
      },
    }),
    dependencies: ({}) => ({
      resourceGroup: "myResourceGroup",
      workspace: ["myWorkspace"],
      networkWatcher: "myNetworkWatcher",
    }),
  },
];

```

### Create connection monitor V2
```js
exports.createResources = () => [
  {
    type: "ConnectionMonitor",
    group: "Network",
    name: "myConnectionMonitor",
    properties: () => ({
      properties: {
        endpoints: [
          {
            name: "vm1",
            resourceId:
              "/subscriptions/96e68903-0a56-4819-9987-8d08ad6a1f99/resourceGroups/NwRgIrinaCentralUSEUAP/providers/Microsoft.Compute/virtualMachines/vm1",
          },
          {
            name: "CanaryWorkspaceVamshi",
            resourceId:
              "/subscriptions/96e68903-0a56-4819-9987-8d08ad6a1f99/resourceGroups/vasamudrRG/providers/Microsoft.OperationalInsights/workspaces/vasamudrWorkspace",
            filter: {
              type: "Include",
              items: [{ type: "AgentAddress", address: "npmuser" }],
            },
          },
          { name: "bing", address: "bing.com" },
          { name: "google", address: "google.com" },
        ],
        testConfigurations: [
          {
            name: "testConfig1",
            testFrequencySec: 60,
            protocol: "Tcp",
            tcpConfiguration: { port: 80, disableTraceRoute: false },
          },
        ],
        testGroups: [
          {
            name: "test1",
            disable: false,
            testConfigurations: ["testConfig1"],
            sources: ["vm1", "CanaryWorkspaceVamshi"],
            destinations: ["bing", "google"],
          },
        ],
        outputs: [],
      },
    }),
    dependencies: ({}) => ({
      resourceGroup: "myResourceGroup",
      workspace: ["myWorkspace"],
      networkWatcher: "myNetworkWatcher",
    }),
  },
];

```
## Dependencies
- [ResourceGroup](../Resources/ResourceGroup.md)
- [Workspace](../OperationalInsights/Workspace.md)
- [NetworkWatcher](../Network/NetworkWatcher.md)
## Swagger Schema
```js
{
  properties: {
    location: { type: 'string', description: 'Connection monitor location.' },
    tags: {
      type: 'object',
      additionalProperties: { type: 'string' },
      description: 'Connection monitor tags.'
    },
    properties: {
      'x-ms-client-flatten': true,
      description: 'Properties of the connection monitor.',
      properties: {
        source: {
          description: 'Describes the source of connection monitor.',
          properties: {
            resourceId: {
              type: 'string',
              description: 'The ID of the resource used as the source by connection monitor.'
            },
            port: {
              type: 'integer',
              format: 'int32',
              minimum: 0,
              maximum: 65535,
              description: 'The source port used by connection monitor.'
            }
          },
          required: [ 'resourceId' ]
        },
        destination: {
          description: 'Describes the destination of connection monitor.',
          properties: {
            resourceId: {
              type: 'string',
              description: 'The ID of the resource used as the destination by connection monitor.'
            },
            address: {
              type: 'string',
              description: 'Address of the connection monitor destination (IP or domain name).'
            },
            port: {
              type: 'integer',
              format: 'int32',
              minimum: 0,
              maximum: 65535,
              description: 'The destination port used by connection monitor.'
            }
          }
        },
        autoStart: {
          type: 'boolean',
          default: true,
          description: 'Determines if the connection monitor will start automatically once created.'
        },
        monitoringIntervalInSeconds: {
          type: 'integer',
          format: 'int32',
          minimum: 30,
          maximum: 1800,
          default: 60,
          description: 'Monitoring interval in seconds.'
        },
        endpoints: {
          type: 'array',
          description: 'List of connection monitor endpoints.',
          items: {
            properties: {
              name: {
                type: 'string',
                description: 'The name of the connection monitor endpoint.'
              },
              type: {
                type: 'string',
                enum: [
                  'AzureVM',
                  'AzureVNet',
                  'AzureSubnet',
                  'ExternalAddress',
                  'MMAWorkspaceMachine',
                  'MMAWorkspaceNetwork'
                ],
                'x-ms-enum': { name: 'EndpointType', modelAsString: true },
                description: 'The endpoint type.'
              },
              resourceId: {
                type: 'string',
                description: 'Resource ID of the connection monitor endpoint.'
              },
              address: {
                type: 'string',
                description: 'Address of the connection monitor endpoint (IP or domain name).'
              },
              filter: {
                description: 'Filter for sub-items within the endpoint.',
                properties: {
                  type: {
                    type: 'string',
                    enum: [ 'Include' ],
                    'x-ms-enum': {
                      name: 'ConnectionMonitorEndpointFilterType',
                      modelAsString: true
                    },
                    description: "The behavior of the endpoint filter. Currently only 'Include' is supported."
                  },
                  items: {
                    type: 'array',
                    description: 'List of items in the filter.',
                    items: {
                      properties: {
                        type: {
                          type: 'string',
                          enum: [ 'AgentAddress' ],
                          'x-ms-enum': {
                            name: 'ConnectionMonitorEndpointFilterItemType',
                            modelAsString: true
                          },
                          description: "The type of item included in the filter. Currently only 'AgentAddress' is supported."
                        },
                        address: {
                          type: 'string',
                          description: 'The address of the filter item.'
                        }
                      },
                      description: 'Describes the connection monitor endpoint filter item.'
                    }
                  }
                }
              },
              scope: {
                description: 'Endpoint scope.',
                properties: {
                  include: {
                    type: 'array',
                    description: 'List of items which needs to be included to the endpoint scope.',
                    items: {
                      properties: {
                        address: {
                          type: 'string',
                          description: 'The address of the endpoint item. Supported types are IPv4/IPv6 subnet mask or IPv4/IPv6 IP address.'
                        }
                      },
                      description: 'Describes the connection monitor endpoint scope item.'
                    }
                  },
                  exclude: {
                    type: 'array',
                    description: 'List of items which needs to be excluded from the endpoint scope.',
                    items: {
                      properties: {
                        address: {
                          type: 'string',
                          description: 'The address of the endpoint item. Supported types are IPv4/IPv6 subnet mask or IPv4/IPv6 IP address.'
                        }
                      },
                      description: 'Describes the connection monitor endpoint scope item.'
                    }
                  }
                }
              },
              coverageLevel: {
                type: 'string',
                enum: [
                  'Default',
                  'Low',
                  'BelowAverage',
                  'Average',
                  'AboveAverage',
                  'Full'
                ],
                'x-ms-enum': { name: 'CoverageLevel', modelAsString: true },
                description: 'Test coverage for the endpoint.'
              }
            },
            required: [ 'name' ],
            description: 'Describes the connection monitor endpoint.'
          }
        },
        testConfigurations: {
          type: 'array',
          description: 'List of connection monitor test configurations.',
          items: {
            properties: {
              name: {
                type: 'string',
                description: 'The name of the connection monitor test configuration.'
              },
              testFrequencySec: {
                type: 'integer',
                format: 'int32',
                description: 'The frequency of test evaluation, in seconds.'
              },
              protocol: {
                type: 'string',
                enum: [ 'Tcp', 'Http', 'Icmp' ],
                'x-ms-enum': {
                  name: 'ConnectionMonitorTestConfigurationProtocol',
                  modelAsString: true
                },
                description: 'The protocol to use in test evaluation.'
              },
              preferredIPVersion: {
                type: 'string',
                enum: [ 'IPv4', 'IPv6' ],
                'x-ms-enum': { name: 'PreferredIPVersion', modelAsString: true },
                description: 'The preferred IP version to use in test evaluation. The connection monitor may choose to use a different version depending on other parameters.'
              },
              httpConfiguration: {
                description: 'The parameters used to perform test evaluation over HTTP.',
                properties: {
                  port: {
                    type: 'integer',
                    format: 'int32',
                    minimum: 0,
                    maximum: 65535,
                    description: 'The port to connect to.'
                  },
                  method: {
                    type: 'string',
                    description: 'The HTTP method to use.',
                    enum: [ 'Get', 'Post' ],
                    'x-ms-enum': {
                      name: 'HTTPConfigurationMethod',
                      modelAsString: true
                    }
                  },
                  path: {
                    type: 'string',
                    description: 'The path component of the URI. For instance, "/dir1/dir2".'
                  },
                  requestHeaders: {
                    type: 'array',
                    description: 'The HTTP headers to transmit with the request.',
                    items: {
                      properties: {
                        name: {
                          type: 'string',
                          description: 'The name in HTTP header.'
                        },
                        value: {
                          type: 'string',
                          description: 'The value in HTTP header.'
                        }
                      },
                      description: 'The HTTP header.'
                    }
                  },
                  validStatusCodeRanges: {
                    type: 'array',
                    items: { type: 'string' },
                    description: 'HTTP status codes to consider successful. For instance, "2xx,301-304,418".'
                  },
                  preferHTTPS: {
                    type: 'boolean',
                    description: 'Value indicating whether HTTPS is preferred over HTTP in cases where the choice is not explicit.'
                  }
                }
              },
              tcpConfiguration: {
                description: 'The parameters used to perform test evaluation over TCP.',
                properties: {
                  port: {
                    type: 'integer',
                    format: 'int32',
                    minimum: 0,
                    maximum: 65535,
                    description: 'The port to connect to.'
                  },
                  disableTraceRoute: {
                    type: 'boolean',
                    description: 'Value indicating whether path evaluation with trace route should be disabled.'
                  },
                  destinationPortBehavior: {
                    type: 'string',
                    description: 'Destination port behavior.',
                    enum: [ 'None', 'ListenIfAvailable' ],
                    'x-ms-enum': {
                      name: 'DestinationPortBehavior',
                      modelAsString: true
                    }
                  }
                }
              },
              icmpConfiguration: {
                description: 'The parameters used to perform test evaluation over ICMP.',
                properties: {
                  disableTraceRoute: {
                    type: 'boolean',
                    description: 'Value indicating whether path evaluation with trace route should be disabled.'
                  }
                }
              },
              successThreshold: {
                description: 'The threshold for declaring a test successful.',
                properties: {
                  checksFailedPercent: {
                    type: 'integer',
                    format: 'int32',
                    description: 'The maximum percentage of failed checks permitted for a test to evaluate as successful.'
                  },
                  roundTripTimeMs: {
                    type: 'number',
                    description: 'The maximum round-trip time in milliseconds permitted for a test to evaluate as successful.'
                  }
                }
              }
            },
            required: [ 'name', 'protocol' ],
            description: 'Describes a connection monitor test configuration.'
          }
        },
        testGroups: {
          type: 'array',
          description: 'List of connection monitor test groups.',
          items: {
            properties: {
              name: {
                type: 'string',
                description: 'The name of the connection monitor test group.'
              },
              disable: {
                type: 'boolean',
                description: 'Value indicating whether test group is disabled.'
              },
              testConfigurations: {
                type: 'array',
                items: { type: 'string' },
                description: 'List of test configuration names.'
              },
              sources: {
                type: 'array',
                items: { type: 'string' },
                description: 'List of source endpoint names.'
              },
              destinations: {
                type: 'array',
                items: { type: 'string' },
                description: 'List of destination endpoint names.'
              }
            },
            required: [ 'name', 'testConfigurations', 'sources', 'destinations' ],
            description: 'Describes the connection monitor test group.'
          }
        },
        outputs: {
          type: 'array',
          description: 'List of connection monitor outputs.',
          items: {
            properties: {
              type: {
                type: 'string',
                description: 'Connection monitor output destination type. Currently, only "Workspace" is supported.',
                enum: [ 'Workspace' ],
                'x-ms-enum': { name: 'OutputType', modelAsString: true }
              },
              workspaceSettings: {
                description: 'Describes the settings for producing output into a log analytics workspace.',
                properties: {
                  workspaceResourceId: {
                    type: 'string',
                    description: 'Log analytics workspace resource ID.'
                  }
                }
              }
            },
            description: 'Describes a connection monitor output destination.'
          }
        },
        notes: {
          type: 'string',
          description: 'Optional notes to be associated with the connection monitor.'
        }
      }
    }
  },
  required: [ 'properties' ],
  description: 'Parameters that define the operation to create a connection monitor.'
}
```
## Misc
The resource version is `2021-08-01`.

The Swagger schema used to generate this documentation can be found [here](https://github.com/Azure/azure-rest-api-specs/tree/main/specification/network/resource-manager/Microsoft.Network/stable/2021-08-01/networkWatcher.json).
