module.exports = ({ stage }) => ({
  projectName: "@grucloud/example-google-vm-network",
  projectId: "grucloud-test",
  iam: {
    ServiceAccount: {
      saSaTestVm: {
        name: "sa-test-vm",
        properties: {
          serviceAccount: {
            displayName: "SA dev",
            description: "Managed By GruCloud",
          },
        },
      },
    },
  },
  compute: {
    Network: {
      vpcDev: {
        name: "vpc-dev",
        properties: {
          description: "Managed By GruCloud",
          autoCreateSubnetworks: false,
          routingConfig: {
            routingMode: "REGIONAL",
          },
        },
      },
    },
    SubNetwork: {
      subnet_subnetworkDev: {
        name: "subnet-subnetworkDev",
        properties: {
          ipCidrRange: "10.164.0.0/20",
        },
      },
    },
    Firewall: {
      firewallDev: {
        name: "firewall-dev",
        properties: {
          description: "Managed By GruCloud",
          priority: 1000,
          sourceRanges: ["0.0.0.0/0"],
          allowed: [
            {
              IPProtocol: "tcp",
              ports: ["22", "80", "433"],
            },
          ],
          direction: "INGRESS",
          logConfig: {
            enable: false,
          },
        },
      },
    },
    VmInstance: {
      dbDev: {
        name: "db-dev",
        properties: {
          tags: {},
          machineType: "f1-micro",
          canIpForward: false,
          metadata: {
            items: [
              {
                key: "enable-oslogin",
                value: "True",
              },
            ],
          },
          labels: {
            "managed-by": "grucloud",
            "gc-stage": "dev",
          },
          startRestricted: false,
          deletionProtection: false,
          reservationAffinity: {
            consumeReservationType: "ANY_RESERVATION",
          },
          displayDevice: {
            enableDisplay: false,
          },
          shieldedInstanceConfig: {
            enableSecureBoot: false,
            enableVtpm: true,
            enableIntegrityMonitoring: true,
          },
          shieldedInstanceIntegrityPolicy: {
            updateAutoLearnPolicy: true,
          },
          confidentialInstanceConfig: {
            enableConfidentialCompute: false,
          },
          sourceImage:
            "projects/ubuntu-os-cloud/global/images/ubuntu-2004-focal-v20210908",
        },
      },
    },
  },
});
