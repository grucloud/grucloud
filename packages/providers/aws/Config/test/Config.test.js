const assert = require("assert");
const { pipe, tap } = require("rubico");

const { awsResourceTest } = require("../../AwsResourceTester");

describe("Config", async function () {
  it("AggregationAuthorization", () =>
    pipe([
      () => ({
        groupType: "Config::AggregationAuthorization",
        livesNotFound: ({ config }) => [
          {
            AuthorizedAccountId: "123456789012",
            AuthorizedAwsRegion: "us-east-1",
          },
        ],
      }),
      awsResourceTest,
    ])());
  it("ConfigurationAggregator", () =>
    pipe([
      () => ({
        groupType: "Config::ConfigurationAggregator",
        livesNotFound: ({ config }) => [
          { ConfigurationAggregatorName: "b123" },
        ],
      }),
      awsResourceTest,
    ])());
  it("ConfigurationRecorder", () =>
    pipe([
      () => ({
        groupType: "Config::ConfigurationRecorder",
        livesNotFound: ({ config }) => [{ name: "b123" }],
      }),
      awsResourceTest,
    ])());
  it("ConfigurationRecorderStatus", () =>
    pipe([
      () => ({
        groupType: "Config::ConfigurationRecorderStatus",
        livesNotFound: ({ config }) => [{ ConfigurationRecorderName: "b123" }],
      }),
      awsResourceTest,
    ])());
  it("ConformancePack", () =>
    pipe([
      () => ({
        groupType: "Config::ConformancePack",
        livesNotFound: ({ config }) => [{ ConformancePackName: "b123" }],
      }),
      awsResourceTest,
    ])());
  it("DeliveryChannel", () =>
    pipe([
      () => ({
        groupType: "Config::DeliveryChannel",
        livesNotFound: ({ config }) => [{ name: "b123" }],
      }),
      awsResourceTest,
    ])());
  it("OrganizationConfigRule", () =>
    pipe([
      () => ({
        groupType: "Config::OrganizationConfigRule",
        livesNotFound: ({ config }) => [{ OrganizationConfigRuleName: "b123" }],
      }),
      awsResourceTest,
    ])());
  it("OrganizationConformancePack", () =>
    pipe([
      () => ({
        groupType: "Config::OrganizationConformancePack",
        livesNotFound: ({ config }) => [
          { OrganizationConformancePackName: "b123" },
        ],
      }),
      awsResourceTest,
    ])());
});
