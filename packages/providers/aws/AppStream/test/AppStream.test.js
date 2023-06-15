const assert = require("assert");
const { pipe, tap } = require("rubico");

const { awsResourceTest } = require("../../AwsResourceTester");

describe("AppStream", async function () {
  it("AppBlock", () =>
    pipe([
      () => ({
        groupType: "AppStream::AppBlock",
        livesNotFound: ({ config }) => [
          {
            Arn: `arn:${config.partition}:appstream:${
              config.region
            }:${config.accountId()}:app-block/myappblockko`,
            Name: "b123",
          },
        ],
      }),
      awsResourceTest,
    ])());
  it("Application", () =>
    pipe([
      () => ({
        groupType: "AppStream::Application",
        livesNotFound: ({ config }) => [
          {
            Arn: `arn:${config.partition}:appstream:${
              config.region
            }:${config.accountId()}:application/myappblockko`,
            Name: "b123",
          },
        ],
      }),
      awsResourceTest,
    ])());
  it("DirectoryConfig", () =>
    pipe([
      () => ({
        groupType: "AppStream::DirectoryConfig",
        livesNotFound: ({ config }) => [{ DirectoryName: "d123.grucloug.org" }],
      }),
      awsResourceTest,
    ])());
  it("Entitlement", () =>
    pipe([
      () => ({
        groupType: "AppStream::Entitlement",
        livesNotFound: ({ config }) => [{ Name: "n123", StackName: "s123" }],
      }),
      awsResourceTest,
    ])());
  it("Fleet", () =>
    pipe([
      () => ({
        groupType: "AppStream::Fleet",
        livesNotFound: ({ config }) => [{ Name: "f123" }],
      }),
      awsResourceTest,
    ])());
  it("ImageBuilder", () =>
    pipe([
      () => ({
        groupType: "AppStream::ImageBuilder",
        livesNotFound: ({ config }) => [{ Name: "f123" }],
      }),
      awsResourceTest,
    ])());
  it("Stack", () =>
    pipe([
      () => ({
        groupType: "AppStream::Stack",
        livesNotFound: ({ config }) => [
          {
            Name: "f123",
            Arn: `arn:${config.partition}:appstream:${
              config.region
            }:${config.accountId()}:stack/stackko`,
          },
        ],
      }),
      awsResourceTest,
    ])());
  it("UsageReportSubscription", () =>
    pipe([
      () => ({
        groupType: "AppStream::UsageReportSubscription",
        livesNotFound: ({ config }) => [{}],
        skipGetByName: true,
        skipGetById: true,
      }),
      awsResourceTest,
    ])());
  it("User", () =>
    pipe([
      () => ({
        groupType: "AppStream::User",
        livesNotFound: ({ config }) => [
          { UserName: "idonotexit", AuthenticationType: "USERPOOL" },
        ],
      }),
      awsResourceTest,
    ])());
  it("UserStackAssociation", () =>
    pipe([
      () => ({
        groupType: "AppStream::UserStackAssociation",
        livesNotFound: ({ config }) => [
          {
            StackName: "s123",
            UserName: "idonotexit",
            AuthenticationType: "USERPOOL",
          },
        ],
      }),
      awsResourceTest,
    ])());
});
