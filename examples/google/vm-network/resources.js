const createResources = ({ provider }) => {
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
          IPProtocol: "tcp",
          ports: ["22", "80", "433"],
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
};
exports.createResources = createResources;
