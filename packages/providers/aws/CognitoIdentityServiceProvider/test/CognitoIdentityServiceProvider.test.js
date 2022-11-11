const assert = require("assert");
const { pipe, tap } = require("rubico");

const { awsResourceTest } = require("../../AwsResourceTester");

describe("CognitoIdentityServiceProvider", async function () {
  it("IdentityProvider", () =>
    pipe([
      () => ({
        groupType: "CognitoIdentityServiceProvider::IdentityProvider",
        livesNotFound: ({ config }) => [
          { UserPoolId: "up_12345", ProviderName: "aaaa" },
        ],
      }),
      awsResourceTest,
    ])());
  it("UserPool", () =>
    pipe([
      () => ({
        groupType: "CognitoIdentityServiceProvider::UserPool",
        livesNotFound: ({ config }) => [{ Id: "up_12345" }],
      }),
      awsResourceTest,
    ])());
  it("UserPoolClient", () =>
    pipe([
      () => ({
        groupType: "CognitoIdentityServiceProvider::UserPoolClient",
        livesNotFound: ({ config }) => [
          {
            ClientId: "3hn8tkap446tnf5unro4v0bina",
            UserPoolId: "us-east-1_AfVOlXeZB",
          },
        ],
      }),
      awsResourceTest,
    ])());
});
