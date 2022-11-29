const assert = require("assert");
const { pipe, tap } = require("rubico");

const { awsResourceTest } = require("../../AwsResourceTester");

describe("Shield", async function () {
  it("Protection", () =>
    pipe([
      () => ({
        groupType: "Shield::Protection",
        livesNotFound: ({ config }) => [
          { ProtectionId: "p123456789p123456789p123456789p12345" },
        ],
      }),
      awsResourceTest,
    ])());
  it("ProtectionGroup", () =>
    pipe([
      () => ({
        groupType: "Shield::ProtectionGroup",
        livesNotFound: ({ config }) => [{ ProtectionGroupId: "pg123" }],
      }),
      awsResourceTest,
    ])());
  it.skip("ProtectionHealthCheckAssociation", () =>
    pipe([
      () => ({
        groupType: "ProtectionHealthCheckAssociation",
        livesNotFound: ({ config }) => [{}],
      }),
      awsResourceTest,
    ])());
});
