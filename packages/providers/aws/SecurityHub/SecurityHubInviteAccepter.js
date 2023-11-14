const assert = require("assert");
const { pipe, tap, get, pick, eq } = require("rubico");
const { defaultsDeep, find, when } = require("rubico/x");

const { getByNameCore } = require("@grucloud/core/Common");
const { getField } = require("@grucloud/core/ProviderCommon");

const pickId = pipe([
  tap(({ InvitationId }) => {
    assert(InvitationId);
  }),
  pick(["InvitationId"]),
]);

const decorate = ({ endpoint, config }) =>
  pipe([
    tap((params) => {
      assert(endpoint);
    }),
    ({ AccountId, ...other }) => ({ AdministratorId: AccountId, ...other }),
  ]);

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/SecurityHub.html
exports.SecurityHubInviteAccepter = () => ({
  type: "InviteAccepter",
  package: "securityhub",
  client: "SecurityHub",
  propertiesDefault: {},
  // TODO do not generate for now
  managedByOther: () => () => true,
  omitProperties: ["InvitedAt", "InvitationId", "AdministratorId"],
  inferName: () =>
    pipe([
      get("AdministratorId"),
      tap((Name) => {
        assert(Name);
      }),
    ]),
  findName: () =>
    pipe([
      get("AdministratorId"),
      tap((name) => {
        assert(name);
      }),
    ]),
  findId: () =>
    pipe([
      get("InvitationId"),
      tap((id) => {
        assert(id);
      }),
    ]),
  ignoreErrorCodes: [
    "ResourceNotFoundException",
    "BadRequestException",
    "AccessDeniedException",
  ],
  dependencies: {
    accountAdmin: {
      type: "Account",
      group: "Organisations",
      dependencyId: ({ lives, config }) => pipe([get("AdministratorId")]),
    },
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/SecurityHub.html#listInvitations-property
  getById: {
    method: "listInvitations",
    pickId,
    decorate: ({ live }) =>
      pipe([
        tap((params) => {
          assert(live.InvitationId);
        }),
        get("Invitations"),
        find(eq(get("InvitationId"), live.InvitationId)),
      ]),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/SecurityHub.html#listInviteAccepters-property
  getList: {
    method: "listInvitations",
    getParam: "Invitations",
    decorate,
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/SecurityHub.html#createInviteAccepter-property
  create: {
    method: "acceptAdministratorInvitation",
    pickCreated: ({ payload }) => pipe([() => payload]),
    // TODO
    // isInstanceUp: pipe([get("MemberStatus"), isIn(["RUNNING"])]),
    isInstanceUp: () => true,
    // isInstanceError: pipe([get("MemberStatus"), isIn(["FAILED"])]),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/SecurityHub.html#deleteInvitations-property
  destroy: {
    method: "deleteInvitations",
    pickId: pipe([
      tap(({ AdministratorId }) => {
        assert(AdministratorId);
      }),
      ({ AdministratorId }) => ({
        AccountIds: [AdministratorId],
      }),
    ]),
    // TODO
    isInstanceDown: () => true,
  },
  getByName: getByNameCore,
  configDefault: ({
    name,
    namespace,
    properties: { ...otherProps },
    dependencies: { accountAdmin },
    config,
  }) =>
    pipe([
      () => otherProps,
      when(
        () => accountAdmin,
        defaultsDeep({ AdministratorId: getField(accountAdmin, "Id") })
      ),
    ])(),
});
