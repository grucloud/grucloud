---
id: LoadBalancer
title: LoadBalancer
---
Provides a **LoadBalancer** from the **Network** group
## Examples
### Create load balancer
```js
provider.Network.makeLoadBalancer({
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
  dependencies: ({ resources }) => ({
    resourceGroup: resources.Resources.ResourceGroup["myResourceGroup"],
    natGateway: resources.Network.NatGateway["myNatGateway"],
    ddosCustomPolicy: resources.Network.DdosCustomPolicy["myDdosCustomPolicy"],
    publicIpPrefix: resources.Network.PublicIPPrefix["myPublicIPPrefix"],
    configuration: resources.DBforPostgreSQL.Configuration["myConfiguration"],
    loadBalancerBackendAddressPool:
      resources.Network.LoadBalancerBackendAddressPool[
        "myLoadBalancerBackendAddressPool"
      ],
  }),
});

```

### Create load balancer with Standard SKU
```js
provider.Network.makeLoadBalancer({
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
  dependencies: ({ resources }) => ({
    resourceGroup: resources.Resources.ResourceGroup["myResourceGroup"],
    natGateway: resources.Network.NatGateway["myNatGateway"],
    ddosCustomPolicy: resources.Network.DdosCustomPolicy["myDdosCustomPolicy"],
    publicIpPrefix: resources.Network.PublicIPPrefix["myPublicIPPrefix"],
    configuration: resources.DBforPostgreSQL.Configuration["myConfiguration"],
    loadBalancerBackendAddressPool:
      resources.Network.LoadBalancerBackendAddressPool[
        "myLoadBalancerBackendAddressPool"
      ],
  }),
});

```

### Create load balancer with Global Tier and one regional load balancer in its backend pool
```js
provider.Network.makeLoadBalancer({
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
  dependencies: ({ resources }) => ({
    resourceGroup: resources.Resources.ResourceGroup["myResourceGroup"],
    natGateway: resources.Network.NatGateway["myNatGateway"],
    ddosCustomPolicy: resources.Network.DdosCustomPolicy["myDdosCustomPolicy"],
    publicIpPrefix: resources.Network.PublicIPPrefix["myPublicIPPrefix"],
    configuration: resources.DBforPostgreSQL.Configuration["myConfiguration"],
    loadBalancerBackendAddressPool:
      resources.Network.LoadBalancerBackendAddressPool[
        "myLoadBalancerBackendAddressPool"
      ],
  }),
});

```

### Create load balancer with Frontend IP in Zone 1
```js
provider.Network.makeLoadBalancer({
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
  dependencies: ({ resources }) => ({
    resourceGroup: resources.Resources.ResourceGroup["myResourceGroup"],
    natGateway: resources.Network.NatGateway["myNatGateway"],
    ddosCustomPolicy: resources.Network.DdosCustomPolicy["myDdosCustomPolicy"],
    publicIpPrefix: resources.Network.PublicIPPrefix["myPublicIPPrefix"],
    configuration: resources.DBforPostgreSQL.Configuration["myConfiguration"],
    loadBalancerBackendAddressPool:
      resources.Network.LoadBalancerBackendAddressPool[
        "myLoadBalancerBackendAddressPool"
      ],
  }),
});

```

### Create load balancer with inbound nat pool
```js
provider.Network.makeLoadBalancer({
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
  dependencies: ({ resources }) => ({
    resourceGroup: resources.Resources.ResourceGroup["myResourceGroup"],
    natGateway: resources.Network.NatGateway["myNatGateway"],
    ddosCustomPolicy: resources.Network.DdosCustomPolicy["myDdosCustomPolicy"],
    publicIpPrefix: resources.Network.PublicIPPrefix["myPublicIPPrefix"],
    configuration: resources.DBforPostgreSQL.Configuration["myConfiguration"],
    loadBalancerBackendAddressPool:
      resources.Network.LoadBalancerBackendAddressPool[
        "myLoadBalancerBackendAddressPool"
      ],
  }),
});

```

### Create load balancer with outbound rules
```js
provider.Network.makeLoadBalancer({
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
  dependencies: ({ resources }) => ({
    resourceGroup: resources.Resources.ResourceGroup["myResourceGroup"],
    natGateway: resources.Network.NatGateway["myNatGateway"],
    ddosCustomPolicy: resources.Network.DdosCustomPolicy["myDdosCustomPolicy"],
    publicIpPrefix: resources.Network.PublicIPPrefix["myPublicIPPrefix"],
    configuration: resources.DBforPostgreSQL.Configuration["myConfiguration"],
    loadBalancerBackendAddressPool:
      resources.Network.LoadBalancerBackendAddressPool[
        "myLoadBalancerBackendAddressPool"
      ],
  }),
});

```

### Create load balancer with Gateway Load Balancer Consumer configured
```js
provider.Network.makeLoadBalancer({
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
  dependencies: ({ resources }) => ({
    resourceGroup: resources.Resources.ResourceGroup["myResourceGroup"],
    natGateway: resources.Network.NatGateway["myNatGateway"],
    ddosCustomPolicy: resources.Network.DdosCustomPolicy["myDdosCustomPolicy"],
    publicIpPrefix: resources.Network.PublicIPPrefix["myPublicIPPrefix"],
    configuration: resources.DBforPostgreSQL.Configuration["myConfiguration"],
    loadBalancerBackendAddressPool:
      resources.Network.LoadBalancerBackendAddressPool[
        "myLoadBalancerBackendAddressPool"
      ],
  }),
});

```

### Create load balancer with Gateway Load Balancer Provider configured with one Backend Pool
```js
provider.Network.makeLoadBalancer({
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
  dependencies: ({ resources }) => ({
    resourceGroup: resources.Resources.ResourceGroup["myResourceGroup"],
    natGateway: resources.Network.NatGateway["myNatGateway"],
    ddosCustomPolicy: resources.Network.DdosCustomPolicy["myDdosCustomPolicy"],
    publicIpPrefix: resources.Network.PublicIPPrefix["myPublicIPPrefix"],
    configuration: resources.DBforPostgreSQL.Configuration["myConfiguration"],
    loadBalancerBackendAddressPool:
      resources.Network.LoadBalancerBackendAddressPool[
        "myLoadBalancerBackendAddressPool"
      ],
  }),
});

```

### Create load balancer with Gateway Load Balancer Provider configured with two Backend Pool
```js
provider.Network.makeLoadBalancer({
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
  dependencies: ({ resources }) => ({
    resourceGroup: resources.Resources.ResourceGroup["myResourceGroup"],
    natGateway: resources.Network.NatGateway["myNatGateway"],
    ddosCustomPolicy: resources.Network.DdosCustomPolicy["myDdosCustomPolicy"],
    publicIpPrefix: resources.Network.PublicIPPrefix["myPublicIPPrefix"],
    configuration: resources.DBforPostgreSQL.Configuration["myConfiguration"],
    loadBalancerBackendAddressPool:
      resources.Network.LoadBalancerBackendAddressPool[
        "myLoadBalancerBackendAddressPool"
      ],
  }),
});

```
## Dependencies
- [ResourceGroup](../Resources/ResourceGroup.md)
- [NatGateway](../Network/NatGateway.md)
- [DdosCustomPolicy](../Network/DdosCustomPolicy.md)
- [PublicIPPrefix](../Network/PublicIPPrefix.md)
- [Configuration](../DBforPostgreSQL/Configuration.md)
- [LoadBalancerBackendAddressPool](../Network/LoadBalancerBackendAddressPool.md)
## Misc
The resource version is `2021-05-01`.

The Swagger schema used to generate this documentation can be found [here](https://github.com/Azure/azure-rest-api-specs/tree/main/specification/network/resource-manager/Microsoft.Network/stable/2021-05-01/loadBalancer.json).
