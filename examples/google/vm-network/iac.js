const assert = require("assert");
const { GoogleProvider } = require("@grucloud/provider-google");
const hook = require("./hook");

const createResources = async ({ provider, resources: { serviceAccount } }) => {
  const { stage } = provider.config;

  // Vpc network
  const network = provider.compute.makeNetwork({
    name: `vpc-${stage}`,
    properties: () => ({ autoCreateSubnetworks: false }),
  });

  // Subnetwork

  const subNetwork = provider.compute.makeSubNetwork({
    name: `subnetwork-${stage}`,
    dependencies: { network },
    properties: () => ({
      ipCidrRange: "10.164.0.0/20",
    }),
  });

  const firewall = provider.compute.makeFirewall({
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
  const server = provider.compute.makeVmInstance({
    name: `db-${stage}`,
    dependencies: { subNetwork },

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

exports.createStack = async ({ createProvider }) => {
  const provider = createProvider(GoogleProvider, {
    config: require("./config"),
  });
  const { stage } = provider.config;
  assert(stage, "missing stage");
  const serviceAccount = provider.iam.makeServiceAccount({
    name: `sa-${stage}`,
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
