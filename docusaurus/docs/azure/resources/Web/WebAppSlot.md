---
id: WebAppSlot
title: WebAppSlot
---
Provides a **WebAppSlot** from the **Web** group
## Examples
## Dependencies
- [ResourceGroup](../Resources/ResourceGroup.md)
- [UserAssignedIdentity](../ManagedIdentity/UserAssignedIdentity.md)
- [ServerFarm](../Web/ServerFarm.md)
- [HostingEnvironment](../Web/HostingEnvironment.md)
- [WebApp](../Web/WebApp.md)
- [Subnet](../Network/Subnet.md)
- [Site](../Web/Site.md)
## Swagger Schema
```js
{
  description: 'A web app, a mobile app backend, or an API app.',
  type: 'object',
  allOf: [
    {
      description: 'Azure resource. This resource is tracked in Azure Resource Manager',
      required: [ 'location' ],
      type: 'object',
      properties: {
        id: { description: 'Resource Id.', type: 'string', readOnly: true },
        name: {
          description: 'Resource Name.',
          type: 'string',
          readOnly: true
        },
        kind: { description: 'Kind of resource.', type: 'string' },
        location: { description: 'Resource Location.', type: 'string' },
        type: {
          description: 'Resource type.',
          type: 'string',
          readOnly: true
        },
        tags: {
          description: 'Resource tags.',
          type: 'object',
          additionalProperties: { type: 'string' }
        }
      },
      'x-ms-azure-resource': true
    }
  ],
  properties: {
    properties: {
      description: 'Site resource specific properties',
      type: 'object',
      properties: {
        state: {
          description: 'Current state of the app.',
          type: 'string',
          readOnly: true
        },
        hostNames: {
          description: 'Hostnames associated with the app.',
          type: 'array',
          items: { type: 'string' },
          readOnly: true
        },
        repositorySiteName: {
          description: 'Name of the repository site.',
          type: 'string',
          readOnly: true
        },
        usageState: {
          description: 'State indicating whether the app has exceeded its quota usage. Read-only.',
          enum: [ 'Normal', 'Exceeded' ],
          type: 'string',
          readOnly: true,
          'x-ms-enum': { name: 'UsageState', modelAsString: false }
        },
        enabled: {
          description: '<code>true</code> if the app is enabled; otherwise, <code>false</code>. Setting this value to false disables the app (takes the app offline).',
          type: 'boolean'
        },
        enabledHostNames: {
          description: 'Enabled hostnames for the app.Hostnames need to be assigned (see HostNames) AND enabled. Otherwise,\n' +
            'the app is not served on those hostnames.',
          type: 'array',
          items: { type: 'string' },
          readOnly: true
        },
        availabilityState: {
          description: 'Management information availability state for the app.',
          enum: [ 'Normal', 'Limited', 'DisasterRecoveryMode' ],
          type: 'string',
          readOnly: true,
          'x-ms-enum': { name: 'SiteAvailabilityState', modelAsString: false }
        },
        hostNameSslStates: {
          description: "Hostname SSL states are used to manage the SSL bindings for app's hostnames.",
          type: 'array',
          items: {
            description: 'SSL-enabled hostname.',
            type: 'object',
            properties: {
              name: { description: 'Hostname.', type: 'string' },
              sslState: {
                description: 'SSL type.',
                enum: [ 'Disabled', 'SniEnabled', 'IpBasedEnabled' ],
                type: 'string',
                'x-ms-enum': { name: 'SslState', modelAsString: false }
              },
              virtualIP: {
                description: 'Virtual IP address assigned to the hostname if IP based SSL is enabled.',
                type: 'string'
              },
              thumbprint: {
                description: 'SSL certificate thumbprint.',
                type: 'string'
              },
              toUpdate: {
                description: 'Set to <code>true</code> to update existing hostname.',
                type: 'boolean'
              },
              hostType: {
                description: 'Indicates whether the hostname is a standard or repository hostname.',
                enum: [ 'Standard', 'Repository' ],
                type: 'string',
                'x-ms-enum': { name: 'HostType', modelAsString: false }
              }
            }
          }
        },
        serverFarmId: {
          description: 'Resource ID of the associated App Service plan, formatted as: "/subscriptions/{subscriptionID}/resourceGroups/{groupName}/providers/Microsoft.Web/serverfarms/{appServicePlanName}".',
          type: 'string'
        },
        reserved: {
          description: '<code>true</code> if reserved; otherwise, <code>false</code>.',
          default: false,
          type: 'boolean',
          'x-ms-mutability': [ 'create', 'read' ]
        },
        isXenon: {
          description: 'Obsolete: Hyper-V sandbox.',
          default: false,
          type: 'boolean',
          'x-ms-mutability': [ 'create', 'read' ]
        },
        hyperV: {
          description: 'Hyper-V sandbox.',
          default: false,
          type: 'boolean',
          'x-ms-mutability': [ 'create', 'read' ]
        },
        lastModifiedTimeUtc: {
          format: 'date-time',
          description: 'Last time the app was modified, in UTC. Read-only.',
          type: 'string',
          readOnly: true
        },
        siteConfig: {
          description: 'Configuration of the app.',
          type: 'object',
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
            remoteDebuggingVersion: {
              description: 'Remote debugging version.',
              type: 'string'
            },
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
              }
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
                    'x-ms-enum': {
                      name: 'ConnectionStringType',
                      modelAsString: false
                    }
                  }
                }
              }
            },
            machineKey: {
              description: 'Site MachineKey.',
              readOnly: true,
              type: 'object',
              properties: {
                validation: {
                  description: 'MachineKey validation.',
                  type: 'string'
                },
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
              }
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
            appCommandLine: {
              description: 'App command line to launch.',
              type: 'string'
            },
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
                      properties: [Object]
                    }
                  }
                }
              }
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
                      actionHostName: [Object],
                      reroutePercentage: [Object],
                      changeStep: [Object],
                      changeIntervalInMinutes: [Object],
                      minReroutePercentage: [Object],
                      maxReroutePercentage: [Object],
                      changeDecisionCallbackUrl: [Object],
                      name: [Object]
                    }
                  }
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
                      properties: [Object]
                    },
                    privateBytesInKB: {
                      format: 'int32',
                      description: 'A rule based on private bytes.',
                      type: 'integer'
                    },
                    statusCodes: {
                      description: 'A rule based on status codes.',
                      type: 'array',
                      items: [Object]
                    },
                    slowRequests: {
                      description: 'A rule based on request execution time.',
                      type: 'object',
                      properties: [Object]
                    },
                    slowRequestsWithPath: {
                      description: 'A rule based on multiple Slow Requests Rule with path',
                      type: 'array',
                      items: [Object]
                    },
                    statusCodesRange: {
                      description: 'A rule based on status codes ranges.',
                      type: 'array',
                      items: [Object]
                    }
                  }
                },
                actions: {
                  description: 'Actions to be executed when a rule is triggered.',
                  type: 'object',
                  properties: {
                    actionType: {
                      description: 'Predefined action to be taken.',
                      enum: [Array],
                      type: 'string',
                      'x-ms-enum': [Object]
                    },
                    customAction: {
                      description: 'Custom action to be taken.',
                      type: 'object',
                      properties: [Object]
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
                    kind: {
                      description: 'Kind of resource.',
                      type: 'string'
                    },
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
                    additionalProperties: { type: 'array', items: [Object] }
                  }
                }
              }
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
                    additionalProperties: { type: 'array', items: [Object] }
                  }
                }
              }
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
        },
        trafficManagerHostNames: {
          description: 'Azure Traffic Manager hostnames associated with the app. Read-only.',
          type: 'array',
          items: { type: 'string' },
          readOnly: true
        },
        scmSiteAlsoStopped: {
          description: '<code>true</code> to stop SCM (KUDU) site when the app is stopped; otherwise, <code>false</code>. The default is <code>false</code>.',
          default: false,
          type: 'boolean'
        },
        targetSwapSlot: {
          description: 'Specifies which deployment slot this app will swap into. Read-only.',
          type: 'string',
          readOnly: true
        },
        hostingEnvironmentProfile: {
          description: 'App Service Environment to use for the app.',
          'x-ms-mutability': [ 'create', 'read' ],
          type: 'object',
          properties: {
            id: {
              description: 'Resource ID of the App Service Environment.',
              type: 'string'
            },
            name: {
              description: 'Name of the App Service Environment.',
              type: 'string',
              readOnly: true
            },
            type: {
              description: 'Resource type of the App Service Environment.',
              type: 'string',
              readOnly: true
            }
          }
        },
        clientAffinityEnabled: {
          description: '<code>true</code> to enable client affinity; <code>false</code> to stop sending session affinity cookies, which route client requests in the same session to the same instance. Default is <code>true</code>.',
          type: 'boolean'
        },
        clientCertEnabled: {
          description: '<code>true</code> to enable client certificate authentication (TLS mutual authentication); otherwise, <code>false</code>. Default is <code>false</code>.',
          type: 'boolean'
        },
        clientCertMode: {
          description: 'This composes with ClientCertEnabled setting.\n' +
            '- ClientCertEnabled: false means ClientCert is ignored.\n' +
            '- ClientCertEnabled: true and ClientCertMode: Required means ClientCert is required.\n' +
            '- ClientCertEnabled: true and ClientCertMode: Optional means ClientCert is optional or accepted.',
          enum: [ 'Required', 'Optional', 'OptionalInteractiveUser' ],
          type: 'string',
          'x-ms-enum': { name: 'ClientCertMode', modelAsString: false }
        },
        clientCertExclusionPaths: {
          description: 'client certificate authentication comma-separated exclusion paths',
          type: 'string'
        },
        hostNamesDisabled: {
          description: '<code>true</code> to disable the public hostnames of the app; otherwise, <code>false</code>.\n' +
            ' If <code>true</code>, the app is only accessible via API management process.',
          type: 'boolean'
        },
        customDomainVerificationId: {
          description: 'Unique identifier that verifies the custom domains assigned to the app. Customer will add this id to a txt record for verification.',
          type: 'string'
        },
        outboundIpAddresses: {
          description: 'List of IP addresses that the app uses for outbound connections (e.g. database access). Includes VIPs from tenants that site can be hosted with current settings. Read-only.',
          type: 'string',
          readOnly: true
        },
        possibleOutboundIpAddresses: {
          description: 'List of IP addresses that the app uses for outbound connections (e.g. database access). Includes VIPs from all tenants except dataComponent. Read-only.',
          type: 'string',
          readOnly: true
        },
        containerSize: {
          format: 'int32',
          description: 'Size of the function container.',
          type: 'integer'
        },
        dailyMemoryTimeQuota: {
          format: 'int32',
          description: 'Maximum allowed daily memory-time quota (applicable on dynamic apps only).',
          type: 'integer'
        },
        suspendedTill: {
          format: 'date-time',
          description: 'App suspended till in case memory-time quota is exceeded.',
          type: 'string',
          readOnly: true
        },
        maxNumberOfWorkers: {
          format: 'int32',
          description: 'Maximum number of workers.\n' +
            'This only applies to Functions container.',
          type: 'integer',
          readOnly: true
        },
        cloningInfo: {
          description: 'If specified during app creation, the app is cloned from a source app.',
          'x-ms-mutability': [ 'create' ],
          required: [ 'sourceWebAppId' ],
          type: 'object',
          properties: {
            correlationId: {
              format: 'uuid',
              description: 'Correlation ID of cloning operation. This ID ties multiple cloning operations\n' +
                'together to use the same snapshot.',
              type: 'string',
              example: '00000000-0000-0000-0000-000000000000'
            },
            overwrite: {
              description: '<code>true</code> to overwrite destination app; otherwise, <code>false</code>.',
              type: 'boolean'
            },
            cloneCustomHostNames: {
              description: '<code>true</code> to clone custom hostnames from source app; otherwise, <code>false</code>.',
              type: 'boolean'
            },
            cloneSourceControl: {
              description: '<code>true</code> to clone source control from source app; otherwise, <code>false</code>.',
              type: 'boolean'
            },
            sourceWebAppId: {
              description: 'ARM resource ID of the source app. App resource ID is of the form \n' +
                '/subscriptions/{subId}/resourceGroups/{resourceGroupName}/providers/Microsoft.Web/sites/{siteName} for production slots and \n' +
                '/subscriptions/{subId}/resourceGroups/{resourceGroupName}/providers/Microsoft.Web/sites/{siteName}/slots/{slotName} for other slots.',
              type: 'string'
            },
            sourceWebAppLocation: {
              description: 'Location of source app ex: West US or North Europe',
              type: 'string'
            },
            hostingEnvironment: { description: 'App Service Environment.', type: 'string' },
            appSettingsOverrides: {
              description: 'Application setting overrides for cloned app. If specified, these settings override the settings cloned \n' +
                'from source app. Otherwise, application settings from source app are retained.',
              type: 'object',
              additionalProperties: { type: 'string' }
            },
            configureLoadBalancing: {
              description: '<code>true</code> to configure load balancing for source and destination app.',
              type: 'boolean'
            },
            trafficManagerProfileId: {
              description: 'ARM resource ID of the Traffic Manager profile to use, if it exists. Traffic Manager resource ID is of the form \n' +
                '/subscriptions/{subId}/resourceGroups/{resourceGroupName}/providers/Microsoft.Network/trafficManagerProfiles/{profileName}.',
              type: 'string'
            },
            trafficManagerProfileName: {
              description: 'Name of Traffic Manager profile to create. This is only needed if Traffic Manager profile does not already exist.',
              type: 'string'
            }
          }
        },
        resourceGroup: {
          description: 'Name of the resource group the app belongs to. Read-only.',
          type: 'string',
          readOnly: true
        },
        isDefaultContainer: {
          description: '<code>true</code> if the app is a default container; otherwise, <code>false</code>.',
          type: 'boolean',
          readOnly: true
        },
        defaultHostName: {
          description: 'Default hostname of the app. Read-only.',
          type: 'string',
          readOnly: true
        },
        slotSwapStatus: {
          description: 'Status of the last deployment slot swap operation.',
          readOnly: true,
          type: 'object',
          properties: {
            timestampUtc: {
              format: 'date-time',
              description: 'The time the last successful slot swap completed.',
              type: 'string',
              readOnly: true
            },
            sourceSlotName: {
              description: 'The source slot of the last swap operation.',
              type: 'string',
              readOnly: true
            },
            destinationSlotName: {
              description: 'The destination slot of the last swap operation.',
              type: 'string',
              readOnly: true
            }
          }
        },
        httpsOnly: {
          description: 'HttpsOnly: configures a web site to accept only https requests. Issues redirect for\n' +
            'http requests',
          type: 'boolean'
        },
        redundancyMode: {
          description: 'Site redundancy mode',
          enum: [
            'None',
            'Manual',
            'Failover',
            'ActiveActive',
            'GeoRedundant'
          ],
          type: 'string',
          'x-ms-enum': { name: 'RedundancyMode', modelAsString: false }
        },
        inProgressOperationId: {
          format: 'uuid',
          description: 'Specifies an operation id if this site has a pending operation.',
          type: 'string',
          readOnly: true,
          example: '00000000-0000-0000-0000-000000000000'
        },
        storageAccountRequired: {
          description: 'Checks if Customer provided storage account is required',
          type: 'boolean'
        },
        keyVaultReferenceIdentity: {
          description: 'Identity to use for Key Vault Reference authentication.',
          type: 'string'
        },
        virtualNetworkSubnetId: {
          description: 'Azure Resource Manager ID of the Virtual network and subnet to be joined by Regional VNET Integration.\n' +
            'This must be of the form /subscriptions/{subscriptionName}/resourceGroups/{resourceGroupName}/providers/Microsoft.Network/virtualNetworks/{vnetName}/subnets/{subnetName}',
          type: 'string'
        }
      },
      'x-ms-client-flatten': true
    },
    identity: {
      description: 'Managed service identity.',
      type: 'object',
      properties: {
        type: {
          description: 'Type of managed service identity.',
          enum: [
            'SystemAssigned',
            'UserAssigned',
            'SystemAssigned, UserAssigned',
            'None'
          ],
          type: 'string',
          'x-ms-enum': { name: 'ManagedServiceIdentityType', modelAsString: false }
        },
        tenantId: {
          description: 'Tenant of managed service identity.',
          type: 'string',
          readOnly: true
        },
        principalId: {
          description: 'Principal Id of managed service identity.',
          type: 'string',
          readOnly: true
        },
        userAssignedIdentities: {
          description: "The list of user assigned identities associated with the resource. The user identity dictionary key references will be ARM resource ids in the form: '/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.ManagedIdentity/userAssignedIdentities/{identityName}",
          type: 'object',
          additionalProperties: {
            description: 'User Assigned identity.',
            type: 'object',
            properties: {
              principalId: {
                description: 'Principal Id of user assigned identity',
                type: 'string',
                readOnly: true
              },
              clientId: {
                description: 'Client Id of user assigned identity',
                type: 'string',
                readOnly: true
              }
            }
          }
        }
      }
    },
    extendedLocation: {
      description: 'Extended Location.',
      type: 'object',
      properties: {
        name: { description: 'Name of extended location.', type: 'string' },
        type: {
          description: 'Type of extended location.',
          type: 'string',
          readOnly: true
        }
      }
    }
  }
}
```
## Misc
The resource version is `2021-02-01`.

The Swagger schema used to generate this documentation can be found [here](https://github.com/Azure/azure-rest-api-specs/tree/main/specification/web/resource-manager/Microsoft.Web/stable/2021-02-01/WebApps.json).
