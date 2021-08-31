module.exports = ({ stage }) => ({
  projectName: "@grucloud/example-google-vm-simple",
  projectId: "grucloud-vm-tuto-1",
  compute: {
    Firewall: {
      defaultAllowIcmp: {
        name: "default-allow-icmp",
        properties: {
          description: "Allow ICMP from anywhere",
          priority: 65534,
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
      defaultAllowInternal: {
        name: "default-allow-internal",
        properties: {
          description: "Allow internal traffic on the default network",
          priority: 65534,
          sourceRanges: ["10.128.0.0/9"],
          allowed: [
            {
              IPProtocol: "tcp",
              ports: ["0-65535"],
            },
            {
              IPProtocol: "udp",
              ports: ["0-65535"],
            },
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
      defaultAllowRdp: {
        name: "default-allow-rdp",
        properties: {
          description: "Allow RDP from anywhere",
          priority: 65534,
          sourceRanges: ["0.0.0.0/0"],
          allowed: [
            {
              IPProtocol: "tcp",
              ports: ["3389"],
            },
          ],
          direction: "INGRESS",
          logConfig: {
            enable: false,
          },
        },
      },
      defaultAllowSsh: {
        name: "default-allow-ssh",
        properties: {
          description: "Allow SSH from anywhere",
          priority: 65534,
          sourceRanges: ["0.0.0.0/0"],
          allowed: [
            {
              IPProtocol: "tcp",
              ports: ["22"],
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
      webServer: {
        name: "web-server",
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
            "projects/ubuntu-os-cloud/global/images/ubuntu-2004-focal-v20210825",
        },
      },
    },
  },
});
