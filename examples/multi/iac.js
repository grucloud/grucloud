const assert = require("assert");
const { AwsProvider } = require("@grucloud/core");
const { GoogleProvider } = require("@grucloud/core");
const { AzureProvider } = require("@grucloud/core");
const { ScalewayProvider } = require("@grucloud/core");
const { MockProvider } = require("@grucloud/core");

const AwsStackEC2 = require("../aws/ec2/iac");
const AwsHooksEC2 = require("../aws/ec2/hooks");

const AwsStackEC2Vpc = require("../aws/ec2-vpc/iac");
const AwsHooksEC2Vpc = require("../aws/ec2-vpc/hooks");

const AwsStackS3 = require("../aws/s3/iac");
const AwsHooksS3 = require("../aws/s3/hooks");

const AwsStackS3Multiple = require("../aws/s3-multiple/iac");

const AzureStack = require("../azure/iac");
const AzureHooks = require("../azure/hooks");

const GoogleStackVm = require("../google/vm/iac");
const GoogleHooksVm = require("../google/vm/hooks");

const GoogleStackVmNetwork = require("../google/vm-network/iac");
const GoogleHooksVmNetwork = require("../google/vm-network/hooks");

const ScalewayStack = require("../scaleway/iac");
const ScalewayHooks = require("../scaleway/hooks");

const MockStack = require("../mock/mock/iac");
const MockHooks = require("../mock/mock/hooks");

const createAws = async ({ config }) => {
  const provider = await AwsProvider({
    config: { ...config.aws, stage: config.stage },
  });

  const keyPair = await provider.useKeyPair({
    name: "kp",
  });
  // Aws stack ec2
  const ec2 = await AwsStackEC2.createResources({
    provider,
    resources: { keyPair },
  });

  provider.hookAdd("ec2", AwsHooksEC2({ resources: ec2, provider }));

  // Aws stack ec2-vpc
  const ec2Vpc = await AwsStackEC2Vpc.createResources({
    provider,
    resources: { keyPair },
  });
  provider.hookAdd("ec2-vpc", AwsHooksEC2Vpc({ resources: ec2Vpc, provider }));

  // S3
  const s3 = await AwsStackS3.createResources({
    provider,
  });

  provider.hookAdd("s3", AwsHooksS3({ resources: s3 }));

  // S3 Multiple
  const s3Multiple = await AwsStackS3Multiple.createResources({
    provider,
  });

  return provider;
};

const createGoogle = async ({ config }) => {
  // Google
  const provider = await GoogleProvider({
    config: config.google,
  });
  const { stage } = provider.config();
  assert(stage, "missing stage");

  // Service Account
  const serviceAccount = await provider.makeServiceAccount({
    name: `sa-${stage}`,
    properties: () => ({
      serviceAccount: {
        displayName: "SA dev",
      },
    }),
  });
  // simple Vm with a public address
  {
    const resources = await GoogleStackVm.createResources({
      provider,
      resources: { serviceAccount },
    });
    provider.hookAdd("vm", GoogleHooksVm({ resources, provider }));
  }
  // Full network, subnet, firewall and vms
  {
    const resources = await GoogleStackVmNetwork.createResources({
      provider,
      resources: { serviceAccount },
    });
    provider.hookAdd(
      "vm-network",
      GoogleHooksVmNetwork({ resources, provider })
    );
  }
  return provider;
};

const createAzure = async ({ config }) => {
  const provider = await AzureProvider({
    config: { ...config.azure, stage: config.stage },
  });
  const resources = await AzureStack.createResources({ provider });
  provider.hookAdd("azure", AzureHooks({ resources, provider }));
  return provider;
};

const createScaleway = async ({ config }) => {
  const provider = await ScalewayProvider({
    config: { ...config.scaleway, stage: config.stage },
  });
  const resources = await ScalewayStack.createResources({ provider });
  provider.hookAdd("scaleway", ScalewayHooks({ resources, provider }));
  return provider;
};

const createMock = async ({ config }) => {
  const provider = await MockProvider({
    config: { stage: config.stage },
  });

  const mock = await MockStack.createResources({ provider });
  provider.hookAdd("mock", MockHooks({ resources: mock }));
  return provider;
};

exports.createStack = async ({ config }) => {
  return {
    providers: [
      await createMock({ config }),
      await createAws({ config }),
      //await createAzure({ config }),
      //await createGoogle({ config }),
      //await createScaleway({ config }),
    ],
  };
};
