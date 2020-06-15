const { AzureProvider } = require("@grucloud/core");

const createStack = async ({ config }) => {
  // Create an Azure provider
  const provider = await AzureProvider({ name: "azure", config });
  // Resource Group
  const resourceGroup = provider.makeResourceGroup({
    name: "dev-resource-group",
  });
  const virtualNetwork = provider.makeVirtualNetwork({
    name: "dev-virtual-network",
    dependencies: { resourceGroup },
    properties: {
      addressSpace: { addressPrefixes: ["10.0.0.0/16"] },
    },
  });
  return { providers: [provider] };
};

module.exports = createStack;
