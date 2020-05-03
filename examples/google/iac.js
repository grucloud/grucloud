require("dotenv").config();
const GoogleProvider = require("@grucloud/core").GoogleProvider;
const config = {
  project: "starhackit",
  region: "us-central1",
  zone: "us-central1-a",
  applicationCredentials: process.env.GOOGLE_APPLICATION_CREDENTIALS,
};

const createStack = ({ options }) => {
  // Create GCP provider
  const provider = GoogleProvider({ name: "google" }, config);
  // Allocate public Ip address
  const ip = provider.makeAddress({ name: "ip-webserver" });
  // Allocate a server
  const server = provider.makeInstance({
    name: "web-server",
    dependencies: {},
    config: async ({ dependencies: {} }) => ({
      machineType: "e2-micro",
    }),
  });

  return { providers: [provider] };
};

module.exports = createStack;
