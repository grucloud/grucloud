const assert = require("assert");
const { AwsProvider } = require("@grucloud/provider-aws");
const { GoogleProvider } = require("@grucloud/provider-google");
const { AzureProvider } = require("@grucloud/provider-azure");
const { ScalewayProvider } = require("@grucloud/provider-scaleway");
const { MockProvider } = require("@grucloud/provider-mock");

//TODO add
const ModuleAwsVpc = require("@grucloud/module-aws-vpc");

const AwsStackEKS = require("@grucloud/module-aws-eks");

const AwsStackWebSite = require("../aws/website-https/iac");
const AwsHooksWebSite = require("../aws/website-https/hook");
const AwsConfigWebSite = require("../aws/website-https/config");

const AwsStackRdsPostgresStateless = require("../aws/rds/postgres-stateless");

const AwsStackEC2 = require("../aws/ec2/iac");

const AwsStackEC2Vpc = require("../aws/ec2-vpc/iac");

const AwsStackS3 = require("../aws/s3/iac");

const AwsStackS3Multiple = require("../aws/s3-multiple/iac");

const AwsStackIamUser = require("../aws/iam/iac");

const AzureStack = require("../azure/vm/iac");

const GoogleStackVm = require("../google/vm/iac");

const GoogleStackVmNetwork = require("../google/vm-network/iac");

const GoogleStackIamBinding = require("../google/iam/iam-binding/iac");

const ScalewayStack = require("../scaleway/iac");

const MockStack = require("../mock/mock/iac");

const createAws = async ({ createProvider }) => {
  const provider = createProvider(AwsProvider, {
    configs: [
      require("./configAws"),
      AwsStackEC2.config,
      AwsStackEKS.config,
      ...AwsStackRdsPostgresStateless.configs,
    ],
  });

  const keyPair = provider.EC2.makeKeyPair({
    name: "kp",
  });

  const vpcResources = await ModuleAwsVpc.createResources({
    provider,
  });

  // Aws stack ec2
  const ec2 = await AwsStackEC2.createResources({
    provider,
    resources: { vpcResources, keyPair },
  });

  // Aws stack rds postgres stateless
  const rdsPostgresStateless =
    await AwsStackRdsPostgresStateless.createResources({
      provider,
      resources: { keyPair, vpcResources },
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

  // use module vpc
  // Aws stack eks
  /*
  const eks = await AwsStackEKS.createResources({
    provider,
    resources: {},
  });
*/
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

const createGoogle = async ({ createProvider }) => {
  // Google
  const provider = createProvider(GoogleProvider, {
    config: require("./configGcp"),
  });

  // Service Account
  const serviceAccount = provider.IAM.makeServiceAccount({
    name: `sa-test`,
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

const createAzure = async ({ createProvider }) => {
  const provider = createProvider(AzureProvider, {
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

exports.createStack = async ({ createProvider }) => {
  return {
    stacks: [
      //await createMock({ config }),
      await createAws({ createProvider }),
      //await createAwsUsEast1({ config }),
      await createAzure({ createProvider }),
      await createGoogle({ createProvider }),
      //await createScaleway({ config }),
    ],
  };
};
