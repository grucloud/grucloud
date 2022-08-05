---
id: LoadBalancer
title: LoadBalancer
---
Provides a **LoadBalancer** from the **Network** group
## Examples
### Create load balancer
```js
exports.createResources = () => [
  {
    type: "LoadBalancer",
    group: "Network",
    name: "myLoadBalancer",
    properties: () => ({
      location: "eastus",
      properties: {
        frontendIPConfigurations: [
          {
            name: "fe-lb",
            properties: {
              subnet: {
                id: "/subscriptions/subid/resourceGroups/rg1/providers/Microsoft.Network/virtualNetworks/vnetlb/subnets/subnetlb",
              },
            },
          },
        ],
        backendAddressPools: [{ name: "be-lb", properties: {} }],
        loadBalancingRules: [
          {
            name: "rulelb",
            properties: {
              frontendIPConfiguration: {
                id: "/subscriptions/subid/resourceGroups/rg1/providers/Microsoft.Network/loadBalancers/lb/frontendIPConfigurations/fe-lb",
              },
              frontendPort: 80,
              backendPort: 80,
              enableFloatingIP: true,
              idleTimeoutInMinutes: 15,
              protocol: "Tcp",
              enableTcpReset: false,
              loadDistribution: "Default",
              backendAddressPool: {
                id: "/subscriptions/subid/resourceGroups/rg1/providers/Microsoft.Network/loadBalancers/lb/backendAddressPools/be-lb",
              },
              probe: {
                id: "/subscriptions/subid/resourceGroups/rg1/providers/Microsoft.Network/loadBalancers/lb/probes/probe-lb",
              },
            },
          },
        ],
        probes: [
          {
            name: "probe-lb",
            properties: {
              protocol: "Http",
              port: 80,
              requestPath: "healthcheck.aspx",
              intervalInSeconds: 15,
              numberOfProbes: 2,
            },
          },
        ],
        inboundNatRules: [
          {
            name: "in-nat-rule",
            properties: {
              frontendIPConfiguration: {
                id: "/subscriptions/subid/resourceGroups/rg1/providers/Microsoft.Network/loadBalancers/lb/frontendIPConfigurations/fe-lb",
              },
              frontendPort: 3389,
              backendPort: 3389,
              enableFloatingIP: true,
              idleTimeoutInMinutes: 15,
              protocol: "Tcp",
              enableTcpReset: false,
            },
          },
        ],
        inboundNatPools: [],
      },
    }),
    dependencies: ({}) => ({
      resourceGroup: "myResourceGroup",
      publicIPAddresses: ["myPublicIPAddress"],
    }),
  },
];

```

### Create load balancer with Standard SKU
```js
exports.createResources = () => [
  {
    type: "LoadBalancer",
    group: "Network",
    name: "myLoadBalancer",
    properties: () => ({
      location: "eastus",
      sku: { name: "Standard" },
      properties: {
        frontendIPConfigurations: [
          {
            name: "fe-lb",
            properties: {
              subnet: {
                id: "/subscriptions/subid/resourceGroups/rg1/providers/Microsoft.Network/virtualNetworks/vnetlb/subnets/subnetlb",
              },
            },
          },
        ],
        backendAddressPools: [{ name: "be-lb", properties: {} }],
        loadBalancingRules: [
          {
            name: "rulelb",
            properties: {
              frontendIPConfiguration: {
                id: "/subscriptions/subid/resourceGroups/rg1/providers/Microsoft.Network/loadBalancers/lb/frontendIPConfigurations/fe-lb",
              },
              frontendPort: 80,
              backendPort: 80,
              enableFloatingIP: true,
              idleTimeoutInMinutes: 15,
              protocol: "Tcp",
              loadDistribution: "Default",
              backendAddressPool: {
                id: "/subscriptions/subid/resourceGroups/rg1/providers/Microsoft.Network/loadBalancers/lb/backendAddressPools/be-lb",
              },
              probe: {
                id: "/subscriptions/subid/resourceGroups/rg1/providers/Microsoft.Network/loadBalancers/lb/probes/probe-lb",
              },
            },
          },
        ],
        probes: [
          {
            name: "probe-lb",
            properties: {
              protocol: "Http",
              port: 80,
              requestPath: "healthcheck.aspx",
              intervalInSeconds: 15,
              numberOfProbes: 2,
            },
          },
        ],
        inboundNatRules: [
          {
            name: "in-nat-rule",
            properties: {
              frontendIPConfiguration: {
                id: "/subscriptions/subid/resourceGroups/rg1/providers/Microsoft.Network/loadBalancers/lb/frontendIPConfigurations/fe-lb",
              },
              frontendPort: 3389,
              backendPort: 3389,
              enableFloatingIP: true,
              idleTimeoutInMinutes: 15,
              protocol: "Tcp",
            },
          },
        ],
        inboundNatPools: [],
        outboundRules: [],
      },
    }),
    dependencies: ({}) => ({
      resourceGroup: "myResourceGroup",
      publicIPAddresses: ["myPublicIPAddress"],
    }),
  },
];

```

### Create load balancer with Global Tier and one regional load balancer in its backend pool
```js
exports.createResources = () => [
  {
    type: "LoadBalancer",
    group: "Network",
    name: "myLoadBalancer",
    properties: () => ({
      location: "eastus",
      sku: { name: "Standard", tier: "Global" },
      properties: {
        frontendIPConfigurations: [
          {
            name: "fe-lb",
            properties: {
              subnet: {
                id: "/subscriptions/subid/resourceGroups/rg1/providers/Microsoft.Network/virtualNetworks/vnetlb/subnets/subnetlb",
              },
            },
          },
        ],
        backendAddressPools: [
          {
            name: "be-lb",
            properties: {
              loadBalancerBackendAddresses: [
                {
                  name: "regional-lb1-address",
                  properties: {
                    loadBalancerFrontendIPConfiguration: {
                      id: "/subscriptions/subid/resourceGroups/regional-lb-rg1/providers/Microsoft.Network/loadBalancers/regional-lb/frontendIPConfigurations/fe-rlb",
                    },
                  },
                },
              ],
            },
          },
        ],
        loadBalancingRules: [
          {
            name: "rulelb",
            properties: {
              frontendIPConfiguration: {
                id: "/subscriptions/subid/resourceGroups/rg1/providers/Microsoft.Network/loadBalancers/lb/frontendIPConfigurations/fe-lb",
              },
              frontendPort: 80,
              backendPort: 80,
              enableFloatingIP: false,
              idleTimeoutInMinutes: 15,
              protocol: "Tcp",
              loadDistribution: "Default",
              backendAddressPool: {
                id: "/subscriptions/subid/resourceGroups/rg1/providers/Microsoft.Network/loadBalancers/lb/backendAddressPools/be-lb",
              },
              probe: {
                id: "/subscriptions/subid/resourceGroups/rg1/providers/Microsoft.Network/loadBalancers/lb/probes/probe-lb",
              },
            },
          },
        ],
        probes: [
          {
            name: "probe-lb",
            properties: {
              protocol: "Http",
              port: 80,
              requestPath: "healthcheck.aspx",
              intervalInSeconds: 15,
              numberOfProbes: 2,
            },
          },
        ],
      },
    }),
    dependencies: ({}) => ({
      resourceGroup: "myResourceGroup",
      publicIPAddresses: ["myPublicIPAddress"],
    }),
  },
];

```

### Create load balancer with Frontend IP in Zone 1
```js
exports.createResources = () => [
  {
    type: "LoadBalancer",
    group: "Network",
    name: "myLoadBalancer",
    properties: () => ({
      location: "eastus",
      sku: { name: "Standard" },
      properties: {
        frontendIPConfigurations: [
          {
            name: "fe-lb",
            properties: {
              subnet: {
                id: "/subscriptions/subid/resourceGroups/rg1/providers/Microsoft.Network/virtualNetworks/vnetlb/subnets/subnetlb",
              },
            },
            zones: ["1"],
          },
        ],
        backendAddressPools: [{ name: "be-lb", properties: {} }],
        loadBalancingRules: [
          {
            name: "rulelb",
            properties: {
              frontendIPConfiguration: {
                id: "/subscriptions/subid/resourceGroups/rg1/providers/Microsoft.Network/loadBalancers/lb/frontendIPConfigurations/fe-lb",
              },
              frontendPort: 80,
              backendPort: 80,
              enableFloatingIP: true,
              idleTimeoutInMinutes: 15,
              protocol: "Tcp",
              loadDistribution: "Default",
              backendAddressPool: {
                id: "/subscriptions/subid/resourceGroups/rg1/providers/Microsoft.Network/loadBalancers/lb/backendAddressPools/be-lb",
              },
              probe: {
                id: "/subscriptions/subid/resourceGroups/rg1/providers/Microsoft.Network/loadBalancers/lb/probes/probe-lb",
              },
            },
          },
        ],
        probes: [
          {
            name: "probe-lb",
            properties: {
              protocol: "Http",
              port: 80,
              requestPath: "healthcheck.aspx",
              intervalInSeconds: 15,
              numberOfProbes: 2,
            },
          },
        ],
        inboundNatRules: [
          {
            name: "in-nat-rule",
            properties: {
              frontendIPConfiguration: {
                id: "/subscriptions/subid/resourceGroups/rg1/providers/Microsoft.Network/loadBalancers/lb/frontendIPConfigurations/fe-lb",
              },
              frontendPort: 3389,
              backendPort: 3389,
              enableFloatingIP: true,
              idleTimeoutInMinutes: 15,
              protocol: "Tcp",
            },
          },
        ],
        inboundNatPools: [],
        outboundRules: [],
      },
    }),
    dependencies: ({}) => ({
      resourceGroup: "myResourceGroup",
      publicIPAddresses: ["myPublicIPAddress"],
    }),
  },
];

```

### Create load balancer with inbound nat pool
```js
exports.createResources = () => [
  {
    type: "LoadBalancer",
    group: "Network",
    name: "myLoadBalancer",
    properties: () => ({
      location: "eastus",
      sku: { name: "Standard" },
      properties: {
        frontendIPConfigurations: [
          {
            properties: {
              privateIPAllocationMethod: "Dynamic",
              subnet: {
                id: "/subscriptions/subid/resourceGroups/rg1/providers/Microsoft.Network/virtualNetworks/lbvnet/subnets/lbsubnet",
              },
            },
            name: "test",
            zones: [],
            id: "/subscriptions/subid/resourceGroups/rg1/providers/Microsoft.Network/loadBalancers/lb/frontendIPConfigurations/test",
          },
        ],
        backendAddressPools: [],
        loadBalancingRules: [],
        probes: [],
        inboundNatRules: [],
        outboundRules: [],
        inboundNatPools: [
          {
            properties: {
              frontendIPConfiguration: {
                id: "/subscriptions/subid/resourceGroups/rg1/providers/Microsoft.Network/loadBalancers/lb/frontendIPConfigurations/test",
              },
              protocol: "Tcp",
              frontendPortRangeStart: 8080,
              frontendPortRangeEnd: 8085,
              backendPort: 8888,
              idleTimeoutInMinutes: 10,
              enableFloatingIP: true,
              enableTcpReset: true,
            },
            name: "test",
            id: "/subscriptions/subid/resourceGroups/rg1/providers/Microsoft.Network/loadBalancers/lb/inboundNatPools/test",
          },
        ],
      },
    }),
    dependencies: ({}) => ({
      resourceGroup: "myResourceGroup",
      publicIPAddresses: ["myPublicIPAddress"],
    }),
  },
];

```

### Create load balancer with outbound rules
```js
exports.createResources = () => [
  {
    type: "LoadBalancer",
    group: "Network",
    name: "myLoadBalancer",
    properties: () => ({
      location: "eastus",
      sku: { name: "Standard" },
      properties: {
        frontendIPConfigurations: [
          {
            name: "fe-lb",
            properties: {
              publicIPAddress: {
                id: "/subscriptions/subid/resourceGroups/rg1/providers/Microsoft.Network/publicIPAddresses/pip",
              },
            },
          },
        ],
        backendAddressPools: [{ name: "be-lb", properties: {} }],
        loadBalancingRules: [
          {
            name: "rulelb",
            properties: {
              frontendIPConfiguration: {
                id: "/subscriptions/subid/resourceGroups/rg1/providers/Microsoft.Network/loadBalancers/lb/frontendIPConfigurations/fe-lb",
              },
              backendAddressPool: {
                id: "/subscriptions/subid/resourceGroups/rg1/providers/Microsoft.Network/loadBalancers/lb/backendAddressPools/be-lb",
              },
              probe: {
                id: "/subscriptions/subid/resourceGroups/rg1/providers/Microsoft.Network/loadBalancers/lb/probes/probe-lb",
              },
              protocol: "Tcp",
              loadDistribution: "Default",
              frontendPort: 80,
              backendPort: 80,
              idleTimeoutInMinutes: 15,
              enableFloatingIP: true,
              disableOutboundSnat: true,
            },
          },
        ],
        probes: [
          {
            name: "probe-lb",
            properties: {
              protocol: "Http",
              port: 80,
              requestPath: "healthcheck.aspx",
              intervalInSeconds: 15,
              numberOfProbes: 2,
            },
          },
        ],
        inboundNatRules: [
          {
            name: "in-nat-rule",
            properties: {
              frontendIPConfiguration: {
                id: "/subscriptions/subid/resourceGroups/rg1/providers/Microsoft.Network/loadBalancers/lb/frontendIPConfigurations/fe-lb",
              },
              frontendPort: 3389,
              backendPort: 3389,
              enableFloatingIP: true,
              idleTimeoutInMinutes: 15,
              protocol: "Tcp",
            },
          },
        ],
        inboundNatPools: [],
        outboundRules: [
          {
            name: "rule1",
            properties: {
              backendAddressPool: {
                id: "/subscriptions/subid/resourceGroups/rg1/providers/Microsoft.Network/loadBalancers/lb/backendAddressPools/be-lb",
              },
              frontendIPConfigurations: [
                {
                  id: "/subscriptions/subid/resourceGroups/rg1/providers/Microsoft.Network/loadBalancers/lb/frontendIPConfigurations/fe-lb",
                },
              ],
              protocol: "All",
            },
          },
        ],
      },
    }),
    dependencies: ({}) => ({
      resourceGroup: "myResourceGroup",
      publicIPAddresses: ["myPublicIPAddress"],
    }),
  },
];

```

### Create load balancer with Gateway Load Balancer Consumer configured
```js
exports.createResources = () => [
  {
    type: "LoadBalancer",
    group: "Network",
    name: "myLoadBalancer",
    properties: () => ({
      location: "eastus",
      sku: { name: "Standard" },
      properties: {
        frontendIPConfigurations: [
          {
            name: "fe-lb",
            properties: {
              subnet: {
                id: "/subscriptions/subid/resourceGroups/rg1/providers/Microsoft.Network/virtualNetworks/vnetlb/subnets/subnetlb",
              },
              gatewayLoadBalancer: {
                id: "/subscriptions/subid/resourceGroups/rg1/providers/Microsoft.Network/loadBalancers/lb/frontendIPConfigurations/fe-lb-provider",
              },
            },
          },
        ],
        backendAddressPools: [{ name: "be-lb", properties: {} }],
        loadBalancingRules: [
          {
            name: "rulelb",
            properties: {
              frontendIPConfiguration: {
                id: "/subscriptions/subid/resourceGroups/rg1/providers/Microsoft.Network/loadBalancers/lb/frontendIPConfigurations/fe-lb",
              },
              frontendPort: 80,
              backendPort: 80,
              enableFloatingIP: true,
              idleTimeoutInMinutes: 15,
              protocol: "Tcp",
              loadDistribution: "Default",
              backendAddressPool: {
                id: "/subscriptions/subid/resourceGroups/rg1/providers/Microsoft.Network/loadBalancers/lb/backendAddressPools/be-lb",
              },
              probe: {
                id: "/subscriptions/subid/resourceGroups/rg1/providers/Microsoft.Network/loadBalancers/lb/probes/probe-lb",
              },
            },
          },
        ],
        probes: [
          {
            name: "probe-lb",
            properties: {
              protocol: "Http",
              port: 80,
              requestPath: "healthcheck.aspx",
              intervalInSeconds: 15,
              numberOfProbes: 2,
            },
          },
        ],
        inboundNatRules: [
          {
            name: "in-nat-rule",
            properties: {
              frontendIPConfiguration: {
                id: "/subscriptions/subid/resourceGroups/rg1/providers/Microsoft.Network/loadBalancers/lb/frontendIPConfigurations/fe-lb",
              },
              frontendPort: 3389,
              backendPort: 3389,
              enableFloatingIP: true,
              idleTimeoutInMinutes: 15,
              protocol: "Tcp",
            },
          },
        ],
        inboundNatPools: [],
        outboundRules: [],
      },
    }),
    dependencies: ({}) => ({
      resourceGroup: "myResourceGroup",
      publicIPAddresses: ["myPublicIPAddress"],
    }),
  },
];

```

### Create load balancer with Gateway Load Balancer Provider configured with one Backend Pool
```js
exports.createResources = () => [
  {
    type: "LoadBalancer",
    group: "Network",
    name: "myLoadBalancer",
    properties: () => ({
      location: "eastus",
      sku: { name: "Premium" },
      properties: {
        frontendIPConfigurations: [
          {
            name: "fe-lb",
            properties: {
              subnet: {
                id: "/subscriptions/subid/resourceGroups/rg1/providers/Microsoft.Network/virtualNetworks/vnetlb/subnets/subnetlb",
              },
            },
          },
        ],
        backendAddressPools: [
          {
            name: "be-lb",
            properties: {
              tunnelInterfaces: [
                {
                  port: 15000,
                  identifier: 900,
                  protocol: "VXLAN",
                  type: "Internal",
                },
                {
                  port: 15001,
                  identifier: 901,
                  protocol: "VXLAN",
                  type: "Internal",
                },
              ],
            },
          },
        ],
        loadBalancingRules: [
          {
            name: "rulelb",
            properties: {
              frontendIPConfiguration: {
                id: "/subscriptions/subid/resourceGroups/rg1/providers/Microsoft.Network/loadBalancers/lb/frontendIPConfigurations/fe-lb",
              },
              frontendPort: 0,
              backendPort: 0,
              enableFloatingIP: true,
              idleTimeoutInMinutes: 15,
              protocol: "All",
              loadDistribution: "Default",
              backendAddressPools: [
                {
                  id: "/subscriptions/subid/resourceGroups/rg1/providers/Microsoft.Network/loadBalancers/lb/backendAddressPools/be-lb",
                },
              ],
              probe: {
                id: "/subscriptions/subid/resourceGroups/rg1/providers/Microsoft.Network/loadBalancers/lb/probes/probe-lb",
              },
            },
          },
        ],
        probes: [
          {
            name: "probe-lb",
            properties: {
              protocol: "Http",
              port: 80,
              requestPath: "healthcheck.aspx",
              intervalInSeconds: 15,
              numberOfProbes: 2,
            },
          },
        ],
        inboundNatPools: [],
        outboundRules: [],
      },
    }),
    dependencies: ({}) => ({
      resourceGroup: "myResourceGroup",
      publicIPAddresses: ["myPublicIPAddress"],
    }),
  },
];

```

### Create load balancer with Gateway Load Balancer Provider configured with two Backend Pool
```js
exports.createResources = () => [
  {
    type: "LoadBalancer",
    group: "Network",
    name: "myLoadBalancer",
    properties: () => ({
      location: "eastus",
      sku: { name: "Premium" },
      properties: {
        frontendIPConfigurations: [
          {
            name: "fe-lb",
            properties: {
              subnet: {
                id: "/subscriptions/subid/resourceGroups/rg1/providers/Microsoft.Network/virtualNetworks/vnetlb/subnets/subnetlb",
              },
            },
          },
        ],
        backendAddressPools: [
          { name: "be-lb1", properties: {} },
          { name: "be-lb2", properties: {} },
        ],
        loadBalancingRules: [
          {
            name: "rulelb",
            properties: {
              frontendIPConfiguration: {
                id: "/subscriptions/subid/resourceGroups/rg1/providers/Microsoft.Network/loadBalancers/lb/frontendIPConfigurations/fe-lb",
              },
              frontendPort: 0,
              backendPort: 0,
              enableFloatingIP: true,
              idleTimeoutInMinutes: 15,
              protocol: "All",
              loadDistribution: "Default",
              backendAddressPool: {},
              backendAddressPools: [
                {
                  id: "/subscriptions/subid/resourceGroups/rg1/providers/Microsoft.Network/loadBalancers/lb/backendAddressPools/be-lb1",
                },
                {
                  id: "/subscriptions/subid/resourceGroups/rg1/providers/Microsoft.Network/loadBalancers/lb/backendAddressPools/be-lb2",
                },
              ],
              probe: {
                id: "/subscriptions/subid/resourceGroups/rg1/providers/Microsoft.Network/loadBalancers/lb/probes/probe-lb",
              },
            },
          },
        ],
        probes: [
          {
            name: "probe-lb",
            properties: {
              protocol: "Http",
              port: 80,
              requestPath: "healthcheck.aspx",
              intervalInSeconds: 15,
              numberOfProbes: 2,
            },
          },
        ],
        inboundNatPools: [],
        outboundRules: [],
      },
    }),
    dependencies: ({}) => ({
      resourceGroup: "myResourceGroup",
      publicIPAddresses: ["myPublicIPAddress"],
    }),
  },
];

```
## Dependencies
- [ResourceGroup](../Resources/ResourceGroup.md)
- [PublicIPAddress](../Network/PublicIPAddress.md)
## Swagger Schema
```js
{
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
          'x-ms-enum': { name: 'ExtendedLocationTypes', modelAsString: true }
        }
      }
    },
    sku: {
      description: 'The load balancer SKU.',
      properties: {
        name: {
          type: 'string',
          description: 'Name of a load balancer SKU.',
          enum: [ 'Basic', 'Standard', 'Gateway' ],
          'x-ms-enum': { name: 'LoadBalancerSkuName', modelAsString: true }
        },
        tier: {
          type: 'string',
          description: 'Tier of a load balancer SKU.',
          enum: [ 'Regional', 'Global' ],
          'x-ms-enum': { name: 'LoadBalancerSkuTier', modelAsString: true }
        }
      }
    },
    properties: {
      'x-ms-client-flatten': true,
      description: 'Properties of load balancer.',
      properties: {
        frontendIPConfigurations: {
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
                            default: 'Disabled',
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
          description: 'Object representing the frontend IPs to be used for the load balancer.'
        },
        backendAddressPools: {
          type: 'array',
          items: <ref *2> {
            properties: {
              properties: {
                'x-ms-client-flatten': true,
                description: 'Properties of load balancer backend address pool.',
                properties: {
                  location: {
                    type: 'string',
                    description: 'The location of the backend address pool.'
                  },
                  tunnelInterfaces: {
                    type: 'array',
                    items: {
                      properties: {
                        port: {
                          type: 'integer',
                          format: 'int32',
                          description: 'Port of gateway load balancer tunnel interface.'
                        },
                        identifier: {
                          type: 'integer',
                          format: 'int32',
                          description: 'Identifier of gateway load balancer tunnel interface.'
                        },
                        protocol: {
                          type: 'string',
                          description: 'Protocol of gateway load balancer tunnel interface.',
                          enum: [ 'None', 'Native', 'VXLAN' ],
                          'x-ms-enum': {
                            name: 'GatewayLoadBalancerTunnelProtocol',
                            modelAsString: true
                          }
                        },
                        type: {
                          type: 'string',
                          description: 'Traffic type of gateway load balancer tunnel interface.',
                          enum: [ 'None', 'Internal', 'External' ],
                          'x-ms-enum': {
                            name: 'GatewayLoadBalancerTunnelInterfaceType',
                            modelAsString: true
                          }
                        }
                      },
                      description: 'Gateway load balancer tunnel interface of a load balancer backend address pool.'
                    },
                    description: 'An array of gateway load balancer tunnel interfaces.'
                  },
                  loadBalancerBackendAddresses: {
                    type: 'array',
                    items: {
                      properties: {
                        properties: {
                          'x-ms-client-flatten': true,
                          description: 'Properties of load balancer backend address pool.',
                          properties: {
                            virtualNetwork: {
                              description: 'Reference to an existing virtual network.',
                              properties: { id: [Object] },
                              'x-ms-azure-resource': true
                            },
                            subnet: {
                              description: 'Reference to an existing subnet.',
                              properties: { id: [Object] },
                              'x-ms-azure-resource': true
                            },
                            ipAddress: {
                              type: 'string',
                              description: 'IP Address belonging to the referenced virtual network.',
                              'x-ms-azure-resource': false
                            },
                            networkInterfaceIPConfiguration: {
                              readOnly: true,
                              description: 'Reference to IP address defined in network interfaces.',
                              properties: { id: [Object] },
                              'x-ms-azure-resource': true
                            },
                            loadBalancerFrontendIPConfiguration: {
                              readOnly: false,
                              description: 'Reference to the frontend ip address configuration defined in regional loadbalancer.',
                              properties: { id: [Object] },
                              'x-ms-azure-resource': true
                            },
                            inboundNatRulesPortMapping: {
                              readOnly: true,
                              type: 'array',
                              items: {
                                type: 'object',
                                properties: [Object],
                                description: 'Individual port mappings for inbound NAT rule created for backend pool.'
                              },
                              description: 'Collection of inbound NAT rule port mappings.'
                            },
                            adminState: {
                              type: 'string',
                              description: 'A list of administrative states which once set can override health probe so that Load Balancer will always forward new connections to backend, or deny new connections and reset existing connections.',
                              enum: [ 'None', 'Up', 'Down', 'Drain' ],
                              'x-ms-enum': {
                                name: 'LoadBalancerBackendAddressAdminState',
                                modelAsString: true
                              }
                            }
                          }
                        },
                        name: {
                          type: 'string',
                          description: 'Name of the backend address.'
                        }
                      },
                      description: 'Load balancer backend addresses.'
                    },
                    description: 'An array of backend addresses.'
                  },
                  backendIPConfigurations: {
                    readOnly: true,
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
                              items: [Circular *2],
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
                    description: 'An array of references to IP addresses defined in network interfaces.'
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
                    description: 'An array of references to load balancing rules that use this backend address pool.'
                  },
                  outboundRule: {
                    readOnly: true,
                    description: 'A reference to an outbound rule that uses this backend address pool.',
                    properties: {
                      id: { type: 'string', description: 'Resource ID.' }
                    },
                    'x-ms-azure-resource': true
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
                    description: 'An array of references to outbound rules that use this backend address pool.'
                  },
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
                    description: 'An array of references to inbound NAT rules that use this backend address pool.'
                  },
                  provisioningState: {
                    readOnly: true,
                    description: 'The provisioning state of the backend address pool resource.',
                    type: 'string',
                    enum: [ 'Succeeded', 'Updating', 'Deleting', 'Failed' ],
                    'x-ms-enum': { name: 'ProvisioningState', modelAsString: true }
                  },
                  drainPeriodInSeconds: {
                    type: 'integer',
                    format: 'int32',
                    description: 'Amount of seconds Load Balancer waits for before sending RESET to client and backend address.'
                  }
                }
              },
              name: {
                type: 'string',
                description: 'The name of the resource that is unique within the set of backend address pools used by the load balancer. This name can be used to access the resource.'
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
                properties: { id: { type: 'string', description: 'Resource ID.' } },
                description: 'Reference to another subresource.',
                'x-ms-azure-resource': true
              }
            ],
            description: 'Pool of backend IP addresses.'
          },
          description: 'Collection of backend address pools used by a load balancer.'
        },
        loadBalancingRules: {
          type: 'array',
          items: {
            properties: {
              properties: {
                'x-ms-client-flatten': true,
                description: 'Properties of load balancer load balancing rule.',
                properties: {
                  frontendIPConfiguration: {
                    description: 'A reference to frontend IP addresses.',
                    properties: {
                      id: { type: 'string', description: 'Resource ID.' }
                    },
                    'x-ms-azure-resource': true
                  },
                  backendAddressPool: {
                    description: 'A reference to a pool of DIPs. Inbound traffic is randomly load balanced across IPs in the backend IPs.',
                    properties: {
                      id: { type: 'string', description: 'Resource ID.' }
                    },
                    'x-ms-azure-resource': true
                  },
                  backendAddressPools: {
                    type: 'array',
                    items: {
                      properties: {
                        id: { type: 'string', description: 'Resource ID.' }
                      },
                      description: 'Reference to another subresource.',
                      'x-ms-azure-resource': true
                    },
                    description: 'An array of references to pool of DIPs.'
                  },
                  probe: {
                    description: 'The reference to the load balancer probe used by the load balancing rule.',
                    properties: {
                      id: { type: 'string', description: 'Resource ID.' }
                    },
                    'x-ms-azure-resource': true
                  },
                  protocol: {
                    description: 'The reference to the transport protocol used by the load balancing rule.',
                    type: 'string',
                    enum: [ 'Udp', 'Tcp', 'All' ],
                    'x-ms-enum': { name: 'TransportProtocol', modelAsString: true }
                  },
                  loadDistribution: {
                    type: 'string',
                    description: 'The load distribution policy for this rule.',
                    enum: [ 'Default', 'SourceIP', 'SourceIPProtocol' ],
                    'x-ms-enum': { name: 'LoadDistribution', modelAsString: true }
                  },
                  frontendPort: {
                    type: 'integer',
                    format: 'int32',
                    description: 'The port for the external endpoint. Port numbers for each rule must be unique within the Load Balancer. Acceptable values are between 0 and 65534. Note that value 0 enables "Any Port".'
                  },
                  backendPort: {
                    type: 'integer',
                    format: 'int32',
                    description: 'The port used for internal connections on the endpoint. Acceptable values are between 0 and 65535. Note that value 0 enables "Any Port".'
                  },
                  idleTimeoutInMinutes: {
                    type: 'integer',
                    format: 'int32',
                    description: 'The timeout for the TCP idle connection. The value can be set between 4 and 30 minutes. The default value is 4 minutes. This element is only used when the protocol is set to TCP.'
                  },
                  enableFloatingIP: {
                    type: 'boolean',
                    description: "Configures a virtual machine's endpoint for the floating IP capability required to configure a SQL AlwaysOn Availability Group. This setting is required when using the SQL AlwaysOn Availability Groups in SQL server. This setting can't be changed after you create the endpoint."
                  },
                  enableTcpReset: {
                    type: 'boolean',
                    description: 'Receive bidirectional TCP Reset on TCP flow idle timeout or unexpected connection termination. This element is only used when the protocol is set to TCP.'
                  },
                  disableOutboundSnat: {
                    type: 'boolean',
                    description: 'Configures SNAT for the VMs in the backend pool to use the publicIP address specified in the frontend of the load balancing rule.'
                  },
                  provisioningState: {
                    readOnly: true,
                    description: 'The provisioning state of the load balancing rule resource.',
                    type: 'string',
                    enum: [ 'Succeeded', 'Updating', 'Deleting', 'Failed' ],
                    'x-ms-enum': { name: 'ProvisioningState', modelAsString: true }
                  }
                },
                required: [ 'protocol', 'frontendPort' ]
              },
              name: {
                type: 'string',
                description: 'The name of the resource that is unique within the set of load balancing rules used by the load balancer. This name can be used to access the resource.'
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
                properties: { id: { type: 'string', description: 'Resource ID.' } },
                description: 'Reference to another subresource.',
                'x-ms-azure-resource': true
              }
            ],
            description: 'A load balancing rule for a load balancer.'
          },
          description: 'Object collection representing the load balancing rules Gets the provisioning.'
        },
        probes: {
          type: 'array',
          items: {
            properties: {
              properties: {
                'x-ms-client-flatten': true,
                description: 'Properties of load balancer probe.',
                properties: {
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
                    description: 'The load balancer rules that use this probe.'
                  },
                  protocol: {
                    type: 'string',
                    description: "The protocol of the end point. If 'Tcp' is specified, a received ACK is required for the probe to be successful. If 'Http' or 'Https' is specified, a 200 OK response from the specifies URI is required for the probe to be successful.",
                    enum: [ 'Http', 'Tcp', 'Https' ],
                    'x-ms-enum': { name: 'ProbeProtocol', modelAsString: true }
                  },
                  port: {
                    type: 'integer',
                    format: 'int32',
                    description: 'The port for communicating the probe. Possible values range from 1 to 65535, inclusive.'
                  },
                  intervalInSeconds: {
                    type: 'integer',
                    format: 'int32',
                    description: 'The interval, in seconds, for how frequently to probe the endpoint for health status. Typically, the interval is slightly less than half the allocated timeout period (in seconds) which allows two full probes before taking the instance out of rotation. The default value is 15, the minimum value is 5.'
                  },
                  numberOfProbes: {
                    type: 'integer',
                    format: 'int32',
                    description: 'The number of probes where if no response, will result in stopping further traffic from being delivered to the endpoint. This values allows endpoints to be taken out of rotation faster or slower than the typical times used in Azure.'
                  },
                  requestPath: {
                    type: 'string',
                    description: 'The URI used for requesting health status from the VM. Path is required if a protocol is set to http. Otherwise, it is not allowed. There is no default value.'
                  },
                  provisioningState: {
                    readOnly: true,
                    description: 'The provisioning state of the probe resource.',
                    type: 'string',
                    enum: [ 'Succeeded', 'Updating', 'Deleting', 'Failed' ],
                    'x-ms-enum': { name: 'ProvisioningState', modelAsString: true }
                  }
                },
                required: [ 'protocol', 'port' ]
              },
              name: {
                type: 'string',
                description: 'The name of the resource that is unique within the set of probes used by the load balancer. This name can be used to access the resource.'
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
                properties: { id: { type: 'string', description: 'Resource ID.' } },
                description: 'Reference to another subresource.',
                'x-ms-azure-resource': true
              }
            ],
            description: 'A load balancer probe.'
          },
          description: 'Collection of probe objects used in the load balancer.'
        },
        inboundNatRules: {
          type: 'array',
          items: <ref *3> {
            properties: {
              properties: {
                'x-ms-client-flatten': true,
                description: 'Properties of load balancer inbound NAT rule.',
                properties: {
                  frontendIPConfiguration: {
                    description: 'A reference to frontend IP addresses.',
                    properties: {
                      id: { type: 'string', description: 'Resource ID.' }
                    },
                    'x-ms-azure-resource': true
                  },
                  backendIPConfiguration: {
                    readOnly: true,
                    description: 'A reference to a private IP address defined on a network interface of a VM. Traffic sent to the frontend port of each of the frontend IP configurations is forwarded to the backend IP.',
                    properties: {
                      properties: {
                        'x-ms-client-flatten': true,
                        description: 'Network interface IP configuration properties.',
                        properties: {
                          gatewayLoadBalancer: {
                            description: 'The reference to gateway load balancer frontend IP.',
                            properties: {
                              id: {
                                type: 'string',
                                description: 'Resource ID.'
                              }
                            },
                            'x-ms-azure-resource': true
                          },
                          virtualNetworkTaps: {
                            type: 'array',
                            items: {
                              properties: { properties: [Object], etag: [Object] },
                              allOf: [ [Object] ],
                              description: 'Virtual Network Tap resource.'
                            },
                            description: 'The reference to Virtual Network Taps.'
                          },
                          applicationGatewayBackendAddressPools: {
                            type: 'array',
                            items: {
                              properties: {
                                properties: [Object],
                                name: [Object],
                                etag: [Object],
                                type: [Object]
                              },
                              allOf: [ [Object] ],
                              description: 'Backend Address Pool of an application gateway.'
                            },
                            description: 'The reference to ApplicationGatewayBackendAddressPool resource.'
                          },
                          loadBalancerBackendAddressPools: {
                            type: 'array',
                            items: <ref *2> {
                              properties: {
                                properties: [Object],
                                name: [Object],
                                etag: [Object],
                                type: [Object]
                              },
                              allOf: [ [Object] ],
                              description: 'Pool of backend IP addresses.'
                            },
                            description: 'The reference to LoadBalancerBackendAddressPool resource.'
                          },
                          loadBalancerInboundNatRules: {
                            type: 'array',
                            items: [Circular *3],
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
                            'x-ms-enum': { name: 'IPVersion', modelAsString: true }
                          },
                          subnet: {
                            description: 'Subnet bound to the IP configuration.',
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
                          primary: {
                            type: 'boolean',
                            description: 'Whether this is a primary customer address on the network interface.'
                          },
                          publicIPAddress: {
                            description: 'Public IP address bound to the IP configuration.',
                            properties: <ref *1> {
                              extendedLocation: {
                                description: 'The extended location of the public ip address.',
                                properties: [Object]
                              },
                              sku: {
                                description: 'The public IP address SKU.',
                                properties: [Object]
                              },
                              properties: {
                                'x-ms-client-flatten': true,
                                description: 'Public IP address properties.',
                                properties: [Object]
                              },
                              etag: {
                                readOnly: true,
                                type: 'string',
                                description: 'A unique read-only string that changes whenever the resource is updated.'
                              },
                              zones: {
                                type: 'array',
                                items: [Object],
                                description: 'A list of availability zones denoting the IP allocated for the resource needs to come from.'
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
                          applicationSecurityGroups: {
                            type: 'array',
                            items: {
                              properties: { properties: [Object], etag: [Object] },
                              allOf: [ [Object] ],
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
                              groupId: {
                                type: 'string',
                                readOnly: true,
                                description: 'The group ID for current private link connection.'
                              },
                              requiredMemberName: {
                                type: 'string',
                                readOnly: true,
                                description: 'The required member name for current private link connection.'
                              },
                              fqdns: {
                                type: 'array',
                                items: [Object],
                                readOnly: true,
                                description: 'List of FQDNs for current private link connection.'
                              }
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
                  protocol: {
                    description: 'The reference to the transport protocol used by the load balancing rule.',
                    type: 'string',
                    enum: [ 'Udp', 'Tcp', 'All' ],
                    'x-ms-enum': { name: 'TransportProtocol', modelAsString: true }
                  },
                  frontendPort: {
                    type: 'integer',
                    format: 'int32',
                    description: 'The port for the external endpoint. Port numbers for each rule must be unique within the Load Balancer. Acceptable values range from 1 to 65534.'
                  },
                  backendPort: {
                    type: 'integer',
                    format: 'int32',
                    description: 'The port used for the internal endpoint. Acceptable values range from 1 to 65535.'
                  },
                  idleTimeoutInMinutes: {
                    type: 'integer',
                    format: 'int32',
                    description: 'The timeout for the TCP idle connection. The value can be set between 4 and 30 minutes. The default value is 4 minutes. This element is only used when the protocol is set to TCP.'
                  },
                  enableFloatingIP: {
                    type: 'boolean',
                    description: "Configures a virtual machine's endpoint for the floating IP capability required to configure a SQL AlwaysOn Availability Group. This setting is required when using the SQL AlwaysOn Availability Groups in SQL server. This setting can't be changed after you create the endpoint."
                  },
                  enableTcpReset: {
                    type: 'boolean',
                    description: 'Receive bidirectional TCP Reset on TCP flow idle timeout or unexpected connection termination. This element is only used when the protocol is set to TCP.'
                  },
                  frontendPortRangeStart: {
                    type: 'integer',
                    format: 'int32',
                    description: 'The port range start for the external endpoint. This property is used together with BackendAddressPool and FrontendPortRangeEnd. Individual inbound NAT rule port mappings will be created for each backend address from BackendAddressPool. Acceptable values range from 1 to 65534.'
                  },
                  frontendPortRangeEnd: {
                    type: 'integer',
                    format: 'int32',
                    description: 'The port range end for the external endpoint. This property is used together with BackendAddressPool and FrontendPortRangeStart. Individual inbound NAT rule port mappings will be created for each backend address from BackendAddressPool. Acceptable values range from 1 to 65534.'
                  },
                  backendAddressPool: {
                    description: 'A reference to backendAddressPool resource.',
                    properties: {
                      id: { type: 'string', description: 'Resource ID.' }
                    },
                    'x-ms-azure-resource': true
                  },
                  provisioningState: {
                    readOnly: true,
                    description: 'The provisioning state of the inbound NAT rule resource.',
                    type: 'string',
                    enum: [ 'Succeeded', 'Updating', 'Deleting', 'Failed' ],
                    'x-ms-enum': { name: 'ProvisioningState', modelAsString: true }
                  }
                }
              },
              name: {
                type: 'string',
                description: 'The name of the resource that is unique within the set of inbound NAT rules used by the load balancer. This name can be used to access the resource.'
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
                properties: { id: { type: 'string', description: 'Resource ID.' } },
                description: 'Reference to another subresource.',
                'x-ms-azure-resource': true
              }
            ],
            description: 'Inbound NAT rule of the load balancer.'
          },
          description: 'Collection of inbound NAT Rules used by a load balancer. Defining inbound NAT rules on your load balancer is mutually exclusive with defining an inbound NAT pool. Inbound NAT pools are referenced from virtual machine scale sets. NICs that are associated with individual virtual machines cannot reference an Inbound NAT pool. They have to reference individual inbound NAT rules.'
        },
        inboundNatPools: {
          type: 'array',
          items: {
            properties: {
              properties: {
                'x-ms-client-flatten': true,
                description: 'Properties of load balancer inbound nat pool.',
                properties: {
                  frontendIPConfiguration: {
                    description: 'A reference to frontend IP addresses.',
                    properties: {
                      id: { type: 'string', description: 'Resource ID.' }
                    },
                    'x-ms-azure-resource': true
                  },
                  protocol: {
                    description: 'The reference to the transport protocol used by the inbound NAT pool.',
                    type: 'string',
                    enum: [ 'Udp', 'Tcp', 'All' ],
                    'x-ms-enum': { name: 'TransportProtocol', modelAsString: true }
                  },
                  frontendPortRangeStart: {
                    type: 'integer',
                    format: 'int32',
                    description: 'The first port number in the range of external ports that will be used to provide Inbound Nat to NICs associated with a load balancer. Acceptable values range between 1 and 65534.'
                  },
                  frontendPortRangeEnd: {
                    type: 'integer',
                    format: 'int32',
                    description: 'The last port number in the range of external ports that will be used to provide Inbound Nat to NICs associated with a load balancer. Acceptable values range between 1 and 65535.'
                  },
                  backendPort: {
                    type: 'integer',
                    format: 'int32',
                    description: 'The port used for internal connections on the endpoint. Acceptable values are between 1 and 65535.'
                  },
                  idleTimeoutInMinutes: {
                    type: 'integer',
                    format: 'int32',
                    description: 'The timeout for the TCP idle connection. The value can be set between 4 and 30 minutes. The default value is 4 minutes. This element is only used when the protocol is set to TCP.'
                  },
                  enableFloatingIP: {
                    type: 'boolean',
                    description: "Configures a virtual machine's endpoint for the floating IP capability required to configure a SQL AlwaysOn Availability Group. This setting is required when using the SQL AlwaysOn Availability Groups in SQL server. This setting can't be changed after you create the endpoint."
                  },
                  enableTcpReset: {
                    type: 'boolean',
                    description: 'Receive bidirectional TCP Reset on TCP flow idle timeout or unexpected connection termination. This element is only used when the protocol is set to TCP.'
                  },
                  provisioningState: {
                    readOnly: true,
                    description: 'The provisioning state of the inbound NAT pool resource.',
                    type: 'string',
                    enum: [ 'Succeeded', 'Updating', 'Deleting', 'Failed' ],
                    'x-ms-enum': { name: 'ProvisioningState', modelAsString: true }
                  }
                },
                required: [
                  'protocol',
                  'frontendPortRangeStart',
                  'frontendPortRangeEnd',
                  'backendPort'
                ]
              },
              name: {
                type: 'string',
                description: 'The name of the resource that is unique within the set of inbound NAT pools used by the load balancer. This name can be used to access the resource.'
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
                properties: { id: { type: 'string', description: 'Resource ID.' } },
                description: 'Reference to another subresource.',
                'x-ms-azure-resource': true
              }
            ],
            description: 'Inbound NAT pool of the load balancer.'
          },
          description: 'Defines an external port range for inbound NAT to a single backend port on NICs associated with a load balancer. Inbound NAT rules are created automatically for each NIC associated with the Load Balancer using an external port from this range. Defining an Inbound NAT pool on your Load Balancer is mutually exclusive with defining inbound NAT rules. Inbound NAT pools are referenced from virtual machine scale sets. NICs that are associated with individual virtual machines cannot reference an inbound NAT pool. They have to reference individual inbound NAT rules.'
        },
        outboundRules: {
          type: 'array',
          items: {
            properties: {
              properties: {
                'x-ms-client-flatten': true,
                description: 'Properties of load balancer outbound rule.',
                properties: {
                  allocatedOutboundPorts: {
                    type: 'integer',
                    format: 'int32',
                    description: 'The number of outbound ports to be used for NAT.'
                  },
                  frontendIPConfigurations: {
                    type: 'array',
                    items: {
                      properties: {
                        id: { type: 'string', description: 'Resource ID.' }
                      },
                      description: 'Reference to another subresource.',
                      'x-ms-azure-resource': true
                    },
                    description: 'The Frontend IP addresses of the load balancer.'
                  },
                  backendAddressPool: {
                    description: 'A reference to a pool of DIPs. Outbound traffic is randomly load balanced across IPs in the backend IPs.',
                    properties: {
                      id: { type: 'string', description: 'Resource ID.' }
                    },
                    'x-ms-azure-resource': true
                  },
                  provisioningState: {
                    readOnly: true,
                    description: 'The provisioning state of the outbound rule resource.',
                    type: 'string',
                    enum: [ 'Succeeded', 'Updating', 'Deleting', 'Failed' ],
                    'x-ms-enum': { name: 'ProvisioningState', modelAsString: true }
                  },
                  protocol: {
                    type: 'string',
                    description: 'The protocol for the outbound rule in load balancer.',
                    enum: [ 'Tcp', 'Udp', 'All' ],
                    'x-ms-enum': {
                      name: 'LoadBalancerOutboundRuleProtocol',
                      modelAsString: true
                    }
                  },
                  enableTcpReset: {
                    type: 'boolean',
                    description: 'Receive bidirectional TCP Reset on TCP flow idle timeout or unexpected connection termination. This element is only used when the protocol is set to TCP.'
                  },
                  idleTimeoutInMinutes: {
                    type: 'integer',
                    description: 'The timeout for the TCP idle connection.'
                  }
                },
                required: [
                  'backendAddressPool',
                  'frontendIPConfigurations',
                  'protocol'
                ]
              },
              name: {
                type: 'string',
                description: 'The name of the resource that is unique within the set of outbound rules used by the load balancer. This name can be used to access the resource.'
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
                properties: { id: { type: 'string', description: 'Resource ID.' } },
                description: 'Reference to another subresource.',
                'x-ms-azure-resource': true
              }
            ],
            description: 'Outbound rule of the load balancer.'
          },
          description: 'The outbound rules.'
        },
        resourceGuid: {
          readOnly: true,
          type: 'string',
          description: 'The resource GUID property of the load balancer resource.'
        },
        provisioningState: {
          readOnly: true,
          description: 'The provisioning state of the load balancer resource.',
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
  description: 'LoadBalancer resource.'
}
```
## Misc
The resource version is `2022-01-01`.

The Swagger schema used to generate this documentation can be found [here](https://github.com/Azure/azure-rest-api-specs/tree/main/specification/network/resource-manager/Microsoft.Network/stable/2022-01-01/loadBalancer.json).
