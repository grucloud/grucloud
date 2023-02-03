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
  it.only("AssessmentDelegation", () =>
    pipe([
      () => ({
        groupType: "AuditManager::AssessmentDelegation",
        livesNotFound: ({ config }) => [
          {
            assessmentId: "5af4b834-7168-4ce3-8538-8fdb21300141",
            delegationId: "5af4b834-7168-4ce3-8538-8fdb21300141",
          },
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
  it("AssessmentFrameworkShare", () =>
    pipe([
      () => ({
        groupType: "AuditManager::AssessmentFrameworkShare",
        livesNotFound: ({ config }) => [
          { requestId: "5af4b834-7168-4ce3-8538-8fdb21300141" },
        ],
      }),
      awsResourceTest,
    ])());
  it("AssessmentReport", () =>
    pipe([
      () => ({
        groupType: "AuditManager::AssessmentReport",
        livesNotFound: ({ config }) => [
          {
            assessmentId: "5af4b834-7168-4ce3-8538-8fdb21300141",
            assessmentReportId: "5af4b834-7168-4ce3-8538-8fdb21300141",
          },
        ],
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
  it("OrganizationAdminAccount", () =>
    pipe([
      () => ({
        groupType: "AuditManager::OrganizationAdminAccount",
        livesNotFound: ({ config }) => [{ adminAccountId: "123456789012" }],
      }),
      awsResourceTest,
    ])());
});
