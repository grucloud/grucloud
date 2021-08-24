const assert = require("assert");
const { AwsProvider } = require("@grucloud/provider-aws");
const { GoogleProvider } = require("@grucloud/provider-google");
const { AzureProvider } = require("@grucloud/provider-azure");
const { K8sProvider } = require("@grucloud/provider-k8s");

exports.createStack = async ({ createProvider }) => {
  return {
    stacks: [
      {
        provider: createProvider(AwsProvider, {
          config: () => ({ region: process.env.AWS_REGION }),
        }),
      },
      {
        provider: createProvider(GoogleProvider, {
          config: () => ({ region: process.env.GCP_REGION }),
        }),
      },
      {
        provider: createProvider(AzureProvider, {
          config: () => ({
            location: process.env.LOCATION,
          }),
        }),
      },
      { provider: createProvider(K8sProvider, { config: () => ({}) }) },
    ],
  };
};
