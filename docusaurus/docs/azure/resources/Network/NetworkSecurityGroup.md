---
id: NetworkSecurityGroup
title: NetworkSecurityGroup
---
Provides a **NetworkSecurityGroup** from the **Network** group
## Examples
### Create network security group
```js
provider.Network.makeNetworkSecurityGroup({
  name: "myNetworkSecurityGroup",
  properties: () => ({ location: "eastus" }),
  dependencies: ({ resources }) => ({
    resourceGroup: resources.Resources.ResourceGroup["myResourceGroup"],
  }),
});

```

### Create network security group with rule
```js
provider.Network.makeNetworkSecurityGroup({
  name: "myNetworkSecurityGroup",
  properties: () => ({
    properties: {
      securityRules: [
        {
          name: "rule1",
          properties: {
            protocol: "*",
            sourceAddressPrefix: "*",
            destinationAddressPrefix: "*",
            access: "Allow",
            destinationPortRange: "80",
            sourcePortRange: "*",
            priority: 130,
            direction: "Inbound",
          },
        },
      ],
    },
    location: "eastus",
  }),
  dependencies: ({ resources }) => ({
    resourceGroup: resources.Resources.ResourceGroup["myResourceGroup"],
  }),
});

```
## Dependencies
- [ResourceGroup](../Resources/ResourceGroup.md)
## Swagger Schema
```js
{
  properties: <ref *1> {
    properties: {
      'x-ms-client-flatten': true,
      description: 'Properties of the network security group.',
      properties: {
        securityRules: {
          type: 'array',
          items: {
            properties: {
              properties: {
                'x-ms-client-flatten': true,
                description: 'Properties of the security rule.',
                properties: {
                  description: {
                    type: 'string',
                    description: 'A description for this rule. Restricted to 140 chars.'
                  },
                  protocol: {
                    type: 'string',
                    description: 'Network protocol this rule applies to.',
                    enum: [ 'Tcp', 'Udp', 'Icmp', 'Esp', '*', 'Ah' ],
                    'x-ms-enum': {
                      name: 'SecurityRuleProtocol',
                      modelAsString: true
                    }
                  },
                  sourcePortRange: {
                    type: 'string',
                    description: "The source port or range. Integer or range between 0 and 65535. Asterisk '*' can also be used to match all ports."
                  },
                  destinationPortRange: {
                    type: 'string',
                    description: "The destination port or range. Integer or range between 0 and 65535. Asterisk '*' can also be used to match all ports."
                  },
                  sourceAddressPrefix: {
                    type: 'string',
                    description: "The CIDR or source IP range. Asterisk '*' can also be used to match all source IPs. Default tags such as 'VirtualNetwork', 'AzureLoadBalancer' and 'Internet' can also be used. If this is an ingress rule, specifies where network traffic originates from."
                  },
                  sourceAddressPrefixes: {
                    type: 'array',
                    items: { type: 'string' },
                    description: 'The CIDR or source IP ranges.'
                  },
                  sourceApplicationSecurityGroups: {
                    type: 'array',
                    items: {
                      properties: [Object],
                      allOf: [Array],
                      description: 'An application security group in a resource group.'
                    },
                    description: 'The application security group specified as source.'
                  },
                  destinationAddressPrefix: {
                    type: 'string',
                    description: "The destination address prefix. CIDR or destination IP range. Asterisk '*' can also be used to match all source IPs. Default tags such as 'VirtualNetwork', 'AzureLoadBalancer' and 'Internet' can also be used."
                  },
                  destinationAddressPrefixes: {
                    type: 'array',
                    items: { type: 'string' },
                    description: 'The destination address prefixes. CIDR or destination IP ranges.'
                  },
                  destinationApplicationSecurityGroups: {
                    type: 'array',
                    items: {
                      properties: [Object],
                      allOf: [Array],
                      description: 'An application security group in a resource group.'
                    },
                    description: 'The application security group specified as destination.'
                  },
                  sourcePortRanges: {
                    type: 'array',
                    items: { type: 'string', description: 'The source port.' },
                    description: 'The source port ranges.'
                  },
                  destinationPortRanges: {
                    type: 'array',
                    items: {
                      type: 'string',
                      description: 'The destination port.'
                    },
                    description: 'The destination port ranges.'
                  },
                  access: {
                    description: 'The network traffic is allowed or denied.',
                    type: 'string',
                    enum: [ 'Allow', 'Deny' ],
                    'x-ms-enum': { name: 'SecurityRuleAccess', modelAsString: true }
                  },
                  priority: {
                    type: 'integer',
                    format: 'int32',
                    description: 'The priority of the rule. The value can be between 100 and 4096. The priority number must be unique for each rule in the collection. The lower the priority number, the higher the priority of the rule.'
                  },
                  direction: {
                    description: 'The direction of the rule. The direction specifies if rule will be evaluated on incoming or outgoing traffic.',
                    type: 'string',
                    enum: [ 'Inbound', 'Outbound' ],
                    'x-ms-enum': {
                      name: 'SecurityRuleDirection',
                      modelAsString: true
                    }
                  },
                  provisioningState: {
                    readOnly: true,
                    description: 'The provisioning state of the security rule resource.',
                    type: 'string',
                    enum: [ 'Succeeded', 'Updating', 'Deleting', 'Failed' ],
                    'x-ms-enum': { name: 'ProvisioningState', modelAsString: true }
                  }
                },
                required: [ 'protocol', 'access', 'direction' ]
              },
              name: {
                type: 'string',
                description: 'The name of the resource that is unique within a resource group. This name can be used to access the resource.'
              },
              etag: {
                readOnly: true,
                type: 'string',
                description: 'A unique read-only string that changes whenever the resource is updated.'
              },
              type: {
                type: 'string',
                description: 'The type of the resource.'
              }
            },
            allOf: [
              {
                properties: { id: { type: 'string', description: 'Resource ID.' } },
                description: 'Reference to another subresource.',
                'x-ms-azure-resource': true
              }
            ],
            description: 'Network security rule.'
          },
          description: 'A collection of security rules of the network security group.'
        },
        defaultSecurityRules: {
          readOnly: true,
          type: 'array',
          items: {
            properties: {
              properties: {
                'x-ms-client-flatten': true,
                description: 'Properties of the security rule.',
                properties: {
                  description: {
                    type: 'string',
                    description: 'A description for this rule. Restricted to 140 chars.'
                  },
                  protocol: {
                    type: 'string',
                    description: 'Network protocol this rule applies to.',
                    enum: [ 'Tcp', 'Udp', 'Icmp', 'Esp', '*', 'Ah' ],
                    'x-ms-enum': {
                      name: 'SecurityRuleProtocol',
                      modelAsString: true
                    }
                  },
                  sourcePortRange: {
                    type: 'string',
                    description: "The source port or range. Integer or range between 0 and 65535. Asterisk '*' can also be used to match all ports."
                  },
                  destinationPortRange: {
                    type: 'string',
                    description: "The destination port or range. Integer or range between 0 and 65535. Asterisk '*' can also be used to match all ports."
                  },
                  sourceAddressPrefix: {
                    type: 'string',
                    description: "The CIDR or source IP range. Asterisk '*' can also be used to match all source IPs. Default tags such as 'VirtualNetwork', 'AzureLoadBalancer' and 'Internet' can also be used. If this is an ingress rule, specifies where network traffic originates from."
                  },
                  sourceAddressPrefixes: {
                    type: 'array',
                    items: { type: 'string' },
                    description: 'The CIDR or source IP ranges.'
                  },
                  sourceApplicationSecurityGroups: {
                    type: 'array',
                    items: {
                      properties: [Object],
                      allOf: [Array],
                      description: 'An application security group in a resource group.'
                    },
                    description: 'The application security group specified as source.'
                  },
                  destinationAddressPrefix: {
                    type: 'string',
                    description: "The destination address prefix. CIDR or destination IP range. Asterisk '*' can also be used to match all source IPs. Default tags such as 'VirtualNetwork', 'AzureLoadBalancer' and 'Internet' can also be used."
                  },
                  destinationAddressPrefixes: {
                    type: 'array',
                    items: { type: 'string' },
                    description: 'The destination address prefixes. CIDR or destination IP ranges.'
                  },
                  destinationApplicationSecurityGroups: {
                    type: 'array',
                    items: {
                      properties: [Object],
                      allOf: [Array],
                      description: 'An application security group in a resource group.'
                    },
                    description: 'The application security group specified as destination.'
                  },
                  sourcePortRanges: {
                    type: 'array',
                    items: { type: 'string', description: 'The source port.' },
                    description: 'The source port ranges.'
                  },
                  destinationPortRanges: {
                    type: 'array',
                    items: {
                      type: 'string',
                      description: 'The destination port.'
                    },
                    description: 'The destination port ranges.'
                  },
                  access: {
                    description: 'The network traffic is allowed or denied.',
                    type: 'string',
                    enum: [ 'Allow', 'Deny' ],
                    'x-ms-enum': { name: 'SecurityRuleAccess', modelAsString: true }
                  },
                  priority: {
                    type: 'integer',
                    format: 'int32',
                    description: 'The priority of the rule. The value can be between 100 and 4096. The priority number must be unique for each rule in the collection. The lower the priority number, the higher the priority of the rule.'
                  },
                  direction: {
                    description: 'The direction of the rule. The direction specifies if rule will be evaluated on incoming or outgoing traffic.',
                    type: 'string',
                    enum: [ 'Inbound', 'Outbound' ],
                    'x-ms-enum': {
                      name: 'SecurityRuleDirection',
                      modelAsString: true
                    }
                  },
                  provisioningState: {
                    readOnly: true,
                    description: 'The provisioning state of the security rule resource.',
                    type: 'string',
                    enum: [ 'Succeeded', 'Updating', 'Deleting', 'Failed' ],
                    'x-ms-enum': { name: 'ProvisioningState', modelAsString: true }
                  }
                },
                required: [ 'protocol', 'access', 'direction' ]
              },
              name: {
                type: 'string',
                description: 'The name of the resource that is unique within a resource group. This name can be used to access the resource.'
              },
              etag: {
                readOnly: true,
                type: 'string',
                description: 'A unique read-only string that changes whenever the resource is updated.'
              },
              type: {
                type: 'string',
                description: 'The type of the resource.'
              }
            },
            allOf: [
              {
                properties: { id: { type: 'string', description: 'Resource ID.' } },
                description: 'Reference to another subresource.',
                'x-ms-azure-resource': true
              }
            ],
            description: 'Network security rule.'
          },
          description: 'The default security rules of network security group.'
        },
        networkInterfaces: {
          readOnly: true,
          type: 'array',
          items: {
            properties: {
              extendedLocation: {
                description: 'The extended location of the network interface.',
                properties: {
                  name: {
                    type: 'string',
                    description: 'The name of the extended location.'
                  },
                  type: {
                    description: 'The type of the extended location.',
                    type: 'string',
                    enum: [ 'EdgeZone' ],
                    'x-ms-enum': {
                      name: 'ExtendedLocationTypes',
                      modelAsString: true
                    }
                  }
                }
              },
              properties: {
                'x-ms-client-flatten': true,
                description: 'Properties of the network interface.',
                properties: {
                  virtualMachine: {
                    properties: { id: [Object] },
                    description: 'Reference to another subresource.',
                    'x-ms-azure-resource': true,
                    readOnly: true
                  },
                  networkSecurityGroup: {
                    description: 'The reference to the NetworkSecurityGroup resource.',
                    properties: [Circular *1],
                    allOf: [ [Object] ]
                  },
                  privateEndpoint: {
                    readOnly: true,
                    description: 'A reference to the private endpoint to which the network interface is linked.',
                    properties: {
                      extendedLocation: [Object],
                      properties: [Object],
                      etag: [Object]
                    },
                    allOf: [ [Object] ]
                  },
                  ipConfigurations: {
                    type: 'array',
                    items: {
                      properties: [Object],
                      allOf: [Array],
                      description: 'IPConfiguration in a network interface.'
                    },
                    description: 'A list of IPConfigurations of the network interface.'
                  },
                  tapConfigurations: {
                    readOnly: true,
                    type: 'array',
                    items: {
                      properties: [Object],
                      allOf: [Array],
                      description: 'Tap configuration in a Network Interface.'
                    },
                    description: 'A list of TapConfigurations of the network interface.'
                  },
                  dnsSettings: {
                    description: 'The DNS settings in network interface.',
                    properties: {
                      dnsServers: [Object],
                      appliedDnsServers: [Object],
                      internalDnsNameLabel: [Object],
                      internalFqdn: [Object],
                      internalDomainNameSuffix: [Object]
                    }
                  },
                  macAddress: {
                    readOnly: true,
                    type: 'string',
                    description: 'The MAC address of the network interface.'
                  },
                  primary: {
                    readOnly: true,
                    type: 'boolean',
                    description: 'Whether this is a primary network interface on a virtual machine.'
                  },
                  vnetEncryptionSupported: {
                    readOnly: true,
                    type: 'boolean',
                    description: 'Whether the virtual machine this nic is attached to supports encryption.'
                  },
                  enableAcceleratedNetworking: {
                    type: 'boolean',
                    description: 'If the network interface is accelerated networking enabled.'
                  },
                  enableIPForwarding: {
                    type: 'boolean',
                    description: 'Indicates whether IP forwarding is enabled on this network interface.'
                  },
                  hostedWorkloads: {
                    type: 'array',
                    items: { type: 'string' },
                    readOnly: true,
                    description: 'A list of references to linked BareMetal resources.'
                  },
                  dscpConfiguration: {
                    properties: { id: [Object] },
                    description: 'Reference to another subresource.',
                    'x-ms-azure-resource': true,
                    readOnly: true
                  },
                  resourceGuid: {
                    readOnly: true,
                    type: 'string',
                    description: 'The resource GUID property of the network interface resource.'
                  },
                  provisioningState: {
                    readOnly: true,
                    description: 'The provisioning state of the network interface resource.',
                    type: 'string',
                    enum: [ 'Succeeded', 'Updating', 'Deleting', 'Failed' ],
                    'x-ms-enum': { name: 'ProvisioningState', modelAsString: true }
                  },
                  workloadType: {
                    type: 'string',
                    description: 'WorkloadType of the NetworkInterface for BareMetal resources'
                  },
                  nicType: {
                    type: 'string',
                    description: 'Type of Network Interface resource.',
                    enum: [ 'Standard', 'Elastic' ],
                    'x-ms-enum': {
                      name: 'NetworkInterfaceNicType',
                      modelAsString: true
                    }
                  },
                  privateLinkService: {
                    description: 'Privatelinkservice of the network interface resource.',
                    properties: {
                      extendedLocation: [Object],
                      properties: [Object],
                      etag: [Object]
                    },
                    allOf: [ [Object] ]
                  },
                  migrationPhase: {
                    type: 'string',
                    description: 'Migration phase of Network Interface resource.',
                    enum: [
                      'None',
                      'Prepare',
                      'Commit',
                      'Abort',
                      'Committed'
                    ],
                    'x-ms-enum': {
                      name: 'NetworkInterfaceMigrationPhase',
                      modelAsString: true
                    }
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
            ],
            description: 'A network interface in a resource group.'
          },
          description: 'A collection of references to network interfaces.'
        },
        subnets: {
          readOnly: true,
          type: 'array',
          items: {
            properties: {
              properties: {
                'x-ms-client-flatten': true,
                description: 'Properties of the subnet.',
                properties: {
                  addressPrefix: {
                    type: 'string',
                    description: 'The address prefix for the subnet.'
                  },
                  addressPrefixes: {
                    type: 'array',
                    items: { type: 'string' },
                    description: 'List of address prefixes for the subnet.'
                  },
                  networkSecurityGroup: {
                    description: 'The reference to the NetworkSecurityGroup resource.',
                    properties: [Circular *1],
                    allOf: [ [Object] ]
                  },
                  routeTable: {
                    description: 'The reference to the RouteTable resource.',
                    properties: { properties: [Object], etag: [Object] },
                    allOf: [ [Object] ]
                  },
                  natGateway: {
                    properties: { id: [Object] },
                    description: 'Reference to another subresource.',
                    'x-ms-azure-resource': true
                  },
                  serviceEndpoints: {
                    type: 'array',
                    items: {
                      properties: [Object],
                      description: 'The service endpoint properties.'
                    },
                    description: 'An array of service endpoints.'
                  },
                  serviceEndpointPolicies: {
                    type: 'array',
                    items: {
                      properties: [Object],
                      allOf: [Array],
                      description: 'Service End point policy resource.'
                    },
                    description: 'An array of service endpoint policies.'
                  },
                  privateEndpoints: {
                    readOnly: true,
                    type: 'array',
                    items: {
                      properties: [Object],
                      allOf: [Array],
                      description: 'Private endpoint resource.'
                    },
                    description: 'An array of references to private endpoints.'
                  },
                  ipConfigurations: {
                    readOnly: true,
                    type: 'array',
                    items: {
                      properties: [Object],
                      allOf: [Array],
                      description: 'IP configuration.'
                    },
                    description: 'An array of references to the network interface IP configurations using subnet.'
                  },
                  ipConfigurationProfiles: {
                    readOnly: true,
                    type: 'array',
                    items: {
                      properties: [Object],
                      allOf: [Array],
                      description: 'IP configuration profile child resource.'
                    },
                    description: 'Array of IP configuration profiles which reference this subnet.'
                  },
                  ipAllocations: {
                    type: 'array',
                    items: {
                      properties: [Object],
                      description: 'Reference to another subresource.',
                      'x-ms-azure-resource': true
                    },
                    description: 'Array of IpAllocation which reference this subnet.'
                  },
                  resourceNavigationLinks: {
                    readOnly: true,
                    type: 'array',
                    items: {
                      properties: [Object],
                      allOf: [Array],
                      description: 'ResourceNavigationLink resource.'
                    },
                    description: 'An array of references to the external resources using subnet.'
                  },
                  serviceAssociationLinks: {
                    readOnly: true,
                    type: 'array',
                    items: {
                      properties: [Object],
                      allOf: [Array],
                      description: 'ServiceAssociationLink resource.'
                    },
                    description: 'An array of references to services injecting into this subnet.'
                  },
                  delegations: {
                    type: 'array',
                    items: {
                      properties: [Object],
                      allOf: [Array],
                      description: 'Details the service to which the subnet is delegated.'
                    },
                    description: 'An array of references to the delegations on the subnet.'
                  },
                  purpose: {
                    type: 'string',
                    readOnly: true,
                    description: 'A read-only string identifying the intention of use for this subnet based on delegations and other user-defined properties.'
                  },
                  provisioningState: {
                    readOnly: true,
                    description: 'The provisioning state of the subnet resource.',
                    type: 'string',
                    enum: [ 'Succeeded', 'Updating', 'Deleting', 'Failed' ],
                    'x-ms-enum': { name: 'ProvisioningState', modelAsString: true }
                  },
                  privateEndpointNetworkPolicies: {
                    type: 'string',
                    default: 'Enabled',
                    description: 'Enable or Disable apply network policies on private end point in the subnet.',
                    enum: [ 'Enabled', 'Disabled' ],
                    'x-ms-enum': {
                      name: 'VirtualNetworkPrivateEndpointNetworkPolicies',
                      modelAsString: true
                    }
                  },
                  privateLinkServiceNetworkPolicies: {
                    type: 'string',
                    default: 'Enabled',
                    description: 'Enable or Disable apply network policies on private link service in the subnet.',
                    enum: [ 'Enabled', 'Disabled' ],
                    'x-ms-enum': {
                      name: 'VirtualNetworkPrivateLinkServiceNetworkPolicies',
                      modelAsString: true
                    }
                  },
                  applicationGatewayIpConfigurations: {
                    type: 'array',
                    items: {
                      properties: [Object],
                      allOf: [Array],
                      description: 'IP configuration of an application gateway. Currently 1 public and 1 private IP configuration is allowed.'
                    },
                    description: 'Application gateway IP configurations of virtual network resource.'
                  }
                }
              },
              name: {
                type: 'string',
                description: 'The name of the resource that is unique within a resource group. This name can be used to access the resource.'
              },
              etag: {
                readOnly: true,
                type: 'string',
                description: 'A unique read-only string that changes whenever the resource is updated.'
              },
              type: { type: 'string', description: 'Resource type.' }
            },
            allOf: [
              {
                properties: { id: { type: 'string', description: 'Resource ID.' } },
                description: 'Reference to another subresource.',
                'x-ms-azure-resource': true
              }
            ],
            description: 'Subnet in a virtual network resource.'
          },
          description: 'A collection of references to subnets.'
        },
        flowLogs: {
          readOnly: true,
          type: 'array',
          items: {
            properties: {
              properties: {
                'x-ms-client-flatten': true,
                description: 'Properties of the flow log.',
                required: [ 'targetResourceId', 'storageId' ],
                properties: {
                  targetResourceId: {
                    description: 'ID of network security group to which flow log will be applied.',
                    type: 'string'
                  },
                  targetResourceGuid: {
                    readOnly: true,
                    description: 'Guid of network security group to which flow log will be applied.',
                    type: 'string'
                  },
                  storageId: {
                    description: 'ID of the storage account which is used to store the flow log.',
                    type: 'string'
                  },
                  enabled: {
                    description: 'Flag to enable/disable flow logging.',
                    type: 'boolean'
                  },
                  retentionPolicy: {
                    description: 'Parameters that define the retention policy for flow log.',
                    properties: { days: [Object], enabled: [Object] }
                  },
                  format: {
                    description: 'Parameters that define the flow log format.',
                    properties: { type: [Object], version: [Object] }
                  },
                  flowAnalyticsConfiguration: {
                    description: 'Parameters that define the configuration of traffic analytics.',
                    properties: {
                      networkWatcherFlowAnalyticsConfiguration: [Object]
                    }
                  },
                  provisioningState: {
                    readOnly: true,
                    description: 'The provisioning state of the flow log.',
                    type: 'string',
                    enum: [ 'Succeeded', 'Updating', 'Deleting', 'Failed' ],
                    'x-ms-enum': { name: 'ProvisioningState', modelAsString: true }
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
            ],
            description: 'A flow log resource.'
          },
          description: 'A collection of references to flow log resources.'
        },
        resourceGuid: {
          readOnly: true,
          type: 'string',
          description: 'The resource GUID property of the network security group resource.'
        },
        provisioningState: {
          readOnly: true,
          description: 'The provisioning state of the network security group resource.',
          type: 'string',
          enum: [ 'Succeeded', 'Updating', 'Deleting', 'Failed' ],
          'x-ms-enum': { name: 'ProvisioningState', modelAsString: true }
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
  ],
  description: 'NetworkSecurityGroup resource.'
}
```
## Misc
The resource version is `2021-05-01`.

The Swagger schema used to generate this documentation can be found [here](https://github.com/Azure/azure-rest-api-specs/tree/main/specification/network/resource-manager/Microsoft.Network/stable/2021-05-01/networkSecurityGroup.json).
