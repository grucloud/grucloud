const assert = require("assert");
const { pipe, tap } = require("rubico");

const { awsResourceTest } = require("../../AwsResourceTester");

describe("Config", async function () {
  it("ConfigRule", () =>
    pipe([
      () => ({
        groupType: "Config::ConfigRule",
        livesNotFound: ({ config }) => [{ ConfigRuleName: "b123" }],
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
  it.skip("OrganizationCustomPolicyRule", () =>
    pipe([
      () => ({
        groupType: "Config::OrganizationCustomPolicyRule",
        livesNotFound: ({ config }) => [{ name: "b123" }],
      }),
      awsResourceTest,
    ])());
  it.skip("OrganizationCustomRule", () =>
    pipe([
      () => ({
        groupType: "Config::OrganizationCustomRule",
        livesNotFound: ({ config }) => [{ name: "b123" }],
      }),
      awsResourceTest,
    ])());
});
