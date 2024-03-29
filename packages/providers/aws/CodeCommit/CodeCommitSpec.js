const assert = require("assert");
const { tap, pipe, map } = require("rubico");
const { defaultsDeep } = require("rubico/x");

const { createAwsService } = require("../AwsService");

const { compareAws } = require("../AwsCommon");
const {
  CodeCommitApprovalRuleTemplate,
} = require("./CodeCommitApprovalRuleTemplate");
const {
  CodeCommitApprovalRuleTemplateAssociation,
} = require("./CodeCommitApprovalRuleTemplateAssociation");
const { CodeCommitRepository } = require("./CodeCommitRepository");
const {
  CodeCommitRepositoryTriggers,
} = require("./CodeCommitRepositoryTriggers");

const GROUP = "CodeCommit";

const tagsKey = "tags";

const compare = compareAws({
  tagsKey,
  key: "key",
});

module.exports = pipe([
  () => [
    //
    CodeCommitApprovalRuleTemplate({}),
    CodeCommitApprovalRuleTemplateAssociation({}),
    CodeCommitRepository({ compare }),
    CodeCommitRepositoryTriggers({}),
  ],
  map(
    pipe([
      createAwsService,
      defaultsDeep({
        group: GROUP,
        tagsKey,
        compare: compare({}),
      }),
    ])
  ),
]);
