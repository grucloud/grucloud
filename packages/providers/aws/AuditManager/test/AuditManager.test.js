const assert = require("assert");
const { pipe, tap } = require("rubico");

const { awsResourceTest } = require("../../AwsResourceTester");

describe("AuditManager", async function () {
  it("AccountRegistration", () =>
    pipe([
      () => ({
        groupType: "AuditManager::AccountRegistration",
        livesNotFound: ({ config }) => [{}],
        skipDelete: true,
      }),
      awsResourceTest,
    ])());
  it("Assessment", () =>
    pipe([
      () => ({
        groupType: "AuditManager::Assessment",
        livesNotFound: ({ config }) => [
          { assessmentId: "5af4b834-7168-4ce3-8538-8fdb21300141" },
        ],
      }),
      awsResourceTest,
    ])());
  it("AssessmentFramework", () =>
    pipe([
      () => ({
        groupType: "AuditManager::AssessmentFramework",
        livesNotFound: ({ config }) => [
          { id: "5af4b834-7168-4ce3-8538-8fdb21300141" },
        ],
      }),
      awsResourceTest,
    ])());
  it.skip("AssessmentReport", () =>
    pipe([
      () => ({
        groupType: "AuditManager::AssessmentReport",
        livesNotFound: ({ config }) => [{}],
      }),
      awsResourceTest,
    ])());

  it("Control", () =>
    pipe([
      () => ({
        groupType: "AuditManager::Control",
        livesNotFound: ({ config }) => [
          { id: "5af4b834-7168-4ce3-8538-8fdb21300141" },
        ],
      }),
      awsResourceTest,
    ])());

  it.skip("FrameworkShare", () =>
    pipe([
      () => ({
        groupType: "AuditManager::FrameworkShare",
        livesNotFound: ({ config }) => [{}],
      }),
      awsResourceTest,
    ])());
  it("Settings", () =>
    pipe([
      () => ({
        groupType: "AuditManager::Settings",
        livesNotFound: ({ config }) => [{}],
        skipDelete: true,
        skipGetById: true,
        skipGetByName: true,
      }),
      awsResourceTest,
    ])());
});
