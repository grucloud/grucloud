const assert = require("assert");
const { AwsProvider } = require("../../AwsProvider");
const { pipe, tap } = require("rubico");

describe("CloudTrail Trail", async function () {
  let config;
  let provider;
  let cloudTrail;

  before(async function () {
    provider = await AwsProvider({ config });
    cloudTrail = provider.getClient({ groupType: "CloudTrail::Trail" });
    await provider.start();
  });
  it(
    "list",
    pipe([
      () => cloudTrail.getList(),
      tap(({ items }) => {
        assert(Array.isArray(items));
      }),
    ])
  );
  it(
    "delete with invalid id",
    pipe([
      () =>
        cloudTrail.destroy({
          live: { Name: "a-12345" },
        }),
    ])
  );
  it(
    "getById with invalid id",
    pipe([
      () =>
        cloudTrail.getById({
          Name: "a-12345",
        }),
    ])
  );
  it(
    "getByName with invalid id",
    pipe([
      () =>
        cloudTrail.getByName({
          name: "a-124",
        }),
    ])
  );
});
