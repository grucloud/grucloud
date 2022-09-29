const { AwsProvider } = require("@grucloud/provider-aws");

exports.createStack = () => ({
  stacks: [
    {
      providerFactory: AwsProvider,
      name: "aws-cloudwan",
      directory: "cloudwan",
      createResources: require("./cloudwan/resources").createResources,
      config: require("./cloudwan/config"),
    },
    {
      providerFactory: AwsProvider,
      name: "aws-primary",
      directory: "primary",
      createResources: require("./primary/resources").createResources,
      config: require("./primary/config"),
    },
    {
      providerFactory: AwsProvider,
      name: "aws-secondary",
      directory: "secondary",
      createResources: require("./secondary/resources").createResources,
      config: require("./secondary/config"),
    },
  ],
});
