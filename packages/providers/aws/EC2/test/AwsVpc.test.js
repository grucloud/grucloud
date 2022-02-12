const assert = require("assert");
const { AwsProvider } = require("../../AwsProvider");
const { pipe, tap } = require("rubico");

describe("Vpc", async function () {
  let config;
  let provider;
  let vpc;

  before(async function () {
    provider = AwsProvider({ config });
    vpc = provider.getClient({
      groupType: "EC2::Vpc",
    });
    await provider.start();
  });
  it(
    "list",
    pipe([
      () => vpc.getList(),
      tap(({ items }) => {
        assert(Array.isArray(items));
      }),
    ])
  );
  it(
    "delete with invalid id",
    pipe([
      () =>
        vpc.destroy({
          live: {
            VpcId: "vpc-08744497940acc9c5",
          },
        }),
      tap((params) => {
        assert(true);
      }),
    ])
  );
  it(
    "getByName with invalid id",
    pipe([
      () =>
        vpc.getByName({
          name: "invalid-vpc-id",
        }),
    ])
  );
});
