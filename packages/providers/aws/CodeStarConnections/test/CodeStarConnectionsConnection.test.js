const assert = require("assert");
const { AwsProvider } = require("../../AwsProvider");
const { pipe, tap } = require("rubico");

describe("CodeStarConnectionsConnection", async function () {
  let config;
  let provider;
  let connection;

  before(async function () {
    provider = AwsProvider({ config });
    connection = provider.getClient({
      groupType: "CodeStarConnections::Connection",
    });
    await provider.start();
  });
  it(
    "list",
    pipe([
      () => connection.getList(),
      tap(({ items }) => {
        assert(Array.isArray(items));
      }),
    ])
  );
  it(
    "delete with invalid id",
    pipe([
      () =>
        connection.destroy({
          live: {
            ConnectionArn:
              "arn:aws:codestar-connections:us-east-1:840541460064:connection/6ba9de29-73f2-436c-82e2-4ef7de54f061",
          },
        }),
    ])
  );
  it(
    "getById with invalid id",
    pipe([
      () =>
        connection.getById({
          ConnectionArn:
            "arn:aws:codestar-connections:us-east-1:840541460064:connection/6ba9de29-73f2-436c-82e2-4ef7de54f061",
        }),
    ])
  );
  it(
    "getByName with invalid id",
    pipe([
      () =>
        connection.getByName({
          name: "a-124",
        }),
    ])
  );
});
