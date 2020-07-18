const { GoogleProvider } = require("@grucloud/core");

const createResources = async ({ provider }) => {
  const { stage } = provider.config();

  const serviceAccount = await provider.makeServiceAccount({
    name: `sa-${stage}`,
    properties: () => ({
      serviceAccount: {
        displayName: "SA dev",
      },
    }),
  });

  // Vpc network
  const network = await provider.makeNetwork({
    name: `vpc-${stage}`,
    properties: () => ({ autoCreateSubnetworks: false }),
  });

  // Subnetwork
  const subNetwork = await provider.makeSubNetwork({
    name: `subnetwork-${stage}`,
    dependencies: { network },
    properties: () => ({
      ipCidrRange: "10.164.0.0/20",
    }),
  });

  const firewall = await provider.makeFirewall({
    name: `firewall-${stage}`,
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
  const ip = await provider.makeAddress({
    name: `ip-webserver-${stage}`,
  });

  // Allocate a server
  const server = await provider.makeVmInstance({
    name: `webserver-${stage}`,
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

  return {
    serviceAccount,
    network,
    subNetwork,
    firewall,
    ip,
    server,
  };
};
exports.createResources = createResources;

exports.createStack = async ({ config }) => {
  const provider = await GoogleProvider({ name: "google", config });
  const resources = await createResources({ provider });
  provider.register({ resources });

  return {
    providers: [provider],
    resources,
  };
};
