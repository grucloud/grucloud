---
id: PrivateLinkService
title: PrivateLinkService
---
Provides a **PrivateLinkService** from the **Network** group
## Examples
### Create private link service
```js
exports.createResources = () => [
  {
    type: "PrivateLinkService",
    group: "Network",
    name: "myPrivateLinkService",
    properties: () => ({ type: "EdgeZone", name: "edgeZone0" }),
    dependencies: ({}) => ({
      resourceGroup: "myResourceGroup",
      natGateway: "myNatGateway",
      ddosCustomPolicy: "myDdosCustomPolicy",
      publicIpPrefix: "myPublicIPPrefix",
      loadBalancer: "myLoadBalancer",
    }),
  },
];

```
## Dependencies
- [ResourceGroup](../Resources/ResourceGroup.md)
- [NatGateway](../Network/NatGateway.md)
- [DdosCustomPolicy](../Network/DdosCustomPolicy.md)
- [PublicIPPrefix](../Network/PublicIPPrefix.md)
- [LoadBalancer](../Network/LoadBalancer.md)
## Swagger Schema
```js
{
  properties: <ref *3> {
    extendedLocation: {
      description: 'The extended location of the load balancer.',
      properties: {
        name: {
          type: 'string',
          description: 'The name of the extended location.'
        },
        type: {
          description: 'The type of the extended location.',
          type: 'string',
          enum: [ 'EdgeZone' ],
          'x-ms-enum': { name: 'ExtendedLocationTypes', modelAsString: true }
        }
      }
    },
    properties: {
      'x-ms-client-flatten': true,
      description: 'Properties of the private link service.',
      properties: {
        loadBalancerFrontendIpConfigurations: {
          type: 'array',
          items: {
            properties: {
              properties: {
                'x-ms-client-flatten': true,
                description: 'Properties of the load balancer probe.',
                properties: {
                  inboundNatRules: {
                    readOnly: true,
                    type: 'array',
                    items: {
                      properties: {
                        id: { type: 'string', description: 'Resource ID.' }
                      },
                      description: 'Reference to another subresource.',
                      'x-ms-azure-resource': true
                    },
                    description: 'An array of references to inbound rules that use this frontend IP.'
                  },
                  inboundNatPools: {
                    readOnly: true,
                    type: 'array',
                    items: {
                      properties: {
                        id: { type: 'string', description: 'Resource ID.' }
                      },
                      description: 'Reference to another subresource.',
                      'x-ms-azure-resource': true
                    },
                    description: 'An array of references to inbound pools that use this frontend IP.'
                  },
                  outboundRules: {
                    readOnly: true,
                    type: 'array',
                    items: {
                      properties: {
                        id: { type: 'string', description: 'Resource ID.' }
                      },
                      description: 'Reference to another subresource.',
                      'x-ms-azure-resource': true
                    },
                    description: 'An array of references to outbound rules that use this frontend IP.'
                  },
                  loadBalancingRules: {
                    readOnly: true,
                    type: 'array',
                    items: {
                      properties: {
                        id: { type: 'string', description: 'Resource ID.' }
                      },
                      description: 'Reference to another subresource.',
                      'x-ms-azure-resource': true
                    },
                    description: 'An array of references to load balancing rules that use this frontend IP.'
                  },
                  privateIPAddress: {
                    type: 'string',
                    description: 'The private IP address of the IP configuration.'
                  },
                  privateIPAllocationMethod: {
                    description: 'The Private IP allocation method.',
                    type: 'string',
                    enum: [ 'Static', 'Dynamic' ],
                    'x-ms-enum': { name: 'IPAllocationMethod', modelAsString: true }
                  },
                  privateIPAddressVersion: {
                    description: 'Whether the specific ipconfiguration is IPv4 or IPv6. Default is taken as IPv4.',
                    type: 'string',
                    enum: [ 'IPv4', 'IPv6' ],
                    'x-ms-enum': { name: 'IPVersion', modelAsString: true }
                  },
                  subnet: {
                    description: 'The reference to the subnet resource.',
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
                            properties: {
                              properties: {
                                'x-ms-client-flatten': true,
                                description: 'Properties of the network security group.',
                                properties: [Object]
                              },
                              etag: {
                                readOnly: true,
                                type: 'string',
                                description: 'A unique read-only string that changes whenever the resource is updated.'
                              }
                            },
                            allOf: [
                              {
                                properties: [Object],
                                description: 'Common resource representation.',
                                'x-ms-azure-resource': true
                              }
                            ]
                          },
                          routeTable: {
                            description: 'The reference to the RouteTable resource.',
                            properties: {
                              properties: {
                                'x-ms-client-flatten': true,
                                description: 'Properties of the route table.',
                                properties: [Object]
                              },
                              etag: {
                                readOnly: true,
                                type: 'string',
                                description: 'A unique read-only string that changes whenever the resource is updated.'
                              }
                            },
                            allOf: [
                              {
                                properties: [Object],
                                description: 'Common resource representation.',
                                'x-ms-azure-resource': true
                              }
                            ]
                          },
                          natGateway: {
                            description: 'Nat gateway associated with this subnet.',
                            properties: {
                              id: {
                                type: 'string',
                                description: 'Resource ID.'
                              }
                            },
                            'x-ms-azure-resource': true
                          },
                          serviceEndpoints: {
                            type: 'array',
                            items: {
                              properties: {
                                service: [Object],
                                locations: [Object],
                                provisioningState: [Object]
                              },
                              description: 'The service endpoint properties.'
                            },
                            description: 'An array of service endpoints.'
                          },
                          serviceEndpointPolicies: {
                            type: 'array',
                            items: {
                              properties: {
                                properties: [Object],
                                etag: [Object],
                                kind: [Object]
                              },
                              allOf: [ [Object] ],
                              description: 'Service End point policy resource.'
                            },
                            description: 'An array of service endpoint policies.'
                          },
                          privateEndpoints: {
                            readOnly: true,
                            type: 'array',
                            items: {
                              properties: {
                                extendedLocation: [Object],
                                properties: [Object],
                                etag: [Object]
                              },
                              allOf: [ [Object] ],
                              description: 'Private endpoint resource.'
                            },
                            description: 'An array of references to private endpoints.'
                          },
                          ipConfigurations: {
                            readOnly: true,
                            type: 'array',
                            items: {
                              properties: {
                                properties: [Object],
                                name: [Object],
                                etag: [Object]
                              },
                              allOf: [ [Object] ],
                              description: 'IP configuration.'
                            },
                            description: 'An array of references to the network interface IP configurations using subnet.'
                          },
                          ipConfigurationProfiles: {
                            readOnly: true,
                            type: 'array',
                            items: {
                              properties: {
                                properties: [Object],
                                name: [Object],
                                type: [Object],
                                etag: [Object]
                              },
                              allOf: [ [Object] ],
                              description: 'IP configuration profile child resource.'
                            },
                            description: 'Array of IP configuration profiles which reference this subnet.'
                          },
                          ipAllocations: {
                            type: 'array',
                            items: {
                              properties: { id: [Object] },
                              description: 'Reference to another subresource.',
                              'x-ms-azure-resource': true
                            },
                            description: 'Array of IpAllocation which reference this subnet.'
                          },
                          resourceNavigationLinks: {
                            readOnly: true,
                            type: 'array',
                            items: {
                              properties: {
                                properties: [Object],
                                name: [Object],
                                id: [Object],
                                etag: [Object],
                                type: [Object]
                              },
                              allOf: [ [Object] ],
                              description: 'ResourceNavigationLink resource.'
                            },
                            description: 'An array of references to the external resources using subnet.'
                          },
                          serviceAssociationLinks: {
                            readOnly: true,
                            type: 'array',
                            items: {
                              properties: {
                                properties: [Object],
                                name: [Object],
                                etag: [Object],
                                type: [Object]
                              },
                              allOf: [ [Object] ],
                              description: 'ServiceAssociationLink resource.'
                            },
                            description: 'An array of references to services injecting into this subnet.'
                          },
                          delegations: {
                            type: 'array',
                            items: {
                              properties: {
                                properties: [Object],
                                name: [Object],
                                etag: [Object],
                                type: [Object]
                              },
                              allOf: [ [Object] ],
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
                              properties: {
                                properties: [Object],
                                name: [Object],
                                etag: [Object],
                                type: [Object]
                              },
                              allOf: [ [Object] ],
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
                        properties: {
                          id: {
                            type: 'string',
                            description: 'Resource ID.'
                          }
                        },
                        description: 'Reference to another subresource.',
                        'x-ms-azure-resource': true
                      }
                    ]
                  },
                  publicIPAddress: {
                    description: 'The reference to the Public IP resource.',
                    properties: <ref *1> {
                      extendedLocation: {
                        description: 'The extended location of the public ip address.',
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
                      sku: {
                        description: 'The public IP address SKU.',
                        properties: {
                          name: {
                            type: 'string',
                            description: 'Name of a public IP address SKU.',
                            enum: [ 'Basic', 'Standard' ],
                            'x-ms-enum': {
                              name: 'PublicIPAddressSkuName',
                              modelAsString: true
                            }
                          },
                          tier: {
                            type: 'string',
                            description: 'Tier of a public IP address SKU.',
                            enum: [ 'Regional', 'Global' ],
                            'x-ms-enum': {
                              name: 'PublicIPAddressSkuTier',
                              modelAsString: true
                            }
                          }
                        }
                      },
                      properties: {
                        'x-ms-client-flatten': true,
                        description: 'Public IP address properties.',
                        properties: {
                          publicIPAllocationMethod: {
                            description: 'The public IP address allocation method.',
                            type: 'string',
                            enum: [ 'Static', 'Dynamic' ],
                            'x-ms-enum': {
                              name: 'IPAllocationMethod',
                              modelAsString: true
                            }
                          },
                          publicIPAddressVersion: {
                            description: 'The public IP address version.',
                            type: 'string',
                            enum: [ 'IPv4', 'IPv6' ],
                            'x-ms-enum': { name: 'IPVersion', modelAsString: true }
                          },
                          ipConfiguration: {
                            readOnly: true,
                            description: 'The IP configuration associated with the public IP address.',
                            properties: {
                              properties: {
                                'x-ms-client-flatten': true,
                                description: 'Properties of the IP configuration.',
                                properties: [Object]
                              },
                              name: {
                                type: 'string',
                                description: 'The name of the resource that is unique within a resource group. This name can be used to access the resource.'
                              },
                              etag: {
                                readOnly: true,
                                type: 'string',
                                description: 'A unique read-only string that changes whenever the resource is updated.'
                              }
                            },
                            allOf: [
                              {
                                properties: [Object],
                                description: 'Reference to another subresource.',
                                'x-ms-azure-resource': true
                              }
                            ]
                          },
                          dnsSettings: {
                            description: 'The FQDN of the DNS record associated with the public IP address.',
                            properties: {
                              domainNameLabel: {
                                type: 'string',
                                description: 'The domain name label. The concatenation of the domain name label and the regionalized DNS zone make up the fully qualified domain name associated with the public IP address. If a domain name label is specified, an A DNS record is created for the public IP in the Microsoft Azure DNS system.'
                              },
                              fqdn: {
                                type: 'string',
                                description: 'The Fully Qualified Domain Name of the A DNS record associated with the public IP. This is the concatenation of the domainNameLabel and the regionalized DNS zone.'
                              },
                              reverseFqdn: {
                                type: 'string',
                                description: 'The reverse FQDN. A user-visible, fully qualified domain name that resolves to this public IP address. If the reverseFqdn is specified, then a PTR DNS record is created pointing from the IP address in the in-addr.arpa domain to the reverse FQDN.'
                              }
                            }
                          },
                          ddosSettings: {
                            description: 'The DDoS protection custom policy associated with the public IP address.',
                            properties: {
                              ddosCustomPolicy: {
                                readOnly: false,
                                description: 'The DDoS custom policy associated with the public IP.',
                                properties: [Object],
                                'x-ms-azure-resource': true
                              },
                              protectionCoverage: {
                                readOnly: false,
                                type: 'string',
                                enum: [Array],
                                'x-ms-enum': [Object],
                                description: 'The DDoS protection policy customizability of the public IP. Only standard coverage will have the ability to be customized.'
                              },
                              protectedIP: {
                                readOnly: false,
                                type: 'boolean',
                                description: 'Enables DDoS protection on the public IP.'
                              }
                            }
                          },
                          ipTags: {
                            type: 'array',
                            items: {
                              properties: { ipTagType: [Object], tag: [Object] },
                              description: 'Contains the IpTag associated with the object.'
                            },
                            description: 'The list of tags associated with the public IP address.'
                          },
                          ipAddress: {
                            type: 'string',
                            description: 'The IP address associated with the public IP address resource.'
                          },
                          publicIPPrefix: {
                            description: 'The Public IP Prefix this Public IP Address should be allocated from.',
                            properties: {
                              id: {
                                type: 'string',
                                description: 'Resource ID.'
                              }
                            },
                            'x-ms-azure-resource': true
                          },
                          idleTimeoutInMinutes: {
                            type: 'integer',
                            format: 'int32',
                            description: 'The idle timeout of the public IP address.'
                          },
                          resourceGuid: {
                            readOnly: true,
                            type: 'string',
                            description: 'The resource GUID property of the public IP address resource.'
                          },
                          provisioningState: {
                            readOnly: true,
                            description: 'The provisioning state of the public IP address resource.',
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
                          servicePublicIPAddress: {
                            description: 'The service public IP address of the public IP address resource.',
                            properties: [Circular *1],
                            allOf: [
                              {
                                properties: [Object],
                                description: 'Common resource representation.',
                                'x-ms-azure-resource': true
                              }
                            ]
                          },
                          natGateway: {
                            description: 'The NatGateway for the Public IP address.',
                            properties: {
                              sku: {
                                description: 'The nat gateway SKU.',
                                properties: [Object]
                              },
                              properties: {
                                'x-ms-client-flatten': true,
                                description: 'Nat Gateway properties.',
                                properties: [Object]
                              },
                              zones: {
                                type: 'array',
                                items: [Object],
                                description: 'A list of availability zones denoting the zone in which Nat Gateway should be deployed.'
                              },
                              etag: {
                                readOnly: true,
                                type: 'string',
                                description: 'A unique read-only string that changes whenever the resource is updated.'
                              }
                            },
                            allOf: [
                              {
                                properties: [Object],
                                description: 'Common resource representation.',
                                'x-ms-azure-resource': true
                              }
                            ]
                          },
                          migrationPhase: {
                            type: 'string',
                            description: 'Migration phase of Public IP Address.',
                            enum: [
                              'None',
                              'Prepare',
                              'Commit',
                              'Abort',
                              'Committed'
                            ],
                            'x-ms-enum': {
                              name: 'PublicIPAddressMigrationPhase',
                              modelAsString: true
                            }
                          },
                          linkedPublicIPAddress: {
                            description: 'The linked public IP address of the public IP address resource.',
                            properties: [Circular *1],
                            allOf: [
                              {
                                properties: [Object],
                                description: 'Common resource representation.',
                                'x-ms-azure-resource': true
                              }
                            ]
                          },
                          deleteOption: {
                            type: 'string',
                            description: 'Specify what happens to the public IP address when the VM using it is deleted',
                            enum: [ 'Delete', 'Detach' ],
                            'x-ms-enum': {
                              name: 'DeleteOptions',
                              modelAsString: true
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
                        description: 'A list of availability zones denoting the IP allocated for the resource needs to come from.'
                      }
                    },
                    allOf: [
                      {
                        properties: {
                          id: {
                            type: 'string',
                            description: 'Resource ID.'
                          },
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
                          location: {
                            type: 'string',
                            description: 'Resource location.'
                          },
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
                  },
                  publicIPPrefix: {
                    description: 'The reference to the Public IP Prefix resource.',
                    properties: {
                      id: { type: 'string', description: 'Resource ID.' }
                    },
                    'x-ms-azure-resource': true
                  },
                  gatewayLoadBalancer: {
                    description: 'The reference to gateway load balancer frontend IP.',
                    properties: {
                      id: { type: 'string', description: 'Resource ID.' }
                    },
                    'x-ms-azure-resource': true
                  },
                  provisioningState: {
                    readOnly: true,
                    description: 'The provisioning state of the frontend IP configuration resource.',
                    type: 'string',
                    enum: [ 'Succeeded', 'Updating', 'Deleting', 'Failed' ],
                    'x-ms-enum': { name: 'ProvisioningState', modelAsString: true }
                  }
                }
              },
              name: {
                type: 'string',
                description: 'The name of the resource that is unique within the set of frontend IP configurations used by the load balancer. This name can be used to access the resource.'
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
              },
              zones: {
                type: 'array',
                items: { type: 'string' },
                description: 'A list of availability zones denoting the IP allocated for the resource needs to come from.'
              }
            },
            allOf: [
              {
                properties: { id: { type: 'string', description: 'Resource ID.' } },
                description: 'Reference to another subresource.',
                'x-ms-azure-resource': true
              }
            ],
            description: 'Frontend IP address of the load balancer.'
          },
          description: 'An array of references to the load balancer IP configurations.'
        },
        ipConfigurations: {
          type: 'array',
          items: {
            properties: {
              properties: {
                'x-ms-client-flatten': true,
                description: 'Properties of the private link service ip configuration.',
                properties: {
                  privateIPAddress: {
                    type: 'string',
                    description: 'The private IP address of the IP configuration.'
                  },
                  privateIPAllocationMethod: {
                    description: 'The private IP address allocation method.',
                    type: 'string',
                    enum: [ 'Static', 'Dynamic' ],
                    'x-ms-enum': { name: 'IPAllocationMethod', modelAsString: true }
                  },
                  subnet: {
                    description: 'The reference to the subnet resource.',
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
                            properties: {
                              properties: {
                                'x-ms-client-flatten': true,
                                description: 'Properties of the network security group.',
                                properties: [Object]
                              },
                              etag: {
                                readOnly: true,
                                type: 'string',
                                description: 'A unique read-only string that changes whenever the resource is updated.'
                              }
                            },
                            allOf: [
                              {
                                properties: [Object],
                                description: 'Common resource representation.',
                                'x-ms-azure-resource': true
                              }
                            ]
                          },
                          routeTable: {
                            description: 'The reference to the RouteTable resource.',
                            properties: {
                              properties: {
                                'x-ms-client-flatten': true,
                                description: 'Properties of the route table.',
                                properties: [Object]
                              },
                              etag: {
                                readOnly: true,
                                type: 'string',
                                description: 'A unique read-only string that changes whenever the resource is updated.'
                              }
                            },
                            allOf: [
                              {
                                properties: [Object],
                                description: 'Common resource representation.',
                                'x-ms-azure-resource': true
                              }
                            ]
                          },
                          natGateway: {
                            description: 'Nat gateway associated with this subnet.',
                            properties: {
                              id: {
                                type: 'string',
                                description: 'Resource ID.'
                              }
                            },
                            'x-ms-azure-resource': true
                          },
                          serviceEndpoints: {
                            type: 'array',
                            items: {
                              properties: {
                                service: [Object],
                                locations: [Object],
                                provisioningState: [Object]
                              },
                              description: 'The service endpoint properties.'
                            },
                            description: 'An array of service endpoints.'
                          },
                          serviceEndpointPolicies: {
                            type: 'array',
                            items: {
                              properties: {
                                properties: [Object],
                                etag: [Object],
                                kind: [Object]
                              },
                              allOf: [ [Object] ],
                              description: 'Service End point policy resource.'
                            },
                            description: 'An array of service endpoint policies.'
                          },
                          privateEndpoints: {
                            readOnly: true,
                            type: 'array',
                            items: {
                              properties: {
                                extendedLocation: [Object],
                                properties: [Object],
                                etag: [Object]
                              },
                              allOf: [ [Object] ],
                              description: 'Private endpoint resource.'
                            },
                            description: 'An array of references to private endpoints.'
                          },
                          ipConfigurations: {
                            readOnly: true,
                            type: 'array',
                            items: {
                              properties: {
                                properties: [Object],
                                name: [Object],
                                etag: [Object]
                              },
                              allOf: [ [Object] ],
                              description: 'IP configuration.'
                            },
                            description: 'An array of references to the network interface IP configurations using subnet.'
                          },
                          ipConfigurationProfiles: {
                            readOnly: true,
                            type: 'array',
                            items: {
                              properties: {
                                properties: [Object],
                                name: [Object],
                                type: [Object],
                                etag: [Object]
                              },
                              allOf: [ [Object] ],
                              description: 'IP configuration profile child resource.'
                            },
                            description: 'Array of IP configuration profiles which reference this subnet.'
                          },
                          ipAllocations: {
                            type: 'array',
                            items: {
                              properties: { id: [Object] },
                              description: 'Reference to another subresource.',
                              'x-ms-azure-resource': true
                            },
                            description: 'Array of IpAllocation which reference this subnet.'
                          },
                          resourceNavigationLinks: {
                            readOnly: true,
                            type: 'array',
                            items: {
                              properties: {
                                properties: [Object],
                                name: [Object],
                                id: [Object],
                                etag: [Object],
                                type: [Object]
                              },
                              allOf: [ [Object] ],
                              description: 'ResourceNavigationLink resource.'
                            },
                            description: 'An array of references to the external resources using subnet.'
                          },
                          serviceAssociationLinks: {
                            readOnly: true,
                            type: 'array',
                            items: {
                              properties: {
                                properties: [Object],
                                name: [Object],
                                etag: [Object],
                                type: [Object]
                              },
                              allOf: [ [Object] ],
                              description: 'ServiceAssociationLink resource.'
                            },
                            description: 'An array of references to services injecting into this subnet.'
                          },
                          delegations: {
                            type: 'array',
                            items: {
                              properties: {
                                properties: [Object],
                                name: [Object],
                                etag: [Object],
                                type: [Object]
                              },
                              allOf: [ [Object] ],
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
                              properties: {
                                properties: [Object],
                                name: [Object],
                                etag: [Object],
                                type: [Object]
                              },
                              allOf: [ [Object] ],
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
                        properties: {
                          id: {
                            type: 'string',
                            description: 'Resource ID.'
                          }
                        },
                        description: 'Reference to another subresource.',
                        'x-ms-azure-resource': true
                      }
                    ]
                  },
                  primary: {
                    type: 'boolean',
                    description: 'Whether the ip configuration is primary or not.'
                  },
                  provisioningState: {
                    readOnly: true,
                    description: 'The provisioning state of the private link service IP configuration resource.',
                    type: 'string',
                    enum: [ 'Succeeded', 'Updating', 'Deleting', 'Failed' ],
                    'x-ms-enum': { name: 'ProvisioningState', modelAsString: true }
                  },
                  privateIPAddressVersion: {
                    description: 'Whether the specific IP configuration is IPv4 or IPv6. Default is IPv4.',
                    type: 'string',
                    enum: [ 'IPv4', 'IPv6' ],
                    'x-ms-enum': { name: 'IPVersion', modelAsString: true }
                  }
                }
              },
              name: {
                type: 'string',
                description: 'The name of private link service ip configuration.'
              },
              etag: {
                readOnly: true,
                type: 'string',
                description: 'A unique read-only string that changes whenever the resource is updated.'
              },
              type: {
                readOnly: true,
                type: 'string',
                description: 'The resource type.'
              }
            },
            allOf: [
              {
                properties: { id: { type: 'string', description: 'Resource ID.' } },
                description: 'Reference to another subresource.',
                'x-ms-azure-resource': true
              }
            ],
            description: 'The private link service ip configuration.'
          },
          description: 'An array of private link service IP configurations.'
        },
        networkInterfaces: {
          type: 'array',
          readOnly: true,
          items: <ref *2> {
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
                    description: 'The reference to a virtual machine.',
                    readOnly: true,
                    properties: {
                      id: { type: 'string', description: 'Resource ID.' }
                    },
                    'x-ms-azure-resource': true
                  },
                  networkSecurityGroup: {
                    description: 'The reference to the NetworkSecurityGroup resource.',
                    properties: {
                      properties: {
                        'x-ms-client-flatten': true,
                        description: 'Properties of the network security group.',
                        properties: {
                          securityRules: {
                            type: 'array',
                            items: {
                              properties: {
                                properties: [Object],
                                name: [Object],
                                etag: [Object],
                                type: [Object]
                              },
                              allOf: [ [Object] ],
                              description: 'Network security rule.'
                            },
                            description: 'A collection of security rules of the network security group.'
                          },
                          defaultSecurityRules: {
                            readOnly: true,
                            type: 'array',
                            items: {
                              properties: {
                                properties: [Object],
                                name: [Object],
                                etag: [Object],
                                type: [Object]
                              },
                              allOf: [ [Object] ],
                              description: 'Network security rule.'
                            },
                            description: 'The default security rules of network security group.'
                          },
                          networkInterfaces: {
                            readOnly: true,
                            type: 'array',
                            items: [Circular *2],
                            description: 'A collection of references to network interfaces.'
                          },
                          subnets: {
                            readOnly: true,
                            type: 'array',
                            items: {
                              properties: {
                                properties: [Object],
                                name: [Object],
                                etag: [Object],
                                type: [Object]
                              },
                              allOf: [ [Object] ],
                              description: 'Subnet in a virtual network resource.'
                            },
                            description: 'A collection of references to subnets.'
                          },
                          flowLogs: {
                            readOnly: true,
                            type: 'array',
                            items: {
                              properties: { properties: [Object], etag: [Object] },
                              allOf: [ [Object] ],
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
                          },
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
                          location: {
                            type: 'string',
                            description: 'Resource location.'
                          },
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
                  },
                  privateEndpoint: {
                    readOnly: true,
                    description: 'A reference to the private endpoint to which the network interface is linked.',
                    properties: {
                      extendedLocation: {
                        description: 'The extended location of the load balancer.',
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
                        description: 'Properties of the private endpoint.',
                        properties: {
                          subnet: {
                            description: 'The ID of the subnet from which the private IP will be allocated.',
                            properties: {
                              properties: {
                                'x-ms-client-flatten': true,
                                description: 'Properties of the subnet.',
                                properties: [Object]
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
                                description: 'Resource type.'
                              }
                            },
                            allOf: [
                              {
                                properties: [Object],
                                description: 'Reference to another subresource.',
                                'x-ms-azure-resource': true
                              }
                            ]
                          },
                          networkInterfaces: {
                            type: 'array',
                            readOnly: true,
                            items: [Circular *2],
                            description: 'An array of references to the network interfaces created for this private endpoint.'
                          },
                          provisioningState: {
                            readOnly: true,
                            description: 'The provisioning state of the private endpoint resource.',
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
                          privateLinkServiceConnections: {
                            type: 'array',
                            items: {
                              properties: {
                                properties: [Object],
                                name: [Object],
                                type: [Object],
                                etag: [Object]
                              },
                              allOf: [ [Object] ],
                              description: 'PrivateLinkServiceConnection resource.'
                            },
                            description: 'A grouping of information about the connection to the remote resource.'
                          },
                          manualPrivateLinkServiceConnections: {
                            type: 'array',
                            items: {
                              properties: {
                                properties: [Object],
                                name: [Object],
                                type: [Object],
                                etag: [Object]
                              },
                              allOf: [ [Object] ],
                              description: 'PrivateLinkServiceConnection resource.'
                            },
                            description: 'A grouping of information about the connection to the remote resource. Used when the network admin does not have access to approve connections to the remote resource.'
                          },
                          customDnsConfigs: {
                            type: 'array',
                            items: {
                              properties: { fqdn: [Object], ipAddresses: [Object] },
                              description: 'Contains custom Dns resolution configuration from customer.'
                            },
                            description: 'An array of custom dns configurations.'
                          },
                          applicationSecurityGroups: {
                            type: 'array',
                            items: {
                              properties: { properties: [Object], etag: [Object] },
                              allOf: [ [Object] ],
                              description: 'An application security group in a resource group.'
                            },
                            description: 'Application security groups in which the private endpoint IP configuration is included.'
                          },
                          ipConfigurations: {
                            type: 'array',
                            items: {
                              type: 'object',
                              properties: {
                                properties: [Object],
                                name: [Object],
                                type: [Object],
                                etag: [Object]
                              },
                              description: 'An IP Configuration of the private endpoint.'
                            },
                            description: "A list of IP configurations of the private endpoint. This will be used to map to the First Party Service's endpoints."
                          },
                          customNetworkInterfaceName: {
                            type: 'string',
                            description: 'The custom name of the network interface attached to the private endpoint.'
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
                          id: {
                            type: 'string',
                            description: 'Resource ID.'
                          },
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
                          location: {
                            type: 'string',
                            description: 'Resource location.'
                          },
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
                  },
                  ipConfigurations: {
                    type: 'array',
                    items: {
                      properties: {
                        properties: {
                          'x-ms-client-flatten': true,
                          description: 'Network interface IP configuration properties.',
                          properties: {
                            gatewayLoadBalancer: {
                              description: 'The reference to gateway load balancer frontend IP.',
                              properties: { id: [Object] },
                              'x-ms-azure-resource': true
                            },
                            virtualNetworkTaps: {
                              type: 'array',
                              items: {
                                properties: [Object],
                                allOf: [Array],
                                description: 'Virtual Network Tap resource.'
                              },
                              description: 'The reference to Virtual Network Taps.'
                            },
                            applicationGatewayBackendAddressPools: {
                              type: 'array',
                              items: {
                                properties: [Object],
                                allOf: [Array],
                                description: 'Backend Address Pool of an application gateway.'
                              },
                              description: 'The reference to ApplicationGatewayBackendAddressPool resource.'
                            },
                            loadBalancerBackendAddressPools: {
                              type: 'array',
                              items: {
                                properties: [Object],
                                allOf: [Array],
                                description: 'Pool of backend IP addresses.'
                              },
                              description: 'The reference to LoadBalancerBackendAddressPool resource.'
                            },
                            loadBalancerInboundNatRules: {
                              type: 'array',
                              items: {
                                properties: [Object],
                                allOf: [Array],
                                description: 'Inbound NAT rule of the load balancer.'
                              },
                              description: 'A list of references of LoadBalancerInboundNatRules.'
                            },
                            privateIPAddress: {
                              type: 'string',
                              description: 'Private IP address of the IP configuration.'
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
                            privateIPAddressVersion: {
                              description: 'Whether the specific IP configuration is IPv4 or IPv6. Default is IPv4.',
                              type: 'string',
                              enum: [ 'IPv4', 'IPv6' ],
                              'x-ms-enum': {
                                name: 'IPVersion',
                                modelAsString: true
                              }
                            },
                            subnet: {
                              description: 'Subnet bound to the IP configuration.',
                              properties: {
                                properties: [Object],
                                name: [Object],
                                etag: [Object],
                                type: [Object]
                              },
                              allOf: [ [Object] ]
                            },
                            primary: {
                              type: 'boolean',
                              description: 'Whether this is a primary customer address on the network interface.'
                            },
                            publicIPAddress: {
                              description: 'Public IP address bound to the IP configuration.',
                              properties: <ref *1> {
                                extendedLocation: [Object],
                                sku: [Object],
                                properties: [Object],
                                etag: [Object],
                                zones: [Object]
                              },
                              allOf: [ [Object] ]
                            },
                            applicationSecurityGroups: {
                              type: 'array',
                              items: {
                                properties: [Object],
                                allOf: [Array],
                                description: 'An application security group in a resource group.'
                              },
                              description: 'Application security groups in which the IP configuration is included.'
                            },
                            provisioningState: {
                              readOnly: true,
                              description: 'The provisioning state of the network interface IP configuration.',
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
                            privateLinkConnectionProperties: {
                              description: 'PrivateLinkConnection properties for the network interface.',
                              readOnly: true,
                              properties: {
                                groupId: [Object],
                                requiredMemberName: [Object],
                                fqdns: [Object]
                              }
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
                        type: {
                          type: 'string',
                          description: 'Resource type.'
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
                      description: 'IPConfiguration in a network interface.'
                    },
                    description: 'A list of IPConfigurations of the network interface.'
                  },
                  tapConfigurations: {
                    readOnly: true,
                    type: 'array',
                    items: {
                      properties: {
                        properties: {
                          'x-ms-client-flatten': true,
                          description: 'Properties of the Virtual Network Tap configuration.',
                          properties: {
                            virtualNetworkTap: {
                              description: 'The reference to the Virtual Network Tap resource.',
                              properties: { properties: [Object], etag: [Object] },
                              allOf: [ [Object] ]
                            },
                            provisioningState: {
                              readOnly: true,
                              description: 'The provisioning state of the network interface tap configuration resource.',
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
                          description: 'The name of the resource that is unique within a resource group. This name can be used to access the resource.'
                        },
                        etag: {
                          readOnly: true,
                          type: 'string',
                          description: 'A unique read-only string that changes whenever the resource is updated.'
                        },
                        type: {
                          readOnly: true,
                          type: 'string',
                          description: 'Sub Resource type.'
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
                      description: 'Tap configuration in a Network Interface.'
                    },
                    description: 'A list of TapConfigurations of the network interface.'
                  },
                  dnsSettings: {
                    description: 'The DNS settings in network interface.',
                    properties: {
                      dnsServers: {
                        type: 'array',
                        items: { type: 'string' },
                        description: "List of DNS servers IP addresses. Use 'AzureProvidedDNS' to switch to azure provided DNS resolution. 'AzureProvidedDNS' value cannot be combined with other IPs, it must be the only value in dnsServers collection."
                      },
                      appliedDnsServers: {
                        readOnly: true,
                        type: 'array',
                        items: { type: 'string' },
                        description: 'If the VM that uses this NIC is part of an Availability Set, then this list will have the union of all DNS servers from all NICs that are part of the Availability Set. This property is what is configured on each of those VMs.'
                      },
                      internalDnsNameLabel: {
                        type: 'string',
                        description: 'Relative DNS name for this NIC used for internal communications between VMs in the same virtual network.'
                      },
                      internalFqdn: {
                        readOnly: true,
                        type: 'string',
                        description: 'Fully qualified DNS name supporting internal communications between VMs in the same virtual network.'
                      },
                      internalDomainNameSuffix: {
                        readOnly: true,
                        type: 'string',
                        description: 'Even if internalDnsNameLabel is not specified, a DNS entry is created for the primary NIC of the VM. This DNS name can be constructed by concatenating the VM name with the value of internalDomainNameSuffix.'
                      }
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
                    description: 'A reference to the dscp configuration to which the network interface is linked.',
                    readOnly: true,
                    properties: {
                      id: { type: 'string', description: 'Resource ID.' }
                    },
                    'x-ms-azure-resource': true
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
                    properties: [Circular *3],
                    allOf: [
                      {
                        properties: {
                          id: {
                            type: 'string',
                            description: 'Resource ID.'
                          },
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
                          location: {
                            type: 'string',
                            description: 'Resource location.'
                          },
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
                  },
                  auxiliaryMode: {
                    type: 'string',
                    description: 'Auxiliary mode of Network Interface resource.',
                    enum: [ 'None', 'MaxConnections', 'Floating' ],
                    'x-ms-enum': {
                      name: 'NetworkInterfaceAuxiliaryMode',
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
          description: 'An array of references to the network interfaces created for this private link service.'
        },
        provisioningState: {
          readOnly: true,
          description: 'The provisioning state of the private link service resource.',
          type: 'string',
          enum: [ 'Succeeded', 'Updating', 'Deleting', 'Failed' ],
          'x-ms-enum': { name: 'ProvisioningState', modelAsString: true }
        },
        privateEndpointConnections: {
          readOnly: true,
          type: 'array',
          items: {
            properties: {
              properties: {
                'x-ms-client-flatten': true,
                description: 'Properties of the private end point connection.',
                properties: {
                  privateEndpoint: {
                    readOnly: true,
                    description: 'The resource of private end point.',
                    properties: {
                      extendedLocation: {
                        description: 'The extended location of the load balancer.',
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
                        description: 'Properties of the private endpoint.',
                        properties: {
                          subnet: {
                            description: 'The ID of the subnet from which the private IP will be allocated.',
                            properties: {
                              properties: {
                                'x-ms-client-flatten': true,
                                description: 'Properties of the subnet.',
                                properties: [Object]
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
                                description: 'Resource type.'
                              }
                            },
                            allOf: [
                              {
                                properties: [Object],
                                description: 'Reference to another subresource.',
                                'x-ms-azure-resource': true
                              }
                            ]
                          },
                          networkInterfaces: {
                            type: 'array',
                            readOnly: true,
                            items: <ref *2> {
                              properties: {
                                extendedLocation: [Object],
                                properties: [Object],
                                etag: [Object]
                              },
                              allOf: [ [Object] ],
                              description: 'A network interface in a resource group.'
                            },
                            description: 'An array of references to the network interfaces created for this private endpoint.'
                          },
                          provisioningState: {
                            readOnly: true,
                            description: 'The provisioning state of the private endpoint resource.',
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
                          privateLinkServiceConnections: {
                            type: 'array',
                            items: {
                              properties: {
                                properties: [Object],
                                name: [Object],
                                type: [Object],
                                etag: [Object]
                              },
                              allOf: [ [Object] ],
                              description: 'PrivateLinkServiceConnection resource.'
                            },
                            description: 'A grouping of information about the connection to the remote resource.'
                          },
                          manualPrivateLinkServiceConnections: {
                            type: 'array',
                            items: {
                              properties: {
                                properties: [Object],
                                name: [Object],
                                type: [Object],
                                etag: [Object]
                              },
                              allOf: [ [Object] ],
                              description: 'PrivateLinkServiceConnection resource.'
                            },
                            description: 'A grouping of information about the connection to the remote resource. Used when the network admin does not have access to approve connections to the remote resource.'
                          },
                          customDnsConfigs: {
                            type: 'array',
                            items: {
                              properties: { fqdn: [Object], ipAddresses: [Object] },
                              description: 'Contains custom Dns resolution configuration from customer.'
                            },
                            description: 'An array of custom dns configurations.'
                          },
                          applicationSecurityGroups: {
                            type: 'array',
                            items: {
                              properties: { properties: [Object], etag: [Object] },
                              allOf: [ [Object] ],
                              description: 'An application security group in a resource group.'
                            },
                            description: 'Application security groups in which the private endpoint IP configuration is included.'
                          },
                          ipConfigurations: {
                            type: 'array',
                            items: {
                              type: 'object',
                              properties: {
                                properties: [Object],
                                name: [Object],
                                type: [Object],
                                etag: [Object]
                              },
                              description: 'An IP Configuration of the private endpoint.'
                            },
                            description: "A list of IP configurations of the private endpoint. This will be used to map to the First Party Service's endpoints."
                          },
                          customNetworkInterfaceName: {
                            type: 'string',
                            description: 'The custom name of the network interface attached to the private endpoint.'
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
                          id: {
                            type: 'string',
                            description: 'Resource ID.'
                          },
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
                          location: {
                            type: 'string',
                            description: 'Resource location.'
                          },
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
                  },
                  privateLinkServiceConnectionState: {
                    description: 'A collection of information about the state of the connection between service consumer and provider.',
                    properties: {
                      status: {
                        type: 'string',
                        description: 'Indicates whether the connection has been Approved/Rejected/Removed by the owner of the service.'
                      },
                      description: {
                        type: 'string',
                        description: 'The reason for approval/rejection of the connection.'
                      },
                      actionsRequired: {
                        type: 'string',
                        description: 'A message indicating if changes on the service provider require any updates on the consumer.'
                      }
                    }
                  },
                  provisioningState: {
                    readOnly: true,
                    description: 'The provisioning state of the private endpoint connection resource.',
                    type: 'string',
                    enum: [ 'Succeeded', 'Updating', 'Deleting', 'Failed' ],
                    'x-ms-enum': { name: 'ProvisioningState', modelAsString: true }
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
                description: 'The name of the resource that is unique within a resource group. This name can be used to access the resource.'
              },
              type: {
                readOnly: true,
                type: 'string',
                description: 'The resource type.'
              },
              etag: {
                readOnly: true,
                type: 'string',
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
            description: 'PrivateEndpointConnection resource.'
          },
          description: 'An array of list about connections to the private endpoint.'
        },
        visibility: {
          allOf: [
            {
              properties: {
                subscriptions: {
                  type: 'array',
                  items: { type: 'string' },
                  description: 'The list of subscriptions.'
                }
              },
              description: 'The base resource set for visibility and auto-approval.'
            }
          ],
          description: 'The visibility list of the private link service.'
        },
        autoApproval: {
          allOf: [
            {
              properties: {
                subscriptions: {
                  type: 'array',
                  items: { type: 'string' },
                  description: 'The list of subscriptions.'
                }
              },
              description: 'The base resource set for visibility and auto-approval.'
            }
          ],
          description: 'The auto-approval list of the private link service.'
        },
        fqdns: {
          type: 'array',
          items: { type: 'string' },
          description: 'The list of Fqdn.'
        },
        alias: {
          readOnly: true,
          type: 'string',
          description: 'The alias of the private link service.'
        },
        enableProxyProtocol: {
          type: 'boolean',
          description: 'Whether the private link service is enabled for proxy protocol or not.'
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
  description: 'Private link service resource.'
}
```
## Misc
The resource version is `2021-08-01`.

The Swagger schema used to generate this documentation can be found [here](https://github.com/Azure/azure-rest-api-specs/tree/main/specification/network/resource-manager/Microsoft.Network/stable/2021-08-01/privateLinkService.json).
