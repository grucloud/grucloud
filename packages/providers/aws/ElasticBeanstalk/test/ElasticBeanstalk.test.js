const assert = require("assert");
const { pipe, tap } = require("rubico");

const { awsResourceTest } = require("../../AwsResourceTester");

describe("ElasticBeanstalk", async function () {
  it("Application", () =>
    pipe([
      () => ({
        groupType: "ElasticBeanstalk::Application",
        livesNotFound: ({ config }) => [
          {
            ApplicationName: "application12345",
          },
        ],
      }),
      awsResourceTest,
    ])());
  it("ApplicationVersion", () =>
    pipe([
      () => ({
        groupType: "ElasticBeanstalk::ApplicationVersion",
        livesNotFound: ({ config }) => [
          {
            ApplicationName: "application12345",
            VersionLabel: "q123",
          },
        ],
      }),
      awsResourceTest,
    ])());
  it("Environment", () =>
    pipe([
      () => ({
        groupType: "ElasticBeanstalk::Environment",
        livesNotFound: ({ config }) => [
          {
            EnvironmentName: "a123",
            EnvironmentId: "s5ghf44",
            ApplicationName: "a123",
          },
        ],
      }),
      awsResourceTest,
    ])());
});
