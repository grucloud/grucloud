const assert = require("assert");
const { AwsProvider } = require("../../AwsProvider");
const { pipe, tap } = require("rubico");

describe("MSKConfiguration", async function () {
  let config;
  let provider;
  let configuration;

  before(async function () {
    provider = await AwsProvider({ config });
    configuration = provider.getClient({
      groupType: "MSK::Configuration",
    });
    await provider.start();
  });
  it(
    "list",
    pipe([
      () => configuration.getList(),
      tap(({ items }) => {
        assert(Array.isArray(items));
      }),
    ])
  );
  it(
    "delete with invalid id",
    pipe([
      () =>
        configuration.destroy({
          live: {
            Arn: "arn:aws:kafka:us-east-1:840541460064:configuration/my-configuration/9d0f971d-1873-4615-8cfd-7c8dba612825-19",
          },
        }),
    ])
  );
  it(
    "getById with invalid id",
    pipe([
      () =>
        configuration.getById({
          Arn: "arn:aws:kafka:us-east-1:840541460064:configuration/my-configuration/9d0f971d-1873-4615-8cfd-7c8dba612825-19",
        }),
    ])
  );
  it(
    "getByName with invalid id",
    pipe([
      () =>
        configuration.getByName({
          name: "configuration-1234",
        }),
    ])
  );
});
