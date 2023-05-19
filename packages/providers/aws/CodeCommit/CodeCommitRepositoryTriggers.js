const assert = require("assert");
const {
  pipe,
  tap,
  get,
  pick,
  assign,
  filter,
  switchCase,
  map,
} = require("rubico");
const { defaultsDeep, pluck, callProp } = require("rubico/x");

const { replaceWithName } = require("@grucloud/core/Common");
const { getByNameCore } = require("@grucloud/core/Common");
const { getField } = require("@grucloud/core/ProviderCommon");

const pickId = pipe([
  tap(({ repositoryName }) => {
    assert(repositoryName);
  }),
  pick(["repositoryName"]),
]);

const decorate = ({ endpoint, config, live }) =>
  pipe([
    tap((params) => {
      assert(live.repositoryName);
    }),
    defaultsDeep({
      repositoryName: live.repositoryName,
    }),
  ]);

const findName =
  () =>
  ({ repositoryName }) =>
    pipe([
      tap((params) => {
        assert(repositoryName);
      }),
      () => `${repositoryName}`,
    ])();

const isSNSTopic = callProp("startsWith", "arn:aws:sns");
const isLambdaFunction = callProp("startsWith", "arn:aws:lambda");

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/CodeCommit.html
exports.CodeCommitRepositoryTriggers = () => ({
  type: "RepositoryTriggers",
  package: "codecommit",
  client: "CodeCommit",
  propertiesDefault: {},
  omitProperties: ["configurationId"],
  inferName: ({ dependenciesSpec: { repository } }) =>
    pipe([
      tap((params) => {
        assert(repository);
      }),
      () => `${repository}`,
    ]),
  findName,
  findId: findName,
  ignoreErrorCodes: [
    "ResourceNotFoundException",
    "RepositoryDoesNotExistException",
    "ApprovalRuleTemplateDoesNotExistException",
  ],
  dependencies: {
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
    snsTopics: {
      type: "Topic",
      group: "SNS",
      optional: true,
      list: true,
      dependencyIds: ({ lives, config }) =>
        pipe([get("triggers"), pluck("destinationArn"), filter(isSNSTopic)]),
    },
    lambdaFunctions: {
      type: "Function",
      group: "Lambda",
      optional: true,
      list: true,
      dependencyIds: ({ lives, config }) =>
        pipe([
          get("triggers"),
          pluck("destinationArn"),
          filter(isLambdaFunction),
        ]),
    },
  },
  filterLive: ({ lives, providerConfig }) =>
    pipe([
      assign({
        triggers: pipe([
          get("triggers"),
          map(
            assign({
              destinationArn: pipe([
                get("destinationArn"),
                switchCase([
                  isSNSTopic,
                  replaceWithName({
                    groupType: "SNS::Topic",
                    path: "id",
                    providerConfig,
                    lives,
                  }),
                  isLambdaFunction,
                  replaceWithName({
                    groupType: "Lambda::Function",
                    path: "id",
                    providerConfig,
                    lives,
                  }),
                  (destinationArn) => {
                    assert(
                      false,
                      `sns topics or lambda functions missing, destinationArn: ${destinationArn}`
                    );
                  },
                ]),
              ]),
            })
          ),
        ]),
      }),
    ]),
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/CodeCommit.html#getRepositoryTriggers-property
  getById: {
    method: "getRepositoryTriggers",
    pickId,
    decorate,
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/CodeCommit.html#getRepositoryTriggers-property
  getList: ({ client, endpoint, getById, config }) =>
    pipe([
      () =>
        client.getListWithParent({
          parent: { type: "Repository", group: "CodeCommit" },
          pickKey: pipe([
            tap(({ repositoryName }) => {
              assert(repositoryName);
            }),
            pick(["repositoryName"]),
          ]),
          method: "getRepositoryTriggers",
          config,
          decorate: ({ parent }) =>
            pipe([
              tap((params) => {
                assert(parent.repositoryName);
              }),
              defaultsDeep({
                repositoryName: parent.repositoryName,
              }),
            ]),
        }),
    ])(),
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/CodeCommit.html#associateApprovalRuleTemplateWithRepository-property
  create: {
    method: "putRepositoryTriggers",
    pickCreated: ({ payload }) => pipe([() => payload]),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/CodeCommit.html#disassociateApprovalRuleTemplateFromRepository-property
  destroy: {
    method: "putRepositoryTriggers",
    pickId: pipe([pickId, assign({ triggers: () => [] })]),
    isInstanceDown: () => true,
  },
  getByName: getByNameCore,
  configDefault: ({
    name,
    namespace,
    properties: { ...otherProps },
    dependencies: { repository },
    config,
  }) =>
    pipe([
      tap(() => {
        assert(repository);
      }),
      () => otherProps,
      defaultsDeep({
        repositoryName: getField(repository, "repositoryName"),
      }),
    ])(),
});
