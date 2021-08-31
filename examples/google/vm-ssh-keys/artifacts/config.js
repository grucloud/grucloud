module.exports = ({ stage }) => ({
  projectName: "@grucloud/example-google-vm-ssh-keys",
  projectId: "grucloud-test",
  compute: {
    Firewall: {
      firewall_22: {
        name: "firewall-22",
        properties: {
          description: "Managed By GruCloud",
          priority: 1000,
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
      ipWebserverSshKeys: {
        name: "ip-webserver-ssh-keys",
        properties: {
          description: "Managed By GruCloud",
        },
      },
    },
    VmInstance: {
      webserverSshKeys: {
        name: "webserver-ssh-keys",
        properties: {
          tags: {},
          machineType: "f1-micro",
          canIpForward: false,
          metadata: {
            items: [
              {
                key: "ssh-keys",
                value:
                  "ubuntu:ssh-rsa AAAAB3NzaC1yc2EAAAADAQABAAACAQC/+ZCfuXkRdiRcNjERsbmuqtKBY+ctRVd/q06VNRGxqAGI+DGnc55eMxvhh1ptdjuNg6HA7yufumrj9AmxrKEtGmRfseeVUy3th7FphEKKYCkpb8zxIEdfRr5r374gl3QxrxeKzk2YgsCQAfwfaD+ZlNQyKHWgnfwFCGEh3ciL5eSQP5xittjJap35l17kwygtCYxPcA+5DlAjDtonLGzypw/Bnb8U6TutWiHsK5Jx4iYVo4rsPmy6MsTZUx0gAKf0jvRpROK4TOHUAfio05jxfDVfE2hOZAvYFas5fKOCI8in/xaVy/hoW3rFU7OvPWfyNv7+5IE6ytI59c5e9PMXJ9IVcQmiPkfTfK91YsYcyknf6SXdTjs0aPWRpCp+UpDr98qt8xqTMujI1RA075719T1I3OUO7+w/prFLUPkEHbOLnfJ1kzam6kX87OkEG6OwIqR3A7Sw1q3EmRfDppzBOw8Oaapla+52DMLeJ6j1eLNLyBcsrgVTbOLYyZXbORMLvr0FwiAmbUPBSPKFIT12N10dElScihA2YI1g6SS5nNZAiyU16T0zL9teXYEYlupXo7T5Dc44m7xiiuzx4xibh8MprUTDUKoHSmTTSZ9psggaYcrZZQKmO8P7Et8t44iEyZ7W8xpByHxRrqmuCrqx9dIopk8fXhnQA/sP/EbX5Q== frederic.heem@gmail.com\n",
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
