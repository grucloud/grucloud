const path = require("path");
const fs = require("fs");

exports.createResources = ({ provider }) => {
  const publicKey = fs.readFileSync(
    path.resolve(process.env.HOME, ".ssh/id_rsa.pub")
  );

  const ip = provider.compute.makeAddress({
    name: `ip-webserver-ssh-keys`,
  });

  const firewall22 = provider.compute.makeFirewall({
    name: `firewall-22`,
    properties: () => ({
      allowed: [
        {
          IPProtocol: "tcp",
          ports: ["22"],
        },
      ],
    }),
  });
  const firewallIcmp = provider.compute.makeFirewall({
    name: `firewall-icmp`,
    properties: () => ({
      allowed: [
        {
          IPProtocol: "icmp",
        },
      ],
    }),
  });

  const server = provider.compute.makeVmInstance({
    name: `webserver-ssh-keys`,
    dependencies: () => ({ ip }),
    properties: () => ({
      diskSizeGb: "20",
      machineType: "f1-micro",
      sourceImage:
        "projects/ubuntu-os-cloud/global/images/family/ubuntu-2004-lts",
      metadata: {
        items: [
          {
            key: "ssh-keys",
            value: `ubuntu:${publicKey}`,
          },
        ],
      },
    }),
  });
};
