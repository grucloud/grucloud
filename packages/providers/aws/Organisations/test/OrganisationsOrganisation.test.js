const assert = require("assert");
const { AwsProvider } = require("../../AwsProvider");
const { pipe, tap } = require("rubico");

describe("OrganisationsOrganisation", async function () {
  let config;
  let provider;
  let organisation;

  before(async function () {
    provider = AwsProvider({ config });
    organisation = provider.getClient({
      groupType: "Organisations::Organisation",
    });
    await provider.start();
  });
  it(
    "list",
    pipe([
      () => organisation.getList(),
      tap(({ items }) => {
        assert(Array.isArray(items));
      }),
    ])
  );
});
