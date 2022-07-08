const assert = require("assert");
const { AwsProvider } = require("../../AwsProvider");
const { pipe, tap } = require("rubico");

describe("Route53RecoveryControlConfigRoutingControl", async function () {
  let config;
  let provider;
  let routingControl;

  before(async function () {
    provider = AwsProvider({ config });
    routingControl = provider.getClient({
      groupType: "Route53RecoveryControlConfig::RoutingControl",
    });
    await provider.start();
  });
  it(
    "delete with invalid id",
    pipe([
      () =>
        routingControl.destroy({
          live: { RoutingControlArn: "arn:aws:a-12345" },
        }),
    ])
  );
  it(
    "getById with invalid id",
    pipe([
      () =>
        routingControl.getById({
          RoutingControlArn: "a-12345",
        }),
    ])
  );
});
