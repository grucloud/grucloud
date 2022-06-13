const { AwsProvider } = require("@grucloud/provider-aws");

exports.createStack = ({ createProvider }) => {
  return {
    stacks: [
      {
        provider: createProvider(AwsProvider, {
          name: "aws-primary",
          createResources: require("./resources-aws-primary").createResources,
          config: require("./config-primary"),
        }),
      },
      {
        provider: createProvider(AwsProvider, {
          name: "aws-secondary",
          createResources: require("./resources-aws-secondary").createResources,
          config: require("./config-secondary"),
        }),
      },
    ],
  };
};
