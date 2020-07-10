const GoogleProvider = require("@grucloud/core").GoogleProvider;

const createStack = async ({ config }) => {
  // Create GCP provider
  const { stage } = config;
  const provider = await GoogleProvider({ name: "google", config });

  const serviceAccount = await provider.makeServiceAccount({
    name: "sa-dev",
    properties: () => ({
      serviceAccount: {
        displayName: "SA dev",
      },
    }),
  });

  // Vpc network
  const network = await provider.makeNetwork({
    name: "vpc",
    properties: () => ({ autoCreateSubnetworks: false }),
  });

  // Subnetwork
  const subNetwork = await provider.makeSubNetwork({
    name: "subnetwork",
    dependencies: { network },
    properties: () => ({
      ipCidrRange: "10.164.0.0/20",
    }),
  });

  const firewall = await provider.makeFirewall({
    name: "firewall-dev",
    dependencies: { network },
    properties: () => ({
      allowed: [
        {
          IPProtocol: "TCP",
          ports: [80, 433],
        },
      ],
    }),
  });

  // Allocate public Ip address
  const ip = await provider.makeAddress({ name: "ip-webserver" });
  // Allocate a server
  const server = await provider.makeVmInstance({
    name: "web-server",
    dependencies: { ip },
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

  return { providers: [provider] };
};

module.exports = createStack;
