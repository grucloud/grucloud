const assert = require("assert");
const { AwsProvider } = require("../../AwsProvider");
const { pipe, tap } = require("rubico");

describe("AppSyncResolver", async function () {
  let config;
  let provider;
  let resolver;

  before(async function () {
    provider = await AwsProvider({ config });
    resolver = provider.getClient({ groupType: "AppSync::Resolver" });
    await provider.start();
  });
  it(
    "delete with invalid id",
    pipe([
      () =>
        resolver.destroy({
          live: {
            typeName: "typeName-no-exist",
            fieldName: "fieldName-no-exist",
            apiId: "12345",
          },
        }),
    ])
  );
});
