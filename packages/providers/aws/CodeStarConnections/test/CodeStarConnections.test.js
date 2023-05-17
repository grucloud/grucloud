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
            ConnectionArn: `arn:aws:codestar-connections:${
              config.region
            }:${config.accountId()}:connection/6ba9de29-73f2-436c-82e2-4ef7de54f061`,
          },
        ],
      }),
      awsResourceTest,
    ])());
  it.skip("Host", () =>
    pipe([
      () => ({
        groupType: "CodeStarConnections::Host",
        livesNotFound: ({ config }) => [
          {
            // ConnectionArn: `arn:aws:codestar-connections:${
            //   config.region
            // }:${config.accountId()}:connection/6ba9de29-73f2-436c-82e2-4ef7de54f061`,
          },
        ],
      }),
      awsResourceTest,
    ])());
});
