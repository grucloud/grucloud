const assert = require("assert");
const { map, pipe, tap } = require("rubico");

const region = "us-east-1";

const profiles = [
  //
  "default",
  "e2e-alpha",
  "e2e-bravo",
  "e2e-charly",
  "e2e-delta",
  "e2e-echo",
  "e2e-foxtrot",
  "e2e-golf",
  "e2e-hotel",
  "e2e-india",
  "e2e-kilo",
  "e2e-lima",
  "e2e-mike",
  "e2e-november",
  "e2e-oscar",
  "e2e-papa",
];

exports.createStack = pipe([
  () => profiles,
  map((profile) => ({
    name: `${profile}`,
    providerFactory: require("@grucloud/provider-aws").AwsProvider,
    createResources: () => [],
    config: () => ({
      region,
      projectName: "empty-multi",
      credentials: { profile },
    }),
  })),
  (stacks) => ({
    stacks,
  }),
]);
