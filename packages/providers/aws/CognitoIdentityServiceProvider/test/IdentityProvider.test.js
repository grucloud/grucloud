const assert = require("assert");
const { AwsProvider } = require("../../AwsProvider");
const { pipe, tap } = require("rubico");

describe("IdentityProvider", async function () {
  let config;
  let provider;
  let identityProvider;

  before(async function () {
    provider = await AwsProvider({ config });
    identityProvider = provider.getClient({
      groupType: "CognitoIdentityServiceProvider::IdentityProvider",
    });
    await provider.start();
  });
  it(
    "delete with invalid id",
    pipe([
      () =>
        identityProvider.destroy({
          live: { UserPoolId: "up_12345", ProviderName: "aaaa" },
        }),
    ])
  );
  it(
    "getById with invalid id",
    pipe([
      () =>
        identityProvider.getById({
          UserPoolId: "up_12345",
          ProviderName: "aaaa",
        }),
    ])
  );
});
