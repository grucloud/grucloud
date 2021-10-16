const assert = require("assert");
const { AwsProvider } = require("../../AwsProvider");
const { ConfigLoader } = require("@grucloud/core/ConfigLoader");
const { pipe, tap } = require("rubico");

describe("ECSTask", async function () {
  let config;
  let provider;
  let task;

  before(async function () {
    try {
      config = ConfigLoader({ path: "../../../examples/multi" });
    } catch (error) {
      this.skip();
    }
    provider = AwsProvider({ config });
    task = provider.getClient({ groupType: "ECS::Task" });
    await provider.start();
  });
  it(
    "delete with invalid id",
    pipe([
      () =>
        task.destroy({
          live: {
            clusterArn:
              "arn:aws:ecs:eu-west-2:840541460064:cluster/not-existing",
            taskArn:
              "arn:aws:ecs:eu-west-2:840541460064:task/demo/ee0e3ce2ad9a49ce90e6a257303c1773",
          },
        }),
    ])
  );
});
