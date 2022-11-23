const assert = require("assert");
const { pipe, tap, get, eq } = require("rubico");
const { defaultsDeep } = require("rubico/x");

const { getField } = require("@grucloud/core/ProviderCommon");

const { getByNameCore } = require("@grucloud/core/Common");
const { ignoreErrorCodes } = require("./SecurityHubCommon");

const pickId = pipe([
  tap(({ AccountId }) => {
    assert(AccountId);
  }),
  ({ AccountId }) => ({ AccountIds: [AccountId] }),
]);

const decorate = ({ endpoint }) =>
  pipe([
    tap((params) => {
      assert(endpoint);
    }),
  ]);

const ignoreErrorMessages = [
  "The request is rejected since no such resource found",
];

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/SecurityHub.html
exports.SecurityHubMember = () => ({
  type: "Member",
  package: "securityhub",
  client: "SecurityHub",
  propertiesDefault: {},
  omitProperties: [
    "AccountId",
    "AdministratorId",
    "MasterId",
    "MemberStatus",
    "UpdatedAt",
  ],
  inferName:
    ({ dependenciesSpec: { account } }) =>
    () =>
      pipe([
        tap((params) => {
          assert(account);
        }),
        () => account,
      ])(),
  findName: ({ lives, config }) =>
    pipe([
      get("AccountId"),
      tap((id) => {
        assert(id);
      }),
      (id) =>
        lives.getById({
          id,
          type: "Account",
          group: "Organisations",
        }),
      get("name"),
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
  dependencies: {
    account: {
      type: "Account",
      group: "Organisations",
      parent: true,
      dependencyId: ({ lives, config }) => pipe([get("AccountId")]),
    },
  },
  ignoreErrorCodes,
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/SecurityHub.html#getMembers-property
  getById: {
    method: "getMembers",
    getField: "Members",
    pickId,
    decorate,
    ignoreErrorMessages,
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/SecurityHub.html#listMembers-property
  getList: {
    method: "listMembers",
    getParam: "Members",
    decorate,
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/SecurityHub.html#createMembers-property
  create: {
    filterPayload: (payload) => pipe([() => ({ AccountDetails: [payload] })])(),
    method: "createMembers",
    pickCreated: ({ payload }) => pipe([() => payload]),
    shouldRetryOnExceptionMessages: [
      "The request is rejected since no such resource found",
    ],
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/SecurityHub.html#deleteMembers-property
  destroy: {
    method: "disassociateMembers",
    pickId,
    isInstanceDown: pipe([eq(get("MemberStatus"), "removed")]),
    ignoreErrorMessages,
  },
  getByName: getByNameCore,
  configDefault: ({
    name,
    namespace,
    properties: { Tags, ...otherProps },
    dependencies: { account },
    config,
  }) =>
    pipe([
      tap((params) => {
        assert(account);
      }),
      () => otherProps,
      defaultsDeep({
        AccountId: getField(account, "Id"),
      }),
    ])(),
});
