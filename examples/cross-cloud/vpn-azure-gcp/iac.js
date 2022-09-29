const { AzureProvider } = require("@grucloud/provider-azure");
const { GoogleProvider } = require("@grucloud/provider-google");

exports.createStack = () => ({
  stacks: [
    {
      providerFactory: AzureProvider,
      directory: "azure",
      createResources: require("./azure/resources").createResources,
      config: require("./azure/config"),
    },
    {
      providerFactory: GoogleProvider,
      directory: "google",
      createResources: require("./google/resources").createResources,
      config: require("./google/config"),
    },
  ],
});
