const assert = require("assert");
const { GoogleProvider } = require("@grucloud/provider-google");

const createResources = async ({ provider, resources: { serviceAccount } }) => {
  const { stage } = provider.config;

  const extNet = await provider.makeNetwork({
    name: "Ext-Net",
    properties: () => ({ autoCreateSubnetworks: false }),
  });

  const s1_2Uk1 = await provider.makeVmInstance({
    name: "s1-2-uk1",
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
    extNet,
    s1_2Uk1,
  };
};

exports.createResources = createResources;

exports.createStack = async () => {
  const provider = GoogleProvider({ config: require("./config") });
  const { stage } = provider.config;
  assert(stage, "missing stage");

  const resources = await createResources({
    provider,
    resources: {},
  });

  return {
    provider,
    resources,
  };
};
