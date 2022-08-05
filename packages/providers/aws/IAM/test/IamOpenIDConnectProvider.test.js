const assert = require("assert");
const { AwsProvider } = require("../../AwsProvider");
const { pipe, tap } = require("rubico");

describe("IamOpenIDConnectProvider", async function () {
  let config;
  let provider;
  let iamOpenIDConnectProvider;

  before(async function () {
    provider = await AwsProvider({ config });
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
  it(
    "delete with invalid id",
    pipe([
      () =>
        iamOpenIDConnectProvider.destroy({
          live: {
            Arn: "arn:aws:iam::840541460064:oidc-provider/oidc.eks.us-east-1.amazonaws.com/id/D37114C060BC22C04E5BE2E1BF4717A2",
          },
        }),
      tap((params) => {
        assert(true);
      }),
    ])
  );
  it(
    "getById with invalid id",
    pipe([
      () =>
        iamOpenIDConnectProvider.getById({
          Arn: "arn:aws:iam::840541460064:oidc-provider/oidc.eks.us-east-1.amazonaws.com/id/D37114C060BC22C04E5BE2E1BF4717A2",
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
