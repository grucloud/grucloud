const assert = require("assert");
const { AwsProvider } = require("../../AwsProvider");
const { pipe, tap } = require("rubico");

describe("ElasticIpAddress", async function () {
  let config;
  let provider;
  let elasticIpAddress;

  before(async function () {
    provider = await AwsProvider({ config });
    elasticIpAddress = provider.getClient({
      groupType: "EC2::ElasticIpAddress",
    });
    await provider.start();
  });
  it(
    "list",
    pipe([
      () => elasticIpAddress.getList(),
      tap(({ items }) => {
        assert(Array.isArray(items));
      }),
    ])
  );
  it(
    "delete with invalid id",
    pipe([
      () =>
        elasticIpAddress.destroy({
          live: {
            AllocationId: "eipalloc-0017fa73b3a36997a",
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
        elasticIpAddress.getByName({
          name: "invalid-elasticIpAddress-id",
        }),
    ])
  );
});
