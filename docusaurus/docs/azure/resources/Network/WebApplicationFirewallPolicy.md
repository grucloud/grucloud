---
id: WebApplicationFirewallPolicy
title: WebApplicationFirewallPolicy
---
Provides a **WebApplicationFirewallPolicy** from the **Network** group
## Examples
### Creates or updates a WAF policy within a resource group
```js
exports.createResources = () => [
  {
    type: "WebApplicationFirewallPolicy",
    group: "Network",
    name: "myWebApplicationFirewallPolicy",
    properties: () => ({
      location: "WestUs",
      properties: {
        managedRules: {
          managedRuleSets: [{ ruleSetType: "OWASP", ruleSetVersion: "3.2" }],
          exclusions: [
            {
              matchVariable: "RequestArgNames",
              selectorMatchOperator: "StartsWith",
              selector: "hello",
              exclusionManagedRuleSets: [
                {
                  ruleSetType: "OWASP",
                  ruleSetVersion: "3.2",
                  ruleGroups: [
                    {
                      ruleGroupName: "REQUEST-930-APPLICATION-ATTACK-LFI",
                      rules: [{ ruleId: "930120" }],
                    },
                    { ruleGroupName: "REQUEST-932-APPLICATION-ATTACK-RCE" },
                  ],
                },
              ],
            },
            {
              matchVariable: "RequestArgNames",
              selectorMatchOperator: "EndsWith",
              selector: "hello",
              exclusionManagedRuleSets: [
                { ruleSetType: "OWASP", ruleSetVersion: "3.1", ruleGroups: [] },
              ],
            },
            {
              matchVariable: "RequestArgNames",
              selectorMatchOperator: "StartsWith",
              selector: "test",
            },
            {
              matchVariable: "RequestArgValues",
              selectorMatchOperator: "StartsWith",
              selector: "test",
            },
          ],
        },
        customRules: [
          {
            name: "Rule1",
            priority: 1,
            ruleType: "MatchRule",
            action: "Block",
            matchConditions: [
              {
                matchVariables: [
                  { variableName: "RemoteAddr", selector: null },
                ],
                operator: "IPMatch",
                matchValues: ["192.168.1.0/24", "10.0.0.0/24"],
              },
            ],
          },
          {
            name: "Rule2",
            priority: 2,
            ruleType: "MatchRule",
            matchConditions: [
              {
                matchVariables: [
                  { variableName: "RemoteAddr", selector: null },
                ],
                operator: "IPMatch",
                matchValues: ["192.168.1.0/24"],
              },
              {
                matchVariables: [
                  { variableName: "RequestHeaders", selector: "UserAgent" },
                ],
                operator: "Contains",
                matchValues: ["Windows"],
              },
            ],
            action: "Block",
          },
        ],
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
  description: 'Defines web application firewall policy.',
  properties: {
    properties: {
      'x-ms-client-flatten': true,
      description: 'Properties of the web application firewall policy.',
      required: [ 'managedRules' ],
      properties: {
        policySettings: {
          description: 'The PolicySettings for policy.',
          properties: {
            state: {
              description: 'The state of the policy.',
              type: 'string',
              enum: [ 'Disabled', 'Enabled' ],
              'x-ms-enum': {
                name: 'WebApplicationFirewallEnabledState',
                modelAsString: true
              }
            },
            mode: {
              description: 'The mode of the policy.',
              type: 'string',
              enum: [ 'Prevention', 'Detection' ],
              'x-ms-enum': {
                name: 'WebApplicationFirewallMode',
                modelAsString: true
              }
            },
            requestBodyCheck: {
              type: 'boolean',
              description: 'Whether to allow WAF to check request Body.'
            },
            maxRequestBodySizeInKb: {
              type: 'integer',
              format: 'int32',
              minimum: 8,
              exclusiveMinimum: false,
              description: 'Maximum request body size in Kb for WAF.'
            },
            fileUploadLimitInMb: {
              type: 'integer',
              format: 'int32',
              minimum: 0,
              exclusiveMinimum: false,
              description: 'Maximum file upload size in Mb for WAF.'
            }
          }
        },
        customRules: {
          description: 'The custom rules inside the policy.',
          type: 'array',
          items: {
            description: 'Defines contents of a web application rule.',
            required: [ 'priority', 'ruleType', 'matchConditions', 'action' ],
            properties: {
              name: {
                type: 'string',
                description: 'The name of the resource that is unique within a policy. This name can be used to access the resource.',
                maxLength: 128
              },
              etag: {
                type: 'string',
                readOnly: true,
                description: 'A unique read-only string that changes whenever the resource is updated.'
              },
              priority: {
                description: 'Priority of the rule. Rules with a lower value will be evaluated before rules with a higher value.',
                type: 'integer'
              },
              ruleType: {
                description: 'The rule type.',
                type: 'string',
                enum: [ 'MatchRule', 'Invalid' ],
                'x-ms-enum': {
                  name: 'WebApplicationFirewallRuleType',
                  modelAsString: true
                }
              },
              matchConditions: {
                description: 'List of match conditions.',
                type: 'array',
                items: {
                  description: 'Define match conditions.',
                  required: [ 'matchVariables', 'operator', 'matchValues' ],
                  properties: {
                    matchVariables: {
                      description: 'List of match variables.',
                      type: 'array',
                      items: {
                        description: 'Define match variables.',
                        required: [ 'variableName' ],
                        properties: {
                          variableName: {
                            description: 'Match Variable.',
                            type: 'string',
                            enum: [
                              'RemoteAddr',
                              'RequestMethod',
                              'QueryString',
                              'PostArgs',
                              'RequestUri',
                              'RequestHeaders',
                              'RequestBody',
                              'RequestCookies'
                            ],
                            'x-ms-enum': {
                              name: 'WebApplicationFirewallMatchVariable',
                              modelAsString: true
                            }
                          },
                          selector: {
                            description: 'The selector of match variable.',
                            type: 'string'
                          }
                        }
                      }
                    },
                    operator: {
                      description: 'The operator to be matched.',
                      type: 'string',
                      enum: [
                        'IPMatch',
                        'Equal',
                        'Contains',
                        'LessThan',
                        'GreaterThan',
                        'LessThanOrEqual',
                        'GreaterThanOrEqual',
                        'BeginsWith',
                        'EndsWith',
                        'Regex',
                        'GeoMatch'
                      ],
                      'x-ms-enum': {
                        name: 'WebApplicationFirewallOperator',
                        modelAsString: true
                      }
                    },
                    negationConditon: {
                      description: 'Whether this is negate condition or not.',
                      type: 'boolean'
                    },
                    matchValues: {
                      description: 'Match value.',
                      type: 'array',
                      items: { type: 'string' }
                    },
                    transforms: {
                      description: 'List of transforms.',
                      type: 'array',
                      items: {
                        description: 'Transforms applied before matching.',
                        type: 'string',
                        enum: [
                          'Lowercase',
                          'Trim',
                          'UrlDecode',
                          'UrlEncode',
                          'RemoveNulls',
                          'HtmlEntityDecode'
                        ],
                        'x-ms-enum': {
                          name: 'WebApplicationFirewallTransform',
                          modelAsString: true
                        }
                      }
                    }
                  }
                }
              },
              action: {
                description: 'Type of Actions.',
                type: 'string',
                enum: [ 'Allow', 'Block', 'Log' ],
                'x-ms-enum': {
                  name: 'WebApplicationFirewallAction',
                  modelAsString: true
                }
              }
            }
          }
        },
        applicationGateways: {
          readOnly: true,
          type: 'array',
          items: {
            properties: {
              properties: {
                'x-ms-client-flatten': true,
                description: 'Properties of the application gateway.',
                properties: {
                  sku: {
                    description: 'SKU of the application gateway resource.',
                    properties: {
                      name: {
                        type: 'string',
                        description: 'Name of an application gateway SKU.',
                        enum: [
                          'Standard_Small',
                          'Standard_Medium',
                          'Standard_Large',
                          'WAF_Medium',
                          'WAF_Large',
                          'Standard_v2',
                          'WAF_v2'
                        ],
                        'x-ms-enum': {
                          name: 'ApplicationGatewaySkuName',
                          modelAsString: true
                        }
                      },
                      tier: {
                        type: 'string',
                        description: 'Tier of an application gateway.',
                        enum: [ 'Standard', 'WAF', 'Standard_v2', 'WAF_v2' ],
                        'x-ms-enum': {
                          name: 'ApplicationGatewayTier',
                          modelAsString: true
                        }
                      },
                      capacity: {
                        type: 'integer',
                        format: 'int32',
                        description: 'Capacity (instance count) of an application gateway.'
                      }
                    }
                  },
                  sslPolicy: {
                    description: 'SSL policy of the application gateway resource.',
                    properties: {
                      disabledSslProtocols: {
                        type: 'array',
                        description: 'Ssl protocols to be disabled on application gateway.',
                        items: {
                          type: 'string',
                          description: 'Ssl protocol enums.',
                          enum: [ 'TLSv1_0', 'TLSv1_1', 'TLSv1_2' ],
                          'x-ms-enum': {
                            name: 'ApplicationGatewaySslProtocol',
                            modelAsString: true
                          }
                        }
                      },
                      policyType: {
                        type: 'string',
                        description: 'Type of Ssl Policy.',
                        enum: [ 'Predefined', 'Custom' ],
                        'x-ms-enum': {
                          name: 'ApplicationGatewaySslPolicyType',
                          modelAsString: true
                        }
                      },
                      policyName: {
                        description: 'Name of Ssl predefined policy.',
                        type: 'string',
                        enum: [
                          'AppGwSslPolicy20150501',
                          'AppGwSslPolicy20170401',
                          'AppGwSslPolicy20170401S'
                        ],
                        'x-ms-enum': {
                          name: 'ApplicationGatewaySslPolicyName',
                          modelAsString: true
                        }
                      },
                      cipherSuites: {
                        type: 'array',
                        items: {
                          type: 'string',
                          description: 'Ssl cipher suites enums.',
                          enum: [
                            'TLS_ECDHE_RSA_WITH_AES_256_CBC_SHA384',
                            'TLS_ECDHE_RSA_WITH_AES_128_CBC_SHA256',
                            'TLS_ECDHE_RSA_WITH_AES_256_CBC_SHA',
                            'TLS_ECDHE_RSA_WITH_AES_128_CBC_SHA',
                            'TLS_DHE_RSA_WITH_AES_256_GCM_SHA384',
                            'TLS_DHE_RSA_WITH_AES_128_GCM_SHA256',
                            'TLS_DHE_RSA_WITH_AES_256_CBC_SHA',
                            'TLS_DHE_RSA_WITH_AES_128_CBC_SHA',
                            'TLS_RSA_WITH_AES_256_GCM_SHA384',
                            'TLS_RSA_WITH_AES_128_GCM_SHA256',
                            'TLS_RSA_WITH_AES_256_CBC_SHA256',
                            'TLS_RSA_WITH_AES_128_CBC_SHA256',
                            'TLS_RSA_WITH_AES_256_CBC_SHA',
                            'TLS_RSA_WITH_AES_128_CBC_SHA',
                            'TLS_ECDHE_ECDSA_WITH_AES_256_GCM_SHA384',
                            'TLS_ECDHE_ECDSA_WITH_AES_128_GCM_SHA256',
                            'TLS_ECDHE_ECDSA_WITH_AES_256_CBC_SHA384',
                            'TLS_ECDHE_ECDSA_WITH_AES_128_CBC_SHA256',
                            'TLS_ECDHE_ECDSA_WITH_AES_256_CBC_SHA',
                            'TLS_ECDHE_ECDSA_WITH_AES_128_CBC_SHA',
                            'TLS_DHE_DSS_WITH_AES_256_CBC_SHA256',
                            'TLS_DHE_DSS_WITH_AES_128_CBC_SHA256',
                            'TLS_DHE_DSS_WITH_AES_256_CBC_SHA',
                            'TLS_DHE_DSS_WITH_AES_128_CBC_SHA',
                            'TLS_RSA_WITH_3DES_EDE_CBC_SHA',
                            'TLS_DHE_DSS_WITH_3DES_EDE_CBC_SHA',
                            'TLS_ECDHE_RSA_WITH_AES_128_GCM_SHA256',
                            'TLS_ECDHE_RSA_WITH_AES_256_GCM_SHA384'
                          ],
                          'x-ms-enum': {
                            name: 'ApplicationGatewaySslCipherSuite',
                            modelAsString: true
                          }
                        },
                        description: 'Ssl cipher suites to be enabled in the specified order to application gateway.'
                      },
                      minProtocolVersion: {
                        description: 'Minimum version of Ssl protocol to be supported on application gateway.',
                        type: 'string',
                        enum: [ 'TLSv1_0', 'TLSv1_1', 'TLSv1_2' ],
                        'x-ms-enum': {
                          name: 'ApplicationGatewaySslProtocol',
                          modelAsString: true
                        }
                      }
                    }
                  },
                  operationalState: {
                    readOnly: true,
                    type: 'string',
                    description: 'Operational state of the application gateway resource.',
                    enum: [ 'Stopped', 'Starting', 'Running', 'Stopping' ],
                    'x-ms-enum': {
                      name: 'ApplicationGatewayOperationalState',
                      modelAsString: true
                    }
                  },
                  gatewayIPConfigurations: {
                    type: 'array',
                    items: {
                      properties: {
                        properties: {
                          'x-ms-client-flatten': true,
                          description: 'Properties of the application gateway IP configuration.',
                          properties: {
                            subnet: {
                              description: 'Reference to the subnet resource. A subnet from where application gateway gets its private address.',
                              properties: { id: [Object] },
                              'x-ms-azure-resource': true
                            },
                            provisioningState: {
                              readOnly: true,
                              description: 'The provisioning state of the application gateway IP configuration resource.',
                              type: 'string',
                              enum: [
                                'Succeeded',
                                'Updating',
                                'Deleting',
                                'Failed'
                              ],
                              'x-ms-enum': {
                                name: 'ProvisioningState',
                                modelAsString: true
                              }
                            }
                          }
                        },
                        name: {
                          type: 'string',
                          description: 'Name of the IP configuration that is unique within an Application Gateway.'
                        },
                        etag: {
                          readOnly: true,
                          type: 'string',
                          description: 'A unique read-only string that changes whenever the resource is updated.'
                        },
                        type: {
                          readOnly: true,
                          type: 'string',
                          description: 'Type of the resource.'
                        }
                      },
                      allOf: [
                        {
                          properties: {
                            id: {
                              type: 'string',
                              description: 'Resource ID.'
                            }
                          },
                          description: 'Reference to another subresource.',
                          'x-ms-azure-resource': true
                        }
                      ],
                      description: 'IP configuration of an application gateway. Currently 1 public and 1 private IP configuration is allowed.'
                    },
                    description: 'Subnets of the application gateway resource. For default limits, see [Application Gateway limits](https://docs.microsoft.com/azure/azure-subscription-service-limits#application-gateway-limits).'
                  },
                  authenticationCertificates: {
                    type: 'array',
                    items: {
                      properties: {
                        properties: {
                          'x-ms-client-flatten': true,
                          description: 'Properties of the application gateway authentication certificate.',
                          properties: {
                            data: {
                              type: 'string',
                              description: 'Certificate public data.'
                            },
                            provisioningState: {
                              readOnly: true,
                              description: 'The provisioning state of the authentication certificate resource.',
                              type: 'string',
                              enum: [
                                'Succeeded',
                                'Updating',
                                'Deleting',
                                'Failed'
                              ],
                              'x-ms-enum': {
                                name: 'ProvisioningState',
                                modelAsString: true
                              }
                            }
                          }
                        },
                        name: {
                          type: 'string',
                          description: 'Name of the authentication certificate that is unique within an Application Gateway.'
                        },
                        etag: {
                          readOnly: true,
                          type: 'string',
                          description: 'A unique read-only string that changes whenever the resource is updated.'
                        },
                        type: {
                          readOnly: true,
                          type: 'string',
                          description: 'Type of the resource.'
                        }
                      },
                      allOf: [
                        {
                          properties: {
                            id: {
                              type: 'string',
                              description: 'Resource ID.'
                            }
                          },
                          description: 'Reference to another subresource.',
                          'x-ms-azure-resource': true
                        }
                      ],
                      description: 'Authentication certificates of an application gateway.'
                    },
                    description: 'Authentication certificates of the application gateway resource. For default limits, see [Application Gateway limits](https://docs.microsoft.com/azure/azure-subscription-service-limits#application-gateway-limits).'
                  },
                  trustedRootCertificates: {
                    type: 'array',
                    items: {
                      properties: {
                        properties: {
                          'x-ms-client-flatten': true,
                          description: 'Properties of the application gateway trusted root certificate.',
                          properties: {
                            data: {
                              type: 'string',
                              description: 'Certificate public data.'
                            },
                            keyVaultSecretId: {
                              type: 'string',
                              description: "Secret Id of (base-64 encoded unencrypted pfx) 'Secret' or 'Certificate' object stored in KeyVault."
                            },
                            provisioningState: {
                              readOnly: true,
                              description: 'The provisioning state of the trusted root certificate resource.',
                              type: 'string',
                              enum: [
                                'Succeeded',
                                'Updating',
                                'Deleting',
                                'Failed'
                              ],
                              'x-ms-enum': {
                                name: 'ProvisioningState',
                                modelAsString: true
                              }
                            }
                          }
                        },
                        name: {
                          type: 'string',
                          description: 'Name of the trusted root certificate that is unique within an Application Gateway.'
                        },
                        etag: {
                          readOnly: true,
                          type: 'string',
                          description: 'A unique read-only string that changes whenever the resource is updated.'
                        },
                        type: {
                          readOnly: true,
                          type: 'string',
                          description: 'Type of the resource.'
                        }
                      },
                      allOf: [
                        {
                          properties: {
                            id: {
                              type: 'string',
                              description: 'Resource ID.'
                            }
                          },
                          description: 'Reference to another subresource.',
                          'x-ms-azure-resource': true
                        }
                      ],
                      description: 'Trusted Root certificates of an application gateway.'
                    },
                    description: 'Trusted Root certificates of the application gateway resource. For default limits, see [Application Gateway limits](https://docs.microsoft.com/azure/azure-subscription-service-limits#application-gateway-limits).'
                  },
                  trustedClientCertificates: {
                    type: 'array',
                    items: {
                      properties: {
                        properties: {
                          'x-ms-client-flatten': true,
                          description: 'Properties of the application gateway trusted client certificate.',
                          properties: {
                            data: {
                              type: 'string',
                              description: 'Certificate public data.'
                            },
                            validatedCertData: {
                              readOnly: true,
                              type: 'string',
                              description: 'Validated certificate data.'
                            },
                            clientCertIssuerDN: {
                              readOnly: true,
                              type: 'string',
                              description: 'Distinguished name of client certificate issuer.'
                            },
                            provisioningState: {
                              readOnly: true,
                              description: 'The provisioning state of the trusted client certificate resource.',
                              type: 'string',
                              enum: [
                                'Succeeded',
                                'Updating',
                                'Deleting',
                                'Failed'
                              ],
                              'x-ms-enum': {
                                name: 'ProvisioningState',
                                modelAsString: true
                              }
                            }
                          }
                        },
                        name: {
                          type: 'string',
                          description: 'Name of the trusted client certificate that is unique within an Application Gateway.'
                        },
                        etag: {
                          readOnly: true,
                          type: 'string',
                          description: 'A unique read-only string that changes whenever the resource is updated.'
                        },
                        type: {
                          readOnly: true,
                          type: 'string',
                          description: 'Type of the resource.'
                        }
                      },
                      allOf: [
                        {
                          properties: {
                            id: {
                              type: 'string',
                              description: 'Resource ID.'
                            }
                          },
                          description: 'Reference to another subresource.',
                          'x-ms-azure-resource': true
                        }
                      ],
                      description: 'Trusted client certificates of an application gateway.'
                    },
                    description: 'Trusted client certificates of the application gateway resource. For default limits, see [Application Gateway limits](https://docs.microsoft.com/azure/azure-subscription-service-limits#application-gateway-limits).'
                  },
                  sslCertificates: {
                    type: 'array',
                    items: {
                      properties: {
                        properties: {
                          'x-ms-client-flatten': true,
                          description: 'Properties of the application gateway SSL certificate.',
                          properties: {
                            data: {
                              type: 'string',
                              description: 'Base-64 encoded pfx certificate. Only applicable in PUT Request.'
                            },
                            password: {
                              type: 'string',
                              description: 'Password for the pfx file specified in data. Only applicable in PUT request.'
                            },
                            publicCertData: {
                              readOnly: true,
                              type: 'string',
                              description: 'Base-64 encoded Public cert data corresponding to pfx specified in data. Only applicable in GET request.'
                            },
                            keyVaultSecretId: {
                              type: 'string',
                              description: "Secret Id of (base-64 encoded unencrypted pfx) 'Secret' or 'Certificate' object stored in KeyVault."
                            },
                            provisioningState: {
                              readOnly: true,
                              description: 'The provisioning state of the SSL certificate resource.',
                              type: 'string',
                              enum: [
                                'Succeeded',
                                'Updating',
                                'Deleting',
                                'Failed'
                              ],
                              'x-ms-enum': {
                                name: 'ProvisioningState',
                                modelAsString: true
                              }
                            }
                          }
                        },
                        name: {
                          type: 'string',
                          description: 'Name of the SSL certificate that is unique within an Application Gateway.'
                        },
                        etag: {
                          readOnly: true,
                          type: 'string',
                          description: 'A unique read-only string that changes whenever the resource is updated.'
                        },
                        type: {
                          readOnly: true,
                          type: 'string',
                          description: 'Type of the resource.'
                        }
                      },
                      allOf: [
                        {
                          properties: {
                            id: {
                              type: 'string',
                              description: 'Resource ID.'
                            }
                          },
                          description: 'Reference to another subresource.',
                          'x-ms-azure-resource': true
                        }
                      ],
                      description: 'SSL certificates of an application gateway.'
                    },
                    description: 'SSL certificates of the application gateway resource. For default limits, see [Application Gateway limits](https://docs.microsoft.com/azure/azure-subscription-service-limits#application-gateway-limits).'
                  },
                  frontendIPConfigurations: {
                    type: 'array',
                    items: {
                      properties: {
                        properties: {
                          'x-ms-client-flatten': true,
                          description: 'Properties of the application gateway frontend IP configuration.',
                          properties: {
                            privateIPAddress: {
                              type: 'string',
                              description: 'PrivateIPAddress of the network interface IP Configuration.'
                            },
                            privateIPAllocationMethod: {
                              description: 'The private IP address allocation method.',
                              type: 'string',
                              enum: [ 'Static', 'Dynamic' ],
                              'x-ms-enum': {
                                name: 'IPAllocationMethod',
                                modelAsString: true
                              }
                            },
                            subnet: {
                              properties: { id: [Object] },
                              description: 'Reference to another subresource.',
                              'x-ms-azure-resource': true
                            },
                            publicIPAddress: {
                              properties: { id: [Object] },
                              description: 'Reference to another subresource.',
                              'x-ms-azure-resource': true
                            },
                            privateLinkConfiguration: {
                              properties: { id: [Object] },
                              description: 'Reference to another subresource.',
                              'x-ms-azure-resource': true
                            },
                            provisioningState: {
                              readOnly: true,
                              description: 'The provisioning state of the frontend IP configuration resource.',
                              type: 'string',
                              enum: [
                                'Succeeded',
                                'Updating',
                                'Deleting',
                                'Failed'
                              ],
                              'x-ms-enum': {
                                name: 'ProvisioningState',
                                modelAsString: true
                              }
                            }
                          }
                        },
                        name: {
                          type: 'string',
                          description: 'Name of the frontend IP configuration that is unique within an Application Gateway.'
                        },
                        etag: {
                          readOnly: true,
                          type: 'string',
                          description: 'A unique read-only string that changes whenever the resource is updated.'
                        },
                        type: {
                          readOnly: true,
                          type: 'string',
                          description: 'Type of the resource.'
                        }
                      },
                      allOf: [
                        {
                          properties: {
                            id: {
                              type: 'string',
                              description: 'Resource ID.'
                            }
                          },
                          description: 'Reference to another subresource.',
                          'x-ms-azure-resource': true
                        }
                      ],
                      description: 'Frontend IP configuration of an application gateway.'
                    },
                    description: 'Frontend IP addresses of the application gateway resource. For default limits, see [Application Gateway limits](https://docs.microsoft.com/azure/azure-subscription-service-limits#application-gateway-limits).'
                  },
                  frontendPorts: {
                    type: 'array',
                    items: {
                      properties: {
                        properties: {
                          'x-ms-client-flatten': true,
                          description: 'Properties of the application gateway frontend port.',
                          properties: {
                            port: {
                              type: 'integer',
                              format: 'int32',
                              description: 'Frontend port.'
                            },
                            provisioningState: {
                              readOnly: true,
                              description: 'The provisioning state of the frontend port resource.',
                              type: 'string',
                              enum: [
                                'Succeeded',
                                'Updating',
                                'Deleting',
                                'Failed'
                              ],
                              'x-ms-enum': {
                                name: 'ProvisioningState',
                                modelAsString: true
                              }
                            }
                          }
                        },
                        name: {
                          type: 'string',
                          description: 'Name of the frontend port that is unique within an Application Gateway.'
                        },
                        etag: {
                          readOnly: true,
                          type: 'string',
                          description: 'A unique read-only string that changes whenever the resource is updated.'
                        },
                        type: {
                          readOnly: true,
                          type: 'string',
                          description: 'Type of the resource.'
                        }
                      },
                      allOf: [
                        {
                          properties: {
                            id: {
                              type: 'string',
                              description: 'Resource ID.'
                            }
                          },
                          description: 'Reference to another subresource.',
                          'x-ms-azure-resource': true
                        }
                      ],
                      description: 'Frontend port of an application gateway.'
                    },
                    description: 'Frontend ports of the application gateway resource. For default limits, see [Application Gateway limits](https://docs.microsoft.com/azure/azure-subscription-service-limits#application-gateway-limits).'
                  },
                  probes: {
                    type: 'array',
                    items: {
                      properties: {
                        properties: {
                          'x-ms-client-flatten': true,
                          description: 'Properties of the application gateway probe.',
                          properties: {
                            protocol: {
                              description: 'The protocol used for the probe.',
                              type: 'string',
                              enum: [ 'Http', 'Https', 'Tcp', 'Tls' ],
                              'x-ms-enum': {
                                name: 'ApplicationGatewayProtocol',
                                modelAsString: true
                              }
                            },
                            host: {
                              type: 'string',
                              description: 'Host name to send the probe to.'
                            },
                            path: {
                              type: 'string',
                              description: "Relative path of probe. Valid path starts from '/'. Probe is sent to <Protocol>://<host>:<port><path>."
                            },
                            interval: {
                              type: 'integer',
                              format: 'int32',
                              description: 'The probing interval in seconds. This is the time interval between two consecutive probes. Acceptable values are from 1 second to 86400 seconds.'
                            },
                            timeout: {
                              type: 'integer',
                              format: 'int32',
                              description: 'The probe timeout in seconds. Probe marked as failed if valid response is not received with this timeout period. Acceptable values are from 1 second to 86400 seconds.'
                            },
                            unhealthyThreshold: {
                              type: 'integer',
                              format: 'int32',
                              description: 'The probe retry count. Backend server is marked down after consecutive probe failure count reaches UnhealthyThreshold. Acceptable values are from 1 second to 20.'
                            },
                            pickHostNameFromBackendHttpSettings: {
                              type: 'boolean',
                              description: 'Whether the host header should be picked from the backend http settings. Default value is false.'
                            },
                            pickHostNameFromBackendSettings: {
                              type: 'boolean',
                              description: 'Whether the server name indication should be picked from the backend settings for Tls protocol. Default value is false.'
                            },
                            minServers: {
                              type: 'integer',
                              format: 'int32',
                              description: 'Minimum number of servers that are always marked healthy. Default value is 0.'
                            },
                            match: {
                              description: 'Criterion for classifying a healthy probe response.',
                              properties: { body: [Object], statusCodes: [Object] }
                            },
                            provisioningState: {
                              readOnly: true,
                              description: 'The provisioning state of the probe resource.',
                              type: 'string',
                              enum: [
                                'Succeeded',
                                'Updating',
                                'Deleting',
                                'Failed'
                              ],
                              'x-ms-enum': {
                                name: 'ProvisioningState',
                                modelAsString: true
                              }
                            },
                            port: {
                              type: 'integer',
                              format: 'int32',
                              description: 'Custom port which will be used for probing the backend servers. The valid value ranges from 1 to 65535. In case not set, port from http settings will be used. This property is valid for Standard_v2 and WAF_v2 only.',
                              minimum: 1,
                              maximum: 65535
                            }
                          }
                        },
                        name: {
                          type: 'string',
                          description: 'Name of the probe that is unique within an Application Gateway.'
                        },
                        etag: {
                          readOnly: true,
                          type: 'string',
                          description: 'A unique read-only string that changes whenever the resource is updated.'
                        },
                        type: {
                          readOnly: true,
                          type: 'string',
                          description: 'Type of the resource.'
                        }
                      },
                      allOf: [
                        {
                          properties: {
                            id: {
                              type: 'string',
                              description: 'Resource ID.'
                            }
                          },
                          description: 'Reference to another subresource.',
                          'x-ms-azure-resource': true
                        }
                      ],
                      description: 'Probe of the application gateway.'
                    },
                    description: 'Probes of the application gateway resource.'
                  },
                  backendAddressPools: {
                    type: 'array',
                    items: {
                      properties: {
                        properties: {
                          'x-ms-client-flatten': true,
                          description: 'Properties of the application gateway backend address pool.',
                          properties: {
                            backendIPConfigurations: {
                              readOnly: true,
                              type: 'array',
                              items: {
                                properties: [Object],
                                allOf: [Array],
                                description: 'IPConfiguration in a network interface.'
                              },
                              description: 'Collection of references to IPs defined in network interfaces.'
                            },
                            backendAddresses: {
                              type: 'array',
                              items: {
                                properties: [Object],
                                description: 'Backend address of an application gateway.'
                              },
                              description: 'Backend addresses.'
                            },
                            provisioningState: {
                              readOnly: true,
                              description: 'The provisioning state of the backend address pool resource.',
                              type: 'string',
                              enum: [
                                'Succeeded',
                                'Updating',
                                'Deleting',
                                'Failed'
                              ],
                              'x-ms-enum': {
                                name: 'ProvisioningState',
                                modelAsString: true
                              }
                            }
                          }
                        },
                        name: {
                          type: 'string',
                          description: 'Name of the backend address pool that is unique within an Application Gateway.'
                        },
                        etag: {
                          readOnly: true,
                          type: 'string',
                          description: 'A unique read-only string that changes whenever the resource is updated.'
                        },
                        type: {
                          readOnly: true,
                          type: 'string',
                          description: 'Type of the resource.'
                        }
                      },
                      allOf: [
                        {
                          properties: {
                            id: {
                              type: 'string',
                              description: 'Resource ID.'
                            }
                          },
                          description: 'Reference to another subresource.',
                          'x-ms-azure-resource': true
                        }
                      ],
                      description: 'Backend Address Pool of an application gateway.'
                    },
                    description: 'Backend address pool of the application gateway resource. For default limits, see [Application Gateway limits](https://docs.microsoft.com/azure/azure-subscription-service-limits#application-gateway-limits).'
                  },
                  backendHttpSettingsCollection: {
                    type: 'array',
                    items: {
                      properties: {
                        properties: {
                          'x-ms-client-flatten': true,
                          description: 'Properties of the application gateway backend HTTP settings.',
                          properties: {
                            port: {
                              type: 'integer',
                              format: 'int32',
                              description: 'The destination port on the backend.'
                            },
                            protocol: {
                              description: 'The protocol used to communicate with the backend.',
                              type: 'string',
                              enum: [ 'Http', 'Https', 'Tcp', 'Tls' ],
                              'x-ms-enum': {
                                name: 'ApplicationGatewayProtocol',
                                modelAsString: true
                              }
                            },
                            cookieBasedAffinity: {
                              type: 'string',
                              description: 'Cookie based affinity.',
                              enum: [ 'Enabled', 'Disabled' ],
                              'x-ms-enum': {
                                name: 'ApplicationGatewayCookieBasedAffinity',
                                modelAsString: true
                              }
                            },
                            requestTimeout: {
                              type: 'integer',
                              format: 'int32',
                              description: 'Request timeout in seconds. Application Gateway will fail the request if response is not received within RequestTimeout. Acceptable values are from 1 second to 86400 seconds.'
                            },
                            probe: {
                              properties: { id: [Object] },
                              description: 'Reference to another subresource.',
                              'x-ms-azure-resource': true
                            },
                            authenticationCertificates: {
                              type: 'array',
                              items: {
                                properties: [Object],
                                description: 'Reference to another subresource.',
                                'x-ms-azure-resource': true
                              },
                              description: 'Array of references to application gateway authentication certificates.'
                            },
                            trustedRootCertificates: {
                              type: 'array',
                              items: {
                                properties: [Object],
                                description: 'Reference to another subresource.',
                                'x-ms-azure-resource': true
                              },
                              description: 'Array of references to application gateway trusted root certificates.'
                            },
                            connectionDraining: {
                              description: 'Connection draining of the backend http settings resource.',
                              properties: {
                                enabled: [Object],
                                drainTimeoutInSec: [Object]
                              },
                              required: [ 'enabled', 'drainTimeoutInSec' ]
                            },
                            hostName: {
                              type: 'string',
                              description: 'Host header to be sent to the backend servers.'
                            },
                            pickHostNameFromBackendAddress: {
                              type: 'boolean',
                              description: 'Whether to pick host header should be picked from the host name of the backend server. Default value is false.'
                            },
                            affinityCookieName: {
                              type: 'string',
                              description: 'Cookie name to use for the affinity cookie.'
                            },
                            probeEnabled: {
                              type: 'boolean',
                              description: 'Whether the probe is enabled. Default value is false.'
                            },
                            path: {
                              type: 'string',
                              description: 'Path which should be used as a prefix for all HTTP requests. Null means no path will be prefixed. Default value is null.'
                            },
                            provisioningState: {
                              readOnly: true,
                              description: 'The provisioning state of the backend HTTP settings resource.',
                              type: 'string',
                              enum: [
                                'Succeeded',
                                'Updating',
                                'Deleting',
                                'Failed'
                              ],
                              'x-ms-enum': {
                                name: 'ProvisioningState',
                                modelAsString: true
                              }
                            }
                          }
                        },
                        name: {
                          type: 'string',
                          description: 'Name of the backend http settings that is unique within an Application Gateway.'
                        },
                        etag: {
                          readOnly: true,
                          type: 'string',
                          description: 'A unique read-only string that changes whenever the resource is updated.'
                        },
                        type: {
                          readOnly: true,
                          type: 'string',
                          description: 'Type of the resource.'
                        }
                      },
                      allOf: [
                        {
                          properties: {
                            id: {
                              type: 'string',
                              description: 'Resource ID.'
                            }
                          },
                          description: 'Reference to another subresource.',
                          'x-ms-azure-resource': true
                        }
                      ],
                      description: 'Backend address pool settings of an application gateway.'
                    },
                    description: 'Backend http settings of the application gateway resource. For default limits, see [Application Gateway limits](https://docs.microsoft.com/azure/azure-subscription-service-limits#application-gateway-limits).'
                  },
                  backendSettingsCollection: {
                    type: 'array',
                    items: {
                      type: 'object',
                      properties: {
                        properties: {
                          'x-ms-client-flatten': true,
                          description: 'Properties of the application gateway backend settings.',
                          type: 'object',
                          properties: {
                            port: {
                              type: 'integer',
                              format: 'int32',
                              description: 'The destination port on the backend.'
                            },
                            protocol: {
                              description: 'The protocol used to communicate with the backend.',
                              type: 'string',
                              enum: [ 'Http', 'Https', 'Tcp', 'Tls' ],
                              'x-ms-enum': {
                                name: 'ApplicationGatewayProtocol',
                                modelAsString: true
                              }
                            },
                            timeout: {
                              type: 'integer',
                              format: 'int32',
                              description: 'Connection timeout in seconds. Application Gateway will fail the request if response is not received within ConnectionTimeout. Acceptable values are from 1 second to 86400 seconds.'
                            },
                            probe: {
                              properties: { id: [Object] },
                              description: 'Reference to another subresource.',
                              'x-ms-azure-resource': true
                            },
                            trustedRootCertificates: {
                              type: 'array',
                              items: {
                                properties: [Object],
                                description: 'Reference to another subresource.',
                                'x-ms-azure-resource': true
                              },
                              description: 'Array of references to application gateway trusted root certificates.'
                            },
                            hostName: {
                              type: 'string',
                              description: 'Server name indication to be sent to the backend servers for Tls protocol.'
                            },
                            pickHostNameFromBackendAddress: {
                              type: 'boolean',
                              description: 'Whether to pick server name indication from the host name of the backend server for Tls protocol. Default value is false.'
                            },
                            provisioningState: {
                              readOnly: true,
                              description: 'The provisioning state of the backend HTTP settings resource.',
                              type: 'string',
                              enum: [
                                'Succeeded',
                                'Updating',
                                'Deleting',
                                'Failed'
                              ],
                              'x-ms-enum': {
                                name: 'ProvisioningState',
                                modelAsString: true
                              }
                            }
                          }
                        },
                        name: {
                          type: 'string',
                          description: 'Name of the backend settings that is unique within an Application Gateway.'
                        },
                        etag: {
                          readOnly: true,
                          type: 'string',
                          description: 'A unique read-only string that changes whenever the resource is updated.'
                        },
                        type: {
                          readOnly: true,
                          type: 'string',
                          description: 'Type of the resource.'
                        }
                      },
                      allOf: [
                        {
                          properties: {
                            id: {
                              type: 'string',
                              description: 'Resource ID.'
                            }
                          },
                          description: 'Reference to another subresource.',
                          'x-ms-azure-resource': true
                        }
                      ],
                      description: 'Backend address pool settings of an application gateway.'
                    },
                    description: 'Backend settings of the application gateway resource. For default limits, see [Application Gateway limits](https://docs.microsoft.com/azure/azure-subscription-service-limits#application-gateway-limits).'
                  },
                  httpListeners: {
                    type: 'array',
                    items: {
                      properties: {
                        properties: {
                          'x-ms-client-flatten': true,
                          description: 'Properties of the application gateway HTTP listener.',
                          properties: {
                            frontendIPConfiguration: {
                              properties: { id: [Object] },
                              description: 'Reference to another subresource.',
                              'x-ms-azure-resource': true
                            },
                            frontendPort: {
                              properties: { id: [Object] },
                              description: 'Reference to another subresource.',
                              'x-ms-azure-resource': true
                            },
                            protocol: {
                              description: 'Protocol of the HTTP listener.',
                              type: 'string',
                              enum: [ 'Http', 'Https', 'Tcp', 'Tls' ],
                              'x-ms-enum': {
                                name: 'ApplicationGatewayProtocol',
                                modelAsString: true
                              }
                            },
                            hostName: {
                              type: 'string',
                              description: 'Host name of HTTP listener.'
                            },
                            sslCertificate: {
                              properties: { id: [Object] },
                              description: 'Reference to another subresource.',
                              'x-ms-azure-resource': true
                            },
                            sslProfile: {
                              properties: { id: [Object] },
                              description: 'Reference to another subresource.',
                              'x-ms-azure-resource': true
                            },
                            requireServerNameIndication: {
                              type: 'boolean',
                              description: 'Applicable only if protocol is https. Enables SNI for multi-hosting.'
                            },
                            provisioningState: {
                              readOnly: true,
                              description: 'The provisioning state of the HTTP listener resource.',
                              type: 'string',
                              enum: [
                                'Succeeded',
                                'Updating',
                                'Deleting',
                                'Failed'
                              ],
                              'x-ms-enum': {
                                name: 'ProvisioningState',
                                modelAsString: true
                              }
                            },
                            customErrorConfigurations: {
                              type: 'array',
                              items: {
                                properties: [Object],
                                description: 'Customer error of an application gateway.'
                              },
                              description: 'Custom error configurations of the HTTP listener.'
                            },
                            firewallPolicy: {
                              properties: { id: [Object] },
                              description: 'Reference to another subresource.',
                              'x-ms-azure-resource': true
                            },
                            hostNames: {
                              type: 'array',
                              items: { type: 'string' },
                              description: 'List of Host names for HTTP Listener that allows special wildcard characters as well.'
                            }
                          }
                        },
                        name: {
                          type: 'string',
                          description: 'Name of the HTTP listener that is unique within an Application Gateway.'
                        },
                        etag: {
                          readOnly: true,
                          type: 'string',
                          description: 'A unique read-only string that changes whenever the resource is updated.'
                        },
                        type: {
                          readOnly: true,
                          type: 'string',
                          description: 'Type of the resource.'
                        }
                      },
                      allOf: [
                        {
                          properties: {
                            id: {
                              type: 'string',
                              description: 'Resource ID.'
                            }
                          },
                          description: 'Reference to another subresource.',
                          'x-ms-azure-resource': true
                        }
                      ],
                      description: 'Http listener of an application gateway.'
                    },
                    description: 'Http listeners of the application gateway resource. For default limits, see [Application Gateway limits](https://docs.microsoft.com/azure/azure-subscription-service-limits#application-gateway-limits).'
                  },
                  listeners: {
                    type: 'array',
                    items: {
                      type: 'object',
                      properties: {
                        properties: {
                          'x-ms-client-flatten': true,
                          description: 'Properties of the application gateway listener.',
                          type: 'object',
                          properties: {
                            frontendIPConfiguration: {
                              properties: { id: [Object] },
                              description: 'Reference to another subresource.',
                              'x-ms-azure-resource': true
                            },
                            frontendPort: {
                              properties: { id: [Object] },
                              description: 'Reference to another subresource.',
                              'x-ms-azure-resource': true
                            },
                            protocol: {
                              description: 'Protocol of the listener.',
                              type: 'string',
                              enum: [ 'Http', 'Https', 'Tcp', 'Tls' ],
                              'x-ms-enum': {
                                name: 'ApplicationGatewayProtocol',
                                modelAsString: true
                              }
                            },
                            sslCertificate: {
                              properties: { id: [Object] },
                              description: 'Reference to another subresource.',
                              'x-ms-azure-resource': true
                            },
                            sslProfile: {
                              properties: { id: [Object] },
                              description: 'Reference to another subresource.',
                              'x-ms-azure-resource': true
                            },
                            provisioningState: {
                              readOnly: true,
                              description: 'The provisioning state of the listener resource.',
                              type: 'string',
                              enum: [
                                'Succeeded',
                                'Updating',
                                'Deleting',
                                'Failed'
                              ],
                              'x-ms-enum': {
                                name: 'ProvisioningState',
                                modelAsString: true
                              }
                            }
                          }
                        },
                        name: {
                          type: 'string',
                          description: 'Name of the listener that is unique within an Application Gateway.'
                        },
                        etag: {
                          readOnly: true,
                          type: 'string',
                          description: 'A unique read-only string that changes whenever the resource is updated.'
                        },
                        type: {
                          readOnly: true,
                          type: 'string',
                          description: 'Type of the resource.'
                        }
                      },
                      allOf: [
                        {
                          properties: {
                            id: {
                              type: 'string',
                              description: 'Resource ID.'
                            }
                          },
                          description: 'Reference to another subresource.',
                          'x-ms-azure-resource': true
                        }
                      ],
                      description: 'Listener of an application gateway.'
                    },
                    description: 'Listeners of the application gateway resource. For default limits, see [Application Gateway limits](https://docs.microsoft.com/azure/azure-subscription-service-limits#application-gateway-limits).'
                  },
                  sslProfiles: {
                    type: 'array',
                    items: {
                      properties: {
                        properties: {
                          'x-ms-client-flatten': true,
                          description: 'Properties of the application gateway SSL profile.',
                          properties: {
                            trustedClientCertificates: {
                              type: 'array',
                              items: {
                                properties: [Object],
                                description: 'Reference to another subresource.',
                                'x-ms-azure-resource': true
                              },
                              description: 'Array of references to application gateway trusted client certificates.'
                            },
                            sslPolicy: {
                              description: 'SSL policy of the application gateway resource.',
                              properties: {
                                disabledSslProtocols: [Object],
                                policyType: [Object],
                                policyName: [Object],
                                cipherSuites: [Object],
                                minProtocolVersion: [Object]
                              }
                            },
                            clientAuthConfiguration: {
                              description: 'Client authentication configuration of the application gateway resource.',
                              properties: { verifyClientCertIssuerDN: [Object] }
                            },
                            provisioningState: {
                              readOnly: true,
                              description: 'The provisioning state of the HTTP listener resource.',
                              type: 'string',
                              enum: [
                                'Succeeded',
                                'Updating',
                                'Deleting',
                                'Failed'
                              ],
                              'x-ms-enum': {
                                name: 'ProvisioningState',
                                modelAsString: true
                              }
                            }
                          }
                        },
                        name: {
                          type: 'string',
                          description: 'Name of the SSL profile that is unique within an Application Gateway.'
                        },
                        etag: {
                          readOnly: true,
                          type: 'string',
                          description: 'A unique read-only string that changes whenever the resource is updated.'
                        },
                        type: {
                          readOnly: true,
                          type: 'string',
                          description: 'Type of the resource.'
                        }
                      },
                      allOf: [
                        {
                          properties: {
                            id: {
                              type: 'string',
                              description: 'Resource ID.'
                            }
                          },
                          description: 'Reference to another subresource.',
                          'x-ms-azure-resource': true
                        }
                      ],
                      description: 'SSL profile of an application gateway.'
                    },
                    description: 'SSL profiles of the application gateway resource. For default limits, see [Application Gateway limits](https://docs.microsoft.com/azure/azure-subscription-service-limits#application-gateway-limits).'
                  },
                  urlPathMaps: {
                    type: 'array',
                    items: {
                      properties: {
                        properties: {
                          'x-ms-client-flatten': true,
                          description: 'Properties of the application gateway URL path map.',
                          properties: {
                            defaultBackendAddressPool: {
                              properties: { id: [Object] },
                              description: 'Reference to another subresource.',
                              'x-ms-azure-resource': true
                            },
                            defaultBackendHttpSettings: {
                              properties: { id: [Object] },
                              description: 'Reference to another subresource.',
                              'x-ms-azure-resource': true
                            },
                            defaultRewriteRuleSet: {
                              properties: { id: [Object] },
                              description: 'Reference to another subresource.',
                              'x-ms-azure-resource': true
                            },
                            defaultRedirectConfiguration: {
                              properties: { id: [Object] },
                              description: 'Reference to another subresource.',
                              'x-ms-azure-resource': true
                            },
                            defaultLoadDistributionPolicy: {
                              properties: { id: [Object] },
                              description: 'Reference to another subresource.',
                              'x-ms-azure-resource': true
                            },
                            pathRules: {
                              type: 'array',
                              items: {
                                properties: [Object],
                                allOf: [Array],
                                description: 'Path rule of URL path map of an application gateway.'
                              },
                              description: 'Path rule of URL path map resource.'
                            },
                            provisioningState: {
                              readOnly: true,
                              description: 'The provisioning state of the URL path map resource.',
                              type: 'string',
                              enum: [
                                'Succeeded',
                                'Updating',
                                'Deleting',
                                'Failed'
                              ],
                              'x-ms-enum': {
                                name: 'ProvisioningState',
                                modelAsString: true
                              }
                            }
                          }
                        },
                        name: {
                          type: 'string',
                          description: 'Name of the URL path map that is unique within an Application Gateway.'
                        },
                        etag: {
                          readOnly: true,
                          type: 'string',
                          description: 'A unique read-only string that changes whenever the resource is updated.'
                        },
                        type: {
                          readOnly: true,
                          type: 'string',
                          description: 'Type of the resource.'
                        }
                      },
                      allOf: [
                        {
                          properties: {
                            id: {
                              type: 'string',
                              description: 'Resource ID.'
                            }
                          },
                          description: 'Reference to another subresource.',
                          'x-ms-azure-resource': true
                        }
                      ],
                      description: 'UrlPathMaps give a url path to the backend mapping information for PathBasedRouting.'
                    },
                    description: 'URL path map of the application gateway resource. For default limits, see [Application Gateway limits](https://docs.microsoft.com/azure/azure-subscription-service-limits#application-gateway-limits).'
                  },
                  requestRoutingRules: {
                    type: 'array',
                    items: {
                      properties: {
                        properties: {
                          'x-ms-client-flatten': true,
                          description: 'Properties of the application gateway request routing rule.',
                          properties: {
                            ruleType: {
                              type: 'string',
                              description: 'Rule type.',
                              enum: [ 'Basic', 'PathBasedRouting' ],
                              'x-ms-enum': {
                                name: 'ApplicationGatewayRequestRoutingRuleType',
                                modelAsString: true
                              }
                            },
                            priority: {
                              type: 'integer',
                              format: 'int32',
                              minimum: 1,
                              exclusiveMinimum: false,
                              maximum: 20000,
                              exclusiveMaximum: false,
                              description: 'Priority of the request routing rule.'
                            },
                            backendAddressPool: {
                              properties: { id: [Object] },
                              description: 'Reference to another subresource.',
                              'x-ms-azure-resource': true
                            },
                            backendHttpSettings: {
                              properties: { id: [Object] },
                              description: 'Reference to another subresource.',
                              'x-ms-azure-resource': true
                            },
                            httpListener: {
                              properties: { id: [Object] },
                              description: 'Reference to another subresource.',
                              'x-ms-azure-resource': true
                            },
                            urlPathMap: {
                              properties: { id: [Object] },
                              description: 'Reference to another subresource.',
                              'x-ms-azure-resource': true
                            },
                            rewriteRuleSet: {
                              properties: { id: [Object] },
                              description: 'Reference to another subresource.',
                              'x-ms-azure-resource': true
                            },
                            redirectConfiguration: {
                              properties: { id: [Object] },
                              description: 'Reference to another subresource.',
                              'x-ms-azure-resource': true
                            },
                            loadDistributionPolicy: {
                              properties: { id: [Object] },
                              description: 'Reference to another subresource.',
                              'x-ms-azure-resource': true
                            },
                            provisioningState: {
                              readOnly: true,
                              description: 'The provisioning state of the request routing rule resource.',
                              type: 'string',
                              enum: [
                                'Succeeded',
                                'Updating',
                                'Deleting',
                                'Failed'
                              ],
                              'x-ms-enum': {
                                name: 'ProvisioningState',
                                modelAsString: true
                              }
                            }
                          }
                        },
                        name: {
                          type: 'string',
                          description: 'Name of the request routing rule that is unique within an Application Gateway.'
                        },
                        etag: {
                          readOnly: true,
                          type: 'string',
                          description: 'A unique read-only string that changes whenever the resource is updated.'
                        },
                        type: {
                          readOnly: true,
                          type: 'string',
                          description: 'Type of the resource.'
                        }
                      },
                      allOf: [
                        {
                          properties: {
                            id: {
                              type: 'string',
                              description: 'Resource ID.'
                            }
                          },
                          description: 'Reference to another subresource.',
                          'x-ms-azure-resource': true
                        }
                      ],
                      description: 'Request routing rule of an application gateway.'
                    },
                    description: 'Request routing rules of the application gateway resource.'
                  },
                  routingRules: {
                    type: 'array',
                    items: {
                      type: 'object',
                      properties: {
                        properties: {
                          'x-ms-client-flatten': true,
                          description: 'Properties of the application gateway routing rule.',
                          type: 'object',
                          properties: {
                            ruleType: {
                              type: 'string',
                              description: 'Rule type.',
                              enum: [ 'Basic', 'PathBasedRouting' ],
                              'x-ms-enum': {
                                name: 'ApplicationGatewayRequestRoutingRuleType',
                                modelAsString: true
                              }
                            },
                            backendAddressPool: {
                              properties: { id: [Object] },
                              description: 'Reference to another subresource.',
                              'x-ms-azure-resource': true
                            },
                            backendSettings: {
                              properties: { id: [Object] },
                              description: 'Reference to another subresource.',
                              'x-ms-azure-resource': true
                            },
                            listener: {
                              properties: { id: [Object] },
                              description: 'Reference to another subresource.',
                              'x-ms-azure-resource': true
                            },
                            provisioningState: {
                              readOnly: true,
                              description: 'The provisioning state of the request routing rule resource.',
                              type: 'string',
                              enum: [
                                'Succeeded',
                                'Updating',
                                'Deleting',
                                'Failed'
                              ],
                              'x-ms-enum': {
                                name: 'ProvisioningState',
                                modelAsString: true
                              }
                            }
                          }
                        },
                        name: {
                          type: 'string',
                          description: 'Name of the routing rule that is unique within an Application Gateway.'
                        },
                        etag: {
                          readOnly: true,
                          type: 'string',
                          description: 'A unique read-only string that changes whenever the resource is updated.'
                        },
                        type: {
                          readOnly: true,
                          type: 'string',
                          description: 'Type of the resource.'
                        }
                      },
                      allOf: [
                        {
                          properties: {
                            id: {
                              type: 'string',
                              description: 'Resource ID.'
                            }
                          },
                          description: 'Reference to another subresource.',
                          'x-ms-azure-resource': true
                        }
                      ],
                      description: 'Routing rule of an application gateway.'
                    },
                    description: 'Routing rules of the application gateway resource.'
                  },
                  rewriteRuleSets: {
                    type: 'array',
                    items: {
                      properties: {
                        properties: {
                          'x-ms-client-flatten': true,
                          description: 'Properties of the application gateway rewrite rule set.',
                          properties: {
                            rewriteRules: {
                              type: 'array',
                              items: {
                                properties: [Object],
                                description: 'Rewrite rule of an application gateway.'
                              },
                              description: 'Rewrite rules in the rewrite rule set.'
                            },
                            provisioningState: {
                              readOnly: true,
                              description: 'The provisioning state of the rewrite rule set resource.',
                              type: 'string',
                              enum: [
                                'Succeeded',
                                'Updating',
                                'Deleting',
                                'Failed'
                              ],
                              'x-ms-enum': {
                                name: 'ProvisioningState',
                                modelAsString: true
                              }
                            }
                          }
                        },
                        name: {
                          type: 'string',
                          description: 'Name of the rewrite rule set that is unique within an Application Gateway.'
                        },
                        etag: {
                          readOnly: true,
                          type: 'string',
                          description: 'A unique read-only string that changes whenever the resource is updated.'
                        }
                      },
                      allOf: [
                        {
                          properties: {
                            id: {
                              type: 'string',
                              description: 'Resource ID.'
                            }
                          },
                          description: 'Reference to another subresource.',
                          'x-ms-azure-resource': true
                        }
                      ],
                      description: 'Rewrite rule set of an application gateway.'
                    },
                    description: 'Rewrite rules for the application gateway resource.'
                  },
                  redirectConfigurations: {
                    type: 'array',
                    items: {
                      properties: {
                        properties: {
                          'x-ms-client-flatten': true,
                          description: 'Properties of the application gateway redirect configuration.',
                          properties: {
                            redirectType: {
                              type: 'string',
                              description: 'HTTP redirection type.',
                              enum: [
                                'Permanent',
                                'Found',
                                'SeeOther',
                                'Temporary'
                              ],
                              'x-ms-enum': {
                                name: 'ApplicationGatewayRedirectType',
                                modelAsString: true
                              }
                            },
                            targetListener: {
                              properties: { id: [Object] },
                              description: 'Reference to another subresource.',
                              'x-ms-azure-resource': true
                            },
                            targetUrl: {
                              type: 'string',
                              description: 'Url to redirect the request to.'
                            },
                            includePath: {
                              type: 'boolean',
                              description: 'Include path in the redirected url.'
                            },
                            includeQueryString: {
                              type: 'boolean',
                              description: 'Include query string in the redirected url.'
                            },
                            requestRoutingRules: {
                              type: 'array',
                              items: {
                                properties: [Object],
                                description: 'Reference to another subresource.',
                                'x-ms-azure-resource': true
                              },
                              description: 'Request routing specifying redirect configuration.'
                            },
                            urlPathMaps: {
                              type: 'array',
                              items: {
                                properties: [Object],
                                description: 'Reference to another subresource.',
                                'x-ms-azure-resource': true
                              },
                              description: 'Url path maps specifying default redirect configuration.'
                            },
                            pathRules: {
                              type: 'array',
                              items: {
                                properties: [Object],
                                description: 'Reference to another subresource.',
                                'x-ms-azure-resource': true
                              },
                              description: 'Path rules specifying redirect configuration.'
                            }
                          }
                        },
                        name: {
                          type: 'string',
                          description: 'Name of the redirect configuration that is unique within an Application Gateway.'
                        },
                        etag: {
                          readOnly: true,
                          type: 'string',
                          description: 'A unique read-only string that changes whenever the resource is updated.'
                        },
                        type: {
                          readOnly: true,
                          type: 'string',
                          description: 'Type of the resource.'
                        }
                      },
                      allOf: [
                        {
                          properties: {
                            id: {
                              type: 'string',
                              description: 'Resource ID.'
                            }
                          },
                          description: 'Reference to another subresource.',
                          'x-ms-azure-resource': true
                        }
                      ],
                      description: 'Redirect configuration of an application gateway.'
                    },
                    description: 'Redirect configurations of the application gateway resource. For default limits, see [Application Gateway limits](https://docs.microsoft.com/azure/azure-subscription-service-limits#application-gateway-limits).'
                  },
                  webApplicationFirewallConfiguration: {
                    description: 'Web application firewall configuration.',
                    properties: {
                      enabled: {
                        type: 'boolean',
                        description: 'Whether the web application firewall is enabled or not.'
                      },
                      firewallMode: {
                        type: 'string',
                        description: 'Web application firewall mode.',
                        enum: [ 'Detection', 'Prevention' ],
                        'x-ms-enum': {
                          name: 'ApplicationGatewayFirewallMode',
                          modelAsString: true
                        }
                      },
                      ruleSetType: {
                        type: 'string',
                        description: "The type of the web application firewall rule set. Possible values are: 'OWASP'."
                      },
                      ruleSetVersion: {
                        type: 'string',
                        description: 'The version of the rule set type.'
                      },
                      disabledRuleGroups: {
                        type: 'array',
                        items: {
                          properties: {
                            ruleGroupName: {
                              type: 'string',
                              description: 'The name of the rule group that will be disabled.'
                            },
                            rules: {
                              type: 'array',
                              items: {
                                type: 'integer',
                                format: 'int32',
                                'x-nullable': false
                              },
                              description: 'The list of rules that will be disabled. If null, all rules of the rule group will be disabled.'
                            }
                          },
                          required: [ 'ruleGroupName' ],
                          description: 'Allows to disable rules within a rule group or an entire rule group.'
                        },
                        description: 'The disabled rule groups.'
                      },
                      requestBodyCheck: {
                        type: 'boolean',
                        description: 'Whether allow WAF to check request Body.'
                      },
                      maxRequestBodySize: {
                        type: 'integer',
                        format: 'int32',
                        maximum: 128,
                        exclusiveMaximum: false,
                        minimum: 8,
                        exclusiveMinimum: false,
                        description: 'Maximum request body size for WAF.'
                      },
                      maxRequestBodySizeInKb: {
                        type: 'integer',
                        format: 'int32',
                        maximum: 128,
                        exclusiveMaximum: false,
                        minimum: 8,
                        exclusiveMinimum: false,
                        description: 'Maximum request body size in Kb for WAF.'
                      },
                      fileUploadLimitInMb: {
                        type: 'integer',
                        format: 'int32',
                        minimum: 0,
                        exclusiveMinimum: false,
                        description: 'Maximum file upload size in Mb for WAF.'
                      },
                      exclusions: {
                        type: 'array',
                        items: {
                          properties: {
                            matchVariable: {
                              type: 'string',
                              description: 'The variable to be excluded.'
                            },
                            selectorMatchOperator: {
                              type: 'string',
                              description: 'When matchVariable is a collection, operate on the selector to specify which elements in the collection this exclusion applies to.'
                            },
                            selector: {
                              type: 'string',
                              description: 'When matchVariable is a collection, operator used to specify which elements in the collection this exclusion applies to.'
                            }
                          },
                          required: [
                            'matchVariable',
                            'selectorMatchOperator',
                            'selector'
                          ],
                          description: 'Allow to exclude some variable satisfy the condition for the WAF check.'
                        },
                        description: 'The exclusion list.'
                      }
                    },
                    required: [
                      'enabled',
                      'firewallMode',
                      'ruleSetType',
                      'ruleSetVersion'
                    ]
                  },
                  firewallPolicy: {
                    properties: {
                      id: { type: 'string', description: 'Resource ID.' }
                    },
                    description: 'Reference to another subresource.',
                    'x-ms-azure-resource': true
                  },
                  enableHttp2: {
                    type: 'boolean',
                    description: 'Whether HTTP2 is enabled on the application gateway resource.'
                  },
                  enableFips: {
                    type: 'boolean',
                    description: 'Whether FIPS is enabled on the application gateway resource.'
                  },
                  autoscaleConfiguration: {
                    description: 'Autoscale Configuration.',
                    properties: {
                      minCapacity: {
                        type: 'integer',
                        format: 'int32',
                        minimum: 0,
                        exclusiveMinimum: false,
                        description: 'Lower bound on number of Application Gateway capacity.'
                      },
                      maxCapacity: {
                        type: 'integer',
                        format: 'int32',
                        minimum: 2,
                        exclusiveMinimum: false,
                        description: 'Upper bound on number of Application Gateway capacity.'
                      }
                    },
                    required: [ 'minCapacity' ]
                  },
                  privateLinkConfigurations: {
                    type: 'array',
                    items: {
                      properties: {
                        properties: {
                          'x-ms-client-flatten': true,
                          description: 'Properties of the application gateway private link configuration.',
                          properties: {
                            ipConfigurations: {
                              type: 'array',
                              items: {
                                properties: [Object],
                                allOf: [Array],
                                description: 'The application gateway private link ip configuration.'
                              },
                              description: 'An array of application gateway private link ip configurations.'
                            },
                            provisioningState: {
                              readOnly: true,
                              description: 'The provisioning state of the application gateway private link configuration.',
                              type: 'string',
                              enum: [
                                'Succeeded',
                                'Updating',
                                'Deleting',
                                'Failed'
                              ],
                              'x-ms-enum': {
                                name: 'ProvisioningState',
                                modelAsString: true
                              }
                            }
                          }
                        },
                        name: {
                          type: 'string',
                          description: 'Name of the private link configuration that is unique within an Application Gateway.'
                        },
                        etag: {
                          readOnly: true,
                          type: 'string',
                          description: 'A unique read-only string that changes whenever the resource is updated.'
                        },
                        type: {
                          readOnly: true,
                          type: 'string',
                          description: 'Type of the resource.'
                        }
                      },
                      allOf: [
                        {
                          properties: {
                            id: {
                              type: 'string',
                              description: 'Resource ID.'
                            }
                          },
                          description: 'Reference to another subresource.',
                          'x-ms-azure-resource': true
                        }
                      ],
                      description: 'Private Link Configuration on an application gateway.'
                    },
                    description: 'PrivateLink configurations on application gateway.'
                  },
                  privateEndpointConnections: {
                    readOnly: true,
                    type: 'array',
                    items: {
                      properties: {
                        properties: {
                          'x-ms-client-flatten': true,
                          description: 'Properties of the application gateway private endpoint connection.',
                          properties: {
                            privateEndpoint: {
                              properties: {
                                extendedLocation: [Object],
                                properties: [Object],
                                etag: [Object]
                              },
                              allOf: [ [Object] ],
                              description: 'Private endpoint resource.',
                              readOnly: true
                            },
                            privateLinkServiceConnectionState: {
                              description: 'A collection of information about the state of the connection between service consumer and provider.',
                              properties: {
                                status: [Object],
                                description: [Object],
                                actionsRequired: [Object]
                              }
                            },
                            provisioningState: {
                              readOnly: true,
                              description: 'The provisioning state of the application gateway private endpoint connection resource.',
                              type: 'string',
                              enum: [
                                'Succeeded',
                                'Updating',
                                'Deleting',
                                'Failed'
                              ],
                              'x-ms-enum': {
                                name: 'ProvisioningState',
                                modelAsString: true
                              }
                            },
                            linkIdentifier: {
                              readOnly: true,
                              type: 'string',
                              description: 'The consumer link id.'
                            }
                          }
                        },
                        name: {
                          type: 'string',
                          description: 'Name of the private endpoint connection on an application gateway.'
                        },
                        etag: {
                          readOnly: true,
                          type: 'string',
                          description: 'A unique read-only string that changes whenever the resource is updated.'
                        },
                        type: {
                          readOnly: true,
                          type: 'string',
                          description: 'Type of the resource.'
                        }
                      },
                      allOf: [
                        {
                          properties: {
                            id: {
                              type: 'string',
                              description: 'Resource ID.'
                            }
                          },
                          description: 'Reference to another subresource.',
                          'x-ms-azure-resource': true
                        }
                      ],
                      description: 'Private Endpoint connection on an application gateway.'
                    },
                    description: 'Private Endpoint connections on application gateway.'
                  },
                  resourceGuid: {
                    readOnly: true,
                    type: 'string',
                    description: 'The resource GUID property of the application gateway resource.'
                  },
                  provisioningState: {
                    readOnly: true,
                    description: 'The provisioning state of the application gateway resource.',
                    type: 'string',
                    enum: [ 'Succeeded', 'Updating', 'Deleting', 'Failed' ],
                    'x-ms-enum': { name: 'ProvisioningState', modelAsString: true }
                  },
                  customErrorConfigurations: {
                    type: 'array',
                    items: {
                      properties: {
                        statusCode: {
                          type: 'string',
                          description: 'Status code of the application gateway customer error.',
                          enum: [ 'HttpStatus403', 'HttpStatus502' ],
                          'x-ms-enum': {
                            name: 'ApplicationGatewayCustomErrorStatusCode',
                            modelAsString: true
                          }
                        },
                        customErrorPageUrl: {
                          type: 'string',
                          description: 'Error page URL of the application gateway customer error.'
                        }
                      },
                      description: 'Customer error of an application gateway.'
                    },
                    description: 'Custom error configurations of the application gateway resource.'
                  },
                  forceFirewallPolicyAssociation: {
                    type: 'boolean',
                    description: 'If true, associates a firewall policy with an application gateway regardless whether the policy differs from the WAF Config.'
                  },
                  loadDistributionPolicies: {
                    type: 'array',
                    items: {
                      properties: {
                        properties: {
                          'x-ms-client-flatten': true,
                          description: 'Properties of the application gateway load distribution policy.',
                          properties: {
                            loadDistributionTargets: {
                              type: 'array',
                              items: {
                                properties: [Object],
                                allOf: [Array],
                                description: 'Load Distribution Target of an application gateway.'
                              },
                              description: 'Load Distribution Targets resource of an application gateway.'
                            },
                            loadDistributionAlgorithm: {
                              description: 'Load Distribution Targets resource of an application gateway.',
                              type: 'string',
                              enum: [
                                'RoundRobin',
                                'LeastConnections',
                                'IpHash'
                              ],
                              'x-ms-enum': {
                                name: 'ApplicationGatewayLoadDistributionAlgorithm',
                                modelAsString: true
                              }
                            },
                            provisioningState: {
                              readOnly: true,
                              description: 'The provisioning state of the Load Distribution Policy resource.',
                              type: 'string',
                              enum: [
                                'Succeeded',
                                'Updating',
                                'Deleting',
                                'Failed'
                              ],
                              'x-ms-enum': {
                                name: 'ProvisioningState',
                                modelAsString: true
                              }
                            }
                          }
                        },
                        name: {
                          type: 'string',
                          description: 'Name of the load distribution policy that is unique within an Application Gateway.'
                        },
                        etag: {
                          readOnly: true,
                          type: 'string',
                          description: 'A unique read-only string that changes whenever the resource is updated.'
                        },
                        type: {
                          readOnly: true,
                          type: 'string',
                          description: 'Type of the resource.'
                        }
                      },
                      allOf: [
                        {
                          properties: {
                            id: {
                              type: 'string',
                              description: 'Resource ID.'
                            }
                          },
                          description: 'Reference to another subresource.',
                          'x-ms-azure-resource': true
                        }
                      ],
                      description: 'Load Distribution Policy of an application gateway.'
                    },
                    description: 'Load distribution policies of the application gateway resource.'
                  },
                  globalConfiguration: {
                    description: 'Global Configuration.',
                    properties: {
                      enableRequestBuffering: {
                        type: 'boolean',
                        description: 'Enable request buffering.'
                      },
                      enableResponseBuffering: {
                        type: 'boolean',
                        description: 'Enable response buffering.'
                      }
                    }
                  }
                }
              },
              etag: {
                readOnly: true,
                type: 'string',
                description: 'A unique read-only string that changes whenever the resource is updated.'
              },
              zones: {
                type: 'array',
                items: { type: 'string' },
                description: 'A list of availability zones denoting where the resource needs to come from.'
              },
              identity: {
                description: 'The identity of the application gateway, if configured.',
                properties: {
                  principalId: {
                    readOnly: true,
                    type: 'string',
                    description: 'The principal id of the system assigned identity. This property will only be provided for a system assigned identity.'
                  },
                  tenantId: {
                    readOnly: true,
                    type: 'string',
                    description: 'The tenant id of the system assigned identity. This property will only be provided for a system assigned identity.'
                  },
                  type: {
                    type: 'string',
                    description: "The type of identity used for the resource. The type 'SystemAssigned, UserAssigned' includes both an implicitly created identity and a set of user assigned identities. The type 'None' will remove any identities from the virtual machine.",
                    enum: [
                      'SystemAssigned',
                      'UserAssigned',
                      'SystemAssigned, UserAssigned',
                      'None'
                    ],
                    'x-ms-enum': {
                      name: 'ResourceIdentityType',
                      modelAsString: false
                    }
                  },
                  userAssignedIdentities: {
                    type: 'object',
                    additionalProperties: {
                      type: 'object',
                      properties: {
                        principalId: {
                          readOnly: true,
                          type: 'string',
                          description: 'The principal id of user assigned identity.'
                        },
                        clientId: {
                          readOnly: true,
                          type: 'string',
                          description: 'The client id of user assigned identity.'
                        }
                      }
                    },
                    description: "The list of user identities associated with resource. The user identity dictionary key references will be ARM resource ids in the form: '/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.ManagedIdentity/userAssignedIdentities/{identityName}'."
                  }
                }
              }
            },
            allOf: [
              {
                properties: {
                  id: { type: 'string', description: 'Resource ID.' },
                  name: {
                    readOnly: true,
                    type: 'string',
                    description: 'Resource name.'
                  },
                  type: {
                    readOnly: true,
                    type: 'string',
                    description: 'Resource type.'
                  },
                  location: { type: 'string', description: 'Resource location.' },
                  tags: {
                    type: 'object',
                    additionalProperties: { type: 'string' },
                    description: 'Resource tags.'
                  }
                },
                description: 'Common resource representation.',
                'x-ms-azure-resource': true
              }
            ],
            description: 'Application gateway resource.'
          },
          description: 'A collection of references to application gateways.'
        },
        provisioningState: {
          readOnly: true,
          description: 'The provisioning state of the web application firewall policy resource.',
          type: 'string',
          enum: [ 'Succeeded', 'Updating', 'Deleting', 'Failed' ],
          'x-ms-enum': { name: 'ProvisioningState', modelAsString: true }
        },
        resourceState: {
          title: 'Resource status of the policy.',
          readOnly: true,
          type: 'string',
          description: 'Resource status of the policy.',
          enum: [
            'Creating',
            'Enabling',
            'Enabled',
            'Disabling',
            'Disabled',
            'Deleting'
          ],
          'x-ms-enum': {
            name: 'WebApplicationFirewallPolicyResourceState',
            modelAsString: true
          }
        },
        managedRules: {
          description: 'Describes the managedRules structure.',
          required: [ 'managedRuleSets' ],
          properties: {
            exclusions: {
              type: 'array',
              items: {
                required: [
                  'matchVariable',
                  'selectorMatchOperator',
                  'selector'
                ],
                description: 'Allow to exclude some variable satisfy the condition for the WAF check.',
                properties: {
                  matchVariable: {
                    type: 'string',
                    enum: [
                      'RequestHeaderNames',
                      'RequestCookieNames',
                      'RequestArgNames',
                      'RequestHeaderKeys',
                      'RequestHeaderValues',
                      'RequestCookieKeys',
                      'RequestCookieValues',
                      'RequestArgKeys',
                      'RequestArgValues'
                    ],
                    description: 'The variable to be excluded.',
                    'x-ms-enum': {
                      name: 'OwaspCrsExclusionEntryMatchVariable',
                      modelAsString: true
                    }
                  },
                  selectorMatchOperator: {
                    type: 'string',
                    enum: [
                      'Equals',
                      'Contains',
                      'StartsWith',
                      'EndsWith',
                      'EqualsAny'
                    ],
                    description: 'When matchVariable is a collection, operate on the selector to specify which elements in the collection this exclusion applies to.',
                    'x-ms-enum': {
                      name: 'OwaspCrsExclusionEntrySelectorMatchOperator',
                      modelAsString: true
                    }
                  },
                  selector: {
                    type: 'string',
                    description: 'When matchVariable is a collection, operator used to specify which elements in the collection this exclusion applies to.'
                  },
                  exclusionManagedRuleSets: {
                    type: 'array',
                    items: {
                      type: 'object',
                      description: 'Defines a managed rule set for Exclusions.',
                      required: [ 'ruleSetType', 'ruleSetVersion' ],
                      properties: {
                        ruleSetType: {
                          description: 'Defines the rule set type to use.',
                          type: 'string'
                        },
                        ruleSetVersion: {
                          description: 'Defines the version of the rule set to use.',
                          type: 'string'
                        },
                        ruleGroups: {
                          description: 'Defines the rule groups to apply to the rule set.',
                          type: 'array',
                          items: {
                            type: 'object',
                            description: 'Defines a managed rule group to use for exclusion.',
                            required: [ 'ruleGroupName' ],
                            properties: {
                              ruleGroupName: {
                                description: 'The managed rule group for exclusion.',
                                type: 'string'
                              },
                              rules: {
                                description: 'List of rules that will be excluded. If none specified, all rules in the group will be excluded.',
                                type: 'array',
                                items: [Object]
                              }
                            }
                          }
                        }
                      }
                    },
                    description: 'The managed rule sets that are associated with the exclusion.'
                  }
                }
              },
              description: 'The Exclusions that are applied on the policy.'
            },
            managedRuleSets: {
              type: 'array',
              items: {
                type: 'object',
                description: 'Defines a managed rule set.',
                required: [ 'ruleSetType', 'ruleSetVersion' ],
                properties: {
                  ruleSetType: {
                    description: 'Defines the rule set type to use.',
                    type: 'string'
                  },
                  ruleSetVersion: {
                    description: 'Defines the version of the rule set to use.',
                    type: 'string'
                  },
                  ruleGroupOverrides: {
                    description: 'Defines the rule group overrides to apply to the rule set.',
                    type: 'array',
                    items: {
                      type: 'object',
                      description: 'Defines a managed rule group override setting.',
                      required: [ 'ruleGroupName' ],
                      properties: {
                        ruleGroupName: {
                          description: 'The managed rule group to override.',
                          type: 'string'
                        },
                        rules: {
                          description: 'List of rules that will be disabled. If none specified, all rules in the group will be disabled.',
                          type: 'array',
                          items: {
                            type: 'object',
                            description: 'Defines a managed rule group override setting.',
                            required: [ 'ruleId' ],
                            properties: {
                              ruleId: {
                                description: 'Identifier for the managed rule.',
                                type: 'string'
                              },
                              state: {
                                description: 'The state of the managed rule. Defaults to Disabled if not specified.',
                                type: 'string',
                                enum: [Array],
                                'x-ms-enum': [Object]
                              }
                            }
                          }
                        }
                      }
                    }
                  }
                }
              },
              description: 'The managed rule sets that are associated with the policy.'
            }
          }
        },
        httpListeners: {
          readOnly: true,
          type: 'array',
          items: {
            properties: { id: { type: 'string', description: 'Resource ID.' } },
            description: 'Reference to another subresource.',
            'x-ms-azure-resource': true
          },
          description: 'A collection of references to application gateway http listeners.'
        },
        pathBasedRules: {
          readOnly: true,
          type: 'array',
          items: {
            properties: { id: { type: 'string', description: 'Resource ID.' } },
            description: 'Reference to another subresource.',
            'x-ms-azure-resource': true
          },
          description: 'A collection of references to application gateway path rules.'
        }
      }
    },
    etag: {
      readOnly: true,
      type: 'string',
      description: 'A unique read-only string that changes whenever the resource is updated.'
    }
  },
  allOf: [
    {
      properties: {
        id: { type: 'string', description: 'Resource ID.' },
        name: {
          readOnly: true,
          type: 'string',
          description: 'Resource name.'
        },
        type: {
          readOnly: true,
          type: 'string',
          description: 'Resource type.'
        },
        location: { type: 'string', description: 'Resource location.' },
        tags: {
          type: 'object',
          additionalProperties: { type: 'string' },
          description: 'Resource tags.'
        }
      },
      description: 'Common resource representation.',
      'x-ms-azure-resource': true
    }
  ]
}
```
## Misc
The resource version is `2021-08-01`.

The Swagger schema used to generate this documentation can be found [here](https://github.com/Azure/azure-rest-api-specs/tree/main/specification/network/resource-manager/Microsoft.Network/stable/2021-08-01/webapplicationfirewall.json).
