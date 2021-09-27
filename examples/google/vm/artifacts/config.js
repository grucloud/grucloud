module.exports = ({ stage }) => ({
  projectName: "@grucloud/example-google-vm",
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
    Firewall: {
      firewall_22_80_433: {
        name: "firewall-22-80-433",
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
      firewallIcmp: {
        name: "firewall-icmp",
        properties: {
          description: "Managed By GruCloud",
          priority: 1000,
          sourceRanges: ["0.0.0.0/0"],
          allowed: [
            {
              IPProtocol: "icmp",
            },
          ],
          direction: "INGRESS",
          logConfig: {
            enable: false,
          },
        },
      },
    },
    Address: {
      ipWebserver: {
        name: "ip-webserver",
        properties: {
          description: "Managed By GruCloud",
        },
      },
    },
    Disk: {
      disk: {
        name: "disk",
        properties: {
          sizeGb: "20",
          type: "pd-standard",
        },
      },
    },
    VmInstance: {
      webserver: {
        name: "webserver",
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
