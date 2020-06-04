const GoogleProvider = require("@grucloud/core").GoogleProvider;

const config = require("./config");

const createStack = async ({ options }) => {
  // Create GCP provider
  const provider = await GoogleProvider({ name: "google", config });
  // Allocate public Ip address
  const ip = provider.makeAddress({ name: "ip-webserver" });
  // Allocate a server
  const server = provider.makeInstance({
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
      /*serviceAccounts: [
        {
          email: "446608274745-compute@developer.gserviceaccount.com",
          scopes: [
            "https://www.googleapis.com/auth/devstorage.read_only",
            "https://www.googleapis.com/auth/logging.write",
            "https://www.googleapis.com/auth/monitoring.write",
            "https://www.googleapis.com/auth/servicecontrol",
            "https://www.googleapis.com/auth/service.management.readonly",
            "https://www.googleapis.com/auth/trace.append",
          ],
        },
      ],*/
    },
  });

  return { providers: [provider] };
};

module.exports = createStack;
