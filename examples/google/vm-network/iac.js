const { GoogleProvider } = require("@grucloud/core");

const createResources = async ({ provider, resources: { serviceAccount } }) => {
  const { stage } = provider.config();

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
          sourceRanges: ["0.0.0.0/0"],
          IPProtocol: "TCP",
          ports: [22, 80, 433],
        },
      ],
    }),
  });

  // Allocate a server
  const server = await provider.makeVmInstance({
    name: `db-${stage}`,
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
    server,
  };
};
exports.createResources = createResources;

exports.createStack = async ({ config }) => {
  const provider = await GoogleProvider({ name: "google", config });

  const serviceAccount = await provider.makeServiceAccount({
    name: `sa-${config.stage}`,
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

  provider.register({ resources });

  return {
    providers: [provider],
    resources,
  };
};
