const assert = require("assert");
const { AwsProvider } = require("../../AwsProvider");
const { pipe, tap } = require("rubico");

describe("ElasticBeanstalkApplication", async function () {
  let config;
  let provider;
  let application;

  before(async function () {
    provider = await AwsProvider({ config });
    application = provider.getClient({
      groupType: "ElasticBeanstalk::Application",
    });
    await provider.start();
  });
  it(
    "list",
    pipe([
      () => application.getList(),
      tap(({ items }) => {
        assert(Array.isArray(items));
      }),
    ])
  );
  it(
    "delete with invalid id",
    pipe([
      () =>
        application.destroy({
          live: { ApplicationName: "application12345" },
        }),
    ])
  );
  it(
    "getById with invalid id",
    pipe([
      () =>
        application.getById({})({
          ApplicationName: "application12345",
        }),
    ])
  );
  it(
    "getByName with invalid id",
    pipe([
      () =>
        application.getByName({
          name: "application1234",
        }),
    ])
  );
});
