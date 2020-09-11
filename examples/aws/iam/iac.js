const { AwsProvider } = require("@grucloud/core");

const createResources = async ({ provider }) => {
  const iamUserName = "Alice";

  return {
    iamUser: await provider.makeIamUser({
      name: iamUserName,
      properties: () => ({}),
    }),
  };
};
exports.createResources = createResources;

exports.createStack = async ({ config }) => {
  // Create a AWS provider
  const provider = await AwsProvider({ name: "aws", config });

  provider.register({
    resources: await createResources({ provider, resources: {} }),
  });

  return {
    providers: [provider],
  };
};
