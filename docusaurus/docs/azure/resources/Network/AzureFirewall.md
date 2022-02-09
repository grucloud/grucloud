---
id: AzureFirewall
title: AzureFirewall
---
Provides a **AzureFirewall** from the **Network** group
## Examples
### Create Azure Firewall
```js
exports.createResources = () => [
  {
    type: "AzureFirewall",
    group: "Network",
    name: "myAzureFirewall",
    properties: () => ({
      tags: { key1: "value1" },
      location: "West US",
      zones: [],
      properties: {
        sku: { name: "AZFW_VNet", tier: "Standard" },
        threatIntelMode: "Alert",
        ipConfigurations: [
          {
            name: "azureFirewallIpConfiguration",
            properties: {
              subnet: {
                id: "/subscriptions/subid/resourceGroups/rg1/providers/Microsoft.Network/virtualNetworks/vnet2/subnets/AzureFirewallSubnet",
              },
              publicIPAddress: {
                id: "/subscriptions/subid/resourceGroups/rg1/providers/Microsoft.Network/publicIPAddresses/pipName",
              },
            },
          },
        ],
        applicationRuleCollections: [
          {
            name: "apprulecoll",
            properties: {
              priority: 110,
              action: { type: "Deny" },
              rules: [
                {
                  name: "rule1",
                  description: "Deny inbound rule",
                  protocols: [{ protocolType: "Https", port: 443 }],
                  targetFqdns: ["www.test.com"],
                  sourceAddresses: ["216.58.216.164", "10.0.0.0/24"],
                },
              ],
            },
          },
        ],
        natRuleCollections: [
          {
            name: "natrulecoll",
            properties: {
              priority: 112,
              action: { type: "Dnat" },
              rules: [
                {
                  name: "DNAT-HTTPS-traffic",
                  description: "D-NAT all outbound web traffic for inspection",
                  sourceAddresses: ["*"],
                  destinationAddresses: ["1.2.3.4"],
                  destinationPorts: ["443"],
                  protocols: ["TCP"],
                  translatedAddress: "1.2.3.5",
                  translatedPort: "8443",
                },
                {
                  name: "DNAT-HTTP-traffic-With-FQDN",
                  description: "D-NAT all inbound web traffic for inspection",
                  sourceAddresses: ["*"],
                  destinationAddresses: ["1.2.3.4"],
                  destinationPorts: ["80"],
                  protocols: ["TCP"],
                  translatedFqdn: "internalhttpserver",
                  translatedPort: "880",
                },
              ],
            },
          },
        ],
        networkRuleCollections: [
          {
            name: "netrulecoll",
            properties: {
              priority: 112,
              action: { type: "Deny" },
              rules: [
                {
                  name: "L4-traffic",
                  description: "Block traffic based on source IPs and ports",
                  sourceAddresses: [
                    "192.168.1.1-192.168.1.12",
                    "10.1.4.12-10.1.4.255",
                  ],
                  destinationPorts: ["443-444", "8443"],
                  destinationAddresses: ["*"],
                  protocols: ["TCP"],
                },
                {
                  name: "L4-traffic-with-FQDN",
                  description:
                    "Block traffic based on source IPs and ports to amazon",
                  sourceAddresses: ["10.2.4.12-10.2.4.255"],
                  destinationPorts: ["443-444", "8443"],
                  destinationFqdns: ["www.amazon.com"],
                  protocols: ["TCP"],
                },
              ],
            },
          },
        ],
      },
    }),
    dependencies: ({}) => ({
      resourceGroup: "myResourceGroup",
      subnets: ["mySubnet"],
      publicIpAddresses: ["myPublicIPAddress"],
      virtualHub: "myVirtualHub",
      firewallPolicy: "myFirewallPolicy",
    }),
  },
];

```

### Create Azure Firewall With Zones
```js
exports.createResources = () => [
  {
    type: "AzureFirewall",
    group: "Network",
    name: "myAzureFirewall",
    properties: () => ({
      location: "West US 2",
      tags: { key1: "value1" },
      zones: ["1", "2", "3"],
      properties: {
        threatIntelMode: "Alert",
        sku: { name: "AZFW_VNet", tier: "Standard" },
        ipConfigurations: [
          {
            name: "azureFirewallIpConfiguration",
            properties: {
              subnet: {
                id: "/subscriptions/subid/resourceGroups/rg1/providers/Microsoft.Network/virtualNetworks/vnet2/subnets/AzureFirewallSubnet",
              },
              publicIPAddress: {
                id: "/subscriptions/subid/resourceGroups/rg1/providers/Microsoft.Network/publicIPAddresses/pipName",
              },
            },
          },
        ],
        applicationRuleCollections: [
          {
            name: "apprulecoll",
            properties: {
              priority: 110,
              action: { type: "Deny" },
              rules: [
                {
                  name: "rule1",
                  description: "Deny inbound rule",
                  protocols: [{ protocolType: "Https", port: 443 }],
                  targetFqdns: ["www.test.com"],
                  sourceAddresses: ["216.58.216.164", "10.0.0.0/24"],
                },
              ],
            },
          },
        ],
        natRuleCollections: [
          {
            name: "natrulecoll",
            properties: {
              priority: 112,
              action: { type: "Dnat" },
              rules: [
                {
                  name: "DNAT-HTTPS-traffic",
                  description: "D-NAT all outbound web traffic for inspection",
                  sourceAddresses: ["*"],
                  destinationAddresses: ["1.2.3.4"],
                  destinationPorts: ["443"],
                  protocols: ["TCP"],
                  translatedAddress: "1.2.3.5",
                  translatedPort: "8443",
                },
                {
                  name: "DNAT-HTTP-traffic-With-FQDN",
                  description: "D-NAT all inbound web traffic for inspection",
                  sourceAddresses: ["*"],
                  destinationAddresses: ["1.2.3.4"],
                  destinationPorts: ["80"],
                  protocols: ["TCP"],
                  translatedFqdn: "internalhttpserver",
                  translatedPort: "880",
                },
              ],
            },
          },
        ],
        networkRuleCollections: [
          {
            name: "netrulecoll",
            properties: {
              priority: 112,
              action: { type: "Deny" },
              rules: [
                {
                  name: "L4-traffic",
                  description: "Block traffic based on source IPs and ports",
                  sourceAddresses: [
                    "192.168.1.1-192.168.1.12",
                    "10.1.4.12-10.1.4.255",
                  ],
                  destinationPorts: ["443-444", "8443"],
                  destinationAddresses: ["*"],
                  protocols: ["TCP"],
                },
                {
                  name: "L4-traffic-with-FQDN",
                  description:
                    "Block traffic based on source IPs and ports to amazon",
                  sourceAddresses: ["10.2.4.12-10.2.4.255"],
                  destinationPorts: ["443-444", "8443"],
                  destinationFqdns: ["www.amazon.com"],
                  protocols: ["TCP"],
                },
              ],
            },
          },
        ],
      },
    }),
    dependencies: ({}) => ({
      resourceGroup: "myResourceGroup",
      subnets: ["mySubnet"],
      publicIpAddresses: ["myPublicIPAddress"],
      virtualHub: "myVirtualHub",
      firewallPolicy: "myFirewallPolicy",
    }),
  },
];

```

### Create Azure Firewall With management subnet
```js
exports.createResources = () => [
  {
    type: "AzureFirewall",
    group: "Network",
    name: "myAzureFirewall",
    properties: () => ({
      tags: { key1: "value1" },
      location: "West US",
      zones: [],
      properties: {
        sku: { name: "AZFW_VNet", tier: "Standard" },
        threatIntelMode: "Alert",
        ipConfigurations: [
          {
            name: "azureFirewallIpConfiguration",
            properties: {
              subnet: {
                id: "/subscriptions/subid/resourceGroups/rg1/providers/Microsoft.Network/virtualNetworks/vnet2/subnets/AzureFirewallSubnet",
              },
              publicIPAddress: {
                id: "/subscriptions/subid/resourceGroups/rg1/providers/Microsoft.Network/publicIPAddresses/pipName",
              },
            },
          },
        ],
        managementIpConfiguration: {
          name: "azureFirewallMgmtIpConfiguration",
          properties: {
            subnet: {
              id: "/subscriptions/subid/resourceGroups/rg1/providers/Microsoft.Network/virtualNetworks/vnet2/subnets/AzureFirewallManagementSubnet",
            },
            publicIPAddress: {
              id: "/subscriptions/subid/resourceGroups/rg1/providers/Microsoft.Network/publicIPAddresses/managementPipName",
            },
          },
        },
        applicationRuleCollections: [
          {
            name: "apprulecoll",
            properties: {
              priority: 110,
              action: { type: "Deny" },
              rules: [
                {
                  name: "rule1",
                  description: "Deny inbound rule",
                  protocols: [{ protocolType: "Https", port: 443 }],
                  targetFqdns: ["www.test.com"],
                  sourceAddresses: ["216.58.216.164", "10.0.0.0/24"],
                },
              ],
            },
          },
        ],
        natRuleCollections: [
          {
            name: "natrulecoll",
            properties: {
              priority: 112,
              action: { type: "Dnat" },
              rules: [
                {
                  name: "DNAT-HTTPS-traffic",
                  description: "D-NAT all outbound web traffic for inspection",
                  sourceAddresses: ["*"],
                  destinationAddresses: ["1.2.3.4"],
                  destinationPorts: ["443"],
                  protocols: ["TCP"],
                  translatedAddress: "1.2.3.5",
                  translatedPort: "8443",
                },
                {
                  name: "DNAT-HTTP-traffic-With-FQDN",
                  description: "D-NAT all inbound web traffic for inspection",
                  sourceAddresses: ["*"],
                  destinationAddresses: ["1.2.3.4"],
                  destinationPorts: ["80"],
                  protocols: ["TCP"],
                  translatedFqdn: "internalhttpserver",
                  translatedPort: "880",
                },
              ],
            },
          },
        ],
        networkRuleCollections: [
          {
            name: "netrulecoll",
            properties: {
              priority: 112,
              action: { type: "Deny" },
              rules: [
                {
                  name: "L4-traffic",
                  description: "Block traffic based on source IPs and ports",
                  sourceAddresses: [
                    "192.168.1.1-192.168.1.12",
                    "10.1.4.12-10.1.4.255",
                  ],
                  destinationPorts: ["443-444", "8443"],
                  destinationAddresses: ["*"],
                  protocols: ["TCP"],
                },
                {
                  name: "L4-traffic-with-FQDN",
                  description:
                    "Block traffic based on source IPs and ports to amazon",
                  sourceAddresses: ["10.2.4.12-10.2.4.255"],
                  destinationPorts: ["443-444", "8443"],
                  destinationFqdns: ["www.amazon.com"],
                  protocols: ["TCP"],
                },
              ],
            },
          },
        ],
      },
    }),
    dependencies: ({}) => ({
      resourceGroup: "myResourceGroup",
      subnets: ["mySubnet"],
      publicIpAddresses: ["myPublicIPAddress"],
      virtualHub: "myVirtualHub",
      firewallPolicy: "myFirewallPolicy",
    }),
  },
];

```

### Create Azure Firewall in virtual Hub
```js
exports.createResources = () => [
  {
    type: "AzureFirewall",
    group: "Network",
    name: "myAzureFirewall",
    properties: () => ({
      tags: { key1: "value1" },
      location: "West US",
      zones: [],
      properties: {
        sku: { name: "AZFW_Hub", tier: "Standard" },
        threatIntelMode: "Alert",
        virtualHub: {
          id: "/subscriptions/subid/resourceGroups/rg1/providers/Microsoft.Network/virtualHubs/hub1",
        },
        firewallPolicy: {
          id: "/subscriptions/subid/resourceGroups/rg1/providers/Microsoft.Network/firewallPolicies/policy1",
        },
        hubIPAddresses: { publicIPs: { addresses: [], count: 1 } },
      },
    }),
    dependencies: ({}) => ({
      resourceGroup: "myResourceGroup",
      subnets: ["mySubnet"],
      publicIpAddresses: ["myPublicIPAddress"],
      virtualHub: "myVirtualHub",
      firewallPolicy: "myFirewallPolicy",
    }),
  },
];

```

### Create Azure Firewall With Additional Properties
```js
exports.createResources = () => [
  {
    type: "AzureFirewall",
    group: "Network",
    name: "myAzureFirewall",
    properties: () => ({
      tags: { key1: "value1" },
      location: "West US",
      zones: [],
      properties: {
        sku: { name: "AZFW_VNet", tier: "Standard" },
        threatIntelMode: "Alert",
        ipConfigurations: [
          {
            name: "azureFirewallIpConfiguration",
            properties: {
              subnet: {
                id: "/subscriptions/subid/resourceGroups/rg1/providers/Microsoft.Network/virtualNetworks/vnet2/subnets/AzureFirewallSubnet",
              },
              publicIPAddress: {
                id: "/subscriptions/subid/resourceGroups/rg1/providers/Microsoft.Network/publicIPAddresses/pipName",
              },
            },
          },
        ],
        applicationRuleCollections: [
          {
            name: "apprulecoll",
            properties: {
              priority: 110,
              action: { type: "Deny" },
              rules: [
                {
                  name: "rule1",
                  description: "Deny inbound rule",
                  protocols: [{ protocolType: "Https", port: 443 }],
                  targetFqdns: ["www.test.com"],
                  sourceAddresses: ["216.58.216.164", "10.0.0.0/24"],
                },
              ],
            },
          },
        ],
        natRuleCollections: [
          {
            name: "natrulecoll",
            properties: {
              priority: 112,
              action: { type: "Dnat" },
              rules: [
                {
                  name: "DNAT-HTTPS-traffic",
                  description: "D-NAT all outbound web traffic for inspection",
                  sourceAddresses: ["*"],
                  destinationAddresses: ["1.2.3.4"],
                  destinationPorts: ["443"],
                  protocols: ["TCP"],
                  translatedAddress: "1.2.3.5",
                  translatedPort: "8443",
                },
                {
                  name: "DNAT-HTTP-traffic-With-FQDN",
                  description: "D-NAT all inbound web traffic for inspection",
                  sourceAddresses: ["*"],
                  destinationAddresses: ["1.2.3.4"],
                  destinationPorts: ["80"],
                  protocols: ["TCP"],
                  translatedFqdn: "internalhttpserver",
                  translatedPort: "880",
                },
              ],
            },
          },
        ],
        networkRuleCollections: [
          {
            name: "netrulecoll",
            properties: {
              priority: 112,
              action: { type: "Deny" },
              rules: [
                {
                  name: "L4-traffic",
                  description: "Block traffic based on source IPs and ports",
                  sourceAddresses: [
                    "192.168.1.1-192.168.1.12",
                    "10.1.4.12-10.1.4.255",
                  ],
                  destinationPorts: ["443-444", "8443"],
                  destinationAddresses: ["*"],
                  protocols: ["TCP"],
                },
                {
                  name: "L4-traffic-with-FQDN",
                  description:
                    "Block traffic based on source IPs and ports to amazon",
                  sourceAddresses: ["10.2.4.12-10.2.4.255"],
                  destinationPorts: ["443-444", "8443"],
                  destinationFqdns: ["www.amazon.com"],
                  protocols: ["TCP"],
                },
              ],
            },
          },
        ],
        ipGroups: [],
        additionalProperties: { key1: "value1", key2: "value2" },
      },
    }),
    dependencies: ({}) => ({
      resourceGroup: "myResourceGroup",
      subnets: ["mySubnet"],
      publicIpAddresses: ["myPublicIPAddress"],
      virtualHub: "myVirtualHub",
      firewallPolicy: "myFirewallPolicy",
    }),
  },
];

```

### Create Azure Firewall With IpGroups
```js
exports.createResources = () => [
  {
    type: "AzureFirewall",
    group: "Network",
    name: "myAzureFirewall",
    properties: () => ({
      tags: { key1: "value1" },
      location: "West US",
      zones: [],
      properties: {
        sku: { name: "AZFW_VNet", tier: "Standard" },
        threatIntelMode: "Alert",
        ipConfigurations: [
          {
            name: "azureFirewallIpConfiguration",
            properties: {
              subnet: {
                id: "/subscriptions/subid/resourceGroups/rg1/providers/Microsoft.Network/virtualNetworks/vnet2/subnets/AzureFirewallSubnet",
              },
              publicIPAddress: {
                id: "/subscriptions/subid/resourceGroups/rg1/providers/Microsoft.Network/publicIPAddresses/pipName",
              },
            },
          },
        ],
        applicationRuleCollections: [
          {
            name: "apprulecoll",
            properties: {
              priority: 110,
              action: { type: "Deny" },
              rules: [
                {
                  name: "rule1",
                  description: "Deny inbound rule",
                  protocols: [{ protocolType: "Https", port: 443 }],
                  targetFqdns: ["www.test.com"],
                  sourceAddresses: ["216.58.216.164", "10.0.0.0/24"],
                },
              ],
            },
          },
        ],
        natRuleCollections: [
          {
            name: "natrulecoll",
            properties: {
              priority: 112,
              action: { type: "Dnat" },
              rules: [
                {
                  name: "DNAT-HTTPS-traffic",
                  description: "D-NAT all outbound web traffic for inspection",
                  sourceAddresses: ["*"],
                  destinationAddresses: ["1.2.3.4"],
                  destinationPorts: ["443"],
                  protocols: ["TCP"],
                  translatedAddress: "1.2.3.5",
                  translatedPort: "8443",
                },
                {
                  name: "DNAT-HTTP-traffic-With-FQDN",
                  description: "D-NAT all inbound web traffic for inspection",
                  sourceAddresses: ["*"],
                  destinationAddresses: ["1.2.3.4"],
                  destinationPorts: ["80"],
                  protocols: ["TCP"],
                  translatedFqdn: "internalhttpserver",
                  translatedPort: "880",
                },
              ],
            },
          },
        ],
        networkRuleCollections: [
          {
            name: "netrulecoll",
            properties: {
              priority: 112,
              action: { type: "Deny" },
              rules: [
                {
                  name: "L4-traffic",
                  description: "Block traffic based on source IPs and ports",
                  sourceAddresses: [
                    "192.168.1.1-192.168.1.12",
                    "10.1.4.12-10.1.4.255",
                  ],
                  destinationPorts: ["443-444", "8443"],
                  destinationAddresses: ["*"],
                  protocols: ["TCP"],
                },
                {
                  name: "L4-traffic-with-FQDN",
                  description:
                    "Block traffic based on source IPs and ports to amazon",
                  sourceAddresses: ["10.2.4.12-10.2.4.255"],
                  destinationPorts: ["443-444", "8443"],
                  destinationFqdns: ["www.amazon.com"],
                  protocols: ["TCP"],
                },
              ],
            },
          },
        ],
      },
    }),
    dependencies: ({}) => ({
      resourceGroup: "myResourceGroup",
      subnets: ["mySubnet"],
      publicIpAddresses: ["myPublicIPAddress"],
      virtualHub: "myVirtualHub",
      firewallPolicy: "myFirewallPolicy",
    }),
  },
];

```
## Dependencies
- [ResourceGroup](../Resources/ResourceGroup.md)
- [Subnet](../Network/Subnet.md)
- [PublicIPAddress](../Network/PublicIPAddress.md)
- [VirtualHub](../Network/VirtualHub.md)
- [FirewallPolicy](../Network/FirewallPolicy.md)
## Swagger Schema
```js
{
  properties: {
    properties: {
      'x-ms-client-flatten': true,
      description: 'Properties of the azure firewall.',
      properties: {
        applicationRuleCollections: {
          type: 'array',
          items: {
            properties: {
              properties: {
                'x-ms-client-flatten': true,
                description: 'Properties of the azure firewall application rule collection.',
                properties: {
                  priority: {
                    type: 'integer',
                    format: 'int32',
                    maximum: 65000,
                    exclusiveMaximum: false,
                    minimum: 100,
                    exclusiveMinimum: false,
                    description: 'Priority of the application rule collection resource.'
                  },
                  action: {
                    description: 'The action type of a rule collection.',
                    properties: {
                      type: {
                        description: 'The type of action.',
                        type: 'string',
                        enum: [ 'Allow', 'Deny' ],
                        'x-ms-enum': {
                          name: 'AzureFirewallRCActionType',
                          modelAsString: true
                        }
                      }
                    }
                  },
                  rules: {
                    type: 'array',
                    items: {
                      properties: {
                        name: {
                          type: 'string',
                          description: 'Name of the application rule.'
                        },
                        description: {
                          type: 'string',
                          description: 'Description of the rule.'
                        },
                        sourceAddresses: {
                          type: 'array',
                          description: 'List of source IP addresses for this rule.',
                          items: { type: 'string' }
                        },
                        protocols: {
                          type: 'array',
                          items: {
                            properties: {
                              protocolType: {
                                description: 'Protocol type.',
                                type: 'string',
                                enum: [Array],
                                'x-ms-enum': [Object]
                              },
                              port: {
                                type: 'integer',
                                format: 'int32',
                                maximum: 64000,
                                exclusiveMaximum: false,
                                minimum: 0,
                                exclusiveMinimum: false,
                                description: 'Port number for the protocol, cannot be greater than 64000. This field is optional.'
                              }
                            },
                            description: 'Properties of the application rule protocol.'
                          },
                          description: 'Array of ApplicationRuleProtocols.'
                        },
                        targetFqdns: {
                          type: 'array',
                          description: 'List of FQDNs for this rule.',
                          items: { type: 'string' }
                        },
                        fqdnTags: {
                          type: 'array',
                          description: 'List of FQDN Tags for this rule.',
                          items: { type: 'string' }
                        },
                        sourceIpGroups: {
                          type: 'array',
                          description: 'List of source IpGroups for this rule.',
                          items: { type: 'string' }
                        }
                      },
                      description: 'Properties of an application rule.'
                    },
                    description: 'Collection of rules used by a application rule collection.'
                  },
                  provisioningState: {
                    readOnly: true,
                    description: 'The provisioning state of the application rule collection resource.',
                    type: 'string',
                    enum: [ 'Succeeded', 'Updating', 'Deleting', 'Failed' ],
                    'x-ms-enum': { name: 'ProvisioningState', modelAsString: true }
                  }
                }
              },
              name: {
                type: 'string',
                description: 'The name of the resource that is unique within the Azure firewall. This name can be used to access the resource.'
              },
              etag: {
                type: 'string',
                readOnly: true,
                description: 'A unique read-only string that changes whenever the resource is updated.'
              }
            },
            allOf: [
              {
                properties: { id: { type: 'string', description: 'Resource ID.' } },
                description: 'Reference to another subresource.',
                'x-ms-azure-resource': true
              }
            ],
            description: 'Application rule collection resource.'
          },
          description: 'Collection of application rule collections used by Azure Firewall.'
        },
        natRuleCollections: {
          type: 'array',
          items: {
            properties: {
              properties: {
                'x-ms-client-flatten': true,
                description: 'Properties of the azure firewall NAT rule collection.',
                properties: {
                  priority: {
                    type: 'integer',
                    format: 'int32',
                    maximum: 65000,
                    exclusiveMaximum: false,
                    minimum: 100,
                    exclusiveMinimum: false,
                    description: 'Priority of the NAT rule collection resource.'
                  },
                  action: {
                    description: 'The action type of a NAT rule collection.',
                    properties: {
                      type: {
                        description: 'The type of action.',
                        type: 'string',
                        enum: [ 'Snat', 'Dnat' ],
                        'x-ms-enum': {
                          name: 'AzureFirewallNatRCActionType',
                          modelAsString: true
                        }
                      }
                    }
                  },
                  rules: {
                    type: 'array',
                    items: {
                      properties: {
                        name: {
                          type: 'string',
                          description: 'Name of the NAT rule.'
                        },
                        description: {
                          type: 'string',
                          description: 'Description of the rule.'
                        },
                        sourceAddresses: {
                          type: 'array',
                          description: 'List of source IP addresses for this rule.',
                          items: { type: 'string' }
                        },
                        destinationAddresses: {
                          type: 'array',
                          description: 'List of destination IP addresses for this rule. Supports IP ranges, prefixes, and service tags.',
                          items: { type: 'string' }
                        },
                        destinationPorts: {
                          type: 'array',
                          description: 'List of destination ports.',
                          items: { type: 'string' }
                        },
                        protocols: {
                          type: 'array',
                          items: {
                            type: 'string',
                            description: 'The protocol of a Network Rule resource.',
                            enum: [ 'TCP', 'UDP', 'Any', 'ICMP' ],
                            'x-ms-enum': {
                              name: 'AzureFirewallNetworkRuleProtocol',
                              modelAsString: true
                            }
                          },
                          description: 'Array of AzureFirewallNetworkRuleProtocols applicable to this NAT rule.'
                        },
                        translatedAddress: {
                          type: 'string',
                          description: 'The translated address for this NAT rule.'
                        },
                        translatedPort: {
                          type: 'string',
                          description: 'The translated port for this NAT rule.'
                        },
                        translatedFqdn: {
                          type: 'string',
                          description: 'The translated FQDN for this NAT rule.'
                        },
                        sourceIpGroups: {
                          type: 'array',
                          description: 'List of source IpGroups for this rule.',
                          items: { type: 'string' }
                        }
                      },
                      description: 'Properties of a NAT rule.'
                    },
                    description: 'Collection of rules used by a NAT rule collection.'
                  },
                  provisioningState: {
                    readOnly: true,
                    description: 'The provisioning state of the NAT rule collection resource.',
                    type: 'string',
                    enum: [ 'Succeeded', 'Updating', 'Deleting', 'Failed' ],
                    'x-ms-enum': { name: 'ProvisioningState', modelAsString: true }
                  }
                }
              },
              name: {
                type: 'string',
                description: 'The name of the resource that is unique within the Azure firewall. This name can be used to access the resource.'
              },
              etag: {
                type: 'string',
                readOnly: true,
                description: 'A unique read-only string that changes whenever the resource is updated.'
              }
            },
            allOf: [
              {
                properties: { id: { type: 'string', description: 'Resource ID.' } },
                description: 'Reference to another subresource.',
                'x-ms-azure-resource': true
              }
            ],
            description: 'NAT rule collection resource.'
          },
          description: 'Collection of NAT rule collections used by Azure Firewall.'
        },
        networkRuleCollections: {
          type: 'array',
          items: {
            properties: {
              properties: {
                'x-ms-client-flatten': true,
                description: 'Properties of the azure firewall network rule collection.',
                properties: {
                  priority: {
                    type: 'integer',
                    format: 'int32',
                    maximum: 65000,
                    exclusiveMaximum: false,
                    minimum: 100,
                    exclusiveMinimum: false,
                    description: 'Priority of the network rule collection resource.'
                  },
                  action: {
                    description: 'The action type of a rule collection.',
                    properties: {
                      type: {
                        description: 'The type of action.',
                        type: 'string',
                        enum: [ 'Allow', 'Deny' ],
                        'x-ms-enum': {
                          name: 'AzureFirewallRCActionType',
                          modelAsString: true
                        }
                      }
                    }
                  },
                  rules: {
                    type: 'array',
                    items: {
                      properties: {
                        name: {
                          type: 'string',
                          description: 'Name of the network rule.'
                        },
                        description: {
                          type: 'string',
                          description: 'Description of the rule.'
                        },
                        protocols: {
                          type: 'array',
                          items: {
                            type: 'string',
                            description: 'The protocol of a Network Rule resource.',
                            enum: [ 'TCP', 'UDP', 'Any', 'ICMP' ],
                            'x-ms-enum': {
                              name: 'AzureFirewallNetworkRuleProtocol',
                              modelAsString: true
                            }
                          },
                          description: 'Array of AzureFirewallNetworkRuleProtocols.'
                        },
                        sourceAddresses: {
                          type: 'array',
                          description: 'List of source IP addresses for this rule.',
                          items: { type: 'string' }
                        },
                        destinationAddresses: {
                          type: 'array',
                          description: 'List of destination IP addresses.',
                          items: { type: 'string' }
                        },
                        destinationPorts: {
                          type: 'array',
                          description: 'List of destination ports.',
                          items: { type: 'string' }
                        },
                        destinationFqdns: {
                          type: 'array',
                          description: 'List of destination FQDNs.',
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
                      description: 'Properties of the network rule.'
                    },
                    description: 'Collection of rules used by a network rule collection.'
                  },
                  provisioningState: {
                    readOnly: true,
                    description: 'The provisioning state of the network rule collection resource.',
                    type: 'string',
                    enum: [ 'Succeeded', 'Updating', 'Deleting', 'Failed' ],
                    'x-ms-enum': { name: 'ProvisioningState', modelAsString: true }
                  }
                }
              },
              name: {
                type: 'string',
                description: 'The name of the resource that is unique within the Azure firewall. This name can be used to access the resource.'
              },
              etag: {
                type: 'string',
                readOnly: true,
                description: 'A unique read-only string that changes whenever the resource is updated.'
              }
            },
            allOf: [
              {
                properties: { id: { type: 'string', description: 'Resource ID.' } },
                description: 'Reference to another subresource.',
                'x-ms-azure-resource': true
              }
            ],
            description: 'Network rule collection resource.'
          },
          description: 'Collection of network rule collections used by Azure Firewall.'
        },
        ipConfigurations: {
          type: 'array',
          items: {
            properties: {
              properties: {
                'x-ms-client-flatten': true,
                description: 'Properties of the azure firewall IP configuration.',
                properties: {
                  privateIPAddress: {
                    type: 'string',
                    readOnly: true,
                    description: 'The Firewall Internal Load Balancer IP to be used as the next hop in User Defined Routes.'
                  },
                  subnet: {
                    properties: {
                      id: { type: 'string', description: 'Resource ID.' }
                    },
                    description: 'Reference to another subresource.',
                    'x-ms-azure-resource': true
                  },
                  publicIPAddress: {
                    properties: {
                      id: { type: 'string', description: 'Resource ID.' }
                    },
                    description: 'Reference to another subresource.',
                    'x-ms-azure-resource': true
                  },
                  provisioningState: {
                    readOnly: true,
                    description: 'The provisioning state of the Azure firewall IP configuration resource.',
                    type: 'string',
                    enum: [ 'Succeeded', 'Updating', 'Deleting', 'Failed' ],
                    'x-ms-enum': { name: 'ProvisioningState', modelAsString: true }
                  }
                }
              },
              name: {
                type: 'string',
                description: 'Name of the resource that is unique within a resource group. This name can be used to access the resource.'
              },
              etag: {
                type: 'string',
                readOnly: true,
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
                properties: { id: { type: 'string', description: 'Resource ID.' } },
                description: 'Reference to another subresource.',
                'x-ms-azure-resource': true
              }
            ],
            description: 'IP configuration of an Azure Firewall.'
          },
          description: 'IP configuration of the Azure Firewall resource.'
        },
        managementIpConfiguration: {
          properties: {
            properties: {
              'x-ms-client-flatten': true,
              description: 'Properties of the azure firewall IP configuration.',
              properties: {
                privateIPAddress: {
                  type: 'string',
                  readOnly: true,
                  description: 'The Firewall Internal Load Balancer IP to be used as the next hop in User Defined Routes.'
                },
                subnet: {
                  properties: {
                    id: { type: 'string', description: 'Resource ID.' }
                  },
                  description: 'Reference to another subresource.',
                  'x-ms-azure-resource': true
                },
                publicIPAddress: {
                  properties: {
                    id: { type: 'string', description: 'Resource ID.' }
                  },
                  description: 'Reference to another subresource.',
                  'x-ms-azure-resource': true
                },
                provisioningState: {
                  readOnly: true,
                  description: 'The provisioning state of the Azure firewall IP configuration resource.',
                  type: 'string',
                  enum: [ 'Succeeded', 'Updating', 'Deleting', 'Failed' ],
                  'x-ms-enum': { name: 'ProvisioningState', modelAsString: true }
                }
              }
            },
            name: {
              type: 'string',
              description: 'Name of the resource that is unique within a resource group. This name can be used to access the resource.'
            },
            etag: {
              type: 'string',
              readOnly: true,
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
              properties: { id: { type: 'string', description: 'Resource ID.' } },
              description: 'Reference to another subresource.',
              'x-ms-azure-resource': true
            }
          ],
          description: 'IP configuration of an Azure Firewall.'
        },
        provisioningState: {
          readOnly: true,
          description: 'The provisioning state of the Azure firewall resource.',
          type: 'string',
          enum: [ 'Succeeded', 'Updating', 'Deleting', 'Failed' ],
          'x-ms-enum': { name: 'ProvisioningState', modelAsString: true }
        },
        threatIntelMode: {
          description: 'The operation mode for Threat Intelligence.',
          type: 'string',
          enum: [ 'Alert', 'Deny', 'Off' ],
          'x-ms-enum': { name: 'AzureFirewallThreatIntelMode', modelAsString: true }
        },
        virtualHub: {
          properties: { id: { type: 'string', description: 'Resource ID.' } },
          description: 'Reference to another subresource.',
          'x-ms-azure-resource': true
        },
        firewallPolicy: {
          properties: { id: { type: 'string', description: 'Resource ID.' } },
          description: 'Reference to another subresource.',
          'x-ms-azure-resource': true
        },
        hubIPAddresses: {
          description: 'IP addresses associated with AzureFirewall.',
          properties: {
            publicIPs: {
              description: 'Public IP addresses associated with azure firewall.',
              properties: {
                addresses: {
                  type: 'array',
                  description: 'The list of Public IP addresses associated with azure firewall or IP addresses to be retained.',
                  items: {
                    properties: {
                      address: {
                        type: 'string',
                        description: 'Public IP Address value.'
                      }
                    },
                    description: 'Public IP Address associated with azure firewall.'
                  }
                },
                count: {
                  type: 'integer',
                  format: 'int32',
                  description: 'The number of Public IP addresses associated with azure firewall.'
                }
              }
            },
            privateIPAddress: {
              type: 'string',
              description: 'Private IP Address associated with azure firewall.'
            }
          }
        },
        ipGroups: {
          readOnly: true,
          description: 'IpGroups associated with AzureFirewall.',
          type: 'array',
          items: {
            properties: {
              id: {
                type: 'string',
                readOnly: true,
                description: 'Resource ID.'
              },
              changeNumber: {
                type: 'string',
                readOnly: true,
                description: 'The iteration number.'
              }
            },
            description: 'IpGroups associated with azure firewall.'
          }
        },
        sku: {
          description: 'The Azure Firewall Resource SKU.',
          properties: {
            name: {
              type: 'string',
              description: 'Name of an Azure Firewall SKU.',
              enum: [ 'AZFW_VNet', 'AZFW_Hub' ],
              'x-ms-enum': { name: 'AzureFirewallSkuName', modelAsString: true }
            },
            tier: {
              type: 'string',
              description: 'Tier of an Azure Firewall.',
              enum: [ 'Standard', 'Premium', 'Basic' ],
              'x-ms-enum': { name: 'AzureFirewallSkuTier', modelAsString: true }
            }
          }
        },
        additionalProperties: {
          description: 'The additional properties used to further config this azure firewall.',
          type: 'object',
          additionalProperties: { type: 'string' }
        }
      }
    },
    zones: {
      type: 'array',
      items: { type: 'string' },
      description: 'A list of availability zones denoting where the resource needs to come from.'
    },
    etag: {
      type: 'string',
      readOnly: true,
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
  ],
  description: 'Azure Firewall resource.'
}
```
## Misc
The resource version is `2021-05-01`.

The Swagger schema used to generate this documentation can be found [here](https://github.com/Azure/azure-rest-api-specs/tree/main/specification/network/resource-manager/Microsoft.Network/stable/2021-05-01/azureFirewall.json).
