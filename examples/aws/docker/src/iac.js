const { AwsProvider } = require("@grucloud/provider-aws");
const { GoogleProvider } = require("@grucloud/provider-google");
const { AzureProvider } = require("@grucloud/provider-azure");
const { K8sProvider } = require("@grucloud/provider-k8s");

exports.createStack = async ({ config }) => {
  return {
    stacks: [
      {
        provider: AwsProvider({
          config: () => ({ region: process.env.AWS_REGION }),
        }),
      },
      {
        provider: GoogleProvider({
          config: () => ({
            projectId: "project",
          }),
        }),
      },
      { provider: AzureProvider({ config: () => ({}) }) },
      { provider: K8sProvider({ config: () => ({}) }) },
    ],
  };
};
