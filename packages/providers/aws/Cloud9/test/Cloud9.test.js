const assert = require("assert");
const { pipe, tap } = require("rubico");

const { awsResourceTest } = require("../../AwsResourceTester");

describe("Cloud9", async function () {
  it("Environment", () =>
    pipe([
      () => ({
        groupType: "Cloud9::Environment",
        livesNotFound: ({ config }) => [
          { environmentId: "8d9967e2f0624182b74e7690ad69ebEX" },
        ],
      }),
      awsResourceTest,
    ])());
  it("EnvironmentMembership", () =>
    pipe([
      () => ({
        groupType: "Cloud9::EnvironmentMembership",
        livesNotFound: ({ config }) => [
          {
            environmentId: "8d9967e2f0624182b74e7690ad69ebEX",
            userArn: "arn:aws:iam::123456789012:user/MyDemoUser",
          },
        ],
      }),
      awsResourceTest,
    ])());
});
