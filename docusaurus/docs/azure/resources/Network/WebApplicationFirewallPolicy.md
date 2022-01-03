---
id: WebApplicationFirewallPolicy
title: WebApplicationFirewallPolicy
---
Provides a **WebApplicationFirewallPolicy** from the **Network** group
## Examples
### Creates or updates a WAF policy within a resource group
```js
provider.Network.makeWebApplicationFirewallPolicy({
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
              matchVariables: [{ variableName: "RemoteAddr", selector: null }],
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
              matchVariables: [{ variableName: "RemoteAddr", selector: null }],
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
  dependencies: ({ resources }) => ({
    resourceGroup: resources.Resources.ResourceGroup["myResourceGroup"],
    firewallPolicy: resources.Network.FirewallPolicy["myFirewallPolicy"],
  }),
});

```
## Dependencies
- [ResourceGroup](../Resources/ResourceGroup.md)
- [FirewallPolicy](../Network/FirewallPolicy.md)
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
                      items: [Object]
                    },
                    operator: {
                      description: 'The operator to be matched.',
                      type: 'string',
                      enum: [Array],
                      'x-ms-enum': [Object]
                    },
                    negationConditon: {
                      description: 'Whether this is negate condition or not.',
                      type: 'boolean'
                    },
                    matchValues: {
                      description: 'Match value.',
                      type: 'array',
                      items: [Object]
                    },
                    transforms: {
                      description: 'List of transforms.',
                      type: 'array',
                      items: [Object]
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
                      name: [Object],
                      tier: [Object],
                      capacity: [Object]
                    }
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
                      properties: [Object],
                      allOf: [Array],
                      description: 'IP configuration of an application gateway. Currently 1 public and 1 private IP configuration is allowed.'
                    },
                    description: 'Subnets of the application gateway resource. For default limits, see [Application Gateway limits](https://docs.microsoft.com/azure/azure-subscription-service-limits#application-gateway-limits).'
                  },
                  authenticationCertificates: {
                    type: 'array',
                    items: {
                      properties: [Object],
                      allOf: [Array],
                      description: 'Authentication certificates of an application gateway.'
                    },
                    description: 'Authentication certificates of the application gateway resource. For default limits, see [Application Gateway limits](https://docs.microsoft.com/azure/azure-subscription-service-limits#application-gateway-limits).'
                  },
                  trustedRootCertificates: {
                    type: 'array',
                    items: {
                      properties: [Object],
                      allOf: [Array],
                      description: 'Trusted Root certificates of an application gateway.'
                    },
                    description: 'Trusted Root certificates of the application gateway resource. For default limits, see [Application Gateway limits](https://docs.microsoft.com/azure/azure-subscription-service-limits#application-gateway-limits).'
                  },
                  trustedClientCertificates: {
                    type: 'array',
                    items: {
                      properties: [Object],
                      allOf: [Array],
                      description: 'Trusted client certificates of an application gateway.'
                    },
                    description: 'Trusted client certificates of the application gateway resource. For default limits, see [Application Gateway limits](https://docs.microsoft.com/azure/azure-subscription-service-limits#application-gateway-limits).'
                  },
                  sslCertificates: {
                    type: 'array',
                    items: {
                      properties: [Object],
                      allOf: [Array],
                      description: 'SSL certificates of an application gateway.'
                    },
                    description: 'SSL certificates of the application gateway resource. For default limits, see [Application Gateway limits](https://docs.microsoft.com/azure/azure-subscription-service-limits#application-gateway-limits).'
                  },
                  frontendIPConfigurations: {
                    type: 'array',
                    items: {
                      properties: [Object],
                      allOf: [Array],
                      description: 'Frontend IP configuration of an application gateway.'
                    },
                    description: 'Frontend IP addresses of the application gateway resource. For default limits, see [Application Gateway limits](https://docs.microsoft.com/azure/azure-subscription-service-limits#application-gateway-limits).'
                  },
                  frontendPorts: {
                    type: 'array',
                    items: {
                      properties: [Object],
                      allOf: [Array],
                      description: 'Frontend port of an application gateway.'
                    },
                    description: 'Frontend ports of the application gateway resource. For default limits, see [Application Gateway limits](https://docs.microsoft.com/azure/azure-subscription-service-limits#application-gateway-limits).'
                  },
                  probes: {
                    type: 'array',
                    items: {
                      properties: [Object],
                      allOf: [Array],
                      description: 'Probe of the application gateway.'
                    },
                    description: 'Probes of the application gateway resource.'
                  },
                  backendAddressPools: {
                    type: 'array',
                    items: {
                      properties: [Object],
                      allOf: [Array],
                      description: 'Backend Address Pool of an application gateway.'
                    },
                    description: 'Backend address pool of the application gateway resource. For default limits, see [Application Gateway limits](https://docs.microsoft.com/azure/azure-subscription-service-limits#application-gateway-limits).'
                  },
                  backendHttpSettingsCollection: {
                    type: 'array',
                    items: {
                      properties: [Object],
                      allOf: [Array],
                      description: 'Backend address pool settings of an application gateway.'
                    },
                    description: 'Backend http settings of the application gateway resource. For default limits, see [Application Gateway limits](https://docs.microsoft.com/azure/azure-subscription-service-limits#application-gateway-limits).'
                  },
                  httpListeners: {
                    type: 'array',
                    items: {
                      properties: [Object],
                      allOf: [Array],
                      description: 'Http listener of an application gateway.'
                    },
                    description: 'Http listeners of the application gateway resource. For default limits, see [Application Gateway limits](https://docs.microsoft.com/azure/azure-subscription-service-limits#application-gateway-limits).'
                  },
                  sslProfiles: {
                    type: 'array',
                    items: {
                      properties: [Object],
                      allOf: [Array],
                      description: 'SSL profile of an application gateway.'
                    },
                    description: 'SSL profiles of the application gateway resource. For default limits, see [Application Gateway limits](https://docs.microsoft.com/azure/azure-subscription-service-limits#application-gateway-limits).'
                  },
                  urlPathMaps: {
                    type: 'array',
                    items: {
                      properties: [Object],
                      allOf: [Array],
                      description: 'UrlPathMaps give a url path to the backend mapping information for PathBasedRouting.'
                    },
                    description: 'URL path map of the application gateway resource. For default limits, see [Application Gateway limits](https://docs.microsoft.com/azure/azure-subscription-service-limits#application-gateway-limits).'
                  },
                  requestRoutingRules: {
                    type: 'array',
                    items: {
                      properties: [Object],
                      allOf: [Array],
                      description: 'Request routing rule of an application gateway.'
                    },
                    description: 'Request routing rules of the application gateway resource.'
                  },
                  rewriteRuleSets: {
                    type: 'array',
                    items: {
                      properties: [Object],
                      allOf: [Array],
                      description: 'Rewrite rule set of an application gateway.'
                    },
                    description: 'Rewrite rules for the application gateway resource.'
                  },
                  redirectConfigurations: {
                    type: 'array',
                    items: {
                      properties: [Object],
                      allOf: [Array],
                      description: 'Redirect configuration of an application gateway.'
                    },
                    description: 'Redirect configurations of the application gateway resource. For default limits, see [Application Gateway limits](https://docs.microsoft.com/azure/azure-subscription-service-limits#application-gateway-limits).'
                  },
                  webApplicationFirewallConfiguration: {
                    description: 'Web application firewall configuration.',
                    properties: {
                      enabled: [Object],
                      firewallMode: [Object],
                      ruleSetType: [Object],
                      ruleSetVersion: [Object],
                      disabledRuleGroups: [Object],
                      requestBodyCheck: [Object],
                      maxRequestBodySize: [Object],
                      maxRequestBodySizeInKb: [Object],
                      fileUploadLimitInMb: [Object],
                      exclusions: [Object]
                    },
                    required: [
                      'enabled',
                      'firewallMode',
                      'ruleSetType',
                      'ruleSetVersion'
                    ]
                  },
                  firewallPolicy: {
                    properties: { id: [Object] },
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
                    properties: { minCapacity: [Object], maxCapacity: [Object] },
                    required: [ 'minCapacity' ]
                  },
                  privateLinkConfigurations: {
                    type: 'array',
                    items: {
                      properties: [Object],
                      allOf: [Array],
                      description: 'Private Link Configuration on an application gateway.'
                    },
                    description: 'PrivateLink configurations on application gateway.'
                  },
                  privateEndpointConnections: {
                    readOnly: true,
                    type: 'array',
                    items: {
                      properties: [Object],
                      allOf: [Array],
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
                      properties: [Object],
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
                      properties: [Object],
                      allOf: [Array],
                      description: 'Load Distribution Policy of an application gateway.'
                    },
                    description: 'Load distribution policies of the application gateway resource.'
                  },
                  globalConfiguration: {
                    description: 'Global Configuration.',
                    properties: {
                      enableRequestBuffering: [Object],
                      enableResponseBuffering: [Object]
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
                    additionalProperties: { type: 'object', properties: [Object] },
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
                      required: [Array],
                      properties: [Object]
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
                      required: [Array],
                      properties: [Object]
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
The resource version is `2021-05-01`.

The Swagger schema used to generate this documentation can be found [here](https://github.com/Azure/azure-rest-api-specs/tree/main/specification/network/resource-manager/Microsoft.Network/stable/2021-05-01/webapplicationfirewall.json).
