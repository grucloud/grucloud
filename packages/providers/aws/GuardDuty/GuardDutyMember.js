const assert = require("assert");
const { pipe, tap, get, eq, pick } = require("rubico");
const { defaultsDeep } = require("rubico/x");

const { getField } = require("@grucloud/core/ProviderCommon");

const { getByNameCore } = require("@grucloud/core/Common");
const { ignoreErrorCodes } = require("./GuardDutyCommon");

const pickId = pipe([
  tap(({ AccountId, DetectorId }) => {
    assert(AccountId);
    assert(DetectorId);
  }),
  ({ AccountId, DetectorId }) => ({ AccountIds: [AccountId], DetectorId }),
]);

const decorate = ({ endpoint }) =>
  pipe([
    tap((params) => {
      assert(endpoint);
    }),
  ]);

const ignoreErrorMessages = [
  "The request is rejected because the JSON could not be processed",
];

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/GuardDuty.html
exports.GuardDutyMember = () => ({
  type: "Member",
  package: "guardduty",
  client: "GuardDuty",
  propertiesDefault: {},
  omitProperties: [
    "AccountId",
    "AdministratorId",
    "MasterId",
    "MemberStatus",
    "UpdatedAt",
    "InvitedAt",
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
      lives.getById({
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
    detector: {
      type: "Detector",
      group: "GuardDuty",
      parent: true,
      dependencyId: ({ lives, config }) => pipe([get("DetectorId")]),
    },
  },
  ignoreErrorCodes,
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/GuardDuty.html#getMembers-property
  getById: {
    method: "getMembers",
    getField: "Members",
    pickId,
    decorate,
    ignoreErrorMessages,
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/GuardDuty.html#listMembers-property
  getList: ({ client, endpoint, getById, config }) =>
    pipe([
      () =>
        client.getListWithParent({
          parent: { type: "Detector", group: "GuardDuty" },
          pickKey: pipe([pick(["DetectorId"])]),
          method: "listMembers",
          getParam: "Members",
          config,
          decorate,
        }),
    ])(),
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/GuardDuty.html#createMembers-property
  create: {
    filterPayload: ({ DetectorId, ...payload }) =>
      pipe([() => ({ DetectorId, AccountDetails: [payload] })])(),
    method: "createMembers",
    pickCreated: ({ payload }) => pipe([() => payload]),
    shouldRetryOnExceptionMessages: [
      "The request is rejected since no such resource found",
    ],
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/GuardDuty.html#deleteMembers-property
  destroy: {
    method: "deleteMembers",
    pickId,
    isInstanceDown: pipe([eq(get("MemberStatus"), "removed")]),
    ignoreErrorMessages,
  },
  getByName: getByNameCore,
  configDefault: ({
    name,
    namespace,
    properties: { Tags, ...otherProps },
    dependencies: { account, detector },
    config,
  }) =>
    pipe([
      tap((params) => {
        assert(account);
        assert(detector);
      }),
      () => otherProps,
      defaultsDeep({
        AccountId: getField(account, "Id"),
        DetectorId: getField(detector, "DetectorId"),
      }),
    ])(),
});
