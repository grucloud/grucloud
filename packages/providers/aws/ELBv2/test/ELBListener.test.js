const assert = require("assert");
const { AwsProvider } = require("../../AwsProvider");
const { pipe, tap } = require("rubico");

describe("ELB Listener", async function () {
  let config;
  let provider;
  let listener;

  before(async function () {
    provider = AwsProvider({ config });
    listener = provider.getClient({
      groupType: "ElasticLoadBalancingV2::Listener",
    });
    await provider.start();
  });
  it(
    "delete with invalid id",
    pipe([
      () =>
        listener.destroy({
          live: {
            ListenerArn:
              "arn:aws:elasticloadbalancing:us-east-1:840541460064:listener/app/load-balancer/e6f97c90654062f0/db2d92e8196bc8c1",
          },
        }),
    ])
  );
  it(
    "getById with invalid id",
    pipe([
      () =>
        listener.getById({
          ListenerArn:
            "arn:aws:elasticloadbalancing:us-east-1:840541460064:listener/app/load-balancer/e6f97c90654062f0/db2d92e8196bc8c1",
        }),
    ])
  );
});
