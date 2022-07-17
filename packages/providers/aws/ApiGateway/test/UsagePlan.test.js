const assert = require("assert");
const { AwsProvider } = require("../../AwsProvider");
const { pipe, tap } = require("rubico");

describe("UsagePlan", async function () {
  let config;
  let provider;
  let usagePlan;

  before(async function () {
    provider = AwsProvider({ config });
    usagePlan = provider.getClient({ groupType: "APIGateway::UsagePlan" });
    await provider.start();
  });
  after(async () => {});
  it("getList", pipe([() => usagePlan.getList()]));

  it(
    "delete with invalid id",
    pipe([
      () =>
        usagePlan.destroy({
          live: { id: "12345" },
        }),
    ])
  );
  it(
    "getById with invalid id",
    pipe([
      () =>
        usagePlan.getById({
          id: "12345",
        }),
    ])
  );
  it(
    "getByName with invalid id",
    pipe([
      () =>
        usagePlan.getByName({
          name: "124",
        }),
    ])
  );
});
