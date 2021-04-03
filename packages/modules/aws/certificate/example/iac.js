const { AwsProvider } = require("@grucloud/provider-aws");
const ModuleAwsCertificate = require("@grucloud/module-aws-certificate");

exports.createStack = async ({ config }) => {
  const provider = AwsProvider({
    configs: [config, ModuleAwsCertificate.config],
  });

  const certificateResources = await ModuleAwsCertificate.createResources({
    provider,
  });

  return {
    provider,
    resources: { certificateResources },
  };
};
