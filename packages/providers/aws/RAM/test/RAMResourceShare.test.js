const assert = require("assert");
const { AwsProvider } = require("../../AwsProvider");
const { pipe, tap } = require("rubico");

describe("RAMResourceShare", async function () {
  let config;
  let provider;
  let resourceShare;

  before(async function () {
    provider = await AwsProvider({ config });
    resourceShare = provider.getClient({ groupType: "RAM::ResourceShare" });
    await provider.start();
  });
  it(
    "list",
    pipe([
      () => resourceShare.getList(),
      tap(({ items }) => {
        assert(Array.isArray(items));
      }),
    ])
  );
  it(
    "delete with invalid id",
    pipe([
      () =>
        resourceShare.destroy({
          live: {
            resourceShareArn:
              "arn:aws:ram:us-east-1:840541460064:resource-share/e4b6b5bd-74db-4776-9967-dc13aa3b2807",
          },
        }),
    ])
  );
  it(
    "getById with invalid id",
    pipe([
      () =>
        resourceShare.getById({})({
          resourceShareArn:
            "arn:aws:ram:us-east-1:840541460064:resource-share/e4b6b5bd-74db-4776-9967-dc13aa3b2807",
        }),
    ])
  );
  it(
    "getByName with invalid id",
    pipe([
      () =>
        resourceShare.getByName({
          name: "124",
        }),
    ])
  );
});
