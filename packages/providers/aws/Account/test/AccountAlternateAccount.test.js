const assert = require("assert");
const { AwsProvider } = require("../../AwsProvider");
const { pipe, tap } = require("rubico");

describe("AccountAlternateAccount", async function () {
  let config;
  let provider;
  let alternateAccount;

  before(async function () {
    provider = await AwsProvider({ config });
    alternateAccount = provider.getClient({
      groupType: "Account::AlternateAccount",
    });
    await provider.start();
  });
  after(async () => {});
  it(
    "list",
    pipe([
      () => alternateAccount.getList(),
      tap((params) => {
        assert(true);
      }),
    ])
  );
});
