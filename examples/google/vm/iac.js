const assert = require("assert");
const { GoogleProvider } = require("@grucloud/provider-google");
const hook = require("./hook");

const createResources = async ({ provider, resources: { serviceAccount } }) => {
  // Allocate public Ip address
  const ip = provider.compute.makeAddress({
    name: `ip-webserver`,
  });

  const firewall22_80_433 = provider.compute.makeFirewall({
    name: `firewall-22-80-433`,
    properties: () => ({
      allowed: [
        {
          sourceRanges: ["0.0.0.0/0"],
          IPProtocol: "TCP",
          ports: [22, 80, 433],
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

  const disk = provider.compute.makeDisk({
    name: `disk`,
    properties: () => ({
      sizeGb: "20",
    }),
  });

  // Allocate a server
  const server = provider.compute.makeVmInstance({
    name: `webserver`,
    dependencies: {
      //TODO broken with serviceAccount
      ip /*serviceAccount */,
      disks: [disk],
    },
    properties: () => ({
      diskSizeGb: "20",
      machineType: "f1-micro",
      sourceImage:
        "projects/ubuntu-os-cloud/global/images/family/ubuntu-2004-lts",
      metadata: {
        items: [
          {
            key: "enable-oslogin",
            value: "True",
          },
        ],
      },
    }),
  });

  return {
    ip,
    server,
    firewall22_80_433,
    firewallIcmp,
  };
};
exports.createResources = createResources;

exports.createStack = async ({ createProvider }) => {
  const provider = createProvider(GoogleProvider, {
    config: require("./config"),
  });

  const serviceAccount = provider.iam.makeServiceAccount({
    name: `sa-test-vm`,
    properties: () => ({
      serviceAccount: {
        displayName: "SA dev",
      },
    }),
  });

  const resources = await createResources({
    provider,
    resources: { serviceAccount },
  });

  return {
    provider,
    resources,
    hooks: [hook],
  };
};
