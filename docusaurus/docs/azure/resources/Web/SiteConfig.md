---
id: SiteConfig
title: SiteConfig
---
Provides a **SiteConfig** from the **Web** group
## Examples
## Dependencies
- [ResourceGroup](../Resources/ResourceGroup.md)
- [Site](../Web/Site.md)
## Swagger Schema
```js
{
  description: 'Configuration of Azure web site',
  type: 'object',
  allOf: [
    {
      required: [ 'location' ],
      properties: {
        id: { description: 'Resource Id', type: 'string' },
        name: { description: 'Resource Name', type: 'string' },
        kind: { description: 'Kind of resource', type: 'string' },
        location: { description: 'Resource Location', type: 'string' },
        type: { description: 'Resource type', type: 'string' },
        tags: {
          description: 'Resource tags',
          type: 'object',
          additionalProperties: { type: 'string' }
        }
      },
      'x-ms-azure-resource': true
    }
  ],
  properties: {
    properties: {
      properties: {
        numberOfWorkers: {
          format: 'int32',
          description: 'Number of workers',
          type: 'integer'
        },
        defaultDocuments: {
          description: 'Default documents',
          type: 'array',
          items: { type: 'string' }
        },
        netFrameworkVersion: { description: 'Net Framework Version', type: 'string' },
        phpVersion: { description: 'Version of PHP', type: 'string' },
        pythonVersion: { description: 'Version of Python', type: 'string' },
        nodeVersion: { description: 'Version of Node', type: 'string' },
        requestTracingEnabled: { description: 'Enable request tracing', type: 'boolean' },
        requestTracingExpirationTime: {
          format: 'date-time',
          description: 'Request tracing expiration time',
          type: 'string'
        },
        remoteDebuggingEnabled: { description: 'Remote Debugging Enabled', type: 'boolean' },
        remoteDebuggingVersion: { description: 'Remote Debugging Version', type: 'string' },
        httpLoggingEnabled: { description: 'HTTP logging Enabled', type: 'boolean' },
        logsDirectorySizeLimit: {
          format: 'int32',
          description: 'HTTP Logs Directory size limit',
          type: 'integer'
        },
        detailedErrorLoggingEnabled: {
          description: 'Detailed error logging enabled',
          type: 'boolean'
        },
        publishingUsername: { description: 'Publishing user name', type: 'string' },
        publishingPassword: { description: 'Publishing password', type: 'string' },
        appSettings: {
          description: 'Application Settings',
          type: 'array',
          items: {
            description: 'Name value pair',
            type: 'object',
            properties: {
              name: { description: 'Pair name', type: 'string' },
              value: { description: 'Pair value', type: 'string' }
            }
          }
        },
        metadata: {
          description: 'Site Metadata',
          type: 'array',
          items: {
            description: 'Name value pair',
            type: 'object',
            properties: {
              name: { description: 'Pair name', type: 'string' },
              value: { description: 'Pair value', type: 'string' }
            }
          }
        },
        connectionStrings: {
          description: 'Connection strings',
          type: 'array',
          items: {
            description: 'Represents database connection string information',
            required: [ 'type' ],
            type: 'object',
            properties: {
              name: {
                description: 'Name of connection string',
                type: 'string'
              },
              connectionString: {
                description: 'Connection string value',
                type: 'string'
              },
              type: {
                description: 'Type of database',
                enum: [ 'MySql', 'SQLServer', 'SQLAzure', 'Custom' ],
                type: 'string',
                'x-ms-enum': { name: 'DatabaseServerType', modelAsString: false }
              }
            }
          }
        },
        handlerMappings: {
          description: 'Handler mappings',
          type: 'array',
          items: {
            description: 'The IIS handler mappings used to define which handler processes HTTP requests with certain extension. \r\n' +
              '            For example it is used to configure php-cgi.exe process to handle all HTTP requests with *.php extension.',
            type: 'object',
            properties: {
              extension: {
                description: 'Requests with this extension will be handled using the specified FastCGI application.',
                type: 'string'
              },
              scriptProcessor: {
                description: 'The absolute path to the FastCGI application.',
                type: 'string'
              },
              arguments: {
                description: 'Command-line arguments to be passed to the script processor.',
                type: 'string'
              }
            }
          }
        },
        documentRoot: { description: 'Document root', type: 'string' },
        scmType: { description: 'SCM type', type: 'string' },
        use32BitWorkerProcess: { description: 'Use 32 bit worker process', type: 'boolean' },
        webSocketsEnabled: { description: 'Web socket enabled.', type: 'boolean' },
        alwaysOn: { description: 'Always On', type: 'boolean' },
        javaVersion: { description: 'Java version', type: 'string' },
        javaContainer: { description: 'Java container', type: 'string' },
        javaContainerVersion: { description: 'Java container version', type: 'string' },
        appCommandLine: { description: 'App Command Line to launch', type: 'string' },
        managedPipelineMode: {
          description: 'Managed pipeline mode',
          enum: [ 'Integrated', 'Classic' ],
          type: 'string',
          'x-ms-enum': { name: 'ManagedPipelineMode', modelAsString: false }
        },
        virtualApplications: {
          description: 'Virtual applications',
          type: 'array',
          items: {
            type: 'object',
            properties: {
              virtualPath: { type: 'string' },
              physicalPath: { type: 'string' },
              preloadEnabled: { type: 'boolean' },
              virtualDirectories: {
                type: 'array',
                items: {
                  type: 'object',
                  properties: {
                    virtualPath: { type: 'string' },
                    physicalPath: { type: 'string' }
                  }
                }
              }
            }
          }
        },
        loadBalancing: {
          description: 'Site load balancing',
          enum: [
            'WeightedRoundRobin',
            'LeastRequests',
            'LeastResponseTime',
            'WeightedTotalTraffic',
            'RequestHash'
          ],
          type: 'string',
          'x-ms-enum': { name: 'SiteLoadBalancing', modelAsString: false }
        },
        experiments: {
          description: 'This is work around for polymorphic types',
          type: 'object',
          properties: {
            rampUpRules: {
              description: 'List of {Microsoft.Web.Hosting.Administration.RampUpRule} objects.',
              type: 'array',
              items: {
                description: 'Routing rules for ramp up testing. This rule allows to redirect static traffic % to a slot or to gradually change routing % based on performance',
                type: 'object',
                properties: {
                  actionHostName: {
                    description: 'Hostname of a slot to which the traffic will be redirected if decided to. E.g. mysite-stage.azurewebsites.net',
                    type: 'string'
                  },
                  reroutePercentage: {
                    format: 'double',
                    description: 'Percentage of the traffic which will be redirected to {Microsoft.Web.Hosting.Administration.RampUpRule.ActionHostName}',
                    type: 'number'
                  },
                  changeStep: {
                    format: 'double',
                    description: '[Optional] In auto ramp up scenario this is the step to add/remove from {Microsoft.Web.Hosting.Administration.RampUpRule.ReroutePercentage} until it reaches \r\n' +
                      '            {Microsoft.Web.Hosting.Administration.RampUpRule.MinReroutePercentage} or {Microsoft.Web.Hosting.Administration.RampUpRule.MaxReroutePercentage}. Site metrics are checked every N minutes specified in {Microsoft.Web.Hosting.Administration.RampUpRule.ChangeIntervalInMinutes}.\r\n' +
                      '            Custom decision algorithm can be provided in TiPCallback site extension which Url can be specified in {Microsoft.Web.Hosting.Administration.RampUpRule.ChangeDecisionCallbackUrl}',
                    type: 'number'
                  },
                  changeIntervalInMinutes: {
                    format: 'int32',
                    description: '[Optional] Specifies interval in minutes to reevaluate ReroutePercentage',
                    type: 'integer'
                  },
                  minReroutePercentage: {
                    format: 'double',
                    description: '[Optional] Specifies lower boundary above which ReroutePercentage will stay.',
                    type: 'number'
                  },
                  maxReroutePercentage: {
                    format: 'double',
                    description: '[Optional] Specifies upper boundary below which ReroutePercentage will stay.',
                    type: 'number'
                  },
                  changeDecisionCallbackUrl: {
                    description: 'Custom decision algorithm can be provided in TiPCallback site extension which Url can be specified. See TiPCallback site extension for the scaffold and contracts.\r\n' +
                      '            https://www.siteextensions.net/packages/TiPCallback/',
                    type: 'string'
                  },
                  name: {
                    description: 'Name of the routing rule. The recommended name would be to point to the slot which will receive the traffic in the experiment.',
                    type: 'string'
                  }
                }
              }
            }
          }
        },
        limits: {
          description: 'Site limits',
          type: 'object',
          properties: {
            maxPercentageCpu: {
              format: 'double',
              description: 'Maximum allowed CPU usage percentage',
              type: 'number'
            },
            maxMemoryInMb: {
              format: 'int64',
              description: 'Maximum allowed memory usage in MB',
              type: 'integer'
            },
            maxDiskSizeInMb: {
              format: 'int64',
              description: 'Maximum allowed disk size usage in MB',
              type: 'integer'
            }
          }
        },
        autoHealEnabled: { description: 'Auto heal enabled', type: 'boolean' },
        autoHealRules: {
          description: 'Auto heal rules',
          type: 'object',
          properties: {
            triggers: {
              description: 'Triggers - Conditions that describe when to execute the auto-heal actions',
              type: 'object',
              properties: {
                requests: {
                  description: 'Requests - Defines a rule based on total requests',
                  type: 'object',
                  properties: {
                    count: {
                      format: 'int32',
                      description: 'Count',
                      type: 'integer'
                    },
                    timeInterval: { description: 'TimeInterval', type: 'string' }
                  }
                },
                privateBytesInKB: {
                  format: 'int32',
                  description: 'PrivateBytesInKB - Defines a rule based on private bytes',
                  type: 'integer'
                },
                statusCodes: {
                  description: 'StatusCodes - Defines a rule based on status codes',
                  type: 'array',
                  items: {
                    description: 'StatusCodeBasedTrigger',
                    type: 'object',
                    properties: {
                      status: [Object],
                      subStatus: [Object],
                      win32Status: [Object],
                      count: [Object],
                      timeInterval: [Object]
                    }
                  }
                },
                slowRequests: {
                  description: 'SlowRequests - Defines a rule based on request execution time',
                  type: 'object',
                  properties: {
                    timeTaken: { description: 'TimeTaken', type: 'string' },
                    count: {
                      format: 'int32',
                      description: 'Count',
                      type: 'integer'
                    },
                    timeInterval: { description: 'TimeInterval', type: 'string' }
                  }
                }
              }
            },
            actions: {
              description: 'Actions - Actions to be executed when a rule is triggered',
              required: [ 'actionType' ],
              type: 'object',
              properties: {
                actionType: {
                  description: 'ActionType - predefined action to be taken',
                  enum: [ 'Recycle', 'LogEvent', 'CustomAction' ],
                  type: 'string',
                  'x-ms-enum': { name: 'AutoHealActionType', modelAsString: false }
                },
                customAction: {
                  description: 'CustomAction - custom action to be taken',
                  type: 'object',
                  properties: {
                    exe: {
                      description: 'Executable to be run',
                      type: 'string'
                    },
                    parameters: {
                      description: 'Parameters for the executable',
                      type: 'string'
                    }
                  }
                },
                minProcessExecutionTime: {
                  description: 'MinProcessExecutionTime - minimum time the process must execute\r\n' +
                    '            before taking the action',
                  type: 'string'
                }
              }
            }
          }
        },
        tracingOptions: { description: 'Tracing options', type: 'string' },
        vnetName: { description: 'Vnet name', type: 'string' },
        cors: {
          description: 'Cross-Origin Resource Sharing (CORS) settings.',
          type: 'object',
          properties: {
            allowedOrigins: {
              description: 'Gets or sets the list of origins that should be allowed to make cross-origin\r\n' +
                '            calls (for example: http://example.com:12345). Use "*" to allow all.',
              type: 'array',
              items: { type: 'string' }
            }
          }
        },
        apiDefinition: {
          description: 'Information about the formal API definition for the web app.',
          type: 'object',
          properties: {
            url: {
              description: 'The URL of the API definition.',
              type: 'string'
            }
          }
        },
        autoSwapSlotName: { description: 'Auto swap slot name', type: 'string' },
        localMySqlEnabled: { description: 'Local mysql enabled', type: 'boolean' },
        ipSecurityRestrictions: {
          description: 'Ip Security restrictions',
          type: 'array',
          items: {
            description: 'Represents an ip security restriction on a web app.',
            type: 'object',
            properties: {
              ipAddress: {
                description: 'IP address the security restriction is valid for',
                type: 'string'
              },
              subnetMask: {
                description: 'Subnet mask for the range of IP addresses the restriction is valid for',
                type: 'string'
              }
            }
          }
        }
      },
      'x-ms-client-flatten': true
    }
  }
}
```
## Misc
The resource version is `2015-08-01`.

The Swagger schema used to generate this documentation can be found [here](https://github.com/Azure/azure-rest-api-specs/tree/main/specification/web/resource-manager/Microsoft.Web/stable/2015-08-01/service.json).
