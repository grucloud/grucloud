const assert = require("assert");
const { pipe, tap } = require("rubico");

const { awsResourceTest } = require("../../AwsResourceTester");

describe("AuditManager", async function () {
  it.skip("Assessment", () =>
    pipe([
      () => ({
        groupType: "AuditManager::Assessment",
        livesNotFound: ({ config }) => [{}],
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

  it.skip("Control", () =>
    pipe([
      () => ({
        groupType: "AuditManager::Control",
        livesNotFound: ({ config }) => [{}],
      }),
      awsResourceTest,
    ])());
  it.skip("Framework", () =>
    pipe([
      () => ({
        groupType: "AuditManager::Framework",
        livesNotFound: ({ config }) => [{}],
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
});
