const assert = require("assert");
const { pipe, tap } = require("rubico");
const { AwsProvider } = require("../../AwsProvider");

describe("AppRunner connection", async function () {
  let provider;
  let connection;

  before(async function () {
    provider = await AwsProvider({
      config: () => ({ projectName: "gru-test" }),
    });
    await provider.start();
    connection = provider.getClient({ groupType: "AppRunner::Connection" });
  });
  it(
    "list",
    pipe([
      () => connection.getList({}),
      tap(({ items }) => {
        assert(Array.isArray(items));
      }),
    ])
  );
  it(
    "getById not found",
    pipe([
      () =>
        connection.getById({
          ConnectionArn:
            "arn:aws:apprunner:us-east-1:840541460064:connection/mock-server/4d97761b3685416bb95d7debd86ca5a8",
        }),
    ])
  );
  it(
    "destroy not found",
    pipe([
      () =>
        connection.destroy({
          live: {
            ConnectionArn:
              "arn:aws:apprunner:us-east-1:840541460064:connection/mock-server/4d97761b3685416bb95d7debd86ca5a8",
          },
        }),
    ])
  );
});
