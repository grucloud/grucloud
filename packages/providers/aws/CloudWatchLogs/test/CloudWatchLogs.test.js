const assert = require("assert");
const { pipe, tap } = require("rubico");

const { awsResourceTest } = require("../../AwsResourceTester");

describe("CloudWatchLogs", async function () {
  it.skip("Destination", () =>
    pipe([
      () => ({
        groupType: "CloudWatchLogs::Destination",
        livesNotFound: ({ config }) => [{ destinationName: "lg-124" }],
      }),
      awsResourceTest,
    ])());
  it.skip("DestinationPolicy", () =>
    pipe([
      () => ({
        groupType: "CloudWatchLogs::DestinationPolicy",
        livesNotFound: ({ config }) => [{ logGroupName: "lg-124" }],
      }),
      awsResourceTest,
    ])());
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
            arn: `arn:aws:logs:${
              config.region
            }:${config.accountId()}:log-group:testlambdatest-:*:sss`,
          },
        ],
      }),
      awsResourceTest,
    ])());
  it.skip("MetricFilter", () =>
    pipe([
      () => ({
        groupType: "CloudWatchLogs::MetricFilter",
        livesNotFound: ({ config }) => [
          { filterName: "f123", logGroupName: "lg-124" },
        ],
      }),
      awsResourceTest,
    ])());
  it.skip("QueryDefinition", () =>
    pipe([
      () => ({
        groupType: "CloudWatchLogs::QueryDefinition",
        livesNotFound: ({ config }) => [{ queryDefinitionId: "q-124" }],
      }),
      awsResourceTest,
    ])());
  it("ResourcePolicy", () =>
    pipe([
      () => ({
        groupType: "CloudWatchLogs::ResourcePolicy",
        livesNotFound: ({ config }) => [
          {
            policyName: "p123",
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
