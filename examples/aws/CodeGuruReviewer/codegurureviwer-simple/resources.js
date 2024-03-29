// Generated by 'gc gencode'
const {} = require("rubico");
const {} = require("rubico/x");

exports.createResources = () => [
  {
    type: "Repository",
    group: "CodeCommit",
    properties: ({}) => ({
      repositoryName: "my-repo",
      tags: {
        "codeguru-reviewer": "enabled",
      },
    }),
  },
  {
    type: "RepositoryAssociation",
    group: "CodeGuruReviewer",
    properties: ({}) => ({
      Name: "my-repo",
      Repository: {
        CodeCommit: {
          Name: "my-repo",
        },
      },
    }),
    dependencies: ({}) => ({
      codeCommitRepository: "my-repo",
    }),
  },
];
