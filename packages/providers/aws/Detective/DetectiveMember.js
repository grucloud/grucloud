const assert = require("assert");
const { pipe, tap, get, pick } = require("rubico");
const { defaultsDeep, first } = require("rubico/x");

const { getByNameCore } = require("@grucloud/core/Common");
const { getField } = require("@grucloud/core/ProviderCommon");

const pickId = pipe([
  tap(({ AccountId, GraphArn }) => {
    assert(AccountId);
    assert(GraphArn);
  }),
  ({ AccountId, GraphArn }) => ({
    AccountIds: [AccountId],
    GraphArn,
  }),
]);

const decorate = ({ endpoint, config }) =>
  pipe([
    tap((params) => {
      assert(endpoint);
    }),
  ]);

const filterPayload = pipe([
  tap(({ AccountId, GraphArn, EmailAddress }) => {
    assert(AccountId);
    assert(GraphArn);
    assert(EmailAddress);
  }),
  ({ AccountId, EmailAddress, GraphArn }) => ({
    Accounts: [{ AccountId, EmailAddress }],
    GraphArn,
  }),
]);

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Detective.html
exports.DetectiveMember = () => ({
  type: "Member",
  package: "detective",
  client: "Detective",
  propertiesDefault: {},
  omitProperties: [
    "GraphArn",
    "AccountId",
    "AdministratorId",
    "MasterId",
    "Status",
    "InvitedTime",
    "UpdatedTime",
    "VolumeUsageInBytes",
    "VolumeUsageUpdatedTime",
    "PercentOfGraphUtilization",
    "PercentOfGraphUtilizationUpdatedTime",
    "InvitationType",
    "VolumeUsageByDatasourcePackage",
    "DatasourcePackageIngestStates",
  ],
  inferName: () =>
    pipe([
      get("EmailAddress"),
      tap((Name) => {
        assert(Name);
      }),
    ]),
  findName: () =>
    pipe([
      get("EmailAddress"),
      tap((name) => {
        assert(name);
      }),
    ]),
  findId: () =>
    pipe([
      get("AccountId"),
      tap((id) => {
        assert(id);
      }),
    ]),
  ignoreErrorCodes: ["ResourceNotFoundException", "AccessDeniedException"],
  dependencies: {
    account: {
      type: "Account",
      group: "Organisations",
      dependencyId: () =>
        pipe([
          get("AccountId"),
          tap((AccountId) => {
            assert(AccountId);
          }),
        ]),
    },
    graph: {
      type: "Graph",
      group: "Detective",
      parent: true,
      dependencyId: () =>
        pipe([
          get("GraphArn"),
          tap((GraphArn) => {
            assert(GraphArn);
          }),
        ]),
    },
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Detective.html#getMembers-property
  getById: {
    method: "getMembers",
    getField: "Member",
    pickId,
    decorate,
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Detective.html#listMembers-property
  getList: ({ client, endpoint, getById, config }) =>
    pipe([
      () =>
        client.getListWithParent({
          parent: { type: "Graph", group: "Detective" },
          pickKey: pipe([
            pick(["GraphArn"]),
            tap(({ GraphArn }) => {
              assert(GraphArn);
            }),
          ]),
          method: "listMembers",
          getParam: "MemberDetails",
          config,
          decorate: () => pipe([decorate({ endpoint, config })]),
        }),
    ])(),
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Detective.html#createMembers-property
  create: {
    filterPayload,
    method: "createMembers",
    pickCreated: ({ payload }) => pipe([get("Members"), first]),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Detective.html#deleteMembers-property
  destroy: {
    method: "deleteMembers",
    pickId,
  },
  getByName: getByNameCore,
  configDefault: ({
    name,
    namespace,
    properties: { ...otherProps },
    dependencies: { graph, account },
    config,
  }) =>
    pipe([
      tap((params) => {
        assert(graph);
        assert(account);
      }),
      () => otherProps,
      defaultsDeep({
        GraphArn: getField(graph, "GraphArn"),
        AccountId: getField(account, "Id"),
        EmailAddress: getField(account, "EmailAddress"),
      }),
    ])(),
});
