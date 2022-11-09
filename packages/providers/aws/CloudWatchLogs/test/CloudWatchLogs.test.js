const assert = require("assert");
const { pipe, tap } = require("rubico");

const { awsResourceTest } = require("../../AwsResourceTester");

describe("CloudWatchLogs", async function () {
  it("LogGroup", () =>
    pipe([
      () => ({
        groupType: "CloudWatchLogs::LogGroup",
        livesNotFound: ({ config }) => [{ logGroupName: "lg-124" }],
      }),
      awsResourceTest,
    ])());
  it("LogStream", () =>
    pipe([
      () => ({
        groupType: "CloudWatchLogs::LogStream",
        livesNotFound: ({ config }) => [
          {
            arn: `arn:aws:logs:us-east-1:${config.accountId()}:log-group:testlambdatest-:*:sss`,
          },
        ],
      }),
      awsResourceTest,
    ])());
  it("SubscriptionFilter", () =>
    pipe([
      () => ({
        groupType: "CloudWatchLogs::SubscriptionFilter",
        livesNotFound: ({ config }) => [
          { filterName: "a123", logGroupName: "123" },
        ],
      }),
      awsResourceTest,
    ])());
});
