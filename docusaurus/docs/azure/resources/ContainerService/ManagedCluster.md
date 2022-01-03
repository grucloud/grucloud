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
    workspace: resources.OperationalInsights.Workspace["myWorkspace"],
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
    workspace: resources.OperationalInsights.Workspace["myWorkspace"],
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
    workspace: resources.OperationalInsights.Workspace["myWorkspace"],
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
    workspace: resources.OperationalInsights.Workspace["myWorkspace"],
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
    workspace: resources.OperationalInsights.Workspace["myWorkspace"],
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
    workspace: resources.OperationalInsights.Workspace["myWorkspace"],
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
    workspace: resources.OperationalInsights.Workspace["myWorkspace"],
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
    workspace: resources.OperationalInsights.Workspace["myWorkspace"],
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
    workspace: resources.OperationalInsights.Workspace["myWorkspace"],
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
    workspace: resources.OperationalInsights.Workspace["myWorkspace"],
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
    workspace: resources.OperationalInsights.Workspace["myWorkspace"],
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
    workspace: resources.OperationalInsights.Workspace["myWorkspace"],
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
    workspace: resources.OperationalInsights.Workspace["myWorkspace"],
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
    workspace: resources.OperationalInsights.Workspace["myWorkspace"],
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
    workspace: resources.OperationalInsights.Workspace["myWorkspace"],
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
    workspace: resources.OperationalInsights.Workspace["myWorkspace"],
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
    workspace: resources.OperationalInsights.Workspace["myWorkspace"],
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
    workspace: resources.OperationalInsights.Workspace["myWorkspace"],
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
    workspace: resources.OperationalInsights.Workspace["myWorkspace"],
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
    workspace: resources.OperationalInsights.Workspace["myWorkspace"],
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
    workspace: resources.OperationalInsights.Workspace["myWorkspace"],
  }),
});

```
## Dependencies
- [ResourceGroup](../Resources/ResourceGroup.md)
- [Workspace](../OperationalInsights/Workspace.md)
## Misc
The resource version is `2021-10-01`.

The Swagger schema used to generate this documentation can be found [here](https://github.com/Azure/azure-rest-api-specs/tree/main/specification/containerservice/resource-manager/Microsoft.ContainerService/stable/2021-10-01/managedClusters.json).
