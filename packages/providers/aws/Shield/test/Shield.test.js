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
  it("ProtectionHealthCheckAssociation", () =>
    pipe([
      () => ({
        groupType: "Shield::ProtectionHealthCheckAssociation",
        livesNotFound: ({ config }) => [
          {
            ProtectionId: "p123456789p123456789p123456789p12345",
            HealthCheckArn:
              "arn:aws:route53:::healthcheck/75ffecf6-0290-49f7-9e76-ee33c82a5b1a",
          },
        ],
      }),
      awsResourceTest,
    ])());
});
