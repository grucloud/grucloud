const GoogleProvider = require("@grucloud/core").GoogleProvider;

const createStack = async ({ config }) => {
  // Create GCP provider
  const provider = await GoogleProvider({ name: "google", config });
  // Allocate public Ip address
  const ip = await provider.makeAddress({ name: "ip-webserver" });
  // Allocate a server
  const server = await provider.makeInstance({
    name: "web-server",
    dependencies: { ip },
    properties: {
      metadata: {
        items: [
          {
            key: "enable-oslogin",
            value: "True",
          },
        ],
      },
    },
  });

  return { providers: [provider] };
};

module.exports = createStack;
