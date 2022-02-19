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
      groupType: "ELBv2::Listener",
    });
    await provider.start();
  });
  it(
    "list",
    pipe([
      () => listener.getList(),
      tap(({ items }) => {
        assert(Array.isArray(items));
      }),
    ])
  );
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
    "getByName with invalid id",
    pipe([
      () =>
        listener.getByName({
          name: "invalid-listener",
        }),
    ])
  );
});
