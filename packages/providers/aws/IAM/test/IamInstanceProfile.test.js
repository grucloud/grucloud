const assert = require("assert");
const { AwsProvider } = require("../../AwsProvider");
const { pipe, tap } = require("rubico");

describe("IamInstanceProfile", async function () {
  let config;
  let provider;
  let instanceProfile;

  before(async function () {
    provider = await AwsProvider({ config });
    instanceProfile = provider.getClient({
      groupType: "IAM::InstanceProfile",
    });
    await provider.start();
  });
  it(
    "list",
    pipe([
      () => instanceProfile.getList(),
      tap(({ items }) => {
        assert(Array.isArray(items));
      }),
    ])
  );
  it(
    "delete with invalid id",
    pipe([
      () =>
        instanceProfile.destroy({
          live: {
            InstanceProfileName: "instanceProfilename",
          },
        }),
    ])
  );
  it(
    "getByName with invalid id",
    pipe([
      () =>
        instanceProfile.getByName({
          name: "invalid-instanceProfile",
        }),
    ])
  );
});
