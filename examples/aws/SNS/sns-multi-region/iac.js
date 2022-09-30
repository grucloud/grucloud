const assert = require("assert");
const { map, pipe, tap } = require("rubico");

const regions = ["us-east-1", "us-west-1", "eu-west-2"];

exports.createStack = pipe([
  () => regions,
  map((region) => ({
    name: `aws-${region}`,
    providerFactory: require("@grucloud/provider-aws").AwsProvider,
    createResources: require("./resources").createResources,
    config: () => ({ projectName: "sns-multi", region }),
  })),
  (stacks) => ({
    stacks,
  }),
]);
