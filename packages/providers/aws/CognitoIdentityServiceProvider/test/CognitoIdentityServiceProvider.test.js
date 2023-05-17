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
  it("Group", () =>
    pipe([
      () => ({
        groupType: "CognitoIdentityServiceProvider::Group",
        livesNotFound: ({ config }) => [
          { UserPoolId: "up_12345", GroupName: "g123" },
        ],
      }),
      awsResourceTest,
    ])());
  it("ResourceServer", () =>
    pipe([
      () => ({
        groupType: "CognitoIdentityServiceProvider::ResourceServer",
        livesNotFound: ({ config }) => [
          { Identifier: "i1234", UserPoolId: "up_12345" },
        ],
      }),
      awsResourceTest,
    ])());
  it("RiskConfiguration", () =>
    pipe([
      () => ({
        groupType: "CognitoIdentityServiceProvider::RiskConfiguration",
        livesNotFound: ({ config }) => [{ UserPoolId: "up_12345" }],
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
  it.skip("UserInGroup", () =>
    pipe([
      () => ({
        groupType: "CognitoIdentityServiceProvider::UserInGroup",
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
  it.skip("UserPoolDomain", () =>
    pipe([
      () => ({
        groupType: "CognitoIdentityServiceProvider::UserPoolDomain",
        livesNotFound: ({ config }) => [
          {
            // ClientId: "3hn8tkap446tnf5unro4v0bina",
            // UserPoolId: "us-east-1_AfVOlXeZB",
          },
        ],
      }),
      awsResourceTest,
    ])());
  it.skip("UserPoolUiCustomization", () =>
    pipe([
      () => ({
        groupType: "CognitoIdentityServiceProvider::UserPoolUiCustomization",
        livesNotFound: ({ config }) => [
          {
            // ClientId: "3hn8tkap446tnf5unro4v0bina",
            // UserPoolId: "us-east-1_AfVOlXeZB",
          },
        ],
      }),
      awsResourceTest,
    ])());
});
