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
  it.skip("ResourcePolicy", () =>
    pipe([
      () => ({
        groupType: "RedshiftServerless::ResourcePolicy",
        livesNotFound: ({ config }) => [{}],
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
