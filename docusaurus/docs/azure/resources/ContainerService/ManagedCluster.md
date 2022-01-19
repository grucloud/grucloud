---
id: ManagedCluster
title: ManagedCluster
---
Provides a **ManagedCluster** from the **ContainerService** group
## Examples
### Create/Update Managed Cluster
```js
provider.ContainerService.makeManagedCluster({
  name: "myManagedCluster",
  properties: () => ({
    location: "location1",
    tags: { tier: "production", archv2: "" },
    sku: { name: "Basic", tier: "Free" },
    properties: {
      kubernetesVersion: "",
      dnsPrefix: "dnsprefix1",
      agentPoolProfiles: [
        {
          name: "nodepool1",
          count: 3,
          vmSize: "Standard_DS1_v2",
          osType: "Linux",
          type: "VirtualMachineScaleSets",
          scaleDownMode: "Deallocate",
          availabilityZones: ["1", "2", "3"],
          enableNodePublicIP: true,
          mode: "System",
        },
      ],
      linuxProfile: {
        adminUsername: "azureuser",
        ssh: { publicKeys: [{ keyData: "keydata" }] },
      },
      networkProfile: {
        loadBalancerSku: "standard",
        outboundType: "loadBalancer",
        loadBalancerProfile: { managedOutboundIPs: { count: 2 } },
      },
      autoScalerProfile: {
        "balance-similar-node-groups": "true",
        expander: "priority",
        "max-node-provision-time": "15m",
        "new-pod-scale-up-delay": "1m",
        "scale-down-delay-after-add": "15m",
        "scan-interval": "20s",
        "skip-nodes-with-system-pods": "false",
      },
      windowsProfile: {
        adminUsername: "azureuser",
        adminPassword: "replacePassword1234$",
      },
      servicePrincipalProfile: { clientId: "clientid", secret: "secret" },
      addonProfiles: {},
      enableRBAC: true,
      diskEncryptionSetID:
        "/subscriptions/subid1/resourceGroups/rg1/providers/Microsoft.Compute/diskEncryptionSets/des",
      enablePodSecurityPolicy: true,
    },
    identity: {
      type: "UserAssigned",
      userAssignedIdentities: {
        "/subscriptions/subid1/resourceGroups/rgName1/providers/Microsoft.ManagedIdentity/userAssignedIdentities/identity1":
          {},
      },
    },
  }),
  dependencies: ({ resources }) => ({
    resourceGroup: resources.Resources.ResourceGroup["myResourceGroup"],
    managedIdentities: [
      resources.ManagedIdentity.UserAssignedIdentity["myUserAssignedIdentity"],
    ],
    diskEncryptionSet:
      resources.Compute.DiskEncryptionSet["myDiskEncryptionSet"],
  }),
});

```

### Create/Update AAD Managed Cluster with EnableAzureRBAC
```js
provider.ContainerService.makeManagedCluster({
  name: "myManagedCluster",
  properties: () => ({
    location: "location1",
    tags: { tier: "production", archv2: "" },
    sku: { name: "Basic", tier: "Free" },
    properties: {
      kubernetesVersion: "",
      dnsPrefix: "dnsprefix1",
      agentPoolProfiles: [
        {
          name: "nodepool1",
          count: 3,
          vmSize: "Standard_DS1_v2",
          osType: "Linux",
          type: "VirtualMachineScaleSets",
          availabilityZones: ["1", "2", "3"],
          enableNodePublicIP: true,
          mode: "System",
        },
      ],
      linuxProfile: {
        adminUsername: "azureuser",
        ssh: { publicKeys: [{ keyData: "keydata" }] },
      },
      networkProfile: {
        loadBalancerSku: "standard",
        outboundType: "loadBalancer",
        loadBalancerProfile: { managedOutboundIPs: { count: 2 } },
      },
      autoScalerProfile: {
        "scan-interval": "20s",
        "scale-down-delay-after-add": "15m",
      },
      windowsProfile: {
        adminUsername: "azureuser",
        adminPassword: "replacePassword1234$",
      },
      servicePrincipalProfile: { clientId: "clientid", secret: "secret" },
      addonProfiles: {},
      aadProfile: { managed: true, enableAzureRBAC: true },
      enableRBAC: true,
      diskEncryptionSetID:
        "/subscriptions/subid1/resourceGroups/rg1/providers/Microsoft.Compute/diskEncryptionSets/des",
      enablePodSecurityPolicy: true,
    },
  }),
  dependencies: ({ resources }) => ({
    resourceGroup: resources.Resources.ResourceGroup["myResourceGroup"],
    managedIdentities: [
      resources.ManagedIdentity.UserAssignedIdentity["myUserAssignedIdentity"],
    ],
    diskEncryptionSet:
      resources.Compute.DiskEncryptionSet["myDiskEncryptionSet"],
  }),
});

```

### Create/Update Managed Cluster with EnableNamespaceResources
```js
provider.ContainerService.makeManagedCluster({
  name: "myManagedCluster",
  properties: () => ({
    location: "location1",
    tags: { tier: "production", archv2: "" },
    sku: { name: "Basic", tier: "Free" },
    properties: {
      kubernetesVersion: "",
      dnsPrefix: "dnsprefix1",
      agentPoolProfiles: [
        {
          name: "nodepool1",
          count: 3,
          vmSize: "Standard_DS1_v2",
          osType: "Linux",
          type: "VirtualMachineScaleSets",
          availabilityZones: ["1", "2", "3"],
          enableNodePublicIP: true,
          mode: "System",
        },
      ],
      linuxProfile: {
        adminUsername: "azureuser",
        ssh: { publicKeys: [{ keyData: "keydata" }] },
      },
      networkProfile: {
        loadBalancerSku: "standard",
        outboundType: "loadBalancer",
        loadBalancerProfile: { managedOutboundIPs: { count: 2 } },
      },
      autoScalerProfile: {
        "scan-interval": "20s",
        "scale-down-delay-after-add": "15m",
      },
      windowsProfile: {
        adminUsername: "azureuser",
        adminPassword: "replacePassword1234$",
      },
      servicePrincipalProfile: { clientId: "clientid", secret: "secret" },
      addonProfiles: {},
      enableRBAC: true,
      diskEncryptionSetID:
        "/subscriptions/subid1/resourceGroups/rg1/providers/Microsoft.Compute/diskEncryptionSets/des",
      enablePodSecurityPolicy: true,
      enableNamespaceResources: true,
    },
  }),
  dependencies: ({ resources }) => ({
    resourceGroup: resources.Resources.ResourceGroup["myResourceGroup"],
    managedIdentities: [
      resources.ManagedIdentity.UserAssignedIdentity["myUserAssignedIdentity"],
    ],
    diskEncryptionSet:
      resources.Compute.DiskEncryptionSet["myDiskEncryptionSet"],
  }),
});

```

### Create Managed Cluster with PPG
```js
provider.ContainerService.makeManagedCluster({
  name: "myManagedCluster",
  properties: () => ({
    location: "location1",
    tags: { tier: "production", archv2: "" },
    sku: { name: "Basic", tier: "Free" },
    properties: {
      kubernetesVersion: "",
      dnsPrefix: "dnsprefix1",
      agentPoolProfiles: [
        {
          name: "nodepool1",
          count: 3,
          vmSize: "Standard_DS2_v2",
          osType: "Linux",
          type: "VirtualMachineScaleSets",
          enableNodePublicIP: true,
          mode: "System",
          proximityPlacementGroupID:
            "/subscriptions/subid1/resourcegroups/rg1/providers//Microsoft.Compute/proximityPlacementGroups/ppg1",
        },
      ],
      linuxProfile: {
        adminUsername: "azureuser",
        ssh: { publicKeys: [{ keyData: "keydata" }] },
      },
      networkProfile: {
        loadBalancerSku: "standard",
        outboundType: "loadBalancer",
        loadBalancerProfile: { managedOutboundIPs: { count: 2 } },
      },
      autoScalerProfile: {
        "scan-interval": "20s",
        "scale-down-delay-after-add": "15m",
      },
      windowsProfile: {
        adminUsername: "azureuser",
        adminPassword: "replacePassword1234$",
      },
      servicePrincipalProfile: { clientId: "clientid", secret: "secret" },
      addonProfiles: {},
      enableRBAC: true,
      diskEncryptionSetID:
        "/subscriptions/subid1/resourceGroups/rg1/providers/Microsoft.Compute/diskEncryptionSets/des",
      enablePodSecurityPolicy: true,
    },
  }),
  dependencies: ({ resources }) => ({
    resourceGroup: resources.Resources.ResourceGroup["myResourceGroup"],
    managedIdentities: [
      resources.ManagedIdentity.UserAssignedIdentity["myUserAssignedIdentity"],
    ],
    diskEncryptionSet:
      resources.Compute.DiskEncryptionSet["myDiskEncryptionSet"],
  }),
});

```

### Create Managed Cluster with OSSKU
```js
provider.ContainerService.makeManagedCluster({
  name: "myManagedCluster",
  properties: () => ({
    location: "location1",
    tags: { tier: "production", archv2: "" },
    sku: { name: "Basic", tier: "Free" },
    properties: {
      kubernetesVersion: "",
      dnsPrefix: "dnsprefix1",
      agentPoolProfiles: [
        {
          name: "nodepool1",
          count: 3,
          vmSize: "Standard_DS2_v2",
          osType: "Linux",
          osSKU: "CBLMariner",
          type: "VirtualMachineScaleSets",
          enableNodePublicIP: true,
          mode: "System",
        },
      ],
      linuxProfile: {
        adminUsername: "azureuser",
        ssh: { publicKeys: [{ keyData: "keydata" }] },
      },
      networkProfile: {
        loadBalancerSku: "standard",
        outboundType: "loadBalancer",
        loadBalancerProfile: { managedOutboundIPs: { count: 2 } },
      },
      autoScalerProfile: {
        "scan-interval": "20s",
        "scale-down-delay-after-add": "15m",
      },
      windowsProfile: {
        adminUsername: "azureuser",
        adminPassword: "replacePassword1234$",
      },
      servicePrincipalProfile: { clientId: "clientid", secret: "secret" },
      addonProfiles: {},
      enableRBAC: true,
      diskEncryptionSetID:
        "/subscriptions/subid1/resourceGroups/rg1/providers/Microsoft.Compute/diskEncryptionSets/des",
      enablePodSecurityPolicy: true,
      httpProxyConfig: {
        httpProxy: "http://myproxy.server.com:8080",
        httpsProxy: "https://myproxy.server.com:8080",
        noProxy: ["localhost", "127.0.0.1"],
        trustedCa: "Q29uZ3JhdHMhIFlvdSBoYXZlIGZvdW5kIGEgaGlkZGVuIG1lc3NhZ2U=",
      },
    },
  }),
  dependencies: ({ resources }) => ({
    resourceGroup: resources.Resources.ResourceGroup["myResourceGroup"],
    managedIdentities: [
      resources.ManagedIdentity.UserAssignedIdentity["myUserAssignedIdentity"],
    ],
    diskEncryptionSet:
      resources.Compute.DiskEncryptionSet["myDiskEncryptionSet"],
  }),
});

```

### Create Managed Cluster with GPUMIG
```js
provider.ContainerService.makeManagedCluster({
  name: "myManagedCluster",
  properties: () => ({
    location: "location1",
    tags: { tier: "production", archv2: "" },
    sku: { name: "Basic", tier: "Free" },
    properties: {
      kubernetesVersion: "",
      dnsPrefix: "dnsprefix1",
      agentPoolProfiles: [
        {
          name: "nodepool1",
          count: 3,
          vmSize: "Standard_ND96asr_v4",
          osType: "Linux",
          gpuInstanceProfile: "MIG3g",
          type: "VirtualMachineScaleSets",
          enableNodePublicIP: true,
          mode: "System",
        },
      ],
      linuxProfile: {
        adminUsername: "azureuser",
        ssh: { publicKeys: [{ keyData: "keydata" }] },
      },
      networkProfile: {
        loadBalancerSku: "standard",
        outboundType: "loadBalancer",
        loadBalancerProfile: { managedOutboundIPs: { count: 2 } },
      },
      autoScalerProfile: {
        "scan-interval": "20s",
        "scale-down-delay-after-add": "15m",
      },
      windowsProfile: {
        adminUsername: "azureuser",
        adminPassword: "replacePassword1234$",
      },
      servicePrincipalProfile: { clientId: "clientid", secret: "secret" },
      addonProfiles: {},
      enableRBAC: true,
      diskEncryptionSetID:
        "/subscriptions/subid1/resourceGroups/rg1/providers/Microsoft.Compute/diskEncryptionSets/des",
      enablePodSecurityPolicy: true,
      httpProxyConfig: {
        httpProxy: "http://myproxy.server.com:8080",
        httpsProxy: "https://myproxy.server.com:8080",
        noProxy: ["localhost", "127.0.0.1"],
        trustedCa: "Q29uZ3JhdHMhIFlvdSBoYXZlIGZvdW5kIGEgaGlkZGVuIG1lc3NhZ2U=",
      },
    },
  }),
  dependencies: ({ resources }) => ({
    resourceGroup: resources.Resources.ResourceGroup["myResourceGroup"],
    managedIdentities: [
      resources.ManagedIdentity.UserAssignedIdentity["myUserAssignedIdentity"],
    ],
    diskEncryptionSet:
      resources.Compute.DiskEncryptionSet["myDiskEncryptionSet"],
  }),
});

```

### Create/Update Managed Cluster with EnableAHUB
```js
provider.ContainerService.makeManagedCluster({
  name: "myManagedCluster",
  properties: () => ({
    location: "location1",
    tags: { tier: "production", archv2: "" },
    sku: { name: "Basic", tier: "Free" },
    properties: {
      kubernetesVersion: "",
      dnsPrefix: "dnsprefix1",
      agentPoolProfiles: [
        {
          name: "nodepool1",
          count: 3,
          vmSize: "Standard_DS1_v2",
          osType: "Linux",
          type: "VirtualMachineScaleSets",
          availabilityZones: ["1", "2", "3"],
          enableNodePublicIP: true,
          mode: "System",
        },
      ],
      linuxProfile: {
        adminUsername: "azureuser",
        ssh: { publicKeys: [{ keyData: "keydata" }] },
      },
      networkProfile: {
        loadBalancerSku: "standard",
        outboundType: "loadBalancer",
        loadBalancerProfile: { managedOutboundIPs: { count: 2 } },
      },
      autoScalerProfile: {
        "scan-interval": "20s",
        "scale-down-delay-after-add": "15m",
      },
      windowsProfile: {
        adminUsername: "azureuser",
        adminPassword: "replacePassword1234$",
        licenseType: "Windows_Server",
      },
      servicePrincipalProfile: { clientId: "clientid", secret: "secret" },
      addonProfiles: {},
      enableRBAC: true,
      diskEncryptionSetID:
        "/subscriptions/subid1/resourceGroups/rg1/providers/Microsoft.Compute/diskEncryptionSets/des",
      enablePodSecurityPolicy: true,
    },
    identity: {
      type: "UserAssigned",
      userAssignedIdentities: {
        "/subscriptions/subid1/resourceGroups/rgName1/providers/Microsoft.ManagedIdentity/userAssignedIdentities/identity1":
          {},
      },
    },
  }),
  dependencies: ({ resources }) => ({
    resourceGroup: resources.Resources.ResourceGroup["myResourceGroup"],
    managedIdentities: [
      resources.ManagedIdentity.UserAssignedIdentity["myUserAssignedIdentity"],
    ],
    diskEncryptionSet:
      resources.Compute.DiskEncryptionSet["myDiskEncryptionSet"],
  }),
});

```

### Create Managed Cluster with EncryptionAtHost enabled
```js
provider.ContainerService.makeManagedCluster({
  name: "myManagedCluster",
  properties: () => ({
    location: "location1",
    tags: { tier: "production", archv2: "" },
    sku: { name: "Basic", tier: "Free" },
    properties: {
      kubernetesVersion: "",
      dnsPrefix: "dnsprefix1",
      agentPoolProfiles: [
        {
          name: "nodepool1",
          count: 3,
          vmSize: "Standard_DS2_v2",
          osType: "Linux",
          type: "VirtualMachineScaleSets",
          enableNodePublicIP: true,
          mode: "System",
          enableEncryptionAtHost: true,
        },
      ],
      linuxProfile: {
        adminUsername: "azureuser",
        ssh: { publicKeys: [{ keyData: "keydata" }] },
      },
      networkProfile: {
        loadBalancerSku: "standard",
        outboundType: "loadBalancer",
        loadBalancerProfile: { managedOutboundIPs: { count: 2 } },
      },
      autoScalerProfile: {
        "scan-interval": "20s",
        "scale-down-delay-after-add": "15m",
      },
      windowsProfile: {
        adminUsername: "azureuser",
        adminPassword: "replacePassword1234$",
      },
      servicePrincipalProfile: { clientId: "clientid", secret: "secret" },
      addonProfiles: {},
      enableRBAC: true,
      diskEncryptionSetID:
        "/subscriptions/subid1/resourceGroups/rg1/providers/Microsoft.Compute/diskEncryptionSets/des",
      enablePodSecurityPolicy: true,
    },
  }),
  dependencies: ({ resources }) => ({
    resourceGroup: resources.Resources.ResourceGroup["myResourceGroup"],
    managedIdentities: [
      resources.ManagedIdentity.UserAssignedIdentity["myUserAssignedIdentity"],
    ],
    diskEncryptionSet:
      resources.Compute.DiskEncryptionSet["myDiskEncryptionSet"],
  }),
});

```

### Create Managed Cluster with UltraSSD enabled
```js
provider.ContainerService.makeManagedCluster({
  name: "myManagedCluster",
  properties: () => ({
    location: "location1",
    tags: { tier: "production", archv2: "" },
    sku: { name: "Basic", tier: "Free" },
    properties: {
      kubernetesVersion: "",
      dnsPrefix: "dnsprefix1",
      agentPoolProfiles: [
        {
          name: "nodepool1",
          count: 3,
          vmSize: "Standard_DS2_v2",
          osType: "Linux",
          type: "VirtualMachineScaleSets",
          enableNodePublicIP: true,
          mode: "System",
          enableUltraSSD: true,
        },
      ],
      linuxProfile: {
        adminUsername: "azureuser",
        ssh: { publicKeys: [{ keyData: "keydata" }] },
      },
      networkProfile: {
        loadBalancerSku: "standard",
        outboundType: "loadBalancer",
        loadBalancerProfile: { managedOutboundIPs: { count: 2 } },
      },
      autoScalerProfile: {
        "scan-interval": "20s",
        "scale-down-delay-after-add": "15m",
      },
      windowsProfile: {
        adminUsername: "azureuser",
        adminPassword: "replacePassword1234$",
      },
      servicePrincipalProfile: { clientId: "clientid", secret: "secret" },
      addonProfiles: {},
      enableRBAC: true,
      diskEncryptionSetID:
        "/subscriptions/subid1/resourceGroups/rg1/providers/Microsoft.Compute/diskEncryptionSets/des",
      enablePodSecurityPolicy: true,
    },
  }),
  dependencies: ({ resources }) => ({
    resourceGroup: resources.Resources.ResourceGroup["myResourceGroup"],
    managedIdentities: [
      resources.ManagedIdentity.UserAssignedIdentity["myUserAssignedIdentity"],
    ],
    diskEncryptionSet:
      resources.Compute.DiskEncryptionSet["myDiskEncryptionSet"],
  }),
});

```

### Create Managed Cluster with PodIdentity enabled
```js
provider.ContainerService.makeManagedCluster({
  name: "myManagedCluster",
  properties: () => ({
    location: "location1",
    tags: { tier: "production", archv2: "" },
    sku: { name: "Basic", tier: "Free" },
    properties: {
      kubernetesVersion: "",
      dnsPrefix: "dnsprefix1",
      agentPoolProfiles: [
        {
          name: "nodepool1",
          count: 3,
          vmSize: "Standard_DS2_v2",
          osType: "Linux",
          type: "VirtualMachineScaleSets",
          enableNodePublicIP: true,
          mode: "System",
        },
      ],
      linuxProfile: {
        adminUsername: "azureuser",
        ssh: { publicKeys: [{ keyData: "keydata" }] },
      },
      networkProfile: {
        loadBalancerSku: "standard",
        outboundType: "loadBalancer",
        loadBalancerProfile: { managedOutboundIPs: { count: 2 } },
      },
      autoScalerProfile: {
        "scan-interval": "20s",
        "scale-down-delay-after-add": "15m",
      },
      windowsProfile: {
        adminUsername: "azureuser",
        adminPassword: "replacePassword1234$",
      },
      servicePrincipalProfile: { clientId: "clientid", secret: "secret" },
      addonProfiles: {},
      enableRBAC: true,
      diskEncryptionSetID:
        "/subscriptions/subid1/resourceGroups/rg1/providers/Microsoft.Compute/diskEncryptionSets/des",
      enablePodSecurityPolicy: true,
      podIdentityProfile: { enabled: true, allowNetworkPluginKubenet: true },
    },
  }),
  dependencies: ({ resources }) => ({
    resourceGroup: resources.Resources.ResourceGroup["myResourceGroup"],
    managedIdentities: [
      resources.ManagedIdentity.UserAssignedIdentity["myUserAssignedIdentity"],
    ],
    diskEncryptionSet:
      resources.Compute.DiskEncryptionSet["myDiskEncryptionSet"],
  }),
});

```

### Create Managed Private Cluster with fqdn subdomain specified
```js
provider.ContainerService.makeManagedCluster({
  name: "myManagedCluster",
  properties: () => ({
    location: "location1",
    tags: { tier: "production", archv2: "" },
    sku: { name: "Basic", tier: "Free" },
    properties: {
      kubernetesVersion: "",
      fqdnSubdomain: "domain1",
      agentPoolProfiles: [
        {
          name: "nodepool1",
          count: 3,
          vmSize: "Standard_DS2_v2",
          osType: "Linux",
          type: "VirtualMachineScaleSets",
          enableNodePublicIP: true,
          mode: "System",
          enableEncryptionAtHost: true,
        },
      ],
      linuxProfile: {
        adminUsername: "azureuser",
        ssh: { publicKeys: [{ keyData: "keydata" }] },
      },
      networkProfile: {
        loadBalancerSku: "standard",
        outboundType: "loadBalancer",
        loadBalancerProfile: { managedOutboundIPs: { count: 2 } },
      },
      autoScalerProfile: {
        "scan-interval": "20s",
        "scale-down-delay-after-add": "15m",
      },
      windowsProfile: {
        adminUsername: "azureuser",
        adminPassword: "replacePassword1234$",
      },
      servicePrincipalProfile: { clientId: "clientid", secret: "secret" },
      apiServerAccessProfile: {
        enablePrivateCluster: true,
        privateDNSZone:
          "/subscriptions/subid1/resourcegroups/rg1/providers/Microsoft.Network/privateDnsZones/privatelink.location1.azmk8s.io",
      },
      addonProfiles: {},
      enableRBAC: true,
      enablePodSecurityPolicy: true,
    },
  }),
  dependencies: ({ resources }) => ({
    resourceGroup: resources.Resources.ResourceGroup["myResourceGroup"],
    managedIdentities: [
      resources.ManagedIdentity.UserAssignedIdentity["myUserAssignedIdentity"],
    ],
    diskEncryptionSet:
      resources.Compute.DiskEncryptionSet["myDiskEncryptionSet"],
  }),
});

```

### Create Managed Private Cluster with Public FQDN specified
```js
provider.ContainerService.makeManagedCluster({
  name: "myManagedCluster",
  properties: () => ({
    location: "location1",
    tags: { tier: "production", archv2: "" },
    sku: { name: "Basic", tier: "Free" },
    properties: {
      kubernetesVersion: "",
      dnsPrefix: "dnsprefix1",
      agentPoolProfiles: [
        {
          name: "nodepool1",
          count: 3,
          vmSize: "Standard_DS2_v2",
          osType: "Linux",
          type: "VirtualMachineScaleSets",
          enableNodePublicIP: true,
          mode: "System",
          enableEncryptionAtHost: true,
        },
      ],
      linuxProfile: {
        adminUsername: "azureuser",
        ssh: { publicKeys: [{ keyData: "keydata" }] },
      },
      networkProfile: {
        loadBalancerSku: "standard",
        outboundType: "loadBalancer",
        loadBalancerProfile: { managedOutboundIPs: { count: 2 } },
      },
      autoScalerProfile: {
        "scan-interval": "20s",
        "scale-down-delay-after-add": "15m",
      },
      windowsProfile: {
        adminUsername: "azureuser",
        adminPassword: "replacePassword1234$",
      },
      servicePrincipalProfile: { clientId: "clientid", secret: "secret" },
      apiServerAccessProfile: {
        enablePrivateCluster: true,
        enablePrivateClusterPublicFQDN: true,
      },
      addonProfiles: {},
      enableRBAC: true,
      enablePodSecurityPolicy: true,
    },
  }),
  dependencies: ({ resources }) => ({
    resourceGroup: resources.Resources.ResourceGroup["myResourceGroup"],
    managedIdentities: [
      resources.ManagedIdentity.UserAssignedIdentity["myUserAssignedIdentity"],
    ],
    diskEncryptionSet:
      resources.Compute.DiskEncryptionSet["myDiskEncryptionSet"],
  }),
});

```

### Create Managed Cluster with RunCommand disabled
```js
provider.ContainerService.makeManagedCluster({
  name: "myManagedCluster",
  properties: () => ({
    location: "location1",
    tags: { tier: "production", archv2: "" },
    sku: { name: "Basic", tier: "Free" },
    properties: {
      kubernetesVersion: "",
      dnsPrefix: "dnsprefix1",
      agentPoolProfiles: [
        {
          name: "nodepool1",
          count: 3,
          vmSize: "Standard_DS2_v2",
          osType: "Linux",
          type: "VirtualMachineScaleSets",
          enableNodePublicIP: true,
          mode: "System",
          enableEncryptionAtHost: true,
        },
      ],
      linuxProfile: {
        adminUsername: "azureuser",
        ssh: { publicKeys: [{ keyData: "keydata" }] },
      },
      networkProfile: {
        loadBalancerSku: "standard",
        outboundType: "loadBalancer",
        loadBalancerProfile: { managedOutboundIPs: { count: 2 } },
      },
      autoScalerProfile: {
        "scan-interval": "20s",
        "scale-down-delay-after-add": "15m",
      },
      windowsProfile: {
        adminUsername: "azureuser",
        adminPassword: "replacePassword1234$",
      },
      servicePrincipalProfile: { clientId: "clientid", secret: "secret" },
      apiServerAccessProfile: { disableRunCommand: true },
      addonProfiles: {},
      enableRBAC: true,
      enablePodSecurityPolicy: true,
    },
  }),
  dependencies: ({ resources }) => ({
    resourceGroup: resources.Resources.ResourceGroup["myResourceGroup"],
    managedIdentities: [
      resources.ManagedIdentity.UserAssignedIdentity["myUserAssignedIdentity"],
    ],
    diskEncryptionSet:
      resources.Compute.DiskEncryptionSet["myDiskEncryptionSet"],
  }),
});

```

### Create Managed Cluster with Node Public IP Prefix
```js
provider.ContainerService.makeManagedCluster({
  name: "myManagedCluster",
  properties: () => ({
    location: "location1",
    tags: { tier: "production", archv2: "" },
    sku: { name: "Basic", tier: "Free" },
    properties: {
      kubernetesVersion: "",
      dnsPrefix: "dnsprefix1",
      agentPoolProfiles: [
        {
          name: "nodepool1",
          count: 3,
          vmSize: "Standard_DS2_v2",
          osType: "Linux",
          type: "VirtualMachineScaleSets",
          enableNodePublicIP: true,
          mode: "System",
          nodePublicIPPrefixID:
            "/subscriptions/subid1/resourcegroups/rg1/providers/Microsoft.Network/publicIPPrefixes/public-ip-prefix",
        },
      ],
      linuxProfile: {
        adminUsername: "azureuser",
        ssh: { publicKeys: [{ keyData: "keydata" }] },
      },
      networkProfile: {
        loadBalancerSku: "standard",
        outboundType: "loadBalancer",
        loadBalancerProfile: { managedOutboundIPs: { count: 2 } },
      },
      autoScalerProfile: {
        "scan-interval": "20s",
        "scale-down-delay-after-add": "15m",
      },
      windowsProfile: {
        adminUsername: "azureuser",
        adminPassword: "replacePassword1234$",
      },
      servicePrincipalProfile: { clientId: "clientid", secret: "secret" },
      addonProfiles: {},
      enableRBAC: true,
      diskEncryptionSetID:
        "/subscriptions/subid1/resourceGroups/rg1/providers/Microsoft.Compute/diskEncryptionSets/des",
      enablePodSecurityPolicy: true,
    },
  }),
  dependencies: ({ resources }) => ({
    resourceGroup: resources.Resources.ResourceGroup["myResourceGroup"],
    managedIdentities: [
      resources.ManagedIdentity.UserAssignedIdentity["myUserAssignedIdentity"],
    ],
    diskEncryptionSet:
      resources.Compute.DiskEncryptionSet["myDiskEncryptionSet"],
  }),
});

```

### Create Managed Cluster with FIPS enabled OS
```js
provider.ContainerService.makeManagedCluster({
  name: "myManagedCluster",
  properties: () => ({
    location: "location1",
    tags: { tier: "production", archv2: "" },
    sku: { name: "Basic", tier: "Free" },
    properties: {
      kubernetesVersion: "",
      dnsPrefix: "dnsprefix1",
      agentPoolProfiles: [
        {
          name: "nodepool1",
          count: 3,
          vmSize: "Standard_DS2_v2",
          osType: "Linux",
          type: "VirtualMachineScaleSets",
          enableNodePublicIP: true,
          mode: "System",
          enableFIPS: true,
        },
      ],
      linuxProfile: {
        adminUsername: "azureuser",
        ssh: { publicKeys: [{ keyData: "keydata" }] },
      },
      networkProfile: {
        loadBalancerSku: "standard",
        outboundType: "loadBalancer",
        loadBalancerProfile: { managedOutboundIPs: { count: 2 } },
      },
      autoScalerProfile: {
        "scan-interval": "20s",
        "scale-down-delay-after-add": "15m",
      },
      windowsProfile: {
        adminUsername: "azureuser",
        adminPassword: "replacePassword1234$",
      },
      servicePrincipalProfile: { clientId: "clientid", secret: "secret" },
      addonProfiles: {},
      enableRBAC: true,
      diskEncryptionSetID:
        "/subscriptions/subid1/resourceGroups/rg1/providers/Microsoft.Compute/diskEncryptionSets/des",
      enablePodSecurityPolicy: false,
    },
  }),
  dependencies: ({ resources }) => ({
    resourceGroup: resources.Resources.ResourceGroup["myResourceGroup"],
    managedIdentities: [
      resources.ManagedIdentity.UserAssignedIdentity["myUserAssignedIdentity"],
    ],
    diskEncryptionSet:
      resources.Compute.DiskEncryptionSet["myDiskEncryptionSet"],
  }),
});

```

### Create Managed Cluster with HTTP proxy configured
```js
provider.ContainerService.makeManagedCluster({
  name: "myManagedCluster",
  properties: () => ({
    location: "location1",
    tags: { tier: "production", archv2: "" },
    sku: { name: "Basic", tier: "Free" },
    properties: {
      kubernetesVersion: "",
      dnsPrefix: "dnsprefix1",
      agentPoolProfiles: [
        {
          name: "nodepool1",
          count: 3,
          vmSize: "Standard_DS2_v2",
          osType: "Linux",
          type: "VirtualMachineScaleSets",
          enableNodePublicIP: true,
          mode: "System",
        },
      ],
      linuxProfile: {
        adminUsername: "azureuser",
        ssh: { publicKeys: [{ keyData: "keydata" }] },
      },
      networkProfile: {
        loadBalancerSku: "standard",
        outboundType: "loadBalancer",
        loadBalancerProfile: { managedOutboundIPs: { count: 2 } },
      },
      autoScalerProfile: {
        "scan-interval": "20s",
        "scale-down-delay-after-add": "15m",
      },
      windowsProfile: {
        adminUsername: "azureuser",
        adminPassword: "replacePassword1234$",
      },
      servicePrincipalProfile: { clientId: "clientid", secret: "secret" },
      addonProfiles: {},
      enableRBAC: true,
      diskEncryptionSetID:
        "/subscriptions/subid1/resourceGroups/rg1/providers/Microsoft.Compute/diskEncryptionSets/des",
      enablePodSecurityPolicy: true,
      httpProxyConfig: {
        httpProxy: "http://myproxy.server.com:8080",
        httpsProxy: "https://myproxy.server.com:8080",
        noProxy: ["localhost", "127.0.0.1"],
        trustedCa: "Q29uZ3JhdHMhIFlvdSBoYXZlIGZvdW5kIGEgaGlkZGVuIG1lc3NhZ2U=",
      },
    },
  }),
  dependencies: ({ resources }) => ({
    resourceGroup: resources.Resources.ResourceGroup["myResourceGroup"],
    managedIdentities: [
      resources.ManagedIdentity.UserAssignedIdentity["myUserAssignedIdentity"],
    ],
    diskEncryptionSet:
      resources.Compute.DiskEncryptionSet["myDiskEncryptionSet"],
  }),
});

```

### Create Managed Cluster with Security Profile configured
```js
provider.ContainerService.makeManagedCluster({
  name: "myManagedCluster",
  properties: () => ({
    location: "location1",
    tags: { tier: "production", archv2: "" },
    sku: { name: "Basic", tier: "Free" },
    properties: {
      kubernetesVersion: "",
      dnsPrefix: "dnsprefix1",
      agentPoolProfiles: [
        {
          name: "nodepool1",
          count: 3,
          vmSize: "Standard_DS2_v2",
          osType: "Linux",
          type: "VirtualMachineScaleSets",
          enableNodePublicIP: true,
          mode: "System",
        },
      ],
      linuxProfile: {
        adminUsername: "azureuser",
        ssh: { publicKeys: [{ keyData: "keydata" }] },
      },
      networkProfile: {
        loadBalancerSku: "standard",
        outboundType: "loadBalancer",
        loadBalancerProfile: { managedOutboundIPs: { count: 2 } },
      },
      securityProfile: {
        azureDefender: {
          enabled: true,
          logAnalyticsWorkspaceResourceId:
            "/subscriptions/SUB_ID/resourcegroups/RG_NAME/providers/microsoft.operationalinsights/workspaces/WORKSPACE_NAME",
        },
      },
    },
  }),
  dependencies: ({ resources }) => ({
    resourceGroup: resources.Resources.ResourceGroup["myResourceGroup"],
    managedIdentities: [
      resources.ManagedIdentity.UserAssignedIdentity["myUserAssignedIdentity"],
    ],
    diskEncryptionSet:
      resources.Compute.DiskEncryptionSet["myDiskEncryptionSet"],
  }),
});

```

### Create Managed Cluster with AKS-managed NAT gateway as outbound type
```js
provider.ContainerService.makeManagedCluster({
  name: "myManagedCluster",
  properties: () => ({
    location: "location1",
    tags: { tier: "production", archv2: "" },
    sku: { name: "Basic", tier: "Free" },
    properties: {
      kubernetesVersion: "",
      dnsPrefix: "dnsprefix1",
      agentPoolProfiles: [
        {
          name: "nodepool1",
          count: 3,
          vmSize: "Standard_DS2_v2",
          osType: "Linux",
          type: "VirtualMachineScaleSets",
          enableNodePublicIP: false,
          mode: "System",
        },
      ],
      linuxProfile: {
        adminUsername: "azureuser",
        ssh: { publicKeys: [{ keyData: "keydata" }] },
      },
      networkProfile: {
        loadBalancerSku: "standard",
        outboundType: "managedNATGateway",
        natGatewayProfile: { managedOutboundIPProfile: { count: 2 } },
      },
      autoScalerProfile: {
        "scan-interval": "20s",
        "scale-down-delay-after-add": "15m",
      },
      windowsProfile: {
        adminUsername: "azureuser",
        adminPassword: "replacePassword1234$",
      },
      servicePrincipalProfile: { clientId: "clientid", secret: "secret" },
      addonProfiles: {},
      enableRBAC: true,
      diskEncryptionSetID:
        "/subscriptions/subid1/resourceGroups/rg1/providers/Microsoft.Compute/diskEncryptionSets/des",
      enablePodSecurityPolicy: true,
    },
  }),
  dependencies: ({ resources }) => ({
    resourceGroup: resources.Resources.ResourceGroup["myResourceGroup"],
    managedIdentities: [
      resources.ManagedIdentity.UserAssignedIdentity["myUserAssignedIdentity"],
    ],
    diskEncryptionSet:
      resources.Compute.DiskEncryptionSet["myDiskEncryptionSet"],
  }),
});

```

### Create Managed Cluster with user-assigned NAT gateway as outbound type
```js
provider.ContainerService.makeManagedCluster({
  name: "myManagedCluster",
  properties: () => ({
    location: "location1",
    tags: { tier: "production", archv2: "" },
    sku: { name: "Basic", tier: "Free" },
    properties: {
      kubernetesVersion: "",
      dnsPrefix: "dnsprefix1",
      agentPoolProfiles: [
        {
          name: "nodepool1",
          count: 3,
          vmSize: "Standard_DS2_v2",
          osType: "Linux",
          type: "VirtualMachineScaleSets",
          enableNodePublicIP: false,
          mode: "System",
        },
      ],
      linuxProfile: {
        adminUsername: "azureuser",
        ssh: { publicKeys: [{ keyData: "keydata" }] },
      },
      networkProfile: {
        loadBalancerSku: "standard",
        outboundType: "userAssignedNATGateway",
      },
      autoScalerProfile: {
        "scan-interval": "20s",
        "scale-down-delay-after-add": "15m",
      },
      windowsProfile: {
        adminUsername: "azureuser",
        adminPassword: "replacePassword1234$",
      },
      servicePrincipalProfile: { clientId: "clientid", secret: "secret" },
      addonProfiles: {},
      enableRBAC: true,
      diskEncryptionSetID:
        "/subscriptions/subid1/resourceGroups/rg1/providers/Microsoft.Compute/diskEncryptionSets/des",
      enablePodSecurityPolicy: true,
    },
  }),
  dependencies: ({ resources }) => ({
    resourceGroup: resources.Resources.ResourceGroup["myResourceGroup"],
    managedIdentities: [
      resources.ManagedIdentity.UserAssignedIdentity["myUserAssignedIdentity"],
    ],
    diskEncryptionSet:
      resources.Compute.DiskEncryptionSet["myDiskEncryptionSet"],
  }),
});

```

### Create Managed Cluster using an agent pool snapshot
```js
provider.ContainerService.makeManagedCluster({
  name: "myManagedCluster",
  properties: () => ({
    location: "location1",
    tags: { tier: "production", archv2: "" },
    sku: { name: "Basic", tier: "Free" },
    properties: {
      kubernetesVersion: "",
      dnsPrefix: "dnsprefix1",
      agentPoolProfiles: [
        {
          name: "nodepool1",
          count: 3,
          vmSize: "Standard_DS2_v2",
          osType: "Linux",
          type: "VirtualMachineScaleSets",
          enableNodePublicIP: true,
          mode: "System",
          enableFIPS: true,
          creationData: {
            sourceResourceId:
              "/subscriptions/subid1/resourceGroups/rg1/providers/Microsoft.ContainerService/snapshots/snapshot1",
          },
        },
      ],
      linuxProfile: {
        adminUsername: "azureuser",
        ssh: { publicKeys: [{ keyData: "keydata" }] },
      },
      networkProfile: {
        loadBalancerSku: "standard",
        outboundType: "loadBalancer",
        loadBalancerProfile: { managedOutboundIPs: { count: 2 } },
      },
      autoScalerProfile: {
        "scan-interval": "20s",
        "scale-down-delay-after-add": "15m",
      },
      windowsProfile: {
        adminUsername: "azureuser",
        adminPassword: "replacePassword1234$",
      },
      servicePrincipalProfile: { clientId: "clientid", secret: "secret" },
      addonProfiles: {},
      enableRBAC: true,
      diskEncryptionSetID:
        "/subscriptions/subid1/resourceGroups/rg1/providers/Microsoft.Compute/diskEncryptionSets/des",
      enablePodSecurityPolicy: false,
    },
  }),
  dependencies: ({ resources }) => ({
    resourceGroup: resources.Resources.ResourceGroup["myResourceGroup"],
    managedIdentities: [
      resources.ManagedIdentity.UserAssignedIdentity["myUserAssignedIdentity"],
    ],
    diskEncryptionSet:
      resources.Compute.DiskEncryptionSet["myDiskEncryptionSet"],
  }),
});

```

### Create/Update Managed Cluster with Windows gMSA enabled
```js
provider.ContainerService.makeManagedCluster({
  name: "myManagedCluster",
  properties: () => ({
    location: "location1",
    tags: { tier: "production", archv2: "" },
    sku: { name: "Basic", tier: "Free" },
    properties: {
      kubernetesVersion: "",
      dnsPrefix: "dnsprefix1",
      agentPoolProfiles: [
        {
          name: "nodepool1",
          count: 3,
          vmSize: "Standard_DS1_v2",
          osType: "Linux",
          type: "VirtualMachineScaleSets",
          availabilityZones: ["1", "2", "3"],
          enableNodePublicIP: true,
          mode: "System",
        },
      ],
      linuxProfile: {
        adminUsername: "azureuser",
        ssh: { publicKeys: [{ keyData: "keydata" }] },
      },
      networkProfile: {
        loadBalancerSku: "standard",
        outboundType: "loadBalancer",
        loadBalancerProfile: { managedOutboundIPs: { count: 2 } },
      },
      autoScalerProfile: {
        "scan-interval": "20s",
        "scale-down-delay-after-add": "15m",
      },
      windowsProfile: {
        adminUsername: "azureuser",
        adminPassword: "replacePassword1234$",
        gmsaProfile: { enabled: true },
      },
      servicePrincipalProfile: { clientId: "clientid", secret: "secret" },
      addonProfiles: {},
      enableRBAC: true,
      diskEncryptionSetID:
        "/subscriptions/subid1/resourceGroups/rg1/providers/Microsoft.Compute/diskEncryptionSets/des",
      enablePodSecurityPolicy: true,
    },
    identity: {
      type: "UserAssigned",
      userAssignedIdentities: {
        "/subscriptions/subid1/resourceGroups/rgName1/providers/Microsoft.ManagedIdentity/userAssignedIdentities/identity1":
          {},
      },
    },
  }),
  dependencies: ({ resources }) => ({
    resourceGroup: resources.Resources.ResourceGroup["myResourceGroup"],
    managedIdentities: [
      resources.ManagedIdentity.UserAssignedIdentity["myUserAssignedIdentity"],
    ],
    diskEncryptionSet:
      resources.Compute.DiskEncryptionSet["myDiskEncryptionSet"],
  }),
});

```

### Create/Update Managed Cluster with dual-stack networking
```js
provider.ContainerService.makeManagedCluster({
  name: "myManagedCluster",
  properties: () => ({
    location: "location1",
    tags: { tier: "production", archv2: "" },
    sku: { name: "Basic", tier: "Free" },
    properties: {
      kubernetesVersion: "",
      dnsPrefix: "dnsprefix1",
      agentPoolProfiles: [
        {
          name: "nodepool1",
          count: 3,
          vmSize: "Standard_DS1_v2",
          osType: "Linux",
          type: "VirtualMachineScaleSets",
          scaleDownMode: "Deallocate",
          availabilityZones: ["1", "2", "3"],
          enableNodePublicIP: true,
          mode: "System",
        },
      ],
      linuxProfile: {
        adminUsername: "azureuser",
        ssh: { publicKeys: [{ keyData: "keydata" }] },
      },
      networkProfile: {
        loadBalancerSku: "standard",
        outboundType: "loadBalancer",
        loadBalancerProfile: { managedOutboundIPs: { count: 2 } },
        ipFamilies: ["IPv4", "IPv6"],
      },
      autoScalerProfile: {
        "balance-similar-node-groups": "true",
        expander: "priority",
        "max-node-provision-time": "15m",
        "new-pod-scale-up-delay": "1m",
        "scale-down-delay-after-add": "15m",
        "scan-interval": "20s",
        "skip-nodes-with-system-pods": "false",
      },
      windowsProfile: {
        adminUsername: "azureuser",
        adminPassword: "replacePassword1234$",
      },
      servicePrincipalProfile: { clientId: "clientid", secret: "secret" },
      addonProfiles: {},
      enableRBAC: true,
      diskEncryptionSetID:
        "/subscriptions/subid1/resourceGroups/rg1/providers/Microsoft.Compute/diskEncryptionSets/des",
      enablePodSecurityPolicy: true,
    },
    identity: {
      type: "UserAssigned",
      userAssignedIdentities: {
        "/subscriptions/subid1/resourceGroups/rgName1/providers/Microsoft.ManagedIdentity/userAssignedIdentities/identity1":
          {},
      },
    },
  }),
  dependencies: ({ resources }) => ({
    resourceGroup: resources.Resources.ResourceGroup["myResourceGroup"],
    managedIdentities: [
      resources.ManagedIdentity.UserAssignedIdentity["myUserAssignedIdentity"],
    ],
    diskEncryptionSet:
      resources.Compute.DiskEncryptionSet["myDiskEncryptionSet"],
  }),
});

```

### Associate Managed Cluster with Capacity Reservation Group
```js
provider.ContainerService.makeManagedCluster({
  name: "myManagedCluster",
  properties: () => ({
    location: "location1",
    tags: { tier: "production", archv2: "" },
    sku: { name: "Basic", tier: "Free" },
    properties: {
      kubernetesVersion: "",
      dnsPrefix: "dnsprefix1",
      agentPoolProfiles: [
        {
          name: "nodepool1",
          count: 3,
          vmSize: "Standard_DS2_v2",
          osType: "Linux",
          type: "VirtualMachineScaleSets",
          enableNodePublicIP: true,
          mode: "System",
          capacityReservationGroupID:
            "/subscriptions/subid1/resourcegroups/rg1/providers//Microsoft.Compute/capacityReservationGroups/crg1",
        },
      ],
      linuxProfile: {
        adminUsername: "azureuser",
        ssh: { publicKeys: [{ keyData: "keydata" }] },
      },
      networkProfile: {
        loadBalancerSku: "standard",
        outboundType: "loadBalancer",
        loadBalancerProfile: { managedOutboundIPs: { count: 2 } },
      },
      autoScalerProfile: {
        "scan-interval": "20s",
        "scale-down-delay-after-add": "15m",
      },
      windowsProfile: {
        adminUsername: "azureuser",
        adminPassword: "replacePassword1234$",
      },
      servicePrincipalProfile: { clientId: "clientid", secret: "secret" },
      addonProfiles: {},
      enableRBAC: true,
      diskEncryptionSetID:
        "/subscriptions/subid1/resourceGroups/rg1/providers/Microsoft.Compute/diskEncryptionSets/des",
      enablePodSecurityPolicy: true,
    },
  }),
  dependencies: ({ resources }) => ({
    resourceGroup: resources.Resources.ResourceGroup["myResourceGroup"],
    managedIdentities: [
      resources.ManagedIdentity.UserAssignedIdentity["myUserAssignedIdentity"],
    ],
    diskEncryptionSet:
      resources.Compute.DiskEncryptionSet["myDiskEncryptionSet"],
  }),
});

```
## Dependencies
- [ResourceGroup](../Resources/ResourceGroup.md)
- [UserAssignedIdentity](../ManagedIdentity/UserAssignedIdentity.md)
- [DiskEncryptionSet](../Compute/DiskEncryptionSet.md)
## Swagger Schema
```js
{
  properties: {
    sku: {
      description: 'The managed cluster SKU.',
      properties: {
        name: {
          type: 'string',
          description: 'The name of a managed cluster SKU.',
          enum: [ 'Basic' ],
          'x-ms-enum': { name: 'ManagedClusterSKUName', modelAsString: true }
        },
        tier: {
          type: 'string',
          title: 'The tier of a managed cluster SKU.',
          description: "If not specified, the default is 'Free'. See [uptime SLA](https://docs.microsoft.com/azure/aks/uptime-sla) for more details.",
          enum: [ 'Paid', 'Free' ],
          'x-ms-enum': {
            name: 'ManagedClusterSKUTier',
            modelAsString: true,
            values: [
              {
                value: 'Paid',
                description: "Guarantees 99.95% availability of the Kubernetes API server endpoint for clusters that use Availability Zones and 99.9% of availability for clusters that don't use Availability Zones."
              },
              {
                value: 'Free',
                description: 'No guaranteed SLA, no additional charges. Free tier clusters have an SLO of 99.5%.'
              }
            ]
          }
        }
      }
    },
    extendedLocation: {
      description: 'The extended location of the Virtual Machine.',
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
    identity: {
      description: 'The identity of the managed cluster, if configured.',
      properties: {
        principalId: {
          readOnly: true,
          type: 'string',
          description: 'The principal id of the system assigned identity which is used by master components.'
        },
        tenantId: {
          readOnly: true,
          type: 'string',
          description: 'The tenant id of the system assigned identity which is used by master components.'
        },
        type: {
          type: 'string',
          title: 'The type of identity used for the managed cluster.',
          description: 'For more information see [use managed identities in AKS](https://docs.microsoft.com/azure/aks/use-managed-identity).',
          enum: [ 'SystemAssigned', 'UserAssigned', 'None' ],
          'x-ms-enum': {
            name: 'ResourceIdentityType',
            modelAsString: false,
            values: [
              {
                value: 'SystemAssigned',
                description: 'Use an implicitly created system assigned managed identity to manage cluster resources. Master components in the control plane such as kube-controller-manager will use the system assigned managed identity to manipulate Azure resources.'
              },
              {
                value: 'UserAssigned',
                description: 'Use a user-specified identity to manage cluster resources. Master components in the control plane such as kube-controller-manager will use the specified user assigned managed identity to manipulate Azure resources.'
              },
              {
                value: 'None',
                description: 'Do not use a managed identity for the Managed Cluster, service principal will be used instead.'
              }
            ]
          }
        },
        userAssignedIdentities: {
          type: 'object',
          additionalProperties: {
            type: 'object',
            'x-ms-client-name': 'ManagedServiceIdentityUserAssignedIdentitiesValue',
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
          title: 'The user identity associated with the managed cluster. This identity will be used in control plane. Only one user assigned identity is allowed.',
          description: "The keys must be ARM resource IDs in the form: '/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.ManagedIdentity/userAssignedIdentities/{identityName}'."
        }
      }
    },
    properties: {
      description: 'Properties of a managed cluster.',
      'x-ms-client-flatten': true,
      properties: {
        provisioningState: {
          readOnly: true,
          type: 'string',
          description: 'The current provisioning state.'
        },
        powerState: {
          description: 'The Power State of the cluster.',
          readOnly: true,
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
        maxAgentPools: {
          readOnly: true,
          type: 'integer',
          format: 'int32',
          description: 'The max number of agent pools for the managed cluster.'
        },
        kubernetesVersion: {
          type: 'string',
          title: 'The version of Kubernetes the Managed Cluster is requested to run.',
          description: 'When you upgrade a supported AKS cluster, Kubernetes minor versions cannot be skipped. All upgrades must be performed sequentially by major version number. For example, upgrades between 1.14.x -> 1.15.x or 1.15.x -> 1.16.x are allowed, however 1.14.x -> 1.16.x is not allowed. See [upgrading an AKS cluster](https://docs.microsoft.com/azure/aks/upgrade-cluster) for more details.'
        },
        currentKubernetesVersion: {
          readOnly: true,
          type: 'string',
          description: 'The version of Kubernetes the Managed Cluster is running.'
        },
        dnsPrefix: {
          type: 'string',
          title: 'The DNS prefix of the Managed Cluster.',
          description: 'This cannot be updated once the Managed Cluster has been created.'
        },
        fqdnSubdomain: {
          type: 'string',
          title: 'The FQDN subdomain of the private cluster with custom private dns zone.',
          description: 'This cannot be updated once the Managed Cluster has been created.'
        },
        fqdn: {
          readOnly: true,
          type: 'string',
          description: 'The FQDN of the master pool.'
        },
        privateFQDN: {
          readOnly: true,
          type: 'string',
          description: 'The FQDN of private cluster.'
        },
        azurePortalFQDN: {
          readOnly: true,
          type: 'string',
          title: 'The special FQDN used by the Azure Portal to access the Managed Cluster. This FQDN is for use only by the Azure Portal and should not be used by other clients.',
          description: "The Azure Portal requires certain Cross-Origin Resource Sharing (CORS) headers to be sent in some responses, which Kubernetes APIServer doesn't handle by default. This special FQDN supports CORS, allowing the Azure Portal to function properly."
        },
        agentPoolProfiles: {
          type: 'array',
          items: {
            allOf: [
              {
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
                        {
                          value: 'Windows',
                          description: 'Use Windows.'
                        }
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
                    'x-ms-enum': {
                      name: 'GPUInstanceProfile ',
                      modelAsString: true
                    }
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
                description: 'Properties for the container service agent pool profile.'
              },
              {
                properties: {
                  name: {
                    type: 'string',
                    title: 'Unique name of the agent pool profile in the context of the subscription and resource group.',
                    description: 'Windows agent pool names must be 6 characters or less.',
                    pattern: '^[a-z][a-z0-9]{0,11}$'
                  }
                }
              }
            ],
            required: [ 'name' ],
            description: 'Profile for the container service agent pool.'
          },
          description: 'The agent pool properties.'
        },
        linuxProfile: {
          description: 'The profile for Linux VMs in the Managed Cluster.',
          properties: {
            adminUsername: {
              type: 'string',
              description: 'The administrator username to use for Linux VMs.',
              pattern: '^[A-Za-z][-A-Za-z0-9_]*$'
            },
            ssh: {
              description: 'The SSH configuration for Linux-based VMs running on Azure.',
              properties: {
                publicKeys: {
                  type: 'array',
                  items: {
                    properties: {
                      keyData: {
                        type: 'string',
                        description: 'Certificate public key used to authenticate with VMs through SSH. The certificate must be in PEM format with or without headers.'
                      }
                    },
                    required: [ 'keyData' ],
                    description: 'Contains information about SSH certificate public key data.'
                  },
                  description: 'The list of SSH public keys used to authenticate with Linux-based VMs. A maximum of 1 key may be specified.'
                }
              },
              required: [ 'publicKeys' ]
            }
          },
          required: [ 'adminUsername', 'ssh' ]
        },
        windowsProfile: {
          description: 'The profile for Windows VMs in the Managed Cluster.',
          properties: {
            adminUsername: {
              type: 'string',
              description: 'Specifies the name of the administrator account. <br><br> **Restriction:** Cannot end in "." <br><br> **Disallowed values:** "administrator", "admin", "user", "user1", "test", "user2", "test1", "user3", "admin1", "1", "123", "a", "actuser", "adm", "admin2", "aspnet", "backup", "console", "david", "guest", "john", "owner", "root", "server", "sql", "support", "support_388945a0", "sys", "test2", "test3", "user4", "user5". <br><br> **Minimum-length:** 1 character <br><br> **Max-length:** 20 characters'
            },
            adminPassword: {
              type: 'string',
              description: 'Specifies the password of the administrator account. <br><br> **Minimum-length:** 8 characters <br><br> **Max-length:** 123 characters <br><br> **Complexity requirements:** 3 out of 4 conditions below need to be fulfilled <br> Has lower characters <br>Has upper characters <br> Has a digit <br> Has a special character (Regex match [\\W_]) <br><br> **Disallowed values:** "abc@123", "P@$$w0rd", "P@ssw0rd", "P@ssword123", "Pa$$word", "pass@word1", "Password!", "Password1", "Password22", "iloveyou!"'
            },
            licenseType: {
              type: 'string',
              enum: [ 'None', 'Windows_Server' ],
              'x-ms-enum': {
                name: 'licenseType',
                modelAsString: true,
                values: [
                  {
                    value: 'None',
                    description: 'No additional licensing is applied.'
                  },
                  {
                    value: 'Windows_Server',
                    description: 'Enables Azure Hybrid User Benefits for Windows VMs.'
                  }
                ]
              },
              description: 'The license type to use for Windows VMs. See [Azure Hybrid User Benefits](https://azure.microsoft.com/pricing/hybrid-benefit/faq/) for more details.'
            },
            enableCSIProxy: {
              type: 'boolean',
              title: 'Whether to enable CSI proxy.',
              description: 'For more details on CSI proxy, see the [CSI proxy GitHub repo](https://github.com/kubernetes-csi/csi-proxy).'
            },
            gmsaProfile: {
              description: 'The Windows gMSA Profile in the Managed Cluster.',
              type: 'object',
              properties: {
                enabled: {
                  type: 'boolean',
                  title: 'Whether to enable Windows gMSA.',
                  description: 'Specifies whether to enable Windows gMSA in the managed cluster.'
                },
                dnsServer: {
                  type: 'string',
                  description: 'Specifies the DNS server for Windows gMSA. <br><br> Set it to empty if you have configured the DNS server in the vnet which is used to create the managed cluster.'
                },
                rootDomainName: {
                  type: 'string',
                  description: 'Specifies the root domain name for Windows gMSA. <br><br> Set it to empty if you have configured the DNS server in the vnet which is used to create the managed cluster.'
                }
              }
            }
          },
          required: [ 'adminUsername' ]
        },
        servicePrincipalProfile: {
          description: 'Information about a service principal identity for the cluster to use for manipulating Azure APIs.',
          properties: {
            clientId: {
              type: 'string',
              description: 'The ID for the service principal.'
            },
            secret: {
              type: 'string',
              description: 'The secret password associated with the service principal in plain text.'
            }
          },
          required: [ 'clientId' ]
        },
        addonProfiles: {
          additionalProperties: {
            properties: {
              enabled: {
                type: 'boolean',
                description: 'Whether the add-on is enabled or not.'
              },
              config: {
                additionalProperties: { type: 'string' },
                description: 'Key-value pairs for configuring an add-on.'
              },
              identity: {
                readOnly: true,
                description: 'Information of user assigned identity used by this add-on.',
                allOf: [
                  {
                    properties: {
                      resourceId: {
                        type: 'string',
                        description: 'The resource ID of the user assigned identity.'
                      },
                      clientId: {
                        type: 'string',
                        description: 'The client ID of the user assigned identity.'
                      },
                      objectId: {
                        type: 'string',
                        description: 'The object ID of the user assigned identity.'
                      }
                    },
                    description: 'Details about a user assigned identity.'
                  }
                ]
              }
            },
            required: [ 'enabled' ],
            description: 'A Kubernetes add-on profile for a managed cluster.'
          },
          description: 'The profile of managed cluster add-on.'
        },
        podIdentityProfile: {
          title: 'The pod identity profile of the Managed Cluster.',
          description: 'See [use AAD pod identity](https://docs.microsoft.com/azure/aks/use-azure-ad-pod-identity) for more details on AAD pod identity integration.',
          properties: {
            enabled: {
              type: 'boolean',
              description: 'Whether the pod identity addon is enabled.'
            },
            allowNetworkPluginKubenet: {
              type: 'boolean',
              title: 'Whether pod identity is allowed to run on clusters with Kubenet networking.',
              description: 'Running in Kubenet is disabled by default due to the security related nature of AAD Pod Identity and the risks of IP spoofing. See [using Kubenet network plugin with AAD Pod Identity](https://docs.microsoft.com/azure/aks/use-azure-ad-pod-identity#using-kubenet-network-plugin-with-azure-active-directory-pod-managed-identities) for more information.'
            },
            userAssignedIdentities: {
              description: 'The pod identities to use in the cluster.',
              type: 'array',
              items: {
                properties: {
                  name: {
                    type: 'string',
                    description: 'The name of the pod identity.'
                  },
                  namespace: {
                    type: 'string',
                    description: 'The namespace of the pod identity.'
                  },
                  bindingSelector: {
                    type: 'string',
                    description: 'The binding selector to use for the AzureIdentityBinding resource.'
                  },
                  identity: {
                    properties: {
                      resourceId: {
                        type: 'string',
                        description: 'The resource ID of the user assigned identity.'
                      },
                      clientId: {
                        type: 'string',
                        description: 'The client ID of the user assigned identity.'
                      },
                      objectId: {
                        type: 'string',
                        description: 'The object ID of the user assigned identity.'
                      }
                    },
                    description: 'Details about a user assigned identity.'
                  },
                  provisioningState: {
                    type: 'string',
                    readOnly: true,
                    description: 'The current provisioning state of the pod identity.',
                    enum: [ 'Assigned', 'Updating', 'Deleting', 'Failed' ],
                    'x-ms-enum': {
                      name: 'ManagedClusterPodIdentityProvisioningState',
                      modelAsString: true
                    }
                  },
                  provisioningInfo: {
                    readOnly: true,
                    properties: {
                      error: {
                        description: 'Pod identity assignment error (if any).',
                        type: 'object',
                        properties: {
                          error: {
                            description: 'Details about the error.',
                            type: 'object',
                            properties: {
                              code: {
                                type: 'string',
                                description: 'An identifier for the error. Codes are invariant and are intended to be consumed programmatically.'
                              },
                              message: {
                                type: 'string',
                                description: 'A message describing the error, intended to be suitable for display in a user interface.'
                              },
                              target: {
                                type: 'string',
                                description: 'The target of the particular error. For example, the name of the property in error.'
                              },
                              details: {
                                type: 'array',
                                items: [Object],
                                description: 'A list of additional details about the error.'
                              }
                            }
                          }
                        }
                      }
                    }
                  }
                },
                required: [ 'name', 'namespace', 'identity' ],
                description: 'Details about the pod identity assigned to the Managed Cluster.'
              }
            },
            userAssignedIdentityExceptions: {
              description: 'The pod identity exceptions to allow.',
              type: 'array',
              items: {
                properties: {
                  name: {
                    type: 'string',
                    description: 'The name of the pod identity exception.'
                  },
                  namespace: {
                    type: 'string',
                    description: 'The namespace of the pod identity exception.'
                  },
                  podLabels: {
                    type: 'object',
                    description: 'The pod labels to match.',
                    additionalProperties: { type: 'string' }
                  }
                },
                required: [ 'name', 'namespace', 'podLabels' ],
                title: 'A pod identity exception, which allows pods with certain labels to access the Azure Instance Metadata Service (IMDS) endpoint without being intercepted by the node-managed identity (NMI) server.',
                description: 'See [disable AAD Pod Identity for a specific Pod/Application](https://azure.github.io/aad-pod-identity/docs/configure/application_exception/) for more details.'
              }
            }
          }
        },
        oidcIssuerProfile: {
          description: 'The OIDC issuer profile of the Managed Cluster.',
          type: 'object',
          properties: {
            issuerURL: {
              readOnly: true,
              type: 'string',
              description: 'The OIDC issuer url of the Managed Cluster.'
            },
            enabled: {
              type: 'boolean',
              description: 'Whether the OIDC issuer is enabled.'
            }
          }
        },
        nodeResourceGroup: {
          type: 'string',
          description: 'The name of the resource group containing agent pool nodes.'
        },
        enableRBAC: {
          type: 'boolean',
          description: 'Whether to enable Kubernetes Role-Based Access Control.'
        },
        enablePodSecurityPolicy: {
          type: 'boolean',
          description: '(DEPRECATING) Whether to enable Kubernetes pod security policy (preview). This feature is set for removal on October 15th, 2020. Learn more at aka.ms/aks/azpodpolicy.'
        },
        enableNamespaceResources: {
          type: 'boolean',
          title: 'Enable namespace as Azure resource.',
          description: 'The default value is false. It can be enabled/disabled on creation and updation of the managed cluster. See [https://aka.ms/NamespaceARMResource](https://aka.ms/NamespaceARMResource) for more details on Namespace as a ARM Resource.'
        },
        networkProfile: {
          description: 'The network configuration profile.',
          properties: {
            networkPlugin: {
              type: 'string',
              enum: [ 'azure', 'kubenet' ],
              default: 'kubenet',
              'x-ms-enum': {
                name: 'NetworkPlugin',
                modelAsString: true,
                values: [
                  {
                    value: 'azure',
                    description: 'Use the Azure CNI network plugin. See [Azure CNI (advanced) networking](https://docs.microsoft.com/azure/aks/concepts-network#azure-cni-advanced-networking) for more information.'
                  },
                  {
                    value: 'kubenet',
                    description: 'Use the Kubenet network plugin. See [Kubenet (basic) networking](https://docs.microsoft.com/azure/aks/concepts-network#kubenet-basic-networking) for more information.'
                  }
                ]
              },
              description: 'Network plugin used for building the Kubernetes network.'
            },
            networkPolicy: {
              type: 'string',
              enum: [ 'calico', 'azure' ],
              'x-ms-enum': {
                name: 'NetworkPolicy',
                modelAsString: true,
                values: [
                  {
                    value: 'calico',
                    description: 'Use Calico network policies. See [differences between Azure and Calico policies](https://docs.microsoft.com/azure/aks/use-network-policies#differences-between-azure-and-calico-policies-and-their-capabilities) for more information.'
                  },
                  {
                    value: 'azure',
                    description: 'Use Azure network policies. See [differences between Azure and Calico policies](https://docs.microsoft.com/azure/aks/use-network-policies#differences-between-azure-and-calico-policies-and-their-capabilities) for more information.'
                  }
                ]
              },
              description: 'Network policy used for building the Kubernetes network.'
            },
            networkMode: {
              type: 'string',
              enum: [ 'transparent', 'bridge' ],
              'x-ms-enum': {
                name: 'networkMode',
                modelAsString: true,
                values: [
                  {
                    value: 'transparent',
                    description: 'No bridge is created. Intra-VM Pod to Pod communication is through IP routes created by Azure CNI. See [Transparent Mode](https://docs.microsoft.com/azure/aks/faq#transparent-mode) for more information.'
                  },
                  {
                    value: 'bridge',
                    description: 'This is no longer supported'
                  }
                ]
              },
              title: 'The network mode Azure CNI is configured with.',
              description: "This cannot be specified if networkPlugin is anything other than 'azure'."
            },
            podCidr: {
              type: 'string',
              pattern: '^([0-9]{1,3}\\.){3}[0-9]{1,3}(\\/([0-9]|[1-2][0-9]|3[0-2]))?$',
              default: '10.244.0.0/16',
              description: 'A CIDR notation IP range from which to assign pod IPs when kubenet is used.'
            },
            serviceCidr: {
              type: 'string',
              pattern: '^([0-9]{1,3}\\.){3}[0-9]{1,3}(\\/([0-9]|[1-2][0-9]|3[0-2]))?$',
              default: '10.0.0.0/16',
              description: 'A CIDR notation IP range from which to assign service cluster IPs. It must not overlap with any Subnet IP ranges.'
            },
            dnsServiceIP: {
              type: 'string',
              pattern: '^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$',
              default: '10.0.0.10',
              description: 'An IP address assigned to the Kubernetes DNS service. It must be within the Kubernetes service address range specified in serviceCidr.'
            },
            dockerBridgeCidr: {
              type: 'string',
              pattern: '^([0-9]{1,3}\\.){3}[0-9]{1,3}(\\/([0-9]|[1-2][0-9]|3[0-2]))?$',
              default: '172.17.0.1/16',
              description: 'A CIDR notation IP range assigned to the Docker bridge network. It must not overlap with any Subnet IP ranges or the Kubernetes service address range.'
            },
            outboundType: {
              type: 'string',
              enum: [
                'loadBalancer',
                'userDefinedRouting',
                'managedNATGateway',
                'userAssignedNATGateway'
              ],
              'x-ms-enum': {
                name: 'outboundType',
                modelAsString: true,
                values: [
                  {
                    value: 'loadBalancer',
                    description: "The load balancer is used for egress through an AKS assigned public IP. This supports Kubernetes services of type 'loadBalancer'. For more information see [outbound type loadbalancer](https://docs.microsoft.com/azure/aks/egress-outboundtype#outbound-type-of-loadbalancer)."
                  },
                  {
                    value: 'userDefinedRouting',
                    description: 'Egress paths must be defined by the user. This is an advanced scenario and requires proper network configuration. For more information see [outbound type userDefinedRouting](https://docs.microsoft.com/azure/aks/egress-outboundtype#outbound-type-of-userdefinedrouting).'
                  },
                  {
                    value: 'managedNATGateway',
                    description: 'The AKS-managed NAT gateway is used for egress.'
                  },
                  {
                    value: 'userAssignedNATGateway',
                    description: 'The user-assigned NAT gateway associated to the cluster subnet is used for egress. This is an advanced scenario and requires proper network configuration.'
                  }
                ]
              },
              default: 'loadBalancer',
              title: 'The outbound (egress) routing method.',
              description: 'This can only be set at cluster creation time and cannot be changed later. For more information see [egress outbound type](https://docs.microsoft.com/azure/aks/egress-outboundtype).'
            },
            loadBalancerSku: {
              type: 'string',
              enum: [ 'standard', 'basic' ],
              'x-ms-enum': {
                name: 'loadBalancerSku',
                modelAsString: true,
                values: [
                  {
                    value: 'standard',
                    description: 'Use a a standard Load Balancer. This is the recommended Load Balancer SKU. For more information about on working with the load balancer in the managed cluster, see the [standard Load Balancer](https://docs.microsoft.com/azure/aks/load-balancer-standard) article.'
                  },
                  {
                    value: 'basic',
                    description: 'Use a basic Load Balancer with limited functionality.'
                  }
                ]
              },
              title: 'The load balancer sku for the managed cluster.',
              description: "The default is 'standard'. See [Azure Load Balancer SKUs](https://docs.microsoft.com/azure/load-balancer/skus) for more information about the differences between load balancer SKUs."
            },
            loadBalancerProfile: {
              description: 'Profile of the cluster load balancer.',
              properties: {
                managedOutboundIPs: {
                  properties: {
                    count: {
                      type: 'integer',
                      format: 'int32',
                      maximum: 100,
                      minimum: 1,
                      description: 'The desired number of IPv4 outbound IPs created/managed by Azure for the cluster load balancer. Allowed values must be in the range of 1 to 100 (inclusive). The default value is 1. ',
                      default: 1
                    },
                    countIPv6: {
                      type: 'integer',
                      format: 'int32',
                      maximum: 100,
                      minimum: 0,
                      description: 'The desired number of IPv6 outbound IPs created/managed by Azure for the cluster load balancer. Allowed values must be in the range of 1 to 100 (inclusive). The default value is 0 for single-stack and 1 for dual-stack. ',
                      default: 0
                    }
                  },
                  description: 'Desired managed outbound IPs for the cluster load balancer.'
                },
                outboundIPPrefixes: {
                  properties: {
                    publicIPPrefixes: {
                      type: 'array',
                      items: {
                        properties: {
                          id: {
                            type: 'string',
                            description: 'The fully qualified Azure resource id.'
                          }
                        },
                        description: 'A reference to an Azure resource.'
                      },
                      description: 'A list of public IP prefix resources.'
                    }
                  },
                  description: 'Desired outbound IP Prefix resources for the cluster load balancer.'
                },
                outboundIPs: {
                  properties: {
                    publicIPs: {
                      type: 'array',
                      items: {
                        properties: {
                          id: {
                            type: 'string',
                            description: 'The fully qualified Azure resource id.'
                          }
                        },
                        description: 'A reference to an Azure resource.'
                      },
                      description: 'A list of public IP resources.'
                    }
                  },
                  description: 'Desired outbound IP resources for the cluster load balancer.'
                },
                effectiveOutboundIPs: {
                  type: 'array',
                  items: {
                    properties: {
                      id: {
                        type: 'string',
                        description: 'The fully qualified Azure resource id.'
                      }
                    },
                    description: 'A reference to an Azure resource.'
                  },
                  description: 'The effective outbound IP resources of the cluster load balancer.'
                },
                allocatedOutboundPorts: {
                  type: 'integer',
                  format: 'int32',
                  maximum: 64000,
                  minimum: 0,
                  description: 'The desired number of allocated SNAT ports per VM. Allowed values are in the range of 0 to 64000 (inclusive). The default value is 0 which results in Azure dynamically allocating ports.',
                  default: 0
                },
                idleTimeoutInMinutes: {
                  type: 'integer',
                  format: 'int32',
                  maximum: 120,
                  minimum: 4,
                  description: 'Desired outbound flow idle timeout in minutes. Allowed values are in the range of 4 to 120 (inclusive). The default value is 30 minutes.',
                  default: 30
                },
                enableMultipleStandardLoadBalancers: {
                  type: 'boolean',
                  description: 'Enable multiple standard load balancers per AKS cluster or not.'
                }
              }
            },
            natGatewayProfile: {
              description: 'Profile of the cluster NAT gateway.',
              type: 'object',
              properties: {
                managedOutboundIPProfile: {
                  description: 'Profile of the managed outbound IP resources of the cluster NAT gateway.',
                  type: 'object',
                  properties: {
                    count: {
                      type: 'integer',
                      format: 'int32',
                      maximum: 16,
                      minimum: 1,
                      description: 'The desired number of outbound IPs created/managed by Azure. Allowed values must be in the range of 1 to 16 (inclusive). The default value is 1. ',
                      default: 1
                    }
                  }
                },
                effectiveOutboundIPs: {
                  type: 'array',
                  items: {
                    properties: {
                      id: {
                        type: 'string',
                        description: 'The fully qualified Azure resource id.'
                      }
                    },
                    description: 'A reference to an Azure resource.'
                  },
                  description: 'The effective outbound IP resources of the cluster NAT gateway.'
                },
                idleTimeoutInMinutes: {
                  type: 'integer',
                  format: 'int32',
                  maximum: 120,
                  minimum: 4,
                  description: 'Desired outbound flow idle timeout in minutes. Allowed values are in the range of 4 to 120 (inclusive). The default value is 4 minutes.',
                  default: 4
                }
              }
            },
            podCidrs: {
              type: 'array',
              items: { type: 'string' },
              title: 'The CIDR notation IP ranges from which to assign pod IPs.',
              description: 'One IPv4 CIDR is expected for single-stack networking. Two CIDRs, one for each IP family (IPv4/IPv6), is expected for dual-stack networking.'
            },
            serviceCidrs: {
              type: 'array',
              items: { type: 'string' },
              title: 'The CIDR notation IP ranges from which to assign service cluster IPs.',
              description: 'One IPv4 CIDR is expected for single-stack networking. Two CIDRs, one for each IP family (IPv4/IPv6), is expected for dual-stack networking. They must not overlap with any Subnet IP ranges.'
            },
            ipFamilies: {
              type: 'array',
              items: {
                type: 'string',
                description: 'The IP version to use for cluster networking and IP assignment.',
                enum: [ 'IPv4', 'IPv6' ],
                'x-ms-enum': { name: 'ipFamily', modelAsString: true }
              },
              title: 'The IP families used to specify IP versions available to the cluster.',
              description: 'IP families are used to determine single-stack or dual-stack clusters. For single-stack, the expected value is IPv4. For dual-stack, the expected values are IPv4 and IPv6.'
            }
          }
        },
        aadProfile: {
          description: 'The Azure Active Directory configuration.',
          properties: {
            managed: {
              type: 'boolean',
              description: 'Whether to enable managed AAD.'
            },
            enableAzureRBAC: {
              type: 'boolean',
              description: 'Whether to enable Azure RBAC for Kubernetes authorization.'
            },
            adminGroupObjectIDs: {
              type: 'array',
              items: { type: 'string' },
              description: 'The list of AAD group object IDs that will have admin role of the cluster.'
            },
            clientAppID: {
              type: 'string',
              description: 'The client AAD application ID.'
            },
            serverAppID: {
              type: 'string',
              description: 'The server AAD application ID.'
            },
            serverAppSecret: {
              type: 'string',
              description: 'The server AAD application secret.'
            },
            tenantID: {
              type: 'string',
              description: 'The AAD tenant ID to use for authentication. If not specified, will use the tenant of the deployment subscription.'
            }
          },
          title: 'AADProfile specifies attributes for Azure Active Directory integration.'
        },
        autoUpgradeProfile: {
          description: 'The auto upgrade configuration.',
          properties: {
            upgradeChannel: {
              type: 'string',
              enum: [ 'rapid', 'stable', 'patch', 'node-image', 'none' ],
              'x-ms-enum': {
                name: 'upgradeChannel',
                modelAsString: true,
                values: [
                  {
                    value: 'rapid',
                    description: 'Automatically upgrade the cluster to the latest supported patch release on the latest supported minor version. In cases where the cluster is at a version of Kubernetes that is at an N-2 minor version where N is the latest supported minor version, the cluster first upgrades to the latest supported patch version on N-1 minor version. For example, if a cluster is running version 1.17.7 and versions 1.17.9, 1.18.4, 1.18.6, and 1.19.1 are available, your cluster first is upgraded to 1.18.6, then is upgraded to 1.19.1.'
                  },
                  {
                    value: 'stable',
                    description: 'Automatically upgrade the cluster to the latest supported patch release on minor version N-1, where N is the latest supported minor version. For example, if a cluster is running version 1.17.7 and versions 1.17.9, 1.18.4, 1.18.6, and 1.19.1 are available, your cluster is upgraded to 1.18.6.'
                  },
                  {
                    value: 'patch',
                    description: 'Automatically upgrade the cluster to the latest supported patch version when it becomes available while keeping the minor version the same. For example, if a cluster is running version 1.17.7 and versions 1.17.9, 1.18.4, 1.18.6, and 1.19.1 are available, your cluster is upgraded to 1.17.9.'
                  },
                  {
                    value: 'node-image',
                    description: "Automatically upgrade the node image to the latest version available. Microsoft provides patches and new images for image nodes frequently (usually weekly), but your running nodes won't get the new images unless you do a node image upgrade. Turning on the node-image channel will automatically update your node images whenever a new version is available."
                  },
                  {
                    value: 'none',
                    description: 'Disables auto-upgrades and keeps the cluster at its current version of Kubernetes.'
                  }
                ]
              },
              title: "The upgrade channel for auto upgrade. The default is 'none'.",
              description: 'For more information see [setting the AKS cluster auto-upgrade channel](https://docs.microsoft.com/azure/aks/upgrade-cluster#set-auto-upgrade-channel).'
            }
          }
        },
        autoScalerProfile: {
          type: 'object',
          properties: {
            'balance-similar-node-groups': {
              type: 'string',
              title: 'Detects similar node pools and balances the number of nodes between them.',
              description: "Valid values are 'true' and 'false'"
            },
            expander: {
              type: 'string',
              enum: [ 'least-waste', 'most-pods', 'priority', 'random' ],
              'x-ms-enum': {
                name: 'expander',
                modelAsString: true,
                values: [
                  {
                    value: 'least-waste',
                    description: 'Selects the node group that will have the least idle CPU (if tied, unused memory) after scale-up. This is useful when you have different classes of nodes, for example, high CPU or high memory nodes, and only want to expand those when there are pending pods that need a lot of those resources.'
                  },
                  {
                    value: 'most-pods',
                    description: "Selects the node group that would be able to schedule the most pods when scaling up. This is useful when you are using nodeSelector to make sure certain pods land on certain nodes. Note that this won't cause the autoscaler to select bigger nodes vs. smaller, as it can add multiple smaller nodes at once."
                  },
                  {
                    value: 'priority',
                    description: "Selects the node group that has the highest priority assigned by the user. It's configuration is described in more details [here](https://github.com/kubernetes/autoscaler/blob/master/cluster-autoscaler/expander/priority/readme.md)."
                  },
                  {
                    value: 'random',
                    description: "Used when you don't have a particular need for the node groups to scale differently."
                  }
                ]
              },
              title: 'The expander to use when scaling up',
              description: "If not specified, the default is 'random'. See [expanders](https://github.com/kubernetes/autoscaler/blob/master/cluster-autoscaler/FAQ.md#what-are-expanders) for more information."
            },
            'max-empty-bulk-delete': {
              type: 'string',
              title: 'The maximum number of empty nodes that can be deleted at the same time. This must be a positive integer.',
              description: 'The default is 10.'
            },
            'max-graceful-termination-sec': {
              type: 'string',
              title: 'The maximum number of seconds the cluster autoscaler waits for pod termination when trying to scale down a node.',
              description: 'The default is 600.'
            },
            'max-node-provision-time': {
              type: 'string',
              title: 'The maximum time the autoscaler waits for a node to be provisioned.',
              description: "The default is '15m'. Values must be an integer followed by an 'm'. No unit of time other than minutes (m) is supported."
            },
            'max-total-unready-percentage': {
              type: 'string',
              title: 'The maximum percentage of unready nodes in the cluster. After this percentage is exceeded, cluster autoscaler halts operations.',
              description: 'The default is 45. The maximum is 100 and the minimum is 0.'
            },
            'new-pod-scale-up-delay': {
              type: 'string',
              title: "Ignore unscheduled pods before they're a certain age.",
              description: "For scenarios like burst/batch scale where you don't want CA to act before the kubernetes scheduler could schedule all the pods, you can tell CA to ignore unscheduled pods before they're a certain age. The default is '0s'. Values must be an integer followed by a unit ('s' for seconds, 'm' for minutes, 'h' for hours, etc)."
            },
            'ok-total-unready-count': {
              type: 'string',
              title: 'The number of allowed unready nodes, irrespective of max-total-unready-percentage.',
              description: 'This must be an integer. The default is 3.'
            },
            'scan-interval': {
              type: 'string',
              title: 'How often cluster is reevaluated for scale up or down.',
              description: "The default is '10'. Values must be an integer number of seconds."
            },
            'scale-down-delay-after-add': {
              type: 'string',
              title: 'How long after scale up that scale down evaluation resumes',
              description: "The default is '10m'. Values must be an integer followed by an 'm'. No unit of time other than minutes (m) is supported."
            },
            'scale-down-delay-after-delete': {
              type: 'string',
              title: 'How long after node deletion that scale down evaluation resumes.',
              description: "The default is the scan-interval. Values must be an integer followed by an 'm'. No unit of time other than minutes (m) is supported."
            },
            'scale-down-delay-after-failure': {
              type: 'string',
              title: 'How long after scale down failure that scale down evaluation resumes.',
              description: "The default is '3m'. Values must be an integer followed by an 'm'. No unit of time other than minutes (m) is supported."
            },
            'scale-down-unneeded-time': {
              type: 'string',
              title: 'How long a node should be unneeded before it is eligible for scale down.',
              description: "The default is '10m'. Values must be an integer followed by an 'm'. No unit of time other than minutes (m) is supported."
            },
            'scale-down-unready-time': {
              type: 'string',
              title: 'How long an unready node should be unneeded before it is eligible for scale down',
              description: "The default is '20m'. Values must be an integer followed by an 'm'. No unit of time other than minutes (m) is supported."
            },
            'scale-down-utilization-threshold': {
              type: 'string',
              title: 'Node utilization level, defined as sum of requested resources divided by capacity, below which a node can be considered for scale down.',
              description: "The default is '0.5'."
            },
            'skip-nodes-with-local-storage': {
              type: 'string',
              title: 'If cluster autoscaler will skip deleting nodes with pods with local storage, for example, EmptyDir or HostPath.',
              description: 'The default is true.'
            },
            'skip-nodes-with-system-pods': {
              type: 'string',
              title: 'If cluster autoscaler will skip deleting nodes with pods from kube-system (except for DaemonSet or mirror pods)',
              description: 'The default is true.'
            }
          },
          description: 'Parameters to be applied to the cluster-autoscaler when enabled'
        },
        apiServerAccessProfile: {
          description: 'The access profile for managed cluster API server.',
          properties: {
            authorizedIPRanges: {
              type: 'array',
              items: { type: 'string' },
              title: 'The IP ranges authorized to access the Kubernetes API server.',
              description: 'IP ranges are specified in CIDR format, e.g. 137.117.106.88/29. This feature is not compatible with clusters that use Public IP Per Node, or clusters that are using a Basic Load Balancer. For more information see [API server authorized IP ranges](https://docs.microsoft.com/azure/aks/api-server-authorized-ip-ranges).'
            },
            enablePrivateCluster: {
              type: 'boolean',
              title: 'Whether to create the cluster as a private cluster or not.',
              description: 'For more details, see [Creating a private AKS cluster](https://docs.microsoft.com/azure/aks/private-clusters).'
            },
            privateDNSZone: {
              type: 'string',
              title: 'The private DNS zone mode for the cluster.',
              description: "The default is System. For more details see [configure private DNS zone](https://docs.microsoft.com/azure/aks/private-clusters#configure-private-dns-zone). Allowed values are 'system' and 'none'."
            },
            enablePrivateClusterPublicFQDN: {
              type: 'boolean',
              description: 'Whether to create additional public FQDN for private cluster or not.'
            },
            disableRunCommand: {
              type: 'boolean',
              description: 'Whether to disable run command for the cluster or not.'
            }
          }
        },
        diskEncryptionSetID: {
          type: 'string',
          title: 'The Resource ID of the disk encryption set to use for enabling encryption at rest.',
          description: "This is of the form: '/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.Compute/diskEncryptionSets/{encryptionSetName}'"
        },
        identityProfile: {
          additionalProperties: {
            properties: {
              resourceId: {
                type: 'string',
                description: 'The resource ID of the user assigned identity.'
              },
              clientId: {
                type: 'string',
                description: 'The client ID of the user assigned identity.'
              },
              objectId: {
                type: 'string',
                description: 'The object ID of the user assigned identity.'
              }
            },
            description: 'Details about a user assigned identity.'
          },
          description: 'Identities associated with the cluster.'
        },
        privateLinkResources: {
          type: 'array',
          items: {
            description: 'A private link resource',
            type: 'object',
            properties: {
              id: {
                type: 'string',
                description: 'The ID of the private link resource.'
              },
              name: {
                type: 'string',
                description: 'The name of the private link resource.',
                externalDocs: { url: 'https://aka.ms/search-naming-rules' }
              },
              type: { type: 'string', description: 'The resource type.' },
              groupId: {
                type: 'string',
                description: 'The group ID of the resource.'
              },
              requiredMembers: {
                type: 'array',
                items: { type: 'string' },
                description: 'The RequiredMembers of the resource'
              },
              privateLinkServiceID: {
                readOnly: true,
                type: 'string',
                description: 'The private link service ID of the resource, this field is exposed only to NRP internally.'
              }
            }
          },
          description: 'Private link resources associated with the cluster.'
        },
        disableLocalAccounts: {
          type: 'boolean',
          title: 'If local accounts should be disabled on the Managed Cluster.',
          description: 'If set to true, getting static credentials will be disabled for this cluster. This must only be used on Managed Clusters that are AAD enabled. For more details see [disable local accounts](https://docs.microsoft.com/azure/aks/managed-aad#disable-local-accounts-preview).'
        },
        httpProxyConfig: {
          description: 'Configurations for provisioning the cluster with HTTP proxy servers.',
          type: 'object',
          properties: {
            httpProxy: {
              type: 'string',
              description: 'The HTTP proxy server endpoint to use.'
            },
            httpsProxy: {
              type: 'string',
              description: 'The HTTPS proxy server endpoint to use.'
            },
            noProxy: {
              type: 'array',
              items: { type: 'string' },
              description: 'The endpoints that should not go through proxy.'
            },
            trustedCa: {
              type: 'string',
              description: 'Alternative CA cert to use for connecting to proxy servers.'
            }
          }
        },
        securityProfile: {
          description: 'Security profile for the managed cluster.',
          type: 'object',
          properties: {
            azureDefender: {
              description: 'Azure Defender settings for the security profile.',
              type: 'object',
              properties: {
                enabled: {
                  type: 'boolean',
                  description: 'Whether to enable Azure Defender'
                },
                logAnalyticsWorkspaceResourceId: {
                  type: 'string',
                  description: 'Resource ID of the Log Analytics workspace to be associated with Azure Defender.  When Azure Defender is enabled, this field is required and must be a valid workspace resource ID. When Azure Defender is disabled, leave the field empty.'
                }
              }
            }
          }
        },
        publicNetworkAccess: {
          type: 'string',
          enum: [ 'Enabled', 'Disabled' ],
          'x-ms-enum': { name: 'PublicNetworkAccess', modelAsString: true },
          title: 'PublicNetworkAccess of the managedCluster',
          description: 'Allow or deny public network access for AKS'
        }
      }
    }
  },
  allOf: [
    {
      description: 'The Resource model definition.',
      properties: {
        id: { readOnly: true, type: 'string', description: 'Resource Id' },
        name: {
          readOnly: true,
          type: 'string',
          description: 'Resource name'
        },
        type: {
          readOnly: true,
          type: 'string',
          description: 'Resource type'
        },
        location: {
          type: 'string',
          description: 'Resource location',
          'x-ms-mutability': [ 'read', 'create' ]
        },
        tags: {
          type: 'object',
          additionalProperties: { type: 'string' },
          description: 'Resource tags'
        }
      },
      required: [ 'location' ],
      'x-ms-azure-resource': true
    }
  ],
  description: 'Managed cluster.'
}
```
## Misc
The resource version is `2021-11-01-preview`.

The Swagger schema used to generate this documentation can be found [here](https://github.com/Azure/azure-rest-api-specs/tree/main/specification/containerservice/resource-manager/Microsoft.ContainerService/preview/2021-11-01-preview/managedClusters.json).
