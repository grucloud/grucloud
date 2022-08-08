---
id: ContainerApp
title: ContainerApp
---
Provides a **ContainerApp** from the **App** group
## Examples
### Create or Update Container App
```js
exports.createResources = () => [
  {
    type: "ContainerApp",
    group: "App",
    name: "myContainerApp",
    properties: () => ({
      location: "East US",
      properties: {
        managedEnvironmentId:
          "/subscriptions/34adfa4f-cedf-4dc0-ba29-b6d1a69ab345/resourceGroups/rg/providers/Microsoft.App/managedEnvironments/demokube",
        configuration: {
          ingress: {
            external: true,
            targetPort: 3000,
            customDomains: [
              {
                name: "www.my-name.com",
                bindingType: "SniEnabled",
                certificateId:
                  "/subscriptions/34adfa4f-cedf-4dc0-ba29-b6d1a69ab345/resourceGroups/rg/providers/Microsoft.App/managedEnvironments/demokube/certificates/my-certificate-for-my-name-dot-com",
              },
              {
                name: "www.my-other-name.com",
                bindingType: "SniEnabled",
                certificateId:
                  "/subscriptions/34adfa4f-cedf-4dc0-ba29-b6d1a69ab345/resourceGroups/rg/providers/Microsoft.App/managedEnvironments/demokube/certificates/my-certificate-for-my-other-name-dot-com",
              },
            ],
            traffic: [
              {
                weight: 100,
                revisionName: "testcontainerApp0-ab1234",
                label: "production",
              },
            ],
          },
          dapr: { enabled: true, appPort: 3000, appProtocol: "http" },
        },
        template: {
          containers: [
            {
              image: "repo/testcontainerApp0:v1",
              name: "testcontainerApp0",
              probes: [
                {
                  type: "Liveness",
                  httpGet: {
                    path: "/health",
                    port: 8080,
                    httpHeaders: [{ name: "Custom-Header", value: "Awesome" }],
                  },
                  initialDelaySeconds: 3,
                  periodSeconds: 3,
                },
              ],
            },
          ],
          scale: {
            minReplicas: 1,
            maxReplicas: 5,
            rules: [
              {
                name: "httpscalingrule",
                custom: {
                  type: "http",
                  metadata: { concurrentRequests: "50" },
                },
              },
            ],
          },
        },
      },
    }),
    dependencies: ({}) => ({
      resourceGroup: "myResourceGroup",
      managedIdentities: ["myUserAssignedIdentity"],
      managedEnvironment: "myManagedEnvironment",
      certificates: ["myCertificate"],
      containerAppsSourceControl: "myContainerAppsSourceControl",
    }),
  },
];

```
## Dependencies
- [ResourceGroup](../Resources/ResourceGroup.md)
- [UserAssignedIdentity](../ManagedIdentity/UserAssignedIdentity.md)
- [ManagedEnvironment](../App/ManagedEnvironment.md)
- [Certificate](../App/Certificate.md)
- [ContainerAppsSourceControl](../App/ContainerAppsSourceControl.md)
## Swagger Schema
```js
{
  description: 'Container App.',
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
    identity: {
      description: 'managed identities for the Container App to interact with other Azure services without maintaining any secrets or credentials in code.',
      type: 'object',
      properties: {
        principalId: {
          readOnly: true,
          format: 'uuid',
          type: 'string',
          description: 'The service principal ID of the system assigned identity. This property will only be provided for a system assigned identity.'
        },
        tenantId: {
          readOnly: true,
          format: 'uuid',
          type: 'string',
          description: 'The tenant ID of the system assigned identity. This property will only be provided for a system assigned identity.'
        },
        type: {
          description: 'Type of managed service identity (where both SystemAssigned and UserAssigned types are allowed).',
          enum: [
            'None',
            'SystemAssigned',
            'UserAssigned',
            'SystemAssigned,UserAssigned'
          ],
          type: 'string',
          'x-ms-enum': { name: 'ManagedServiceIdentityType', modelAsString: true }
        },
        userAssignedIdentities: {
          title: 'User-Assigned Identities',
          description: "The set of user assigned identities associated with the resource. The userAssignedIdentities dictionary keys will be ARM resource ids in the form: '/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.ManagedIdentity/userAssignedIdentities/{identityName}. The dictionary values can be empty objects ({}) in requests.",
          type: 'object',
          additionalProperties: {
            type: 'object',
            description: 'User assigned identity properties',
            properties: {
              principalId: {
                description: 'The principal ID of the assigned identity.',
                format: 'uuid',
                type: 'string',
                readOnly: true
              },
              clientId: {
                description: 'The client ID of the assigned identity.',
                format: 'uuid',
                type: 'string',
                readOnly: true
              }
            }
          }
        }
      },
      required: [ 'type' ]
    },
    properties: {
      description: 'ContainerApp resource specific properties',
      type: 'object',
      properties: {
        provisioningState: {
          description: 'Provisioning state of the Container App.',
          enum: [ 'InProgress', 'Succeeded', 'Failed', 'Canceled' ],
          type: 'string',
          readOnly: true,
          'x-ms-enum': {
            name: 'ContainerAppProvisioningState',
            modelAsString: true
          }
        },
        managedEnvironmentId: {
          description: "Resource ID of the Container App's environment.",
          type: 'string',
          'x-ms-mutability': [ 'create', 'read' ]
        },
        latestRevisionName: {
          description: 'Name of the latest revision of the Container App.',
          type: 'string',
          readOnly: true
        },
        latestRevisionFqdn: {
          description: 'Fully Qualified Domain Name of the latest revision of the Container App.',
          type: 'string',
          readOnly: true
        },
        customDomainVerificationId: {
          description: 'Id used to verify domain name ownership',
          type: 'string',
          readOnly: true
        },
        configuration: {
          description: 'Non versioned Container App configuration properties.',
          type: 'object',
          properties: {
            secrets: {
              description: 'Collection of secrets used by a Container app',
              type: 'array',
              items: {
                description: 'Secret definition.',
                type: 'object',
                properties: {
                  name: { description: 'Secret Name.', type: 'string' },
                  value: {
                    description: 'Secret Value.',
                    type: 'string',
                    'x-ms-mutability': [ 'create', 'update' ],
                    'x-ms-secret': true
                  }
                }
              },
              'x-ms-identifiers': [ 'name' ]
            },
            activeRevisionsMode: {
              description: 'ActiveRevisionsMode controls how active revisions are handled for the Container app:\n' +
                '<list><item>Multiple: multiple revisions can be active.</item><item>Single: Only one revision can be active at a time. Revision weights can not be used in this mode. If no value if provided, this is the default.</item></list>',
              enum: [ 'Multiple', 'Single' ],
              type: 'string',
              'x-ms-enum': { name: 'ActiveRevisionsMode', modelAsString: true }
            },
            ingress: {
              description: 'Ingress configurations.',
              type: 'object',
              properties: {
                fqdn: {
                  description: 'Hostname.',
                  type: 'string',
                  readOnly: true
                },
                external: {
                  description: 'Bool indicating if app exposes an external http endpoint',
                  default: false,
                  type: 'boolean'
                },
                targetPort: {
                  format: 'int32',
                  description: 'Target Port in containers for traffic from ingress',
                  type: 'integer'
                },
                transport: {
                  description: 'Ingress transport protocol',
                  enum: [ 'auto', 'http', 'http2' ],
                  type: 'string',
                  'x-ms-enum': {
                    name: 'IngressTransportMethod',
                    modelAsString: true
                  }
                },
                traffic: {
                  description: "Traffic weights for app's revisions",
                  type: 'array',
                  items: {
                    description: 'Traffic weight assigned to a revision',
                    type: 'object',
                    properties: {
                      revisionName: {
                        description: 'Name of a revision',
                        type: 'string'
                      },
                      weight: {
                        format: 'int32',
                        description: 'Traffic weight assigned to a revision',
                        type: 'integer'
                      },
                      latestRevision: {
                        description: 'Indicates that the traffic weight belongs to a latest stable revision',
                        default: false,
                        type: 'boolean'
                      },
                      label: {
                        description: 'Associates a traffic label with a revision',
                        type: 'string'
                      }
                    }
                  },
                  'x-ms-identifiers': [ 'revisionName' ]
                },
                customDomains: {
                  description: "custom domain bindings for Container Apps' hostnames.",
                  type: 'array',
                  items: {
                    description: 'Custom Domain of a Container App',
                    type: 'object',
                    required: [ 'name', 'certificateId' ],
                    properties: {
                      name: { description: 'Hostname.', type: 'string' },
                      bindingType: {
                        description: 'Custom Domain binding type.',
                        enum: [ 'Disabled', 'SniEnabled' ],
                        type: 'string',
                        'x-ms-enum': { name: 'bindingType', modelAsString: true }
                      },
                      certificateId: {
                        description: 'Resource Id of the Certificate to be bound to this hostname. Must exist in the Managed Environment.',
                        type: 'string'
                      }
                    }
                  },
                  'x-ms-identifiers': [ 'name' ]
                },
                allowInsecure: {
                  description: 'Bool indicating if HTTP connections to is allowed. If set to false HTTP connections are automatically redirected to HTTPS connections',
                  type: 'boolean'
                }
              }
            },
            registries: {
              description: 'Collection of private container registry credentials for containers used by the Container app',
              type: 'array',
              items: {
                description: 'Container App Private Registry',
                type: 'object',
                properties: {
                  server: {
                    description: 'Container Registry Server',
                    type: 'string'
                  },
                  username: {
                    description: 'Container Registry Username',
                    type: 'string'
                  },
                  passwordSecretRef: {
                    description: 'The name of the Secret that contains the registry login password',
                    type: 'string'
                  },
                  identity: {
                    description: "A Managed Identity to use to authenticate with Azure Container Registry. For user-assigned identities, use the full user-assigned identity Resource ID. For system-assigned identities, use 'system'",
                    type: 'string'
                  }
                }
              },
              'x-ms-identifiers': [ 'server' ]
            },
            dapr: {
              description: 'Dapr configuration for the Container App.',
              type: 'object',
              properties: {
                enabled: {
                  description: 'Boolean indicating if the Dapr side car is enabled',
                  type: 'boolean'
                },
                appId: {
                  description: 'Dapr application identifier',
                  type: 'string'
                },
                appProtocol: {
                  description: 'Tells Dapr which protocol your application is using. Valid options are http and grpc. Default is http',
                  enum: [ 'http', 'grpc' ],
                  type: 'string',
                  'x-ms-enum': { name: 'appProtocol', modelAsString: true }
                },
                appPort: {
                  format: 'int32',
                  description: 'Tells Dapr which port your application is listening on',
                  type: 'integer'
                }
              }
            }
          }
        },
        template: {
          description: 'Container App versioned application definition.',
          type: 'object',
          properties: {
            revisionSuffix: {
              description: 'User friendly suffix that is appended to the revision name',
              type: 'string'
            },
            containers: {
              description: 'List of container definitions for the Container App.',
              type: 'array',
              items: {
                description: 'Container App container definition.',
                type: 'object',
                properties: {
                  image: {
                    description: 'Container image tag.',
                    type: 'string'
                  },
                  name: {
                    description: 'Custom container name.',
                    type: 'string'
                  },
                  command: {
                    description: 'Container start command.',
                    type: 'array',
                    items: { type: 'string' }
                  },
                  args: {
                    description: 'Container start command arguments.',
                    type: 'array',
                    items: { type: 'string' }
                  },
                  env: {
                    description: 'Container environment variables.',
                    type: 'array',
                    items: {
                      description: 'Container App container environment variable.',
                      type: 'object',
                      properties: {
                        name: {
                          description: 'Environment variable name.',
                          type: 'string'
                        },
                        value: {
                          description: 'Non-secret environment variable value.',
                          type: 'string'
                        },
                        secretRef: {
                          description: 'Name of the Container App secret from which to pull the environment variable value.',
                          type: 'string'
                        }
                      }
                    },
                    'x-ms-identifiers': [ 'name' ]
                  },
                  resources: {
                    description: 'Container resource requirements.',
                    type: 'object',
                    properties: {
                      cpu: {
                        format: 'double',
                        description: 'Required CPU in cores, e.g. 0.5',
                        type: 'number'
                      },
                      memory: {
                        description: 'Required memory, e.g. "250Mb"',
                        type: 'string'
                      },
                      ephemeralStorage: {
                        description: 'Ephemeral Storage, e.g. "1Gi"',
                        type: 'string',
                        readOnly: true
                      }
                    }
                  },
                  probes: {
                    description: 'List of probes for the container.',
                    type: 'array',
                    items: {
                      description: 'Probe describes a health check to be performed against a container to determine whether it is alive or ready to receive traffic.',
                      type: 'object',
                      properties: {
                        failureThreshold: {
                          description: 'Minimum consecutive failures for the probe to be considered failed after having succeeded. Defaults to 3. Minimum value is 1. Maximum value is 10.',
                          type: 'integer',
                          format: 'int32'
                        },
                        httpGet: {
                          description: 'HTTPGet specifies the http request to perform.',
                          type: 'object',
                          required: [ 'port' ],
                          properties: {
                            host: {
                              description: 'Host name to connect to, defaults to the pod IP. You probably want to set "Host" in httpHeaders instead.',
                              type: 'string'
                            },
                            httpHeaders: {
                              description: 'Custom headers to set in the request. HTTP allows repeated headers.',
                              type: 'array',
                              items: {
                                description: 'HTTPHeader describes a custom header to be used in HTTP probes',
                                type: 'object',
                                required: [Array],
                                properties: [Object]
                              },
                              'x-ms-identifiers': [ 'name' ]
                            },
                            path: {
                              description: 'Path to access on the HTTP server.',
                              type: 'string'
                            },
                            port: {
                              description: 'Name or number of the port to access on the container. Number must be in the range 1 to 65535. Name must be an IANA_SVC_NAME.',
                              type: 'integer',
                              format: 'int32'
                            },
                            scheme: {
                              description: 'Scheme to use for connecting to the host. Defaults to HTTP.',
                              enum: [ 'HTTP', 'HTTPS' ],
                              type: 'string',
                              'x-ms-enum': { name: 'Scheme', modelAsString: true }
                            }
                          }
                        },
                        initialDelaySeconds: {
                          description: 'Number of seconds after the container has started before liveness probes are initiated. Minimum value is 1. Maximum value is 60.',
                          type: 'integer',
                          format: 'int32'
                        },
                        periodSeconds: {
                          description: 'How often (in seconds) to perform the probe. Default to 10 seconds. Minimum value is 1. Maximum value is 240.',
                          type: 'integer',
                          format: 'int32'
                        },
                        successThreshold: {
                          description: 'Minimum consecutive successes for the probe to be considered successful after having failed. Defaults to 1. Must be 1 for liveness and startup. Minimum value is 1. Maximum value is 10.',
                          type: 'integer',
                          format: 'int32'
                        },
                        tcpSocket: {
                          description: 'TCPSocket specifies an action involving a TCP port. TCP hooks not yet supported.',
                          type: 'object',
                          required: [ 'port' ],
                          properties: {
                            host: {
                              description: 'Optional: Host name to connect to, defaults to the pod IP.',
                              type: 'string'
                            },
                            port: {
                              description: 'Number or name of the port to access on the container. Number must be in the range 1 to 65535. Name must be an IANA_SVC_NAME.',
                              type: 'integer',
                              format: 'int32'
                            }
                          }
                        },
                        terminationGracePeriodSeconds: {
                          description: "Optional duration in seconds the pod needs to terminate gracefully upon probe failure. The grace period is the duration in seconds after the processes running in the pod are sent a termination signal and the time when the processes are forcibly halted with a kill signal. Set this value longer than the expected cleanup time for your process. If this value is nil, the pod's terminationGracePeriodSeconds will be used. Otherwise, this value overrides the value provided by the pod spec. Value must be non-negative integer. The value zero indicates stop immediately via the kill signal (no opportunity to shut down). This is an alpha field and requires enabling ProbeTerminationGracePeriod feature gate. Maximum value is 3600 seconds (1 hour)",
                          type: 'integer',
                          format: 'int64'
                        },
                        timeoutSeconds: {
                          description: 'Number of seconds after which the probe times out. Defaults to 1 second. Minimum value is 1. Maximum value is 240.',
                          type: 'integer',
                          format: 'int32'
                        },
                        type: {
                          description: 'The type of probe.',
                          enum: [ 'Liveness', 'Readiness', 'Startup' ],
                          type: 'string',
                          'x-ms-enum': { name: 'Type', modelAsString: true }
                        }
                      }
                    },
                    'x-ms-identifiers': [ 'type' ]
                  },
                  volumeMounts: {
                    description: 'Container volume mounts.',
                    type: 'array',
                    items: {
                      description: 'Volume mount for the Container App.',
                      type: 'object',
                      properties: {
                        volumeName: {
                          description: 'This must match the Name of a Volume.',
                          type: 'string'
                        },
                        mountPath: {
                          description: "Path within the container at which the volume should be mounted.Must not contain ':'.",
                          type: 'string'
                        }
                      }
                    },
                    'x-ms-identifiers': [ 'volumeName' ]
                  }
                }
              },
              'x-ms-identifiers': [ 'name' ]
            },
            scale: {
              description: 'Scaling properties for the Container App.',
              type: 'object',
              properties: {
                minReplicas: {
                  format: 'int32',
                  description: 'Optional. Minimum number of container replicas.',
                  type: 'integer'
                },
                maxReplicas: {
                  format: 'int32',
                  description: 'Optional. Maximum number of container replicas. Defaults to 10 if not set.',
                  type: 'integer'
                },
                rules: {
                  description: 'Scaling rules.',
                  type: 'array',
                  items: {
                    description: 'Container App container scaling rule.',
                    type: 'object',
                    properties: {
                      name: {
                        description: 'Scale Rule Name',
                        type: 'string'
                      },
                      azureQueue: {
                        description: 'Azure Queue based scaling.',
                        type: 'object',
                        properties: {
                          queueName: {
                            description: 'Queue name.',
                            type: 'string'
                          },
                          queueLength: {
                            format: 'int32',
                            description: 'Queue length.',
                            type: 'integer'
                          },
                          auth: {
                            description: 'Authentication secrets for the queue scale rule.',
                            type: 'array',
                            items: {
                              description: 'Auth Secrets for Container App Scale Rule',
                              type: 'object',
                              properties: {
                                secretRef: [Object],
                                triggerParameter: [Object]
                              }
                            },
                            'x-ms-identifiers': [ 'triggerParameter' ]
                          }
                        }
                      },
                      custom: {
                        description: 'Custom scale rule.',
                        type: 'object',
                        properties: {
                          type: {
                            description: 'Type of the custom scale rule\n' +
                              'eg: azure-servicebus, redis etc.',
                            type: 'string'
                          },
                          metadata: {
                            description: 'Metadata properties to describe custom scale rule.',
                            type: 'object',
                            additionalProperties: { type: 'string' }
                          },
                          auth: {
                            description: 'Authentication secrets for the custom scale rule.',
                            type: 'array',
                            items: {
                              description: 'Auth Secrets for Container App Scale Rule',
                              type: 'object',
                              properties: {
                                secretRef: [Object],
                                triggerParameter: [Object]
                              }
                            },
                            'x-ms-identifiers': [ 'triggerParameter' ]
                          }
                        }
                      },
                      http: {
                        description: 'HTTP requests based scaling.',
                        type: 'object',
                        properties: {
                          metadata: {
                            description: 'Metadata properties to describe http scale rule.',
                            type: 'object',
                            additionalProperties: { type: 'string' }
                          },
                          auth: {
                            description: 'Authentication secrets for the custom scale rule.',
                            type: 'array',
                            items: {
                              description: 'Auth Secrets for Container App Scale Rule',
                              type: 'object',
                              properties: {
                                secretRef: [Object],
                                triggerParameter: [Object]
                              }
                            },
                            'x-ms-identifiers': [ 'triggerParameter' ]
                          }
                        }
                      }
                    }
                  },
                  'x-ms-identifiers': [ 'name' ]
                }
              }
            },
            volumes: {
              description: 'List of volume definitions for the Container App.',
              type: 'array',
              items: {
                description: 'Volume definitions for the Container App.',
                type: 'object',
                properties: {
                  name: { description: 'Volume name.', type: 'string' },
                  storageType: {
                    description: 'Storage type for the volume. If not provided, use EmptyDir.',
                    enum: [ 'AzureFile', 'EmptyDir' ],
                    type: 'string',
                    'x-ms-enum': { name: 'StorageType', modelAsString: true }
                  },
                  storageName: {
                    description: 'Name of storage resource. No need to provide for EmptyDir.',
                    type: 'string'
                  }
                }
              },
              'x-ms-identifiers': [ 'name' ]
            }
          }
        },
        outboundIPAddresses: {
          description: 'Outbound IP Addresses for container app.',
          type: 'array',
          items: { type: 'string' },
          readOnly: true
        }
      },
      'x-ms-client-flatten': true
    }
  }
}
```
## Misc
The resource version is `2022-03-01`.

The Swagger schema used to generate this documentation can be found [here](https://github.com/Azure/azure-rest-api-specs/tree/main/specification/app/resource-manager/Microsoft.App/stable/2022-03-01/ContainerApps.json).
