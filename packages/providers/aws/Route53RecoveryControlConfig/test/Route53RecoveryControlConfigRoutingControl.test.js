const assert = require("assert");
const { AwsProvider } = require("../../AwsProvider");
const { pipe, tap } = require("rubico");

describe("Route53RecoveryControlConfigRoutingControl", async function () {
  let config;
  let provider;
  let routingControl;

  before(async function () {
    provider = await AwsProvider({ config });
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
          live: {
            RoutingControlArn:
              "arn:aws:route53-recovery-control::840541460064:controlpanel/b95ba5f33ba04c3ca6dc231654a1604d/routingcontrol/21d6c872221c4961",
          },
        }),
    ])
  );
  it(
    "getById with invalid id",
    pipe([
      () =>
        routingControl.getById({})({
          RoutingControlArn:
            "arn:aws:route53-recovery-control::840541460064:controlpanel/b95ba5f33ba04c3ca6dc231654a1604d/routingcontrol/21d6c872221c4961",
        }),
    ])
  );
});
