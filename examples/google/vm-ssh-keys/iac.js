const path = require("path");
const fs = require("fs");
const { GoogleProvider } = require("@grucloud/provider-google");
const hook = require("./hook");

exports.createStack = async () => {
  const provider = GoogleProvider({ config: require("./config") });

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
          sourceRanges: ["0.0.0.0/0"],
          IPProtocol: "TCP",
          ports: [22],
        },
      ],
    }),
  });
  const firewallIcmp = provider.compute.makeFirewall({
    name: `firewall-icmp`,
    properties: () => ({
      allowed: [
        {
          sourceRanges: ["0.0.0.0/0"],
          IPProtocol: "icmp",
        },
      ],
    }),
  });

  const server = provider.compute.makeVmInstance({
    name: `webserver-ssh-keys`,
    dependencies: { ip },
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

  return {
    provider,
    resources: { ip, server },
    hooks: [hook],
  };
};
