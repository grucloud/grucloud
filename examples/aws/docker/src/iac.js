const assert = require("assert");
const { AwsProvider } = require("@grucloud/provider-aws");
const { GoogleProvider } = require("@grucloud/provider-google");
const { AzureProvider } = require("@grucloud/provider-azure");
const { K8sProvider } = require("@grucloud/provider-k8s");

const createResources = () => [];

exports.createStack = () => ({
  stacks: [
    {
      providerFactory: AwsProvider,
      name: "aws",
      createResources,
      config: () => ({ region: process.env.AWS_REGION }),
    },
    {
      providerFactory: GoogleProvider,
      name: "google",
      createResources,
      config: () => ({ region: process.env.GCP_REGION }),
    },
    {
      providerFactory: AzureProvider,
      name: "azure",
      createResources,
      config: () => ({ location: process.env.AZURE_LOCATION }),
    },
    {
      providerFactory: K8sProvider,
      name: "k8s",
      createResources,
      config: () => ({}),
    },
  ],
});
