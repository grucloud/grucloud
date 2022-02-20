const assert = require("assert");
const { AwsProvider } = require("../../AwsProvider");
const { pipe, tap } = require("rubico");

describe("CloudFrontDistribution", async function () {
  let config;
  let provider;
  let distribution;

  before(async function () {
    provider = AwsProvider({ config });
    distribution = provider.getClient({
      groupType: "CloudFront::Distribution",
    });
    await provider.start();
  });
  it(
    "list",
    pipe([
      () => distribution.getList(),
      tap(({ items }) => {
        assert(Array.isArray(items));
      }),
    ])
  );
  it(
    "delete with invalid id",
    pipe([
      () =>
        distribution.destroy({
          live: { Id: "123" },
        }),
    ])
  );
  it(
    "getById with invalid id",
    pipe([
      () =>
        distribution.getById({
          Id: "123",
        }),
    ])
  );
  it(
    "getByName with invalid id",
    pipe([
      () =>
        distribution.getByName({
          name: "124",
        }),
    ])
  );
});
