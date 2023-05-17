const assert = require("assert");
const { pipe, tap } = require("rubico");

const { awsResourceTest } = require("../../AwsResourceTester");

describe("CodeCommit", async function () {
  //approval_rule_template
  it.skip("ApprovalRuleTemplate", () =>
    pipe([
      () => ({
        groupType: "CodeCommit::ApprovalRuleTemplate",
        livesNotFound: ({ config }) => [{ approvalRuleTemplateName: "a123" }],
      }),
      awsResourceTest,
    ])());
  it.skip("ApprovalRuleTemplateAssociation", () =>
    pipe([
      () => ({
        groupType: "CodeCommit::ApprovalRuleTemplateAssociation",
        livesNotFound: ({ config }) => [{ approvalRuleTemplateName: "a123" }],
      }),
      awsResourceTest,
    ])());
  it("Repository", () =>
    pipe([
      () => ({
        groupType: "CodeCommit::Repository",
        livesNotFound: ({ config }) => [{ repositoryName: "r123" }],
      }),
      awsResourceTest,
    ])());
  it.skip("RepositoryTrigger", () =>
    pipe([
      () => ({
        groupType: "CodeCommit::RepositoryTrigger",
        livesNotFound: ({ config }) => [
          { repositoryName: "r123", triggers: [] },
        ],
      }),
      awsResourceTest,
    ])());
});
