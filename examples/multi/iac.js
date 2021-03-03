const assert = require("assert");
const { AwsProvider } = require("@grucloud/core");
const { GoogleProvider } = require("@grucloud/core");
const { AzureProvider } = require("@grucloud/core");
const { ScalewayProvider } = require("@grucloud/core");
const { MockProvider } = require("@grucloud/core");

const AwsStackEKS = require("../aws/eks/iac");
const AwsHooksEKS = require("../aws/eks/hooks");

const AwsStackWebSite = require("../aws/website-https/iac");
const AwsHooksWebSite = require("../aws/website-https/hooks");
const AwsConfigWebSite = require("../aws/website-https/config/default");

const AwsStackEC2 = require("../aws/ec2/iac");
const AwsHooksEC2 = require("../aws/ec2/hooks");

const AwsStackEC2Vpc = require("../aws/ec2-vpc/iac");
const AwsHooksEC2Vpc = require("../aws/ec2-vpc/hooks");

const AwsStackS3 = require("../aws/s3/iac");
const AwsHooksS3 = require("../aws/s3/hooks");

const AwsStackS3Multiple = require("../aws/s3-multiple/iac");

const AwsStackIamUser = require("../aws/iam/iac");
const AwsHooksIamUser = require("../aws/iam/hooks");

const AzureStack = require("../azure/iac");
const AzureHooks = require("../azure/hooks");

const GoogleStackVm = require("../google/vm/iac");
const GoogleHooksVm = require("../google/vm/hooks");

const GoogleStackVmNetwork = require("../google/vm-network/iac");
const GoogleHooksVmNetwork = require("../google/vm-network/hooks");

const GoogleStackIamBinding = require("../google/iam/iam-binding/iac");
const GoogleHooksIamBinding = require("../google/iam/iam-binding/hooks");

const ScalewayStack = require("../scaleway/iac");
const ScalewayHooks = require("../scaleway/hooks");

const MockStack = require("../mock/mock/iac");
const MockHooks = require("../mock/mock/hooks");

const createAws = async ({ config }) => {
  const provider = AwsProvider({
    config: { ...AwsConfigWebSite(), ...config.aws, stage: config.stage },
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

  provider.hookAdd("s3", AwsHooksS3({ provider, resources: s3 }));

  // S3 Multiple
  const s3Multiple = await AwsStackS3Multiple.createResources({
    provider,
  });

  // Iam User
  const iamUser = await AwsStackIamUser.createResources({
    provider,
    resources: { keyPair },
  });

  provider.hookAdd(
    "iamUser",
    AwsHooksIamUser({ provider, resources: iamUser })
  );

  // Aws stack eks
  const eks = await AwsStackEKS.createResources({
    provider,
    resources: {},
  });

  provider.hookAdd("eks", AwsHooksEKS({ resources: eks, provider }));

  // Aws stack website https
  const website = await AwsStackWebSite.createResources({
    provider,
    resources: {},
  });

  provider.hookAdd(
    "website",
    AwsHooksWebSite({ resources: website, provider })
  );

  return { provider };
};

const createGoogle = async ({ config }) => {
  // Google
  const provider = GoogleProvider({
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

  // IAM Binding
  {
    const resources = await GoogleStackIamBinding.createResources({
      provider,
      resources: { serviceAccount },
    });
    provider.hookAdd("iam", GoogleHooksIamBinding({ resources, provider }));
  }
  return { provider };
};

const createAzure = async ({ config }) => {
  const provider = AzureProvider({
    config: { ...config.azure, stage: config.stage },
  });
  const resources = await AzureStack.createResources({ provider });
  provider.hookAdd("azure", AzureHooks({ resources, provider }));
  return { provider, resources };
};

const createScaleway = async ({ config }) => {
  const provider = ScalewayProvider({
    config: { ...config.scaleway, stage: config.stage },
  });
  const resources = ScalewayStack.createResources({ provider });
  provider.hookAdd("scaleway", ScalewayHooks({ resources, provider }));
  return { provider, resources };
};

const createMock = async ({ config }) => {
  const provider = MockProvider({
    config: { stage: config.stage },
  });

  const resources = await MockStack.createResources({ provider });
  provider.hookAdd("mock", MockHooks({ resources }));
  return { provider, resources };
};

exports.createStack = async ({ config }) => {
  return [
    //await createMock({ config }),
    await createAws({ config }),
    //await createAwsUsEast1({ config }),
    //await createAzure({ config }),
    //await createGoogle({ config }),
    //await createScaleway({ config }),
  ];
};
