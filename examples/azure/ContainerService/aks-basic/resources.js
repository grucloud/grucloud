// Generated by 'gc gencode'
const {} = require("rubico");
const {} = require("rubico/x");

exports.createResources = () => [
  {
    type: "ManagedCluster",
    group: "ContainerService",
    properties: ({ config }) => ({
      name: "cluster",
      location: config.location,
      sku: {
        name: "Basic",
        tier: "Free",
      },
      identity: {
        type: "SystemAssigned",
      },
      properties: {
        kubernetesVersion: "1.24.6",
        dnsPrefix: "cluster-dns",
        agentPoolProfiles: [
          {
            count: 1,
            vmSize: "Standard_B4ms",
            osDiskSizeGB: 128,
            osDiskType: "Managed",
            kubeletDiskType: "OS",
            maxPods: 110,
            osSKU: "Ubuntu",
            enableAutoScaling: false,
            type: "VirtualMachineScaleSets",
            mode: "System",
            orchestratorVersion: "1.24.0",
            enableNodePublicIP: false,
            enableFIPS: false,
            name: "agentpool",
          },
        ],
        addonProfiles: {
          azurepolicy: {
            enabled: false,
            config: null,
          },
          httpApplicationRouting: {
            enabled: false,
            config: null,
          },
        },
        enableRBAC: true,
        networkProfile: {
          loadBalancerSku: "Standard",
          loadBalancerProfile: {
            managedOutboundIPs: {
              count: 1,
            },
          },
          natGatewayProfile: {
            managedOutboundIPProfile: {
              count: 1,
            },
          },
          podCidrs: ["10.244.0.0/16"],
          serviceCidrs: ["10.0.0.0/16"],
          ipFamilies: ["IPv4"],
        },
        storageProfile: {
          diskCSIDriver: {
            enabled: true,
          },
          fileCSIDriver: {
            enabled: true,
          },
          snapshotController: {
            enabled: true,
          },
        },
      },
    }),
    dependencies: ({}) => ({
      resourceGroup: "rg-aks-basic",
    }),
  },
  {
    type: "ResourceGroup",
    group: "Resources",
    properties: ({}) => ({
      name: "rg-aks-basic",
    }),
  },
];
