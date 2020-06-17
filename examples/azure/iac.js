const { AzureProvider } = require("@grucloud/core");

const createStack = async ({ config }) => {
  const { stage } = config;
  // Create an Azure provider
  const provider = await AzureProvider({ name: "azure", config });

  const resourceGroup = provider.makeResourceGroup({
    name: `resource-group-${stage}`,
  });

  // https://docs.microsoft.com/en-us/rest/api/virtualnetwork/virtualnetworks/createorupdate#request-body
  const virtualNetwork = provider.makeVirtualNetwork({
    name: `dev-virtual-network-${stage}`,
    dependencies: { resourceGroup },
    properties: {
      addressSpace: { addressPrefixes: ["10.0.0.0/16"] },
      subnets: [
        {
          name: `subnet-${stage}`,
          properties: { addressPrefix: "10.0.0.0/24" },
        },
      ],
    },
  });

  return { providers: [provider] };
};

module.exports = createStack;
