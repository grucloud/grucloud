const assert = require("assert");
const { pipe, tap } = require("rubico");

const { awsResourceTest } = require("../../AwsResourceTester");

describe("CodeStarConnections", async function () {
  it("Connection", () =>
    pipe([
      () => ({
        groupType: "CodeStarConnections::Connection",
        livesNotFound: ({ config }) => [
          {
            ConnectionArn: `arn:aws:codestar-connections:us-east-1:${config.accountId()}:connection/6ba9de29-73f2-436c-82e2-4ef7de54f061`,
          },
        ],
      }),
      awsResourceTest,
    ])());
});