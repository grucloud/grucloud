---
id: WebAppConfigurationSlot
title: WebAppConfigurationSlot
---
Provides a **WebAppConfigurationSlot** from the **Web** group
## Examples
## Dependencies
- [ResourceGroup](../Resources/ResourceGroup.md)
- [WebApp](../Web/WebApp.md)
- [WebAppSlot](../Web/WebAppSlot.md)
## Swagger Schema
```js
{
  description: 'Web app configuration ARM resource.',
  type: 'object',
  allOf: [
    {
      description: 'Azure proxy only resource. This resource is not tracked by Azure Resource Manager.',
      type: 'object',
      properties: {
        id: { description: 'Resource Id.', type: 'string', readOnly: true },
        name: {
          description: 'Resource Name.',
          type: 'string',
          readOnly: true
        },
        kind: { description: 'Kind of resource.', type: 'string' },
        type: {
          description: 'Resource type.',
          type: 'string',
          readOnly: true
        }
      },
      'x-ms-azure-resource': true
    }
  ],
  properties: {
    properties: {
      description: 'Core resource properties',
      type: 'object',
      'x-ms-client-flatten': true,
      properties: {
        numberOfWorkers: {
          format: 'int32',
          description: 'Number of workers.',
          type: 'integer'
        },
        defaultDocuments: {
          description: 'Default documents.',
          type: 'array',
          items: { type: 'string' }
        },
        netFrameworkVersion: {
          description: '.NET Framework version.',
          default: 'v4.6',
          type: 'string'
        },
        phpVersion: { description: 'Version of PHP.', type: 'string' },
        pythonVersion: { description: 'Version of Python.', type: 'string' },
        nodeVersion: { description: 'Version of Node.js.', type: 'string' },
        powerShellVersion: { description: 'Version of PowerShell.', type: 'string' },
        linuxFxVersion: {
          description: 'Linux App Framework and version',
          type: 'string'
        },
        windowsFxVersion: {
          description: 'Xenon App Framework and version',
          type: 'string'
        },
        requestTracingEnabled: {
          description: '<code>true</code> if request tracing is enabled; otherwise, <code>false</code>.',
          type: 'boolean'
        },
        requestTracingExpirationTime: {
          format: 'date-time',
          description: 'Request tracing expiration time.',
          type: 'string'
        },
        remoteDebuggingEnabled: {
          description: '<code>true</code> if remote debugging is enabled; otherwise, <code>false</code>.',
          type: 'boolean'
        },
        remoteDebuggingVersion: { description: 'Remote debugging version.', type: 'string' },
        httpLoggingEnabled: {
          description: '<code>true</code> if HTTP logging is enabled; otherwise, <code>false</code>.',
          type: 'boolean'
        },
        acrUseManagedIdentityCreds: {
          description: 'Flag to use Managed Identity Creds for ACR pull',
          type: 'boolean'
        },
        acrUserManagedIdentityID: {
          description: 'If using user managed identity, the user managed identity ClientId',
          type: 'string'
        },
        logsDirectorySizeLimit: {
          format: 'int32',
          description: 'HTTP logs directory size limit.',
          type: 'integer'
        },
        detailedErrorLoggingEnabled: {
          description: '<code>true</code> if detailed error logging is enabled; otherwise, <code>false</code>.',
          type: 'boolean'
        },
        publishingUsername: { description: 'Publishing user name.', type: 'string' },
        appSettings: {
          description: 'Application settings.',
          type: 'array',
          items: {
            description: 'Name value pair.',
            type: 'object',
            properties: {
              name: { description: 'Pair name.', type: 'string' },
              value: { description: 'Pair value.', type: 'string' }
            }
          },
          'x-ms-identifiers': [ 'name' ]
        },
        connectionStrings: {
          description: 'Connection strings.',
          type: 'array',
          items: {
            description: 'Database connection string information.',
            type: 'object',
            properties: {
              name: {
                description: 'Name of connection string.',
                type: 'string'
              },
              connectionString: {
                description: 'Connection string value.',
                type: 'string'
              },
              type: {
                description: 'Type of database.',
                enum: [
                  'MySql',
                  'SQLServer',
                  'SQLAzure',
                  'Custom',
                  'NotificationHub',
                  'ServiceBus',
                  'EventHub',
                  'ApiHub',
                  'DocDb',
                  'RedisCache',
                  'PostgreSQL'
                ],
                type: 'string',
                'x-ms-enum': { name: 'ConnectionStringType', modelAsString: false }
              }
            }
          },
          'x-ms-identifiers': [ 'name' ]
        },
        machineKey: {
          description: 'Site MachineKey.',
          readOnly: true,
          type: 'object',
          properties: {
            validation: { description: 'MachineKey validation.', type: 'string' },
            validationKey: { description: 'Validation key.', type: 'string' },
            decryption: {
              description: 'Algorithm used for decryption.',
              type: 'string'
            },
            decryptionKey: { description: 'Decryption key.', type: 'string' }
          }
        },
        handlerMappings: {
          description: 'Handler mappings.',
          type: 'array',
          items: {
            description: 'The IIS handler mappings used to define which handler processes HTTP requests with certain extension. \n' +
              'For example, it is used to configure php-cgi.exe process to handle all HTTP requests with *.php extension.',
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
          },
          'x-ms-identifiers': [ 'extension' ]
        },
        documentRoot: { description: 'Document root.', type: 'string' },
        scmType: {
          description: 'SCM type.',
          enum: [
            'None',        'Dropbox',
            'Tfs',         'LocalGit',
            'GitHub',      'CodePlexGit',
            'CodePlexHg',  'BitbucketGit',
            'BitbucketHg', 'ExternalGit',
            'ExternalHg',  'OneDrive',
            'VSO',         'VSTSRM'
          ],
          type: 'string',
          'x-ms-enum': { name: 'ScmType', modelAsString: true }
        },
        use32BitWorkerProcess: {
          description: '<code>true</code> to use 32-bit worker process; otherwise, <code>false</code>.',
          type: 'boolean'
        },
        webSocketsEnabled: {
          description: '<code>true</code> if WebSocket is enabled; otherwise, <code>false</code>.',
          type: 'boolean'
        },
        alwaysOn: {
          description: '<code>true</code> if Always On is enabled; otherwise, <code>false</code>.',
          type: 'boolean'
        },
        javaVersion: { description: 'Java version.', type: 'string' },
        javaContainer: { description: 'Java container.', type: 'string' },
        javaContainerVersion: { description: 'Java container version.', type: 'string' },
        appCommandLine: { description: 'App command line to launch.', type: 'string' },
        managedPipelineMode: {
          description: 'Managed pipeline mode.',
          enum: [ 'Integrated', 'Classic' ],
          type: 'string',
          'x-ms-enum': { name: 'ManagedPipelineMode', modelAsString: false }
        },
        virtualApplications: {
          description: 'Virtual applications.',
          type: 'array',
          items: {
            description: 'Virtual application in an app.',
            type: 'object',
            properties: {
              virtualPath: { description: 'Virtual path.', type: 'string' },
              physicalPath: { description: 'Physical path.', type: 'string' },
              preloadEnabled: {
                description: '<code>true</code> if preloading is enabled; otherwise, <code>false</code>.',
                type: 'boolean'
              },
              virtualDirectories: {
                description: 'Virtual directories for virtual application.',
                type: 'array',
                items: {
                  description: 'Directory for virtual application.',
                  type: 'object',
                  properties: {
                    virtualPath: {
                      description: 'Path to virtual application.',
                      type: 'string'
                    },
                    physicalPath: { description: 'Physical path.', type: 'string' }
                  }
                },
                'x-ms-identifiers': [ 'virtualPath' ]
              }
            }
          },
          'x-ms-identifiers': [ 'virtualPath' ]
        },
        loadBalancing: {
          description: 'Site load balancing.',
          enum: [
            'WeightedRoundRobin',
            'LeastRequests',
            'LeastResponseTime',
            'WeightedTotalTraffic',
            'RequestHash',
            'PerSiteRoundRobin'
          ],
          type: 'string',
          'x-ms-enum': { name: 'SiteLoadBalancing', modelAsString: false }
        },
        experiments: {
          description: 'This is work around for polymorphic types.',
          type: 'object',
          properties: {
            rampUpRules: {
              description: 'List of ramp-up rules.',
              type: 'array',
              items: {
                description: 'Routing rules for ramp up testing. This rule allows to redirect static traffic % to a slot or to gradually change routing % based on performance.',
                type: 'object',
                properties: {
                  actionHostName: {
                    description: 'Hostname of a slot to which the traffic will be redirected if decided to. E.g. myapp-stage.azurewebsites.net.',
                    type: 'string'
                  },
                  reroutePercentage: {
                    format: 'double',
                    description: 'Percentage of the traffic which will be redirected to <code>ActionHostName</code>.',
                    type: 'number'
                  },
                  changeStep: {
                    format: 'double',
                    description: 'In auto ramp up scenario this is the step to add/remove from <code>ReroutePercentage</code> until it reaches \\n<code>MinReroutePercentage</code> or \n' +
                      '<code>MaxReroutePercentage</code>. Site metrics are checked every N minutes specified in <code>ChangeIntervalInMinutes</code>.\\nCustom decision algorithm \n' +
                      'can be provided in TiPCallback site extension which URL can be specified in <code>ChangeDecisionCallbackUrl</code>.',
                    type: 'number'
                  },
                  changeIntervalInMinutes: {
                    format: 'int32',
                    description: 'Specifies interval in minutes to reevaluate ReroutePercentage.',
                    type: 'integer'
                  },
                  minReroutePercentage: {
                    format: 'double',
                    description: 'Specifies lower boundary above which ReroutePercentage will stay.',
                    type: 'number'
                  },
                  maxReroutePercentage: {
                    format: 'double',
                    description: 'Specifies upper boundary below which ReroutePercentage will stay.',
                    type: 'number'
                  },
                  changeDecisionCallbackUrl: {
                    description: 'Custom decision algorithm can be provided in TiPCallback site extension which URL can be specified. See TiPCallback site extension for the scaffold and contracts.\n' +
                      'https://www.siteextensions.net/packages/TiPCallback/',
                    type: 'string'
                  },
                  name: {
                    description: 'Name of the routing rule. The recommended name would be to point to the slot which will receive the traffic in the experiment.',
                    type: 'string'
                  }
                }
              },
              'x-ms-identifiers': [ 'name' ]
            }
          }
        },
        limits: {
          description: 'Site limits.',
          type: 'object',
          properties: {
            maxPercentageCpu: {
              format: 'double',
              description: 'Maximum allowed CPU usage percentage.',
              type: 'number'
            },
            maxMemoryInMb: {
              format: 'int64',
              description: 'Maximum allowed memory usage in MB.',
              type: 'integer'
            },
            maxDiskSizeInMb: {
              format: 'int64',
              description: 'Maximum allowed disk size usage in MB.',
              type: 'integer'
            }
          }
        },
        autoHealEnabled: {
          description: '<code>true</code> if Auto Heal is enabled; otherwise, <code>false</code>.',
          type: 'boolean'
        },
        autoHealRules: {
          description: 'Auto Heal rules.',
          type: 'object',
          properties: {
            triggers: {
              description: 'Conditions that describe when to execute the auto-heal actions.',
              type: 'object',
              properties: {
                requests: {
                  description: 'A rule based on total requests.',
                  type: 'object',
                  properties: {
                    count: {
                      format: 'int32',
                      description: 'Request Count.',
                      type: 'integer'
                    },
                    timeInterval: { description: 'Time interval.', type: 'string' }
                  }
                },
                privateBytesInKB: {
                  format: 'int32',
                  description: 'A rule based on private bytes.',
                  type: 'integer'
                },
                statusCodes: {
                  description: 'A rule based on status codes.',
                  type: 'array',
                  items: {
                    description: 'Trigger based on status code.',
                    type: 'object',
                    properties: {
                      status: {
                        format: 'int32',
                        description: 'HTTP status code.',
                        type: 'integer'
                      },
                      subStatus: {
                        format: 'int32',
                        description: 'Request Sub Status.',
                        type: 'integer'
                      },
                      win32Status: {
                        format: 'int32',
                        description: 'Win32 error code.',
                        type: 'integer'
                      },
                      count: {
                        format: 'int32',
                        description: 'Request Count.',
                        type: 'integer'
                      },
                      timeInterval: { description: 'Time interval.', type: 'string' },
                      path: { description: 'Request Path', type: 'string' }
                    }
                  },
                  'x-ms-identifiers': [ 'path' ]
                },
                slowRequests: {
                  description: 'A rule based on request execution time.',
                  type: 'object',
                  properties: {
                    timeTaken: { description: 'Time taken.', type: 'string' },
                    path: { description: 'Request Path.', type: 'string' },
                    count: {
                      format: 'int32',
                      description: 'Request Count.',
                      type: 'integer'
                    },
                    timeInterval: { description: 'Time interval.', type: 'string' }
                  }
                },
                slowRequestsWithPath: {
                  description: 'A rule based on multiple Slow Requests Rule with path',
                  type: 'array',
                  items: {
                    description: 'Trigger based on request execution time.',
                    type: 'object',
                    properties: {
                      timeTaken: { description: 'Time taken.', type: 'string' },
                      path: { description: 'Request Path.', type: 'string' },
                      count: {
                        format: 'int32',
                        description: 'Request Count.',
                        type: 'integer'
                      },
                      timeInterval: { description: 'Time interval.', type: 'string' }
                    }
                  },
                  'x-ms-identifiers': [ 'path' ]
                },
                statusCodesRange: {
                  description: 'A rule based on status codes ranges.',
                  type: 'array',
                  items: {
                    description: 'Trigger based on range of status codes.',
                    type: 'object',
                    properties: {
                      statusCodes: {
                        description: 'HTTP status code.',
                        type: 'string'
                      },
                      path: { type: 'string' },
                      count: {
                        format: 'int32',
                        description: 'Request Count.',
                        type: 'integer'
                      },
                      timeInterval: { description: 'Time interval.', type: 'string' }
                    }
                  },
                  'x-ms-identifiers': [ 'path' ]
                }
              }
            },
            actions: {
              description: 'Actions to be executed when a rule is triggered.',
              type: 'object',
              properties: {
                actionType: {
                  description: 'Predefined action to be taken.',
                  enum: [ 'Recycle', 'LogEvent', 'CustomAction' ],
                  type: 'string',
                  'x-ms-enum': { name: 'AutoHealActionType', modelAsString: false }
                },
                customAction: {
                  description: 'Custom action to be taken.',
                  type: 'object',
                  properties: {
                    exe: {
                      description: 'Executable to be run.',
                      type: 'string'
                    },
                    parameters: {
                      description: 'Parameters for the executable.',
                      type: 'string'
                    }
                  }
                },
                minProcessExecutionTime: {
                  description: 'Minimum time the process must execute\n' +
                    'before taking the action',
                  type: 'string'
                }
              }
            }
          }
        },
        tracingOptions: { description: 'Tracing options.', type: 'string' },
        vnetName: {
          description: 'Virtual Network name.',
          type: 'string',
          'x-ms-mutability': [ 'create', 'read' ]
        },
        vnetRouteAllEnabled: {
          description: 'Virtual Network Route All enabled. This causes all outbound traffic to have Virtual Network Security Groups and User Defined Routes applied.',
          type: 'boolean'
        },
        vnetPrivatePortsCount: {
          format: 'int32',
          description: 'The number of private ports assigned to this app. These will be assigned dynamically on runtime.',
          type: 'integer'
        },
        cors: {
          description: 'Cross-Origin Resource Sharing (CORS) settings.',
          type: 'object',
          properties: {
            allowedOrigins: {
              description: 'Gets or sets the list of origins that should be allowed to make cross-origin\n' +
                'calls (for example: http://example.com:12345). Use "*" to allow all.',
              type: 'array',
              items: { type: 'string' }
            },
            supportCredentials: {
              description: 'Gets or sets whether CORS requests with credentials are allowed. See \n' +
                'https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS#Requests_with_credentials\n' +
                'for more details.',
              type: 'boolean'
            }
          }
        },
        push: {
          description: 'Push endpoint settings.',
          type: 'object',
          allOf: [
            {
              description: 'Azure proxy only resource. This resource is not tracked by Azure Resource Manager.',
              type: 'object',
              properties: {
                id: {
                  description: 'Resource Id.',
                  type: 'string',
                  readOnly: true
                },
                name: {
                  description: 'Resource Name.',
                  type: 'string',
                  readOnly: true
                },
                kind: { description: 'Kind of resource.', type: 'string' },
                type: {
                  description: 'Resource type.',
                  type: 'string',
                  readOnly: true
                }
              },
              'x-ms-azure-resource': true
            }
          ],
          properties: {
            properties: {
              description: 'PushSettings resource specific properties',
              required: [ 'isPushEnabled' ],
              type: 'object',
              properties: {
                isPushEnabled: {
                  description: 'Gets or sets a flag indicating whether the Push endpoint is enabled.',
                  type: 'boolean'
                },
                tagWhitelistJson: {
                  description: 'Gets or sets a JSON string containing a list of tags that are whitelisted for use by the push registration endpoint.',
                  type: 'string'
                },
                tagsRequiringAuth: {
                  description: 'Gets or sets a JSON string containing a list of tags that require user authentication to be used in the push registration endpoint.\n' +
                    'Tags can consist of alphanumeric characters and the following:\n' +
                    "'_', '@', '#', '.', ':', '-'. \n" +
                    'Validation should be performed at the PushRequestHandler.',
                  type: 'string'
                },
                dynamicTagsJson: {
                  description: 'Gets or sets a JSON string containing a list of dynamic tags that will be evaluated from user claims in the push registration endpoint.',
                  type: 'string'
                }
              },
              'x-ms-client-flatten': true
            }
          }
        },
        apiDefinition: {
          description: 'Information about the formal API definition for the app.',
          type: 'object',
          properties: {
            url: {
              description: 'The URL of the API definition.',
              type: 'string'
            }
          }
        },
        apiManagementConfig: {
          description: 'Azure API management settings linked to the app.',
          type: 'object',
          properties: {
            id: { description: 'APIM-Api Identifier.', type: 'string' }
          }
        },
        autoSwapSlotName: { description: 'Auto-swap slot name.', type: 'string' },
        localMySqlEnabled: {
          description: '<code>true</code> to enable local MySQL; otherwise, <code>false</code>.',
          default: false,
          type: 'boolean'
        },
        managedServiceIdentityId: {
          format: 'int32',
          description: 'Managed Service Identity Id',
          type: 'integer'
        },
        xManagedServiceIdentityId: {
          format: 'int32',
          description: 'Explicit Managed Service Identity Id',
          type: 'integer'
        },
        keyVaultReferenceIdentity: {
          description: 'Identity to use for Key Vault Reference authentication.',
          type: 'string'
        },
        ipSecurityRestrictions: {
          description: 'IP security restrictions for main.',
          type: 'array',
          items: {
            description: 'IP security restriction on an app.',
            type: 'object',
            properties: {
              ipAddress: {
                description: 'IP address the security restriction is valid for.\n' +
                  'It can be in form of pure ipv4 address (required SubnetMask property) or\n' +
                  'CIDR notation such as ipv4/mask (leading bit match). For CIDR,\n' +
                  'SubnetMask property must not be specified.',
                type: 'string'
              },
              subnetMask: {
                description: 'Subnet mask for the range of IP addresses the restriction is valid for.',
                type: 'string'
              },
              vnetSubnetResourceId: {
                description: 'Virtual network resource id',
                type: 'string'
              },
              vnetTrafficTag: {
                format: 'int32',
                description: '(internal) Vnet traffic tag',
                type: 'integer'
              },
              subnetTrafficTag: {
                format: 'int32',
                description: '(internal) Subnet traffic tag',
                type: 'integer'
              },
              action: {
                description: 'Allow or Deny access for this IP range.',
                type: 'string'
              },
              tag: {
                description: 'Defines what this IP filter will be used for. This is to support IP filtering on proxies.',
                enum: [ 'Default', 'XffProxy', 'ServiceTag' ],
                type: 'string',
                'x-ms-enum': { name: 'IpFilterTag', modelAsString: true }
              },
              priority: {
                format: 'int32',
                description: 'Priority of IP restriction rule.',
                type: 'integer'
              },
              name: {
                description: 'IP restriction rule name.',
                type: 'string'
              },
              description: {
                description: 'IP restriction rule description.',
                type: 'string'
              },
              headers: {
                description: 'IP restriction rule headers.\n' +
                  'X-Forwarded-Host (https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/X-Forwarded-Host#Examples). \n' +
                  'The matching logic is ..\n' +
                  '- If the property is null or empty (default), all hosts(or lack of) are allowed.\n' +
                  '- A value is compared using ordinal-ignore-case (excluding port number).\n' +
                  "- Subdomain wildcards are permitted but don't match the root domain. For example, *.contoso.com matches the subdomain foo.contoso.com\n" +
                  ' but not the root domain contoso.com or multi-level foo.bar.contoso.com\n' +
                  '- Unicode host names are allowed but are converted to Punycode for matching.\n' +
                  '\n' +
                  'X-Forwarded-For (https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/X-Forwarded-For#Examples).\n' +
                  'The matching logic is ..\n' +
                  '- If the property is null or empty (default), any forwarded-for chains (or lack of) are allowed.\n' +
                  '- If any address (excluding port number) in the chain (comma separated) matches the CIDR defined by the property.\n' +
                  '\n' +
                  'X-Azure-FDID and X-FD-HealthProbe.\n' +
                  'The matching logic is exact match.',
                type: 'object',
                additionalProperties: { type: 'array', items: { type: 'string' } }
              }
            }
          },
          'x-ms-identifiers': [ 'name' ]
        },
        scmIpSecurityRestrictions: {
          description: 'IP security restrictions for scm.',
          type: 'array',
          items: {
            description: 'IP security restriction on an app.',
            type: 'object',
            properties: {
              ipAddress: {
                description: 'IP address the security restriction is valid for.\n' +
                  'It can be in form of pure ipv4 address (required SubnetMask property) or\n' +
                  'CIDR notation such as ipv4/mask (leading bit match). For CIDR,\n' +
                  'SubnetMask property must not be specified.',
                type: 'string'
              },
              subnetMask: {
                description: 'Subnet mask for the range of IP addresses the restriction is valid for.',
                type: 'string'
              },
              vnetSubnetResourceId: {
                description: 'Virtual network resource id',
                type: 'string'
              },
              vnetTrafficTag: {
                format: 'int32',
                description: '(internal) Vnet traffic tag',
                type: 'integer'
              },
              subnetTrafficTag: {
                format: 'int32',
                description: '(internal) Subnet traffic tag',
                type: 'integer'
              },
              action: {
                description: 'Allow or Deny access for this IP range.',
                type: 'string'
              },
              tag: {
                description: 'Defines what this IP filter will be used for. This is to support IP filtering on proxies.',
                enum: [ 'Default', 'XffProxy', 'ServiceTag' ],
                type: 'string',
                'x-ms-enum': { name: 'IpFilterTag', modelAsString: true }
              },
              priority: {
                format: 'int32',
                description: 'Priority of IP restriction rule.',
                type: 'integer'
              },
              name: {
                description: 'IP restriction rule name.',
                type: 'string'
              },
              description: {
                description: 'IP restriction rule description.',
                type: 'string'
              },
              headers: {
                description: 'IP restriction rule headers.\n' +
                  'X-Forwarded-Host (https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/X-Forwarded-Host#Examples). \n' +
                  'The matching logic is ..\n' +
                  '- If the property is null or empty (default), all hosts(or lack of) are allowed.\n' +
                  '- A value is compared using ordinal-ignore-case (excluding port number).\n' +
                  "- Subdomain wildcards are permitted but don't match the root domain. For example, *.contoso.com matches the subdomain foo.contoso.com\n" +
                  ' but not the root domain contoso.com or multi-level foo.bar.contoso.com\n' +
                  '- Unicode host names are allowed but are converted to Punycode for matching.\n' +
                  '\n' +
                  'X-Forwarded-For (https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/X-Forwarded-For#Examples).\n' +
                  'The matching logic is ..\n' +
                  '- If the property is null or empty (default), any forwarded-for chains (or lack of) are allowed.\n' +
                  '- If any address (excluding port number) in the chain (comma separated) matches the CIDR defined by the property.\n' +
                  '\n' +
                  'X-Azure-FDID and X-FD-HealthProbe.\n' +
                  'The matching logic is exact match.',
                type: 'object',
                additionalProperties: { type: 'array', items: { type: 'string' } }
              }
            }
          },
          'x-ms-identifiers': [ 'name' ]
        },
        scmIpSecurityRestrictionsUseMain: {
          description: 'IP security restrictions for scm to use main.',
          type: 'boolean'
        },
        http20Enabled: {
          description: 'Http20Enabled: configures a web site to allow clients to connect over http2.0',
          default: true,
          type: 'boolean'
        },
        minTlsVersion: {
          description: 'MinTlsVersion: configures the minimum version of TLS required for SSL requests',
          enum: [ '1.0', '1.1', '1.2' ],
          type: 'string',
          'x-ms-enum': { name: 'SupportedTlsVersions', modelAsString: true }
        },
        scmMinTlsVersion: {
          description: 'ScmMinTlsVersion: configures the minimum version of TLS required for SSL requests for SCM site',
          enum: [ '1.0', '1.1', '1.2' ],
          type: 'string',
          'x-ms-enum': { name: 'SupportedTlsVersions', modelAsString: true }
        },
        ftpsState: {
          description: 'State of FTP / FTPS service',
          enum: [ 'AllAllowed', 'FtpsOnly', 'Disabled' ],
          type: 'string',
          'x-ms-enum': { name: 'FtpsState', modelAsString: true }
        },
        preWarmedInstanceCount: {
          format: 'int32',
          description: 'Number of preWarmed instances.\n' +
            'This setting only applies to the Consumption and Elastic Plans',
          maximum: 10,
          minimum: 0,
          type: 'integer'
        },
        functionAppScaleLimit: {
          format: 'int32',
          description: 'Maximum number of workers that a site can scale out to.\n' +
            'This setting only applies to the Consumption and Elastic Premium Plans',
          minimum: 0,
          type: 'integer'
        },
        healthCheckPath: { description: 'Health check path', type: 'string' },
        functionsRuntimeScaleMonitoringEnabled: {
          description: 'Gets or sets a value indicating whether functions runtime scale monitoring is enabled. When enabled,\n' +
            'the ScaleController will not monitor event sources directly, but will instead call to the\n' +
            'runtime to get scale status.',
          type: 'boolean'
        },
        websiteTimeZone: {
          description: 'Sets the time zone a site uses for generating timestamps. Compatible with Linux and Windows App Service. Setting the WEBSITE_TIME_ZONE app setting takes precedence over this config. For Linux, expects tz database values https://www.iana.org/time-zones (for a quick reference see https://en.wikipedia.org/wiki/List_of_tz_database_time_zones). For Windows, expects one of the time zones listed under HKEY_LOCAL_MACHINE\\SOFTWARE\\Microsoft\\Windows NT\\CurrentVersion\\Time Zones',
          type: 'string'
        },
        minimumElasticInstanceCount: {
          format: 'int32',
          description: 'Number of minimum instance count for a site\n' +
            'This setting only applies to the Elastic Plans',
          maximum: 20,
          minimum: 0,
          type: 'integer'
        },
        azureStorageAccounts: {
          description: 'List of Azure Storage Accounts.',
          type: 'object',
          additionalProperties: {
            description: 'Azure Files or Blob Storage access information value for dictionary storage.',
            type: 'object',
            properties: {
              type: {
                description: 'Type of storage.',
                enum: [ 'AzureFiles', 'AzureBlob' ],
                type: 'string',
                'x-ms-enum': { name: 'AzureStorageType', modelAsString: false }
              },
              accountName: {
                description: 'Name of the storage account.',
                type: 'string'
              },
              shareName: {
                description: 'Name of the file share (container name, for Blob storage).',
                type: 'string'
              },
              accessKey: {
                description: 'Access key for the storage account.',
                type: 'string',
                'x-ms-secret': true
              },
              mountPath: {
                description: "Path to mount the storage within the site's runtime environment.",
                type: 'string'
              },
              state: {
                description: 'State of the storage account.',
                enum: [
                  'Ok',
                  'InvalidCredentials',
                  'InvalidShare',
                  'NotValidated'
                ],
                type: 'string',
                readOnly: true,
                'x-ms-enum': { name: 'AzureStorageState', modelAsString: false }
              }
            }
          }
        },
        publicNetworkAccess: {
          description: 'Property to allow or block all public traffic.',
          type: 'string'
        }
      }
    }
  }
}
```
## Misc
The resource version is `2021-03-01`.

The Swagger schema used to generate this documentation can be found [here](https://github.com/Azure/azure-rest-api-specs/tree/main/specification/web/resource-manager/Microsoft.Web/stable/2021-03-01/WebApps.json).
