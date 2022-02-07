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
  dependencies: ({}) => ({
    resourceGroup: "myResourceGroup",
    proximityPlacementGroup: "myProximityPlacementGroup",
    capacityReservationGroup: "myCapacityReservationGroup",
    resource: "myManagedCluster",
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
  dependencies: ({}) => ({
    resourceGroup: "myResourceGroup",
    proximityPlacementGroup: "myProximityPlacementGroup",
    capacityReservationGroup: "myCapacityReservationGroup",
    resource: "myManagedCluster",
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
  dependencies: ({}) => ({
    resourceGroup: "myResourceGroup",
    proximityPlacementGroup: "myProximityPlacementGroup",
    capacityReservationGroup: "myCapacityReservationGroup",
    resource: "myManagedCluster",
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
  dependencies: ({}) => ({
    resourceGroup: "myResourceGroup",
    proximityPlacementGroup: "myProximityPlacementGroup",
    capacityReservationGroup: "myCapacityReservationGroup",
    resource: "myManagedCluster",
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
  dependencies: ({}) => ({
    resourceGroup: "myResourceGroup",
    proximityPlacementGroup: "myProximityPlacementGroup",
    capacityReservationGroup: "myCapacityReservationGroup",
    resource: "myManagedCluster",
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
  dependencies: ({}) => ({
    resourceGroup: "myResourceGroup",
    proximityPlacementGroup: "myProximityPlacementGroup",
    capacityReservationGroup: "myCapacityReservationGroup",
    resource: "myManagedCluster",
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
  dependencies: ({}) => ({
    resourceGroup: "myResourceGroup",
    proximityPlacementGroup: "myProximityPlacementGroup",
    capacityReservationGroup: "myCapacityReservationGroup",
    resource: "myManagedCluster",
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
  dependencies: ({}) => ({
    resourceGroup: "myResourceGroup",
    proximityPlacementGroup: "myProximityPlacementGroup",
    capacityReservationGroup: "myCapacityReservationGroup",
    resource: "myManagedCluster",
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
  dependencies: ({}) => ({
    resourceGroup: "myResourceGroup",
    proximityPlacementGroup: "myProximityPlacementGroup",
    capacityReservationGroup: "myCapacityReservationGroup",
    resource: "myManagedCluster",
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
  dependencies: ({}) => ({
    resourceGroup: "myResourceGroup",
    proximityPlacementGroup: "myProximityPlacementGroup",
    capacityReservationGroup: "myCapacityReservationGroup",
    resource: "myManagedCluster",
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
  dependencies: ({}) => ({
    resourceGroup: "myResourceGroup",
    proximityPlacementGroup: "myProximityPlacementGroup",
    capacityReservationGroup: "myCapacityReservationGroup",
    resource: "myManagedCluster",
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
  dependencies: ({}) => ({
    resourceGroup: "myResourceGroup",
    proximityPlacementGroup: "myProximityPlacementGroup",
    capacityReservationGroup: "myCapacityReservationGroup",
    resource: "myManagedCluster",
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
  dependencies: ({}) => ({
    resourceGroup: "myResourceGroup",
    proximityPlacementGroup: "myProximityPlacementGroup",
    capacityReservationGroup: "myCapacityReservationGroup",
    resource: "myManagedCluster",
  }),
});

```

### Create Agent Pool with Message of the Day
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
      messageOfTheDay: "Zm9vCg==",
    },
  }),
  dependencies: ({}) => ({
    resourceGroup: "myResourceGroup",
    proximityPlacementGroup: "myProximityPlacementGroup",
    capacityReservationGroup: "myCapacityReservationGroup",
    resource: "myManagedCluster",
  }),
});

```

### Stop Agent Pool
```js
provider.ContainerService.makeAgentPool({
  name: "myAgentPool",
  properties: () => ({ properties: { powerState: { code: "Stopped" } } }),
  dependencies: ({}) => ({
    resourceGroup: "myResourceGroup",
    proximityPlacementGroup: "myProximityPlacementGroup",
    capacityReservationGroup: "myCapacityReservationGroup",
    resource: "myManagedCluster",
  }),
});

```

### Start Agent Pool
```js
provider.ContainerService.makeAgentPool({
  name: "myAgentPool",
  properties: () => ({ properties: { powerState: { code: "Running" } } }),
  dependencies: ({}) => ({
    resourceGroup: "myResourceGroup",
    proximityPlacementGroup: "myProximityPlacementGroup",
    capacityReservationGroup: "myCapacityReservationGroup",
    resource: "myManagedCluster",
  }),
});

```

### Associate Agent Pool with Capacity Reservation Group
```js
provider.ContainerService.makeAgentPool({
  name: "myAgentPool",
  properties: () => ({
    properties: {
      orchestratorVersion: "",
      count: 3,
      vmSize: "Standard_DS2_v2",
      osType: "Linux",
      capacityReservationGroupID:
        "/subscriptions/subid1/resourcegroups/rg1/providers//Microsoft.Compute/CapacityReservationGroups/crg1",
    },
  }),
  dependencies: ({}) => ({
    resourceGroup: "myResourceGroup",
    proximityPlacementGroup: "myProximityPlacementGroup",
    capacityReservationGroup: "myCapacityReservationGroup",
    resource: "myManagedCluster",
  }),
});

```
## Dependencies
- [ResourceGroup](../Resources/ResourceGroup.md)
- [ProximityPlacementGroup](../Compute/ProximityPlacementGroup.md)
- [CapacityReservationGroup](../Compute/CapacityReservationGroup.md)
- [ManagedCluster](../ContainerService/ManagedCluster.md)
## Swagger Schema
```js
{
  allOf: [
    {
      properties: {
        id: { readOnly: true, type: 'string', description: 'Resource ID.' },
        name: {
          readOnly: true,
          type: 'string',
          description: 'The name of the resource that is unique within a resource group. This name can be used to access the resource.'
        },
        type: {
          readOnly: true,
          type: 'string',
          description: 'Resource type'
        }
      },
      description: 'Reference to another subresource.',
      'x-ms-azure-resource': true
    },
    {
      properties: {
        properties: {
          properties: {
            count: {
              type: 'integer',
              format: 'int32',
              description: 'Number of agents (VMs) to host docker containers. Allowed values must be in the range of 0 to 1000 (inclusive) for user pools and in the range of 1 to 1000 (inclusive) for system pools. The default value is 1.'
            },
            vmSize: {
              type: 'string',
              title: 'The size of the agent pool VMs.',
              description: 'VM size availability varies by region. If a node contains insufficient compute resources (memory, cpu, etc) pods might fail to run correctly. For more details on restricted VM sizes, see: https://docs.microsoft.com/azure/aks/quotas-skus-regions'
            },
            osDiskSizeGB: {
              type: 'integer',
              format: 'int32',
              maximum: 2048,
              minimum: 0,
              description: 'OS Disk Size in GB to be used to specify the disk size for every machine in the master/agent pool. If you specify 0, it will apply the default osDisk size according to the vmSize specified.'
            },
            osDiskType: {
              type: 'string',
              enum: [ 'Managed', 'Ephemeral' ],
              'x-ms-enum': {
                name: 'OSDiskType',
                modelAsString: true,
                values: [
                  {
                    value: 'Managed',
                    description: "Azure replicates the operating system disk for a virtual machine to Azure storage to avoid data loss should the VM need to be relocated to another host. Since containers aren't designed to have local state persisted, this behavior offers limited value while providing some drawbacks, including slower node provisioning and higher read/write latency."
                  },
                  {
                    value: 'Ephemeral',
                    description: 'Ephemeral OS disks are stored only on the host machine, just like a temporary disk. This provides lower read/write latency, along with faster node scaling and cluster upgrades.'
                  }
                ]
              },
              title: 'The OS disk type to be used for machines in the agent pool.',
              description: "The default is 'Ephemeral' if the VM supports it and has a cache disk larger than the requested OSDiskSizeGB. Otherwise, defaults to 'Managed'. May not be changed after creation. For more information see [Ephemeral OS](https://docs.microsoft.com/azure/aks/cluster-configuration#ephemeral-os)."
            },
            kubeletDiskType: {
              type: 'string',
              enum: [ 'OS', 'Temporary' ],
              'x-ms-enum': {
                name: 'KubeletDiskType',
                modelAsString: true,
                values: [
                  {
                    value: 'OS',
                    description: 'Kubelet will use the OS disk for its data.'
                  },
                  {
                    value: 'Temporary',
                    description: 'Kubelet will use the temporary disk for its data.'
                  }
                ]
              },
              description: 'Determines the placement of emptyDir volumes, container runtime data root, and Kubelet ephemeral storage.'
            },
            workloadRuntime: {
              type: 'string',
              enum: [ 'OCIContainer', 'WasmWasi' ],
              'x-ms-enum': {
                name: 'WorkloadRuntime',
                modelAsString: true,
                values: [
                  {
                    value: 'OCIContainer',
                    description: 'Nodes will use Kubelet to run standard OCI container workloads.'
                  },
                  {
                    value: 'WasmWasi',
                    description: 'Nodes will use Krustlet to run WASM workloads using the WASI provider (Preview).'
                  }
                ]
              },
              description: 'Determines the type of workload a node can run.'
            },
            messageOfTheDay: {
              type: 'string',
              title: 'Message of the day for Linux nodes, base64-encoded.',
              description: 'A base64-encoded string which will be written to /etc/motd after decoding. This allows customization of the message of the day for Linux nodes. It must not be specified for Windows nodes. It must be a static string (i.e., will be printed raw and not be executed as a script).'
            },
            vnetSubnetID: {
              type: 'string',
              title: 'The ID of the subnet which agent pool nodes and optionally pods will join on startup.',
              description: 'If this is not specified, a VNET and subnet will be generated and used. If no podSubnetID is specified, this applies to nodes and pods, otherwise it applies to just nodes. This is of the form: /subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.Network/virtualNetworks/{virtualNetworkName}/subnets/{subnetName}'
            },
            podSubnetID: {
              type: 'string',
              title: 'The ID of the subnet which pods will join when launched.',
              description: 'If omitted, pod IPs are statically assigned on the node subnet (see vnetSubnetID for more details). This is of the form: /subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.Network/virtualNetworks/{virtualNetworkName}/subnets/{subnetName}'
            },
            maxPods: {
              type: 'integer',
              format: 'int32',
              description: 'The maximum number of pods that can run on a node.'
            },
            osType: {
              type: 'string',
              default: 'Linux',
              enum: [ 'Linux', 'Windows' ],
              'x-ms-enum': {
                name: 'OSType',
                modelAsString: true,
                values: [
                  { value: 'Linux', description: 'Use Linux.' },
                  { value: 'Windows', description: 'Use Windows.' }
                ]
              },
              description: 'The operating system type. The default is Linux.'
            },
            osSKU: {
              type: 'string',
              enum: [ 'Ubuntu', 'CBLMariner' ],
              'x-ms-enum': { name: 'OSSKU', modelAsString: true },
              description: 'Specifies an OS SKU. This value must not be specified if OSType is Windows.'
            },
            maxCount: {
              type: 'integer',
              format: 'int32',
              description: 'The maximum number of nodes for auto-scaling'
            },
            minCount: {
              type: 'integer',
              format: 'int32',
              description: 'The minimum number of nodes for auto-scaling'
            },
            enableAutoScaling: {
              type: 'boolean',
              description: 'Whether to enable auto-scaler'
            },
            scaleDownMode: {
              title: 'The scale down mode to use when scaling the Agent Pool.',
              description: 'This also effects the cluster autoscaler behavior. If not specified, it defaults to Delete.',
              type: 'string',
              enum: [ 'Delete', 'Deallocate' ],
              'x-ms-enum': {
                name: 'ScaleDownMode',
                modelAsString: true,
                values: [
                  {
                    value: 'Delete',
                    description: 'Create new instances during scale up and remove instances during scale down.'
                  },
                  {
                    value: 'Deallocate',
                    description: 'Attempt to start deallocated instances (if they exist) during scale up and deallocate instances during scale down.'
                  }
                ]
              }
            },
            type: {
              type: 'string',
              enum: [ 'VirtualMachineScaleSets', 'AvailabilitySet' ],
              'x-ms-enum': {
                name: 'AgentPoolType',
                modelAsString: true,
                values: [
                  {
                    value: 'VirtualMachineScaleSets',
                    description: 'Create an Agent Pool backed by a Virtual Machine Scale Set.'
                  },
                  {
                    value: 'AvailabilitySet',
                    description: 'Use of this is strongly discouraged.'
                  }
                ]
              },
              description: 'The type of Agent Pool.'
            },
            mode: {
              type: 'string',
              enum: [ 'System', 'User' ],
              'x-ms-enum': {
                name: 'AgentPoolMode',
                modelAsString: true,
                values: [
                  {
                    value: 'System',
                    description: 'System agent pools are primarily for hosting critical system pods such as CoreDNS and metrics-server. System agent pools osType must be Linux. System agent pools VM SKU must have at least 2vCPUs and 4GB of memory.'
                  },
                  {
                    value: 'User',
                    description: 'User agent pools are primarily for hosting your application pods.'
                  }
                ]
              },
              title: 'The mode of an agent pool.',
              description: "A cluster must have at least one 'System' Agent Pool at all times. For additional information on agent pool restrictions and best practices, see: https://docs.microsoft.com/azure/aks/use-system-pools"
            },
            orchestratorVersion: {
              type: 'string',
              title: 'The version of Kubernetes running on the Agent Pool.',
              description: 'As a best practice, you should upgrade all node pools in an AKS cluster to the same Kubernetes version. The node pool version must have the same major version as the control plane. The node pool minor version must be within two minor versions of the control plane version. The node pool version cannot be greater than the control plane version. For more information see [upgrading a node pool](https://docs.microsoft.com/azure/aks/use-multiple-node-pools#upgrade-a-node-pool).'
            },
            nodeImageVersion: {
              readOnly: true,
              type: 'string',
              description: 'The version of node image'
            },
            upgradeSettings: {
              description: 'Settings for upgrading the agentpool',
              properties: {
                maxSurge: {
                  type: 'string',
                  title: 'The maximum number or percentage of nodes that are surged during upgrade.',
                  description: "This can either be set to an integer (e.g. '5') or a percentage (e.g. '50%'). If a percentage is specified, it is the percentage of the total agent pool size at the time of the upgrade. For percentages, fractional nodes are rounded up. If not specified, the default is 1. For more information, including best practices, see: https://docs.microsoft.com/azure/aks/upgrade-cluster#customize-node-surge-upgrade"
                }
              }
            },
            provisioningState: {
              readOnly: true,
              type: 'string',
              description: 'The current deployment or provisioning state.'
            },
            powerState: {
              title: 'Whether the Agent Pool is running or stopped.',
              description: 'When an Agent Pool is first created it is initially Running. The Agent Pool can be stopped by setting this field to Stopped. A stopped Agent Pool stops all of its VMs and does not accrue billing charges. An Agent Pool can only be stopped if it is Running and provisioning state is Succeeded',
              properties: {
                code: {
                  type: 'string',
                  description: 'Tells whether the cluster is Running or Stopped',
                  enum: [ 'Running', 'Stopped' ],
                  'x-ms-enum': {
                    name: 'code',
                    modelAsString: true,
                    values: [
                      {
                        value: 'Running',
                        description: 'The cluster is running.'
                      },
                      {
                        value: 'Stopped',
                        description: 'The cluster is stopped.'
                      }
                    ]
                  }
                }
              }
            },
            availabilityZones: {
              type: 'array',
              items: { type: 'string' },
              description: "The list of Availability zones to use for nodes. This can only be specified if the AgentPoolType property is 'VirtualMachineScaleSets'."
            },
            enableNodePublicIP: {
              type: 'boolean',
              title: 'Whether each node is allocated its own public IP.',
              description: 'Some scenarios may require nodes in a node pool to receive their own dedicated public IP addresses. A common scenario is for gaming workloads, where a console needs to make a direct connection to a cloud virtual machine to minimize hops. For more information see [assigning a public IP per node](https://docs.microsoft.com/azure/aks/use-multiple-node-pools#assign-a-public-ip-per-node-for-your-node-pools). The default is false.'
            },
            nodePublicIPPrefixID: {
              type: 'string',
              title: 'The public IP prefix ID which VM nodes should use IPs from.',
              description: 'This is of the form: /subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.Network/publicIPPrefixes/{publicIPPrefixName}'
            },
            scaleSetPriority: {
              description: "The Virtual Machine Scale Set priority. If not specified, the default is 'Regular'.",
              type: 'string',
              default: 'Regular',
              enum: [ 'Spot', 'Regular' ],
              'x-ms-enum': {
                name: 'ScaleSetPriority',
                modelAsString: true,
                values: [
                  {
                    value: 'Spot',
                    description: 'Spot priority VMs will be used. There is no SLA for spot nodes. See [spot on AKS](https://docs.microsoft.com/azure/aks/spot-node-pool) for more information.'
                  },
                  {
                    value: 'Regular',
                    description: 'Regular VMs will be used.'
                  }
                ]
              }
            },
            scaleSetEvictionPolicy: {
              title: 'The Virtual Machine Scale Set eviction policy to use.',
              description: "This cannot be specified unless the scaleSetPriority is 'Spot'. If not specified, the default is 'Delete'.",
              type: 'string',
              default: 'Delete',
              enum: [ 'Delete', 'Deallocate' ],
              'x-ms-enum': {
                name: 'ScaleSetEvictionPolicy',
                modelAsString: true,
                values: [
                  {
                    value: 'Delete',
                    description: "Nodes in the underlying Scale Set of the node pool are deleted when they're evicted."
                  },
                  {
                    value: 'Deallocate',
                    description: 'Nodes in the underlying Scale Set of the node pool are set to the stopped-deallocated state upon eviction. Nodes in the stopped-deallocated state count against your compute quota and can cause issues with cluster scaling or upgrading.'
                  }
                ]
              }
            },
            spotMaxPrice: {
              title: 'The max price (in US Dollars) you are willing to pay for spot instances. Possible values are any decimal value greater than zero or -1 which indicates default price to be up-to on-demand.',
              description: 'Possible values are any decimal value greater than zero or -1 which indicates the willingness to pay any on-demand price. For more details on spot pricing, see [spot VMs pricing](https://docs.microsoft.com/azure/virtual-machines/spot-vms#pricing)',
              type: 'number',
              default: -1
            },
            tags: {
              type: 'object',
              additionalProperties: { type: 'string' },
              description: 'The tags to be persisted on the agent pool virtual machine scale set.'
            },
            nodeLabels: {
              type: 'object',
              additionalProperties: { type: 'string' },
              description: 'The node labels to be persisted across all nodes in agent pool.'
            },
            nodeTaints: {
              type: 'array',
              items: { type: 'string' },
              description: 'The taints added to new nodes during node pool create and scale. For example, key=value:NoSchedule.'
            },
            proximityPlacementGroupID: {
              description: 'The ID for Proximity Placement Group.',
              type: 'string'
            },
            kubeletConfig: {
              description: 'The Kubelet configuration on the agent pool nodes.',
              title: 'Kubelet configurations of agent nodes.',
              type: 'object',
              properties: {
                cpuManagerPolicy: {
                  type: 'string',
                  title: 'The CPU Manager policy to use.',
                  description: "The default is 'none'. See [Kubernetes CPU management policies](https://kubernetes.io/docs/tasks/administer-cluster/cpu-management-policies/#cpu-management-policies) for more information. Allowed values are 'none' and 'static'."
                },
                cpuCfsQuota: {
                  type: 'boolean',
                  title: 'If CPU CFS quota enforcement is enabled for containers that specify CPU limits.',
                  description: 'The default is true.'
                },
                cpuCfsQuotaPeriod: {
                  type: 'string',
                  title: 'The CPU CFS quota period value.',
                  description: "The default is '100ms.' Valid values are a sequence of decimal numbers with an optional fraction and a unit suffix. For example: '300ms', '2h45m'. Supported units are 'ns', 'us', 'ms', 's', 'm', and 'h'."
                },
                imageGcHighThreshold: {
                  type: 'integer',
                  format: 'int32',
                  title: 'The percent of disk usage after which image garbage collection is always run.',
                  description: 'To disable image garbage collection, set to 100. The default is 85%'
                },
                imageGcLowThreshold: {
                  type: 'integer',
                  format: 'int32',
                  title: 'The percent of disk usage before which image garbage collection is never run.',
                  description: 'This cannot be set higher than imageGcHighThreshold. The default is 80%'
                },
                topologyManagerPolicy: {
                  type: 'string',
                  title: 'The Topology Manager policy to use.',
                  description: "For more information see [Kubernetes Topology Manager](https://kubernetes.io/docs/tasks/administer-cluster/topology-manager). The default is 'none'. Allowed values are 'none', 'best-effort', 'restricted', and 'single-numa-node'."
                },
                allowedUnsafeSysctls: {
                  type: 'array',
                  items: { type: 'string' },
                  description: 'Allowed list of unsafe sysctls or unsafe sysctl patterns (ending in `*`).'
                },
                failSwapOn: {
                  type: 'boolean',
                  description: 'If set to true it will make the Kubelet fail to start if swap is enabled on the node.'
                },
                containerLogMaxSizeMB: {
                  type: 'integer',
                  format: 'int32',
                  description: 'The maximum size (e.g. 10Mi) of container log file before it is rotated.'
                },
                containerLogMaxFiles: {
                  type: 'integer',
                  format: 'int32',
                  description: 'The maximum number of container log files that can be present for a container. The number must be ≥ 2.',
                  minimum: 2
                },
                podMaxPids: {
                  type: 'integer',
                  format: 'int32',
                  description: 'The maximum number of processes per pod.'
                }
              }
            },
            linuxOSConfig: {
              description: 'The OS configuration of Linux agent nodes.',
              title: 'OS configurations of Linux agent nodes.',
              type: 'object',
              properties: {
                sysctls: {
                  description: 'Sysctl settings for Linux agent nodes.',
                  type: 'object',
                  properties: {
                    netCoreSomaxconn: {
                      type: 'integer',
                      format: 'int32',
                      description: 'Sysctl setting net.core.somaxconn.'
                    },
                    netCoreNetdevMaxBacklog: {
                      type: 'integer',
                      format: 'int32',
                      description: 'Sysctl setting net.core.netdev_max_backlog.'
                    },
                    netCoreRmemDefault: {
                      type: 'integer',
                      format: 'int32',
                      description: 'Sysctl setting net.core.rmem_default.'
                    },
                    netCoreRmemMax: {
                      type: 'integer',
                      format: 'int32',
                      description: 'Sysctl setting net.core.rmem_max.'
                    },
                    netCoreWmemDefault: {
                      type: 'integer',
                      format: 'int32',
                      description: 'Sysctl setting net.core.wmem_default.'
                    },
                    netCoreWmemMax: {
                      type: 'integer',
                      format: 'int32',
                      description: 'Sysctl setting net.core.wmem_max.'
                    },
                    netCoreOptmemMax: {
                      type: 'integer',
                      format: 'int32',
                      description: 'Sysctl setting net.core.optmem_max.'
                    },
                    netIpv4TcpMaxSynBacklog: {
                      type: 'integer',
                      format: 'int32',
                      description: 'Sysctl setting net.ipv4.tcp_max_syn_backlog.'
                    },
                    netIpv4TcpMaxTwBuckets: {
                      type: 'integer',
                      format: 'int32',
                      description: 'Sysctl setting net.ipv4.tcp_max_tw_buckets.'
                    },
                    netIpv4TcpFinTimeout: {
                      type: 'integer',
                      format: 'int32',
                      description: 'Sysctl setting net.ipv4.tcp_fin_timeout.'
                    },
                    netIpv4TcpKeepaliveTime: {
                      type: 'integer',
                      format: 'int32',
                      description: 'Sysctl setting net.ipv4.tcp_keepalive_time.'
                    },
                    netIpv4TcpKeepaliveProbes: {
                      type: 'integer',
                      format: 'int32',
                      description: 'Sysctl setting net.ipv4.tcp_keepalive_probes.'
                    },
                    netIpv4TcpkeepaliveIntvl: {
                      type: 'integer',
                      format: 'int32',
                      description: 'Sysctl setting net.ipv4.tcp_keepalive_intvl.'
                    },
                    netIpv4TcpTwReuse: {
                      type: 'boolean',
                      description: 'Sysctl setting net.ipv4.tcp_tw_reuse.'
                    },
                    netIpv4IpLocalPortRange: {
                      type: 'string',
                      description: 'Sysctl setting net.ipv4.ip_local_port_range.'
                    },
                    netIpv4NeighDefaultGcThresh1: {
                      type: 'integer',
                      format: 'int32',
                      description: 'Sysctl setting net.ipv4.neigh.default.gc_thresh1.'
                    },
                    netIpv4NeighDefaultGcThresh2: {
                      type: 'integer',
                      format: 'int32',
                      description: 'Sysctl setting net.ipv4.neigh.default.gc_thresh2.'
                    },
                    netIpv4NeighDefaultGcThresh3: {
                      type: 'integer',
                      format: 'int32',
                      description: 'Sysctl setting net.ipv4.neigh.default.gc_thresh3.'
                    },
                    netNetfilterNfConntrackMax: {
                      type: 'integer',
                      format: 'int32',
                      description: 'Sysctl setting net.netfilter.nf_conntrack_max.'
                    },
                    netNetfilterNfConntrackBuckets: {
                      type: 'integer',
                      format: 'int32',
                      description: 'Sysctl setting net.netfilter.nf_conntrack_buckets.'
                    },
                    fsInotifyMaxUserWatches: {
                      type: 'integer',
                      format: 'int32',
                      description: 'Sysctl setting fs.inotify.max_user_watches.'
                    },
                    fsFileMax: {
                      type: 'integer',
                      format: 'int32',
                      description: 'Sysctl setting fs.file-max.'
                    },
                    fsAioMaxNr: {
                      type: 'integer',
                      format: 'int32',
                      description: 'Sysctl setting fs.aio-max-nr.'
                    },
                    fsNrOpen: {
                      type: 'integer',
                      format: 'int32',
                      description: 'Sysctl setting fs.nr_open.'
                    },
                    kernelThreadsMax: {
                      type: 'integer',
                      format: 'int32',
                      description: 'Sysctl setting kernel.threads-max.'
                    },
                    vmMaxMapCount: {
                      type: 'integer',
                      format: 'int32',
                      description: 'Sysctl setting vm.max_map_count.'
                    },
                    vmSwappiness: {
                      type: 'integer',
                      format: 'int32',
                      description: 'Sysctl setting vm.swappiness.'
                    },
                    vmVfsCachePressure: {
                      type: 'integer',
                      format: 'int32',
                      description: 'Sysctl setting vm.vfs_cache_pressure.'
                    }
                  }
                },
                transparentHugePageEnabled: {
                  type: 'string',
                  title: 'Whether transparent hugepages are enabled.',
                  description: "Valid values are 'always', 'madvise', and 'never'. The default is 'always'. For more information see [Transparent Hugepages](https://www.kernel.org/doc/html/latest/admin-guide/mm/transhuge.html#admin-guide-transhuge)."
                },
                transparentHugePageDefrag: {
                  type: 'string',
                  title: 'Whether the kernel should make aggressive use of memory compaction to make more hugepages available.',
                  description: "Valid values are 'always', 'defer', 'defer+madvise', 'madvise' and 'never'. The default is 'madvise'. For more information see [Transparent Hugepages](https://www.kernel.org/doc/html/latest/admin-guide/mm/transhuge.html#admin-guide-transhuge)."
                },
                swapFileSizeMB: {
                  type: 'integer',
                  format: 'int32',
                  description: 'The size in MB of a swap file that will be created on each node.'
                }
              }
            },
            enableEncryptionAtHost: {
              type: 'boolean',
              title: 'Whether to enable host based OS and data drive encryption.',
              description: 'This is only supported on certain VM sizes and in certain Azure regions. For more information, see: https://docs.microsoft.com/azure/aks/enable-host-encryption'
            },
            enableUltraSSD: {
              type: 'boolean',
              description: 'Whether to enable UltraSSD'
            },
            enableFIPS: {
              type: 'boolean',
              title: 'Whether to use a FIPS-enabled OS.',
              description: 'See [Add a FIPS-enabled node pool](https://docs.microsoft.com/azure/aks/use-multiple-node-pools#add-a-fips-enabled-node-pool-preview) for more details.'
            },
            gpuInstanceProfile: {
              description: 'GPUInstanceProfile to be used to specify GPU MIG instance profile for supported GPU VM SKU.',
              type: 'string',
              enum: [ 'MIG1g', 'MIG2g', 'MIG3g', 'MIG4g', 'MIG7g' ],
              'x-ms-enum': { name: 'GPUInstanceProfile ', modelAsString: true }
            },
            creationData: {
              description: 'CreationData to be used to specify the source Snapshot ID if the node pool will be created/upgraded using a snapshot.',
              type: 'object',
              properties: {
                sourceResourceId: {
                  type: 'string',
                  description: 'This is the ARM ID of the source object to be used to create the target object.'
                }
              }
            },
            capacityReservationGroupID: {
              description: 'AKS will associate the specified agent pool with the Capacity Reservation Group.',
              type: 'string'
            }
          },
          description: 'Properties for the container service agent pool profile.',
          'x-ms-client-flatten': true
        }
      }
    }
  ],
  description: 'Agent Pool.'
}
```
## Misc
The resource version is `2021-11-01-preview`.

The Swagger schema used to generate this documentation can be found [here](https://github.com/Azure/azure-rest-api-specs/tree/main/specification/containerservice/resource-manager/Microsoft.ContainerService/preview/2021-11-01-preview/managedClusters.json).
