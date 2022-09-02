const { AwsProvider } = require("@grucloud/provider-aws");
const { GoogleProvider } = require("@grucloud/provider-google");

exports.createStack = async ({ createProvider }) => {
  return {
    stacks: [
      {
        provider: await createProvider(AwsProvider, {
          name: "aws",
          createResources: require("./resources-aws").createResources,
          config: require("./config-aws"),
        }),
      },
      {
        provider: await createProvider(GoogleProvider, {
          name: "google",
          createResources: require("./resources-google").createResources,
          config: require("./config-google"),
        }),
      },
    ],
  };
};
