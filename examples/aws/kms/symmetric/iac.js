const { AwsProvider } = require("@grucloud/provider-aws");

exports.createStack = async ({ config, stage }) => {
  const provider = AwsProvider({ config, stage });

  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/KMS.html#createKey-property
  const cmk = provider.kms.makeKey({
    name: "secret-key-test",
    properties: () => ({}),
  });

  return {
    provider,
    resources: { cmk },
  };
};
