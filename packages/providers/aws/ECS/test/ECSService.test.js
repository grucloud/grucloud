const assert = require("assert");
const { AwsProvider } = require("../../AwsProvider");
const { ConfigLoader } = require("@grucloud/core/ConfigLoader");
const { pipe, tap } = require("rubico");

describe("ECSService", async function () {
  let config;
  let provider;
  let service;

  before(async function () {
    try {
      config = ConfigLoader({ path: "../../../examples/multi" });
    } catch (error) {
      this.skip();
    }
    provider = AwsProvider({ config });
    service = provider.getClient({ groupType: "ECS::Service" });
    await provider.start();
  });
  it(
    "delete with invalid id",
    pipe([
      () =>
        service.destroy({
          live: {
            clusterArn:
              "arn:aws:ecs:eu-west-2:840541460064:cluster/not-existing",
            serviceName: "12345",
          },
        }),
    ])
  );
  it.skip(
    "getByName with invalid id",
    pipe([
      () =>
        service.getByName({
          name: "124",
        }),
    ])
  );
  it(
    "getById with invalid id",
    pipe([
      () =>
        service.getById({
          serviceName: "124",
          clusterArn: "arn:aws:ecs:eu-west-2:840541460064:cluster/not-existing",
        }),
    ])
  );
});
