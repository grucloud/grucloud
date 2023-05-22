const assert = require("assert");
const { pipe, tap, get, pick, switchCase } = require("rubico");
const { defaultsDeep, includes } = require("rubico/x");

const { getByNameCore } = require("@grucloud/core/Common");
const { getField } = require("@grucloud/core/ProviderCommon");

const pickId = pipe([
  tap(({ approvalRuleTemplateName, repositoryName }) => {
    assert(approvalRuleTemplateName);
    assert(repositoryName);
  }),
  pick(["approvalRuleTemplateName", "repositoryName"]),
]);

const decorate = ({ endpoint, config }) =>
  pipe([
    tap((params) => {
      assert(endpoint);
    }),
  ]);

const findName =
  () =>
  ({ approvalRuleTemplateName, repositoryName }) =>
    pipe([
      tap((params) => {
        assert(approvalRuleTemplateName);
        assert(repositoryName);
      }),
      () => `${approvalRuleTemplateName}::${repositoryName}`,
    ])();

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/CodeCommit.html
exports.CodeCommitApprovalRuleTemplateAssociation = () => ({
  type: "ApprovalRuleTemplateAssociation",
  package: "codecommit",
  client: "CodeCommit",
  propertiesDefault: {},
  omitProperties: [],
  inferName: ({ dependenciesSpec: { approvalRuleTemplate, repository } }) =>
    pipe([
      tap((params) => {
        assert(approvalRuleTemplate);
        assert(repository);
      }),
      () => `${approvalRuleTemplate}::${repository}`,
    ]),
  findName,
  findId: findName,
  ignoreErrorCodes: [
    "ResourceNotFoundException",
    "RepositoryDoesNotExistException",
    "ApprovalRuleTemplateDoesNotExistException",
  ],
  dependencies: {
    approvalRuleTemplate: {
      type: "ApprovalRuleTemplate",
      group: "CodeCommit",
      parent: true,
      pathId: "approvalRuleTemplateName",
      dependencyId: ({ lives, config }) =>
        pipe([
          get("approvalRuleTemplateName"),
          tap((approvalRuleTemplateName) => {
            assert(approvalRuleTemplateName);
          }),
        ]),
    },
    repository: {
      type: "Repository",
      group: "CodeCommit",
      parent: true,
      pathId: "repositoryName",
      dependencyId: ({ lives, config }) =>
        pipe([
          get("repositoryName"),
          tap((repositoryName) => {
            assert(repositoryName);
          }),
        ]),
    },
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/CodeCommit.html#listRepositoriesForApprovalRuleTemplate-property
  getById: {
    method: "listRepositoriesForApprovalRuleTemplate",
    pickId,
    decorate: ({ live }) =>
      pipe([
        tap(() => {
          assert(live.repositoryName);
        }),
        get("repositoryNames"),
        switchCase([
          includes(live.repositoryName),
          () => live,
          () => undefined,
        ]),
      ]),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/CodeCommit.html#listRepositoriesForApprovalRuleTemplate-property
  getList: ({ client, endpoint, getById, config }) =>
    pipe([
      () =>
        client.getListWithParent({
          parent: { type: "ApprovalRuleTemplate", group: "CodeCommit" },
          pickKey: pipe([
            tap(({ approvalRuleTemplateName }) => {
              assert(approvalRuleTemplateName);
            }),
            pick(["approvalRuleTemplateName"]),
            //({ approvalRuleTemplateName }) => ({ approvalRuleTemplateName }),
          ]),
          method: "listRepositoriesForApprovalRuleTemplate",
          getParam: "repositoryNames",
          config,
          decorate: ({ parent }) =>
            pipe([
              tap((params) => {
                assert(parent.approvalRuleTemplateName);
              }),
              (repositoryName) => ({ repositoryName }),
              defaultsDeep({
                approvalRuleTemplateName: parent.approvalRuleTemplateName,
              }),
            ]),
        }),
    ])(),
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/CodeCommit.html#associateApprovalRuleTemplateWithRepository-property
  create: {
    method: "associateApprovalRuleTemplateWithRepository",
    pickCreated: ({ payload }) => pipe([() => payload]),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/CodeCommit.html#disassociateApprovalRuleTemplateFromRepository-property
  destroy: {
    method: "disassociateApprovalRuleTemplateFromRepository",
    pickId,
  },
  getByName: getByNameCore,
  configDefault: ({
    name,
    namespace,
    properties: { ...otherProps },
    dependencies: { approvalRuleTemplate, repository },
    config,
  }) =>
    pipe([
      tap(() => {
        assert(approvalRuleTemplate);
        assert(repository);
      }),
      () => otherProps,
      defaultsDeep({
        approvalRuleTemplateName: getField(
          approvalRuleTemplate,
          "approvalRuleTemplateName"
        ),
        repositoryName: getField(repository, "repositoryName"),
      }),
    ])(),
});
