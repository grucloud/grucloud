const { AzureProvider } = require("@grucloud/core");

const createStack = async ({ config }) => {
  // Create an Azure provider
  const provider = await AzureProvider({ name: "azure", config });
  // Resource Group
  const rg = provider.makeResourceGroup({ name: "dev-resource-group" });
  return { providers: [provider] };
};

module.exports = createStack;
