const assert = require("assert");
const { pipe, tap } = require("rubico");

const { awsResourceTest } = require("../../AwsResourceTester");

describe("CognitoIdentity", async function () {
  it("IdentityPool", () =>
    pipe([
      () => ({
        groupType: "Cognito::IdentityPool",
        livesNotFound: ({ config }) => [{ IdentityPoolId: "i-12345" }],
      }),
      awsResourceTest,
    ])());
});
