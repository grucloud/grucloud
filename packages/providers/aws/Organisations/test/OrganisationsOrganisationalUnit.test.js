const assert = require("assert");
const { AwsProvider } = require("../../AwsProvider");
const { pipe, tap } = require("rubico");

describe("OrganisationsOrganisationalUnit", async function () {
  let config;
  let provider;
  let organisation;

  before(async function () {
    provider = await AwsProvider({ config });
    organisation = provider.getClient({
      groupType: "Organisations::OrganisationalUnit",
    });
    await provider.start();
  });
  it(
    "destroy invalid id",
    pipe([
      () => organisation.destroy({ live: { Id: "ou-941x-2jykk4x1" } }),
      tap((params) => {
        assert(true);
      }),
    ])
  );
});
