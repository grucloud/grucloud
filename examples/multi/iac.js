const assert = require("assert");
const { AwsProvider } = require("@grucloud/provider-aws");
const { GoogleProvider } = require("@grucloud/provider-google");
const { AzureProvider } = require("@grucloud/provider-azure");
const { ScalewayProvider } = require("@grucloud/provider-scaleway");
const { MockProvider } = require("@grucloud/core");

const AwsStackEKS = require("@grucloud/module-aws-eks");

const AwsStackWebSite = require("../aws/website-https/iac");
const AwsHooksWebSite = require("../aws/website-https/hooks");
const AwsConfigWebSite = require("../aws/website-https/config/default");

const AwsStackEC2 = require("../aws/ec2/iac");

const AwsStackEC2Vpc = require("../aws/ec2-vpc/iac");

const AwsStackS3 = require("../aws/s3/iac");

const AwsStackS3Multiple = require("../aws/s3-multiple/iac");

const AwsStackIamUser = require("../aws/iam/iac");

const AzureStack = require("../azure/iac");

const GoogleStackVm = require("../google/vm/iac");

const GoogleStackVmNetwork = require("../google/vm-network/iac");

const GoogleStackIamBinding = require("../google/iam/iam-binding/iac");

const ScalewayStack = require("../scaleway/iac");

const MockStack = require("../mock/mock/iac");

const createAws = async ({}) => {
  const provider = AwsProvider({
    configs: [require("./configAws"), AwsStackEKS.config],
  });

  const keyPair = await provider.useKeyPair({
    name: "kp",
  });

  // Aws stack ec2
  const ec2 = await AwsStackEC2.createResources({
    provider,
    resources: { keyPair },
  });

  // Aws stack ec2-vpc
  const ec2Vpc = await AwsStackEC2Vpc.createResources({
    provider,
    resources: { keyPair },
  });

  // S3
  const s3 = await AwsStackS3.createResources({
    provider,
  });

  // S3 Multiple
  const s3Multiple = await AwsStackS3Multiple.createResources({
    provider,
  });

  // Iam User
  const iamUser = await AwsStackIamUser.createResources({
    provider,
    resources: { keyPair },
  });

  // Aws stack eks
  const eks = await AwsStackEKS.createResources({
    provider,
    resources: {},
  });

  // Aws stack website https
  /*
  TODO
  const website = await AwsStackWebSite.createResources({
    provider,
    resources: {},
  });

*/
  return { provider };
};

const createGoogle = async ({}) => {
  // Google
  const provider = GoogleProvider({
    config: require("./configGcp"),
  });
  const { stage } = provider.config;
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
  }
  // Full network, subnet, firewall and vms
  {
    const resources = await GoogleStackVmNetwork.createResources({
      provider,
      resources: { serviceAccount },
    });
  }

  // IAM Binding
  {
    const resources = await GoogleStackIamBinding.createResources({
      provider,
      resources: { serviceAccount },
    });
  }
  return { provider };
};

const createAzure = async ({ config }) => {
  const provider = AzureProvider({
    config: require("./configAzure"),
  });
  const resources = await AzureStack.createResources({ provider });
  return { provider, resources };
};

const createScaleway = async ({ config }) => {
  const provider = ScalewayProvider({
    config: { ...config.scaleway, stage: config.stage },
  });
  const resources = ScalewayStack.createResources({ provider });
  return { provider, resources };
};

const createMock = async ({ config }) => {
  const provider = MockProvider({
    config: () => ({ stage: config.stage }),
  });

  const resources = await MockStack.createResources({ provider });
  return { provider, resources };
};

exports.createStack = async ({ config }) => {
  return [
    //await createMock({ config }),
    await createAws({ config }),
    //await createAwsUsEast1({ config }),
    await createAzure({ config }),
    //await createGoogle({ config }),
    //await createScaleway({ config }),
  ];
};
