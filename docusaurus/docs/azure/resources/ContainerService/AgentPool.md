---
id: AgentPool
title: AgentPool
---
Provides a **AgentPool** from the **ContainerService** group
## Examples
### Create/Update Agent Pool
```js
provider.ContainerService.makeAgentPool({
  name: "myAgentPool",
  properties: () => ({
    properties: {
      orchestratorVersion: "",
      count: 3,
      vmSize: "Standard_DS1_v2",
      osType: "Linux",
      tags: { name1: "val1" },
      nodeLabels: { key1: "val1" },
      nodeTaints: ["Key1=Value1:NoSchedule"],
      scaleSetPriority: "Spot",
      scaleSetEvictionPolicy: "Delete",
      mode: "User",
    },
  }),
  dependencies: ({ resources }) => ({
    resourceGroup: resources.Resources.ResourceGroup["myResourceGroup"],
    resource: resources.ContainerService.ManagedCluster["myManagedCluster"],
  }),
});

```

### Update Agent Pool
```js
provider.ContainerService.makeAgentPool({
  name: "myAgentPool",
  properties: () => ({
    properties: {
      orchestratorVersion: "",
      count: 3,
      enableAutoScaling: true,
      minCount: 2,
      maxCount: 2,
      vmSize: "Standard_DS1_v2",
      osType: "Linux",
      nodeTaints: ["Key1=Value1:NoSchedule"],
      scaleSetPriority: "Spot",
      scaleSetEvictionPolicy: "Delete",
    },
  }),
  dependencies: ({ resources }) => ({
    resourceGroup: resources.Resources.ResourceGroup["myResourceGroup"],
    resource: resources.ContainerService.ManagedCluster["myManagedCluster"],
  }),
});

```

### Create Spot Agent Pool
```js
provider.ContainerService.makeAgentPool({
  name: "myAgentPool",
  properties: () => ({
    properties: {
      orchestratorVersion: "",
      count: 3,
      vmSize: "Standard_DS1_v2",
      osType: "Linux",
      tags: { name1: "val1" },
      nodeLabels: { key1: "val1" },
      nodeTaints: ["Key1=Value1:NoSchedule"],
      scaleSetPriority: "Spot",
      scaleSetEvictionPolicy: "Delete",
    },
  }),
  dependencies: ({ resources }) => ({
    resourceGroup: resources.Resources.ResourceGroup["myResourceGroup"],
    resource: resources.ContainerService.ManagedCluster["myManagedCluster"],
  }),
});

```

### Create Agent Pool with PPG
```js
provider.ContainerService.makeAgentPool({
  name: "myAgentPool",
  properties: () => ({
    properties: {
      orchestratorVersion: "",
      count: 3,
      vmSize: "Standard_DS2_v2",
      osType: "Linux",
      proximityPlacementGroupID:
        "/subscriptions/subid1/resourcegroups/rg1/providers//Microsoft.Compute/proximityPlacementGroups/ppg1",
    },
  }),
  dependencies: ({ resources }) => ({
    resourceGroup: resources.Resources.ResourceGroup["myResourceGroup"],
    resource: resources.ContainerService.ManagedCluster["myManagedCluster"],
  }),
});

```

### Create Agent Pool with OSSKU
```js
provider.ContainerService.makeAgentPool({
  name: "myAgentPool",
  properties: () => ({
    properties: {
      orchestratorVersion: "",
      count: 3,
      vmSize: "Standard_DS2_v2",
      osType: "Linux",
      osSKU: "CBLMariner",
      kubeletConfig: {
        cpuManagerPolicy: "static",
        cpuCfsQuota: true,
        cpuCfsQuotaPeriod: "200ms",
        imageGcHighThreshold: 90,
        imageGcLowThreshold: 70,
        topologyManagerPolicy: "best-effort",
        allowedUnsafeSysctls: ["kernel.msg*", "net.core.somaxconn"],
        failSwapOn: false,
      },
      linuxOSConfig: {
        sysctls: {
          netCoreWmemDefault: 12345,
          netIpv4TcpTwReuse: true,
          netIpv4IpLocalPortRange: "20000 60000",
          kernelThreadsMax: 99999,
        },
        transparentHugePageEnabled: "always",
        transparentHugePageDefrag: "madvise",
        swapFileSizeMB: 1500,
      },
    },
  }),
  dependencies: ({ resources }) => ({
    resourceGroup: resources.Resources.ResourceGroup["myResourceGroup"],
    resource: resources.ContainerService.ManagedCluster["myManagedCluster"],
  }),
});

```

### Create Agent Pool with GPUMIG
```js
provider.ContainerService.makeAgentPool({
  name: "myAgentPool",
  properties: () => ({
    properties: {
      orchestratorVersion: "",
      count: 3,
      vmSize: "Standard_ND96asr_v4",
      osType: "Linux",
      gpuInstanceProfile: "MIG2g",
      kubeletConfig: {
        cpuManagerPolicy: "static",
        cpuCfsQuota: true,
        cpuCfsQuotaPeriod: "200ms",
        imageGcHighThreshold: 90,
        imageGcLowThreshold: 70,
        topologyManagerPolicy: "best-effort",
        allowedUnsafeSysctls: ["kernel.msg*", "net.core.somaxconn"],
        failSwapOn: false,
      },
      linuxOSConfig: {
        sysctls: {
          netCoreWmemDefault: 12345,
          netIpv4TcpTwReuse: true,
          netIpv4IpLocalPortRange: "20000 60000",
          kernelThreadsMax: 99999,
        },
        transparentHugePageEnabled: "always",
        transparentHugePageDefrag: "madvise",
        swapFileSizeMB: 1500,
      },
    },
  }),
  dependencies: ({ resources }) => ({
    resourceGroup: resources.Resources.ResourceGroup["myResourceGroup"],
    resource: resources.ContainerService.ManagedCluster["myManagedCluster"],
  }),
});

```

### Create Agent Pool with Ephemeral OS Disk
```js
provider.ContainerService.makeAgentPool({
  name: "myAgentPool",
  properties: () => ({
    properties: {
      orchestratorVersion: "",
      count: 3,
      vmSize: "Standard_DS2_v2",
      osType: "Linux",
      osDiskType: "Ephemeral",
      osDiskSizeGB: 64,
    },
  }),
  dependencies: ({ resources }) => ({
    resourceGroup: resources.Resources.ResourceGroup["myResourceGroup"],
    resource: resources.ContainerService.ManagedCluster["myManagedCluster"],
  }),
});

```

### Create Agent Pool with KubeletConfig and LinuxOSConfig
```js
provider.ContainerService.makeAgentPool({
  name: "myAgentPool",
  properties: () => ({
    properties: {
      orchestratorVersion: "",
      count: 3,
      vmSize: "Standard_DS2_v2",
      osType: "Linux",
      kubeletConfig: {
        cpuManagerPolicy: "static",
        cpuCfsQuota: true,
        cpuCfsQuotaPeriod: "200ms",
        imageGcHighThreshold: 90,
        imageGcLowThreshold: 70,
        topologyManagerPolicy: "best-effort",
        allowedUnsafeSysctls: ["kernel.msg*", "net.core.somaxconn"],
        failSwapOn: false,
      },
      linuxOSConfig: {
        sysctls: {
          netCoreWmemDefault: 12345,
          netIpv4TcpTwReuse: true,
          netIpv4IpLocalPortRange: "20000 60000",
          kernelThreadsMax: 99999,
        },
        transparentHugePageEnabled: "always",
        transparentHugePageDefrag: "madvise",
        swapFileSizeMB: 1500,
      },
    },
  }),
  dependencies: ({ resources }) => ({
    resourceGroup: resources.Resources.ResourceGroup["myResourceGroup"],
    resource: resources.ContainerService.ManagedCluster["myManagedCluster"],
  }),
});

```

### Create Agent Pool with EncryptionAtHost enabled
```js
provider.ContainerService.makeAgentPool({
  name: "myAgentPool",
  properties: () => ({
    properties: {
      orchestratorVersion: "",
      count: 3,
      vmSize: "Standard_DS2_v2",
      osType: "Linux",
      enableEncryptionAtHost: true,
    },
  }),
  dependencies: ({ resources }) => ({
    resourceGroup: resources.Resources.ResourceGroup["myResourceGroup"],
    resource: resources.ContainerService.ManagedCluster["myManagedCluster"],
  }),
});

```

### Create Agent Pool with UltraSSD enabled
```js
provider.ContainerService.makeAgentPool({
  name: "myAgentPool",
  properties: () => ({
    properties: {
      orchestratorVersion: "",
      count: 3,
      vmSize: "Standard_DS2_v2",
      osType: "Linux",
      enableUltraSSD: true,
    },
  }),
  dependencies: ({ resources }) => ({
    resourceGroup: resources.Resources.ResourceGroup["myResourceGroup"],
    resource: resources.ContainerService.ManagedCluster["myManagedCluster"],
  }),
});

```

### Create Agent Pool with FIPS enabled OS
```js
provider.ContainerService.makeAgentPool({
  name: "myAgentPool",
  properties: () => ({
    properties: {
      orchestratorVersion: "",
      count: 3,
      vmSize: "Standard_DS2_v2",
      osType: "Linux",
      enableFIPS: true,
    },
  }),
  dependencies: ({ resources }) => ({
    resourceGroup: resources.Resources.ResourceGroup["myResourceGroup"],
    resource: resources.ContainerService.ManagedCluster["myManagedCluster"],
  }),
});

```

### Create Agent Pool using an agent pool snapshot
```js
provider.ContainerService.makeAgentPool({
  name: "myAgentPool",
  properties: () => ({
    properties: {
      orchestratorVersion: "",
      count: 3,
      vmSize: "Standard_DS2_v2",
      osType: "Linux",
      enableFIPS: true,
      creationData: {
        sourceResourceId:
          "/subscriptions/subid1/resourceGroups/rg1/providers/Microsoft.ContainerService/snapshots/snapshot1",
      },
    },
  }),
  dependencies: ({ resources }) => ({
    resourceGroup: resources.Resources.ResourceGroup["myResourceGroup"],
    resource: resources.ContainerService.ManagedCluster["myManagedCluster"],
  }),
});

```

### Create Agent Pool with Krustlet and the WASI runtime
```js
provider.ContainerService.makeAgentPool({
  name: "myAgentPool",
  properties: () => ({
    properties: {
      orchestratorVersion: "",
      count: 3,
      vmSize: "Standard_DS2_v2",
      osType: "Linux",
      osDiskSizeGB: 64,
      mode: "User",
      workloadRuntime: "WasmWasi",
    },
  }),
  dependencies: ({ resources }) => ({
    resourceGroup: resources.Resources.ResourceGroup["myResourceGroup"],
    resource: resources.ContainerService.ManagedCluster["myManagedCluster"],
  }),
});

```

### Stop Agent Pool
```js
provider.ContainerService.makeAgentPool({
  name: "myAgentPool",
  properties: () => ({ properties: { powerState: { code: "Stopped" } } }),
  dependencies: ({ resources }) => ({
    resourceGroup: resources.Resources.ResourceGroup["myResourceGroup"],
    resource: resources.ContainerService.ManagedCluster["myManagedCluster"],
  }),
});

```

### Start Agent Pool
```js
provider.ContainerService.makeAgentPool({
  name: "myAgentPool",
  properties: () => ({ properties: { powerState: { code: "Running" } } }),
  dependencies: ({ resources }) => ({
    resourceGroup: resources.Resources.ResourceGroup["myResourceGroup"],
    resource: resources.ContainerService.ManagedCluster["myManagedCluster"],
  }),
});

```
## Dependencies
- [ResourceGroup](../Resources/ResourceGroup.md)
- [ManagedCluster](../ContainerService/ManagedCluster.md)
## Misc
The resource version is `2021-10-01`.

The Swagger schema used to generate this documentation can be found [here](https://github.com/Azure/azure-rest-api-specs/tree/main/specification/containerservice/resource-manager/Microsoft.ContainerService/stable/2021-10-01/managedClusters.json).
