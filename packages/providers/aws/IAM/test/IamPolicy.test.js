const assert = require("assert");
const { AwsProvider } = require("../../AwsProvider");
const { pipe, tap } = require("rubico");

describe("IamPolicy", async function () {
  let config;
  let provider;
  let policy;

  before(async function () {
    provider = AwsProvider({ config });
    policy = provider.getClient({
      groupType: "IAM::Policy",
    });
    await provider.start();
  });
  it(
    "list",
    pipe([
      () => policy.getList(),
      tap(({ items }) => {
        assert(Array.isArray(items));
      }),
    ])
  );
  it(
    "delete with invalid id",
    pipe([
      () =>
        policy.destroy({
          live: {
            Arn: "arn:aws:iam::aws:policy/service-role/blabla",
          },
        }),
    ])
  );
  it(
    "getByName with invalid id",
    pipe([
      () =>
        policy.getByName({
          name: "arn:aws:iam::aws:policy/service-role/blabla",
        }),
    ])
  );
});
