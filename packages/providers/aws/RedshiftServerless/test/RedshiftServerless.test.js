const assert = require("assert");
const { pipe, tap } = require("rubico");

const { awsResourceTest } = require("../../AwsResourceTester");

describe("RedshiftServerless", async function () {
  it("EndpointAccess", () =>
    pipe([
      () => ({
        groupType: "RedshiftServerless::EndpointAccess",
        livesNotFound: ({ config }) => [{ endpointName: "e123" }],
      }),
      awsResourceTest,
    ])());
  it("Namespace", () =>
    pipe([
      () => ({
        groupType: "RedshiftServerless::Namespace",
        livesNotFound: ({ config }) => [{ namespaceName: "n123" }],
      }),
      awsResourceTest,
    ])());
  it("ResourcePolicy", () =>
    pipe([
      () => ({
        groupType: "RedshiftServerless::ResourcePolicy",
        livesNotFound: ({ config }) => [
          {
            resourceArn: `arn:aws:redshift-serverless:${
              config.region
            }:${config.accountId()}:snapshot/b6e29843-fee3-4b39-84cc-33e51a87dd60`,
          },
        ],
      }),
      awsResourceTest,
    ])());
  it("Snapshot", () =>
    pipe([
      () => ({
        groupType: "RedshiftServerless::Snapshot",
        livesNotFound: ({ config }) => [{ snapshotName: "s123" }],
      }),
      awsResourceTest,
    ])());
  it("UsageLimit", () =>
    pipe([
      () => ({
        groupType: "RedshiftServerless::UsageLimit",
        livesNotFound: ({ config }) => [{ usageLimitId: "u123" }],
      }),
      awsResourceTest,
    ])());
  it("Workgroup", () =>
    pipe([
      () => ({
        groupType: "RedshiftServerless::Workgroup",
        livesNotFound: ({ config }) => [{ workgroupName: "w123" }],
      }),
      awsResourceTest,
    ])());
});
