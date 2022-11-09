const assert = require("assert");
const { AwsProvider } = require("../../AwsProvider");
const { pipe, tap } = require("rubico");

describe("UsagePlanKey", async function () {
  let config;
  let provider;
  let usagePlan;

  before(async function () {
    provider = await AwsProvider({ config });
    usagePlan = provider.getClient({ groupType: "APIGateway::UsagePlanKey" });
    await provider.start();
  });
  after(async () => {});
  it(
    "delete with invalid id",
    pipe([
      () =>
        usagePlan.destroy({
          live: { keyId: "12345", usagePlanId: "123" },
        }),
    ])
  );
  it(
    "getById with invalid id",
    pipe([
      () =>
        usagePlan.getById({})({
          keyId: "12345",
          usagePlanId: "123",
        }),
    ])
  );
});
