const { AwsProvider } = require("@grucloud/provider-aws");

exports.createStack = async ({ createProvider }) => {
  const provider = createProvider(AwsProvider, { config: require("./config") });

  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/KMS.html#createKey-property
  const cmk = provider.KMS.makeKey({
    name: "secret-key-test",
    properties: () => ({}),
  });

  return {
    provider,
    resources: { cmk },
  };
};
