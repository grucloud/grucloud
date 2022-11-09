const assert = require("assert");
const { pipe, tap } = require("rubico");

const { awsResourceTest } = require("../../AwsResourceTester");

describe("Route53RecoveryReadiness", async function () {
  it("Cell", () =>
    pipe([
      () => ({
        groupType: "Route53RecoveryReadiness::Cell",
        livesNotFound: ({ config }) => [{ CellName: "a-12345" }],
      }),
      awsResourceTest,
    ])());
  it("ReadinessCheck", () =>
    pipe([
      () => ({
        groupType: "Route53RecoveryReadiness::ReadinessCheck",
        livesNotFound: ({ config }) => [{ ReadinessCheckName: "a-12345" }],
      }),
      awsResourceTest,
    ])());
  it("RecoveryGroup", () =>
    pipe([
      () => ({
        groupType: "Route53RecoveryReadiness::RecoveryGroup",
        livesNotFound: ({ config }) => [{ RecoveryGroupName: "a-12345" }],
      }),
      awsResourceTest,
    ])());
  it("ResourceSet", () =>
    pipe([
      () => ({
        groupType: "Route53RecoveryReadiness::ResourceSet",
        livesNotFound: ({ config }) => [{ ResourceSetName: "a-12345" }],
      }),
      awsResourceTest,
    ])());
});
