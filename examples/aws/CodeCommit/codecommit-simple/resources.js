// Generated by 'gc gencode'
const {} = require("rubico");
const {} = require("rubico/x");

exports.createResources = () => [
  {
    type: "ApprovalRuleTemplate",
    group: "CodeCommit",
    properties: ({}) => ({
      approvalRuleTemplateContent: {
        DestinationReferences: "*",
        Statements: [
          {
            ApprovalPoolMembers: "*",
            NumberOfApprovalsNeeded: 1,
            Type: "Approvers",
          },
        ],
        Version: "2018-11-08",
      },
      approvalRuleTemplateName: "my-approval-template",
    }),
  },
  {
    type: "ApprovalRuleTemplateAssociation",
    group: "CodeCommit",
    dependencies: ({}) => ({
      approvalRuleTemplate: "my-approval-template",
      repository: "my-repo-test",
    }),
  },
  {
    type: "Repository",
    group: "CodeCommit",
    properties: ({}) => ({
      repositoryName: "my-repo-test",
    }),
  },
];
