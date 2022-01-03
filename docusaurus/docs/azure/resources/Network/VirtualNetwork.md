---
id: VirtualNetwork
title: VirtualNetwork
---
Provides a **VirtualNetwork** from the **Network** group
## Examples
### Create virtual network
```js
provider.Network.makeVirtualNetwork({
  name: "myVirtualNetwork",
  properties: () => ({
    properties: {
      addressSpace: { addressPrefixes: ["10.0.0.0/16"] },
      flowTimeoutInMinutes: 10,
    },
    location: "eastus",
  }),
  dependencies: ({ resources }) => ({
    resourceGroup: resources.Resources.ResourceGroup["myResourceGroup"],
    natGateway: resources.Network.NatGateway["myNatGateway"],
    ddosProtectionPlan:
      resources.Network.DdosProtectionPlan["myDdosProtectionPlan"],
  }),
});

```

### Create virtual network with subnet
```js
provider.Network.makeVirtualNetwork({
  name: "myVirtualNetwork",
  properties: () => ({
    properties: {
      addressSpace: { addressPrefixes: ["10.0.0.0/16"] },
      subnets: [
        { name: "test-1", properties: { addressPrefix: "10.0.0.0/24" } },
      ],
    },
    location: "eastus",
  }),
  dependencies: ({ resources }) => ({
    resourceGroup: resources.Resources.ResourceGroup["myResourceGroup"],
    natGateway: resources.Network.NatGateway["myNatGateway"],
    ddosProtectionPlan:
      resources.Network.DdosProtectionPlan["myDdosProtectionPlan"],
  }),
});

```

### Create virtual network with subnet containing address prefixes
```js
provider.Network.makeVirtualNetwork({
  name: "myVirtualNetwork",
  properties: () => ({
    properties: {
      addressSpace: { addressPrefixes: ["10.0.0.0/16"] },
      subnets: [
        {
          name: "test-2",
          properties: { addressPrefixes: ["10.0.0.0/28", "10.0.1.0/28"] },
        },
      ],
    },
    location: "eastus",
  }),
  dependencies: ({ resources }) => ({
    resourceGroup: resources.Resources.ResourceGroup["myResourceGroup"],
    natGateway: resources.Network.NatGateway["myNatGateway"],
    ddosProtectionPlan:
      resources.Network.DdosProtectionPlan["myDdosProtectionPlan"],
  }),
});

```

### Create virtual network with Bgp Communities
```js
provider.Network.makeVirtualNetwork({
  name: "myVirtualNetwork",
  properties: () => ({
    properties: {
      addressSpace: { addressPrefixes: ["10.0.0.0/16"] },
      subnets: [
        { name: "test-1", properties: { addressPrefix: "10.0.0.0/24" } },
      ],
      bgpCommunities: { virtualNetworkCommunity: "12076:20000" },
    },
    location: "eastus",
  }),
  dependencies: ({ resources }) => ({
    resourceGroup: resources.Resources.ResourceGroup["myResourceGroup"],
    natGateway: resources.Network.NatGateway["myNatGateway"],
    ddosProtectionPlan:
      resources.Network.DdosProtectionPlan["myDdosProtectionPlan"],
  }),
});

```

### Create virtual network with service endpoints
```js
provider.Network.makeVirtualNetwork({
  name: "myVirtualNetwork",
  properties: () => ({
    properties: {
      addressSpace: { addressPrefixes: ["10.0.0.0/16"] },
      subnets: [
        {
          name: "test-1",
          properties: {
            addressPrefix: "10.0.0.0/16",
            serviceEndpoints: [{ service: "Microsoft.Storage" }],
          },
        },
      ],
    },
    location: "eastus",
  }),
  dependencies: ({ resources }) => ({
    resourceGroup: resources.Resources.ResourceGroup["myResourceGroup"],
    natGateway: resources.Network.NatGateway["myNatGateway"],
    ddosProtectionPlan:
      resources.Network.DdosProtectionPlan["myDdosProtectionPlan"],
  }),
});

```

### Create virtual network with service endpoints and service endpoint policy
```js
provider.Network.makeVirtualNetwork({
  name: "myVirtualNetwork",
  properties: () => ({
    properties: {
      addressSpace: { addressPrefixes: ["10.0.0.0/16"] },
      subnets: [
        {
          name: "test-1",
          properties: {
            addressPrefix: "10.0.0.0/16",
            serviceEndpoints: [{ service: "Microsoft.Storage" }],
            serviceEndpointPolicies: [
              {
                id: "/subscriptions/subid/resourceGroups/vnetTest/providers/Microsoft.Network/serviceEndpointPolicies/ServiceEndpointPolicy1",
              },
            ],
          },
        },
      ],
    },
    location: "eastus2euap",
  }),
  dependencies: ({ resources }) => ({
    resourceGroup: resources.Resources.ResourceGroup["myResourceGroup"],
    natGateway: resources.Network.NatGateway["myNatGateway"],
    ddosProtectionPlan:
      resources.Network.DdosProtectionPlan["myDdosProtectionPlan"],
  }),
});

```

### Create virtual network with delegated subnets
```js
provider.Network.makeVirtualNetwork({
  name: "myVirtualNetwork",
  properties: () => ({
    properties: {
      addressSpace: { addressPrefixes: ["10.0.0.0/16"] },
      subnets: [
        {
          name: "test-1",
          properties: {
            addressPrefix: "10.0.0.0/24",
            delegations: [
              {
                name: "myDelegation",
                properties: { serviceName: "Microsoft.Sql/managedInstances" },
              },
            ],
          },
        },
      ],
    },
    location: "westcentralus",
  }),
  dependencies: ({ resources }) => ({
    resourceGroup: resources.Resources.ResourceGroup["myResourceGroup"],
    natGateway: resources.Network.NatGateway["myNatGateway"],
    ddosProtectionPlan:
      resources.Network.DdosProtectionPlan["myDdosProtectionPlan"],
  }),
});

```

### Create virtual network with encryption
```js
provider.Network.makeVirtualNetwork({
  name: "myVirtualNetwork",
  properties: () => ({
    properties: {
      addressSpace: { addressPrefixes: ["10.0.0.0/16"] },
      subnets: [
        { name: "test-1", properties: { addressPrefix: "10.0.0.0/24" } },
      ],
      encryption: { enabled: true, enforcement: "AllowUnencrypted" },
    },
    location: "eastus",
  }),
  dependencies: ({ resources }) => ({
    resourceGroup: resources.Resources.ResourceGroup["myResourceGroup"],
    natGateway: resources.Network.NatGateway["myNatGateway"],
    ddosProtectionPlan:
      resources.Network.DdosProtectionPlan["myDdosProtectionPlan"],
  }),
});

```
## Dependencies
- [ResourceGroup](../Resources/ResourceGroup.md)
- [NatGateway](../Network/NatGateway.md)
- [DdosProtectionPlan](../Network/DdosProtectionPlan.md)
## Misc
The resource version is `2021-05-01`.

The Swagger schema used to generate this documentation can be found [here](https://github.com/Azure/azure-rest-api-specs/tree/main/specification/network/resource-manager/Microsoft.Network/stable/2021-05-01/virtualNetwork.json).
