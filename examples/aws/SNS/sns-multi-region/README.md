# SNS Multi region

This example deploys SNS topics on multiple regions with dynamically created stack.

![resources-mindmap](./artifacts/resources-mindmap.svg)

It illustrates the programmatic way to create multiple providers on different regions.

First of all, let's see the [resources.js](./resources.js) where the SNS Topic is defined:

```js
exports.createResources = () => [
  {
    type: "Topic",
    group: "SNS",
    name: ({ config }) => `my-topic-${config.region}`,
  },
];
```

Next, Here is the sample [iac.js](./iac.js) to define the multi region providers:

```js
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
```

We loop through the region array to define stacks with the same `createResources` but on different regions.
