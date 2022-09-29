const { AwsProvider } = require("@grucloud/provider-aws");
const { GoogleProvider } = require("@grucloud/provider-google");

exports.createStack = () => ({
  stacks: [
    {
      providerFactory: AwsProvider,
      directory: "aws",
      createResources: require("./aws/resources").createResources,
      config: require("./aws/config"),
    },
    {
      providerFactory: GoogleProvider,
      directory: "google",
      createResources: require("./google/resources").createResources,
      config: require("./google/config"),
    },
  ],
});
