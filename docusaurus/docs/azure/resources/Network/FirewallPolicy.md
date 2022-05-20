---
id: FirewallPolicy
title: FirewallPolicy
---
Provides a **FirewallPolicy** from the **Network** group
## Examples
### Create FirewallPolicy
```js
exports.createResources = () => [
  {
    type: "FirewallPolicy",
    group: "Network",
    name: "myFirewallPolicy",
    properties: () => ({
      tags: { key1: "value1" },
      location: "West US",
      properties: {
        threatIntelMode: "Alert",
        threatIntelWhitelist: {
          ipAddresses: ["20.3.4.5"],
          fqdns: ["*.microsoft.com"],
        },
        insights: {
          isEnabled: true,
          retentionDays: 100,
          logAnalyticsResources: {
            workspaces: [
              {
                region: "westus",
                workspaceId: {
                  id: "/subscriptions/subid/resourcegroups/rg1/providers/microsoft.operationalinsights/workspaces/workspace1",
                },
              },
              {
                region: "eastus",
                workspaceId: {
                  id: "/subscriptions/subid/resourcegroups/rg1/providers/microsoft.operationalinsights/workspaces/workspace2",
                },
              },
            ],
            defaultWorkspaceId: {
              id: "/subscriptions/subid/resourcegroups/rg1/providers/microsoft.operationalinsights/workspaces/defaultWorkspace",
            },
          },
        },
        snat: { privateRanges: ["IANAPrivateRanges"] },
        sql: { allowSqlRedirect: true },
        dnsSettings: {
          servers: ["30.3.4.5"],
          enableProxy: true,
          requireProxyForNetworkRules: false,
        },
        explicitProxySettings: {
          enableExplicitProxy: true,
          httpPort: 8087,
          httpsPort: 8087,
          pacFilePort: 8087,
          pacFile:
            "https://tinawstorage.file.core.windows.net/?sv=2020-02-10&ss=bfqt&srt=sco&sp=rwdlacuptfx&se=2021-06-04T07:01:12Z&st=2021-06-03T23:01:12Z&sip=68.65.171.11&spr=https&sig=Plsa0RRVpGbY0IETZZOT6znOHcSro71LLTTbzquYPgs%3D",
        },
        sku: { tier: "Premium" },
        intrusionDetection: {
          mode: "Alert",
          configuration: {
            signatureOverrides: [{ id: "2525004", mode: "Deny" }],
            bypassTrafficSettings: [
              {
                name: "bypassRule1",
                description: "Rule 1",
                protocol: "TCP",
                sourceAddresses: ["1.2.3.4"],
                destinationAddresses: ["5.6.7.8"],
                destinationPorts: ["*"],
              },
            ],
          },
        },
        transportSecurity: {
          certificateAuthority: {
            name: "clientcert",
            keyVaultSecretId: "https://kv/secret",
          },
        },
      },
    }),
    dependencies: ({}) => ({
      resourceGroup: "myResourceGroup",
      managedIdentities: ["myUserAssignedIdentity"],
      workspace: ["myWorkspace"],
    }),
  },
];

```
## Dependencies
- [ResourceGroup](../Resources/ResourceGroup.md)
- [UserAssignedIdentity](../ManagedIdentity/UserAssignedIdentity.md)
- [Workspace](../OperationalInsights/Workspace.md)
## Swagger Schema
```js
{
  type: 'object',
  properties: {
    properties: {
      'x-ms-client-flatten': true,
      description: 'Properties of the firewall policy.',
      type: 'object',
      properties: {
        ruleCollectionGroups: {
          type: 'array',
          readOnly: true,
          description: 'List of references to FirewallPolicyRuleCollectionGroups.',
          items: {
            properties: { id: { type: 'string', description: 'Resource ID.' } },
            description: 'Reference to another subresource.',
            'x-ms-azure-resource': true
          }
        },
        provisioningState: {
          readOnly: true,
          description: 'The provisioning state of the firewall policy resource.',
          type: 'string',
          enum: [ 'Succeeded', 'Updating', 'Deleting', 'Failed' ],
          'x-ms-enum': { name: 'ProvisioningState', modelAsString: true }
        },
        basePolicy: {
          readOnly: false,
          description: 'The parent firewall policy from which rules are inherited.',
          properties: { id: { type: 'string', description: 'Resource ID.' } },
          'x-ms-azure-resource': true
        },
        firewalls: {
          type: 'array',
          readOnly: true,
          description: 'List of references to Azure Firewalls that this Firewall Policy is associated with.',
          items: {
            properties: { id: { type: 'string', description: 'Resource ID.' } },
            description: 'Reference to another subresource.',
            'x-ms-azure-resource': true
          }
        },
        childPolicies: {
          type: 'array',
          readOnly: true,
          description: 'List of references to Child Firewall Policies.',
          items: {
            properties: { id: { type: 'string', description: 'Resource ID.' } },
            description: 'Reference to another subresource.',
            'x-ms-azure-resource': true
          }
        },
        threatIntelMode: {
          description: 'The operation mode for Threat Intelligence.',
          type: 'string',
          enum: [ 'Alert', 'Deny', 'Off' ],
          'x-ms-enum': { name: 'AzureFirewallThreatIntelMode', modelAsString: true }
        },
        threatIntelWhitelist: {
          description: 'ThreatIntel Whitelist for Firewall Policy.',
          type: 'object',
          properties: {
            ipAddresses: {
              type: 'array',
              description: 'List of IP addresses for the ThreatIntel Whitelist.',
              items: { type: 'string' }
            },
            fqdns: {
              type: 'array',
              description: 'List of FQDNs for the ThreatIntel Whitelist.',
              items: { type: 'string' }
            }
          }
        },
        insights: {
          description: 'Insights on Firewall Policy.',
          type: 'object',
          properties: {
            isEnabled: {
              type: 'boolean',
              description: 'A flag to indicate if the insights are enabled on the policy.'
            },
            retentionDays: {
              type: 'integer',
              format: 'int32',
              description: 'Number of days the insights should be enabled on the policy.'
            },
            logAnalyticsResources: {
              description: 'Workspaces needed to configure the Firewall Policy Insights.',
              type: 'object',
              properties: {
                workspaces: {
                  type: 'array',
                  description: 'List of workspaces for Firewall Policy Insights.',
                  items: {
                    type: 'object',
                    description: 'Log Analytics Workspace for Firewall Policy Insights.',
                    properties: {
                      region: {
                        type: 'string',
                        description: 'Region to configure the Workspace.'
                      },
                      workspaceId: {
                        description: 'The workspace Id for Firewall Policy Insights.',
                        properties: {
                          id: {
                            type: 'string',
                            description: 'Resource ID.'
                          }
                        },
                        'x-ms-azure-resource': true
                      }
                    }
                  },
                  'x-ms-identifiers': []
                },
                defaultWorkspaceId: {
                  description: 'The default workspace Id for Firewall Policy Insights.',
                  properties: {
                    id: { type: 'string', description: 'Resource ID.' }
                  },
                  'x-ms-azure-resource': true
                }
              }
            }
          }
        },
        snat: {
          description: 'The private IP addresses/IP ranges to which traffic will not be SNAT.',
          type: 'object',
          properties: {
            privateRanges: {
              type: 'array',
              description: 'List of private IP addresses/IP address ranges to not be SNAT.',
              items: { type: 'string' }
            }
          }
        },
        sql: {
          description: 'SQL Settings definition.',
          type: 'object',
          properties: {
            allowSqlRedirect: {
              type: 'boolean',
              description: 'A flag to indicate if SQL Redirect traffic filtering is enabled. Turning on the flag requires no rule using port 11000-11999.'
            }
          }
        },
        dnsSettings: {
          description: 'DNS Proxy Settings definition.',
          type: 'object',
          properties: {
            servers: {
              type: 'array',
              description: 'List of Custom DNS Servers.',
              items: { type: 'string' }
            },
            enableProxy: {
              type: 'boolean',
              description: 'Enable DNS Proxy on Firewalls attached to the Firewall Policy.'
            },
            requireProxyForNetworkRules: {
              type: 'boolean',
              description: 'FQDNs in Network Rules are supported when set to true.',
              'x-nullable': true
            }
          }
        },
        explicitProxySettings: {
          description: 'Explicit Proxy Settings definition.',
          type: 'object',
          properties: {
            enableExplicitProxy: {
              type: 'boolean',
              description: 'When set to true, explicit proxy mode is enabled.',
              'x-nullable': true
            },
            httpPort: {
              type: 'integer',
              format: 'int32',
              maximum: 64000,
              exclusiveMaximum: false,
              minimum: 0,
              exclusiveMinimum: false,
              description: 'Port number for explicit proxy http protocol, cannot be greater than 64000.'
            },
            httpsPort: {
              type: 'integer',
              format: 'int32',
              maximum: 64000,
              exclusiveMaximum: false,
              minimum: 0,
              exclusiveMinimum: false,
              description: 'Port number for explicit proxy https protocol, cannot be greater than 64000.'
            },
            pacFilePort: {
              type: 'integer',
              format: 'int32',
              maximum: 64000,
              exclusiveMaximum: false,
              minimum: 0,
              exclusiveMinimum: false,
              description: 'Port number for firewall to serve PAC file.'
            },
            pacFile: { type: 'string', description: 'SAS URL for PAC file.' }
          }
        },
        intrusionDetection: {
          description: 'The configuration for Intrusion detection.',
          type: 'object',
          properties: {
            mode: {
              description: 'Intrusion detection general state.',
              type: 'string',
              enum: [ 'Off', 'Alert', 'Deny' ],
              'x-ms-enum': {
                name: 'FirewallPolicyIntrusionDetectionStateType',
                modelAsString: true
              }
            },
            configuration: {
              description: 'Intrusion detection configuration properties.',
              type: 'object',
              properties: {
                signatureOverrides: {
                  type: 'array',
                  description: 'List of specific signatures states.',
                  items: {
                    type: 'object',
                    properties: {
                      id: { type: 'string', description: 'Signature id.' },
                      mode: {
                        description: 'The signature state.',
                        type: 'string',
                        enum: [ 'Off', 'Alert', 'Deny' ],
                        'x-ms-enum': {
                          name: 'FirewallPolicyIntrusionDetectionStateType',
                          modelAsString: true
                        }
                      }
                    },
                    description: 'Intrusion detection signatures specification states.'
                  }
                },
                bypassTrafficSettings: {
                  type: 'array',
                  description: 'List of rules for traffic to bypass.',
                  items: {
                    type: 'object',
                    properties: {
                      name: {
                        type: 'string',
                        description: 'Name of the bypass traffic rule.'
                      },
                      description: {
                        type: 'string',
                        description: 'Description of the bypass traffic rule.'
                      },
                      protocol: {
                        type: 'string',
                        description: 'The rule bypass protocol.',
                        enum: [ 'TCP', 'UDP', 'ICMP', 'ANY' ],
                        'x-ms-enum': {
                          name: 'FirewallPolicyIntrusionDetectionProtocol',
                          modelAsString: true
                        }
                      },
                      sourceAddresses: {
                        type: 'array',
                        description: 'List of source IP addresses or ranges for this rule.',
                        items: { type: 'string' }
                      },
                      destinationAddresses: {
                        type: 'array',
                        description: 'List of destination IP addresses or ranges for this rule.',
                        items: { type: 'string' }
                      },
                      destinationPorts: {
                        type: 'array',
                        description: 'List of destination ports or ranges.',
                        items: { type: 'string' }
                      },
                      sourceIpGroups: {
                        type: 'array',
                        description: 'List of source IpGroups for this rule.',
                        items: { type: 'string' }
                      },
                      destinationIpGroups: {
                        type: 'array',
                        description: 'List of destination IpGroups for this rule.',
                        items: { type: 'string' }
                      }
                    },
                    description: 'Intrusion detection bypass traffic specification.'
                  },
                  'x-ms-identifiers': []
                },
                privateRanges: {
                  type: 'array',
                  description: 'IDPS Private IP address ranges are used to identify traffic direction (i.e. inbound, outbound, etc.). By default, only ranges defined by IANA RFC 1918 are considered private IP addresses. To modify default ranges, specify your Private IP address ranges with this property',
                  items: { type: 'string' },
                  'x-ms-identifiers': []
                }
              }
            }
          }
        },
        transportSecurity: {
          description: 'TLS Configuration definition.',
          type: 'object',
          properties: {
            certificateAuthority: {
              description: 'The CA used for intermediate CA generation.',
              type: 'object',
              properties: {
                keyVaultSecretId: {
                  type: 'string',
                  description: "Secret Id of (base-64 encoded unencrypted pfx) 'Secret' or 'Certificate' object stored in KeyVault."
                },
                name: {
                  type: 'string',
                  description: 'Name of the CA certificate.'
                }
              }
            }
          }
        },
        sku: {
          description: 'The Firewall Policy SKU.',
          type: 'object',
          properties: {
            tier: {
              type: 'string',
              description: 'Tier of Firewall Policy.',
              enum: [ 'Standard', 'Premium', 'Basic' ],
              'x-ms-enum': { name: 'FirewallPolicySkuTier', modelAsString: true }
            }
          }
        }
      }
    },
    etag: {
      type: 'string',
      readOnly: true,
      description: 'A unique read-only string that changes whenever the resource is updated.'
    },
    identity: {
      description: 'The identity of the firewall policy.',
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
          'x-ms-enum': { name: 'ResourceIdentityType', modelAsString: false }
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
  description: 'FirewallPolicy Resource.'
}
```
## Misc
The resource version is `2021-08-01`.

The Swagger schema used to generate this documentation can be found [here](https://github.com/Azure/azure-rest-api-specs/tree/main/specification/network/resource-manager/Microsoft.Network/stable/2021-08-01/firewallPolicy.json).
