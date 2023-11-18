// Generated by 'gc gencode'

exports.createResources = () => [
  {
    type: "VirtualMachine",
    group: "Compute",
    properties: ({ getId }) => ({
      name: "vm",
      properties: {
        hardwareProfile: {
          vmSize: "Standard_A2_v2",
        },
        osProfile: {
          computerName: "vm",
          adminUsername: "ops",
          linuxConfiguration: {
            ssh: {
              publicKeys: [
                {
                  path: "/home/ops/.ssh/authorized_keys",
                  keyData: `${getId({
                    type: "SshPublicKey",
                    group: "Compute",
                    name: "rg-vm::mykeypair",
                    path: "live.properties.publicKey",
                  })}`,
                },
              ],
            },
            enableVMAgentPlatformUpdates: false,
          },
          adminPassword: process.env.RG_VM_VM_ADMIN_PASSWORD,
        },
        storageProfile: {
          imageReference: {
            publisher: "Canonical",
            offer: "UbuntuServer",
            sku: "18.04-LTS",
            version: "latest",
          },
          osDisk: {
            osType: "Linux",
            name: "vm_disk1_fe471e07212f4e7a9c62afcd7c57b84c",
            createOption: "FromImage",
            caching: "ReadWrite",
            managedDisk: {
              storageAccountType: "Standard_LRS",
            },
            deleteOption: "Detach",
            diskSizeGB: 30,
          },
        },
        networkProfile: {
          networkInterfaces: [
            {
              id: getId({
                type: "NetworkInterface",
                group: "Network",
                name: "rg-vm::network-interface",
              }),
              properties: {
                primary: true,
              },
            },
          ],
        },
      },
    }),
    dependencies: ({}) => ({
      resourceGroup: "rg-vm",
      sshPublicKeys: ["rg-vm::mykeypair"],
      networkInterfaces: ["rg-vm::network-interface"],
    }),
  },
];
