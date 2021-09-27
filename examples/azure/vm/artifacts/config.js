module.exports = ({ stage }) => ({
  projectName: "@grucloud/example-azure",
  resourceManagement: {
    ResourceGroup: {
      resourceGroup: {
        name: "resource-group",
      },
    },
  },
  virtualNetworks: {
    VirtualNetwork: {
      virtualNetwork: {
        name: "virtual-network",
        properties: {
          properties: {
            addressSpace: {
              addressPrefixes: ["10.0.0.0/16"],
            },
            enableDdosProtection: false,
          },
        },
      },
    },
    SecurityGroup: {
      securityGroup: {
        name: "security-group",
        properties: {
          properties: {
            securityRules: [
              {
                name: "SSH",
                properties: {
                  protocol: "Tcp",
                  sourcePortRange: "*",
                  destinationPortRange: "22",
                  sourceAddressPrefix: "*",
                  destinationAddressPrefix: "*",
                  access: "Allow",
                  priority: 1000,
                  direction: "Inbound",
                },
              },
              {
                name: "ICMP",
                properties: {
                  protocol: "Icmp",
                  sourcePortRange: "*",
                  destinationPortRange: "*",
                  sourceAddressPrefix: "*",
                  destinationAddressPrefix: "*",
                  access: "Allow",
                  priority: 1001,
                  direction: "Inbound",
                },
              },
            ],
          },
        },
      },
    },
    PublicIpAddress: {
      ip: {
        name: "ip",
        properties: {
          properties: {
            publicIPAddressVersion: "IPv4",
            publicIPAllocationMethod: "Dynamic",
            idleTimeoutInMinutes: 4,
          },
        },
      },
    },
    NetworkInterface: {
      networkInterface: {
        name: "network-interface",
        properties: {
          properties: {
            ipConfigurations: [
              {
                name: "ipconfig",
                properties: {
                  privateIPAllocationMethod: "Dynamic",
                },
              },
            ],
          },
        },
      },
    },
    Subnet: {
      subnet: {
        name: "subnet",
        properties: {
          properties: {
            addressPrefix: "10.0.0.0/24",
          },
        },
      },
    },
  },
  compute: {
    VirtualMachine: {
      vm: {
        name: "vm",
        properties: {
          properties: {
            hardwareProfile: {
              vmSize: "Standard_A1_v2",
            },
            storageProfile: {
              imageReference: {
                publisher: "Canonical",
                offer: "UbuntuServer",
                sku: "18.04-LTS",
                version: "latest",
                exactVersion: "18.04.202109180",
              },
            },
            osProfile: {
              computerName: "myVM",
              adminUsername: "ops",
              linuxConfiguration: {
                disablePasswordAuthentication: false,
                provisionVMAgent: true,
              },
              allowExtensionOperations: true,
              requireGuestProvisionSignal: true,
              adminPassword: process.env.VM_ADMIN_PASSWORD,
            },
          },
        },
      },
    },
  },
});
