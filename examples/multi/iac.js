const { AwsProvider } = require("@grucloud/core");
const { GoogleProvider } = require("@grucloud/core");
const { AzureProvider } = require("@grucloud/core");
const { MockProvider } = require("@grucloud/core");

const AwsStackEC2 = require("../aws/ec2/iac");
const AwsStackEC2Vpc = require("../aws/ec2-vpc/iac");
const AwsStackS3 = require("../aws/s3/iac");

const AzureStack = require("../azure/iac");
const GoogleStack = require("../google/iac");

const MockStack = require("../mock/iac");

exports.createStack = async ({ config }) => {
  const awsProvider = await AwsProvider({
    config: { ...config.aws, stage: config.stage },
  });

  const keyPair = await awsProvider.useKeyPair({
    name: "kp",
  });

  const googleProvider = await GoogleProvider({
    config: { ...config.google, stage: config.stage },
  });

  const azureProvider = await AzureProvider({
    config: { ...config.azure, stage: config.stage },
  });

  const mockProvider = await MockProvider({
    config: { stage: config.stage },
  });

  return {
    providers: [awsProvider, googleProvider, azureProvider, mockProvider],
    resources: {
      ec2: await AwsStackEC2.createResources({
        provider: awsProvider,
        resources: { keyPair },
      }),
      ec2Vpc: await AwsStackEC2Vpc.createResources({
        provider: awsProvider,
        resources: { keyPair },
      }),
      s3: await AwsStackS3.createResources({
        provider: awsProvider,
      }),
      google: await GoogleStack.createResources({
        provider: googleProvider,
      }),
      azure: await AzureStack.createResources({
        provider: azureProvider,
      }),
      mock: await MockStack.createResources({
        provider: mockProvider,
      }),
    },
  };
};
