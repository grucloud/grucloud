const { AwsProvider } = require("@grucloud/provider-aws");

const { createResources } = require("./resources");
const { createResourcesS3Object } = require("./resourcesS3Objects");

exports.createStack = async ({ createProvider }) => ({
  provider: await createProvider(AwsProvider, {
    createResources: [createResourcesS3Object, createResources],
    config: require("./config"),
  }),
  hooks: [require("./hook")],
});
