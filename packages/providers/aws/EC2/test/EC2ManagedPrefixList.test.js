const assert = require("assert");
const { pipe, tap } = require("rubico");
const { AwsProvider } = require("../../AwsProvider");

describe("EC2ManagedPrefixList", async function () {
  let provider;
  let prefixList;
  before(async function () {
    provider = await AwsProvider({
      config: () => ({ projectName: "gru-test" }),
    });
    prefixList = provider.getClient({ groupType: "EC2::ManagedPrefixList" });
  });
  it(
    "list",
    pipe([
      () => prefixList.getList(),
      tap(({ items }) => {
        assert(Array.isArray(items));
      }),
    ])
  );
  it(
    "prefixList destroy not found",
    pipe([
      () =>
        prefixList.destroy({
          live: {
            PrefixListId: "pl-63a5400b",
          },
        }),
    ])
  );
  it(
    "prefixList getById not found",
    pipe([
      () =>
        prefixList.getById({
          PrefixListId: "pl-63a5400b",
        }),
    ])
  );
});
