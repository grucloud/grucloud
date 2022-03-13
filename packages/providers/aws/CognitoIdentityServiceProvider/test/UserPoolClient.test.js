const assert = require("assert");
const { AwsProvider } = require("../../AwsProvider");
const { pipe, tap } = require("rubico");

describe("UserPoolClient", async function () {
  let config;
  let provider;
  let userPoolClient;

  before(async function () {
    provider = AwsProvider({ config });
    userPoolClient = provider.getClient({
      groupType: "CognitoIdentityServiceProvider::UserPoolClient",
    });
    await provider.start();
  });
  it(
    "delete with invalid id",
    pipe([
      () =>
        userPoolClient.destroy({
          live: {
            ClientId: "3hn8tkap446tnf5unro4v0bina",
            UserPoolId: "us-east-1_AfVOlXeZB",
          },
        }),
    ])
  );
  it(
    "getById with invalid id",
    pipe([
      () =>
        userPoolClient.getById({
          ClientId: "3hn8tkap446tnf5unro4v0bina",
          UserPoolId: "us-east-1_AfVOlXeZB",
        }),
    ])
  );
});
