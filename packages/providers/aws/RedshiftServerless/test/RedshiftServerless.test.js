const assert = require("assert");
const { pipe, tap } = require("rubico");

const { awsResourceTest } = require("../../AwsResourceTester");

describe("RedshiftServerless", async function () {
  it.skip("EndpointAccess", () =>
    pipe([
      () => ({
        groupType: "RedshiftServerless::EndpointAccess",
        livesNotFound: ({ config }) => [{}],
      }),
      awsResourceTest,
    ])());
  it.skip("Namespace", () =>
    pipe([
      () => ({
        groupType: "RedshiftServerless::Namespace",
        livesNotFound: ({ config }) => [{ namespaceName: "n123" }],
      }),
      awsResourceTest,
    ])());
  it.skip("Snapshot", () =>
    pipe([
      () => ({
        groupType: "RedshiftServerless::Snapshot",
        livesNotFound: ({ config }) => [{}],
      }),
      awsResourceTest,
    ])());
  it.skip("Workgroup", () =>
    pipe([
      () => ({
        groupType: "RedshiftServerless::Workgroup",
        livesNotFound: ({ config }) => [{}],
      }),
      awsResourceTest,
    ])());
});
