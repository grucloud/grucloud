const assert = require("assert");
const { pipe, tap } = require("rubico");

const { awsResourceTest } = require("../../AwsResourceTester");

describe("CognitoIdentity", async function () {
  it("IdentityPool", () =>
    pipe([
      () => ({
        groupType: "Cognito::IdentityPool",
        livesNotFound: ({ config }) => [
          { IdentityPoolId: "us-east-1:64a8f1cb-e5e1-4d32-9405-ca6e7ff4ee4a" },
        ],
      }),
      awsResourceTest,
    ])());
});
