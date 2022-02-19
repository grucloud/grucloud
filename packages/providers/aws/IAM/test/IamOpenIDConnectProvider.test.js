const assert = require("assert");
const { AwsProvider } = require("../../AwsProvider");
const { pipe, tap } = require("rubico");

describe("IamOpenIDConnectProvider", async function () {
  let config;
  let provider;
  let iamOpenIDConnectProvider;

  before(async function () {
    provider = AwsProvider({ config });
    iamOpenIDConnectProvider = provider.getClient({
      groupType: "IAM::OpenIDConnectProvider",
    });
    await provider.start();
  });
  it(
    "list",
    pipe([
      () => iamOpenIDConnectProvider.getList(),
      tap(({ items }) => {
        assert(Array.isArray(items));
      }),
    ])
  );
  //TODO
  it.skip(
    "delete with invalid id",
    pipe([
      () =>
        iamOpenIDConnectProvider.destroy({
          live: {
            //TODO
            OpenIDConnectProviderArn:
              "iamOpenIDConnectProvider-08744497940acc9c5",
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
        iamOpenIDConnectProvider.getByName({
          name: "invalid-iamOpenIDConnectProvider-id",
        }),
    ])
  );
});
