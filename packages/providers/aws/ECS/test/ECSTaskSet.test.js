const assert = require("assert");
const { AwsProvider } = require("../../AwsProvider");
const { pipe, tap } = require("rubico");

describe("ECSTaskSet", async function () {
  let config;
  let provider;
  let taskset;

  before(async function () {
    provider = await AwsProvider({ config });
    taskset = provider.getClient({ groupType: "ECS::TaskSet" });
    await provider.start();
  });
  it(
    "delete with invalid id",
    pipe([
      () =>
        taskset.destroy({
          live: {
            cluster: "arn:aws:ecs:eu-west-2:840541460064:cluster/not-existing",
            service:
              "arn:aws:ecs:eu-west-2:840541460064:service/demo/service-demo",
            taskSet:
              "arn:aws:ecs:eu-west-2:840541460064:task-set/not-existing/service-demo/ecs-svc/1234567890123456789",
          },
        }),
    ])
  );
});
