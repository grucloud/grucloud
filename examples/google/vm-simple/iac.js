const { GoogleProvider } = require("@grucloud/core");

exports.createStack = async ({ config }) => {
  const provider = await GoogleProvider({ name: "google", config });

  const server = await provider.makeVmInstance({
    name: `webserver`,
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
    provider,
  };
};
