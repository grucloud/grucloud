const assert = require("assert");
const { AwsProvider } = require("../../AwsProvider");
const { pipe, tap } = require("rubico");

describe("Inspector2OrganizationConfiguration", async function () {
  let config;
  let provider;
  let organisationConfiguration;

  before(async function () {
    provider = await AwsProvider({ config });
    organisationConfiguration = provider.getClient({
      groupType: "Inspector2::OrganizationConfiguration",
    });
    await provider.start();
  });
  it(
    "list",
    pipe([
      () => organisationConfiguration.getList(),
      tap(({ items }) => {
        assert(Array.isArray(items));
      }),
    ])
  );
  // it(
  //   "getByName with invalid id",
  //   pipe([
  //     () =>
  //       organisationConfiguration.getByName({
  //         name: "124",
  //       }),
  //   ])
  // );
});
