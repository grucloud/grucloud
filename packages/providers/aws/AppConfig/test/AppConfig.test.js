const assert = require("assert");
const { pipe, tap } = require("rubico");

const { awsResourceTest } = require("../../AwsResourceTester");

describe("AppConfig", async function () {
  it("Application", () =>
    pipe([
      () => ({
        groupType: "AppConfig::Application",
        livesNotFound: ({ config }) => [{ Id: "a123456" }],
      }),
      awsResourceTest,
    ])());
  it("ConfigurationProfile", () =>
    pipe([
      () => ({
        groupType: "AppConfig::ConfigurationProfile",
        livesNotFound: ({ config }) => [
          { Id: "a123456", ApplicationId: "b123456" },
        ],
      }),
      awsResourceTest,
    ])());
  it("Deployment", () =>
    pipe([
      () => ({
        groupType: "AppConfig::Deployment",
        livesNotFound: ({ config }) => [
          {
            DeploymentNumber: "1",
            ApplicationId: "a1234",
            EnvironmentId: "e12345",
          },
        ],
      }),
      awsResourceTest,
    ])());
  it("DeploymentStrategy", () =>
    pipe([
      () => ({
        groupType: "AppConfig::DeploymentStrategy",
        livesNotFound: ({ config }) => [
          {
            Id: "a1234",
          },
        ],
      }),
      awsResourceTest,
    ])());
  it("Environment", () =>
    pipe([
      () => ({
        groupType: "AppConfig::Environment",
        livesNotFound: ({ config }) => [
          {
            ApplicationId: "a1234",
            Id: "b1234",
          },
        ],
      }),
      awsResourceTest,
    ])());
  it.skip("Extension", () =>
    pipe([
      () => ({
        groupType: "AppConfig::Extension",
        livesNotFound: ({ config }) => [{}],
      }),
      awsResourceTest,
    ])());
  it.skip("ExtensionAssociation", () =>
    pipe([
      () => ({
        groupType: "AppConfig::ExtensionAssociation",
        livesNotFound: ({ config }) => [{}],
      }),
      awsResourceTest,
    ])());
  it("HostedConfigurationVersion", () =>
    pipe([
      () => ({
        groupType: "AppConfig::HostedConfigurationVersion",
        livesNotFound: ({ config }) => [
          {
            ApplicationId: "a1234",
            VersionNumber: "1",
            ConfigurationProfileId: "a123",
          },
        ],
      }),
      awsResourceTest,
    ])());
});
