const assert = require("assert");
const { AwsProvider } = require("../../AwsProvider");
const { pipe, tap } = require("rubico");

describe("ELB LoadBalancer", async function () {
  let config;
  let provider;
  let loadBalancer;

  before(async function () {
    provider = AwsProvider({ config });
    loadBalancer = provider.getClient({
      groupType: "ElasticLoadBalancingV2::LoadBalancer",
    });
    await provider.start();
  });
  it(
    "list",
    pipe([
      () => loadBalancer.getList(),
      tap(({ items }) => {
        assert(Array.isArray(items));
      }),
    ])
  );
  it(
    "delete with invalid id",
    pipe([
      () =>
        loadBalancer.destroy({
          live: {
            LoadBalancerArn:
              "arn:aws:elasticloadbalancing:us-east-1:840541460064:loadbalancer/app/load-balancer/e6f97c90654062f0",
          },
        }),
    ])
  );
  it(
    "getByName with invalid id",
    pipe([
      () =>
        loadBalancer.getByName({
          name: "invalid-loadBalancer",
        }),
    ])
  );
});
