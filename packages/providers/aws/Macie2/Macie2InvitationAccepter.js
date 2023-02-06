const assert = require("assert");
const { pipe, tap, get, eq } = require("rubico");
const { defaultsDeep, identity, unless, isEmpty, find } = require("rubico/x");

const { getByNameCore } = require("@grucloud/core/Common");

const { ignoreErrorCodes } = require("./Macie2Common");
const { getField } = require("@grucloud/core/ProviderCommon");

const pickId = pipe([() => ({})]);

const toAdministratorAccountId = ({ accountId, ...other }) => ({
  administratorAccountId: accountId,
  ...other,
});

const decorate = ({ endpoint, config }) =>
  pipe([
    tap((params) => {
      assert(endpoint);
    }),
    toAdministratorAccountId,
  ]);

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Macie2.html
exports.Macie2InvitationAccepter = () => ({
  type: "InvitationAccepter",
  package: "macie2",
  client: "Macie2",
  propertiesDefault: {},
  omitProperties: ["administratorAccountId", "invitedAt"],
  inferName:
    ({ dependenciesSpec: { administratorAccount } }) =>
    () =>
      pipe([
        tap((params) => {
          assert(administratorAccount);
        }),
        () => administratorAccount,
      ])(),
  findName:
    ({ lives, config }) =>
    ({ administratorAccountId }) =>
      pipe([
        () => administratorAccountId,
        get("administratorAccountId"),
        tap((id) => {
          assert(id);
        }),
        lives.getById({
          type: "Account",
          group: "Organisations",
        }),
        get("name", administratorAccountId),
      ]),
  findId: () =>
    pipe([
      get("administratorAccountId"),
      tap((id) => {
        assert(id);
      }),
    ]),
  ignoreErrorCodes,
  dependencies: {
    account: {
      type: "Account",
      group: "Macie2",
      dependencyId: ({ lives, config }) => pipe([() => "default"]),
    },
    administratorAccount: {
      type: "Account",
      group: "Organisations",
      parent: true,
      dependencyId: ({ lives, config }) =>
        pipe([
          get("administratorAccountId"),
          tap((id) => {
            assert(id);
          }),
        ]),
    },
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Macie2.html#listInvitations-property
  getById: {
    method: "listInvitations",
    pickId,
    decorate: ({ live, config }) =>
      pipe([
        tap((params) => {
          assert(live.administratorAccountId);
        }),
        get("invitations"),
        find(eq(get("accountId"), live.administratorAccountId)),
        unless(isEmpty, decorate({ config })),
      ]),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Macie2.html#listInvitations-property
  getList: {
    method: "listInvitations",
    getParam: "invitations",
    decorate,
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Macie2.html#createInvitationAccepter-property
  create: {
    method: "acceptInvitation",
    pickCreated: ({ payload }) => pipe([identity]),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Macie2.html#disassociateFromAdministratorAccount-property
  destroy: {
    method: "disassociateFromAdministratorAccount",
    pickId,
  },
  getByName: getByNameCore,
  configDefault: ({
    name,
    namespace,
    properties: { ...otherProps },
    dependencies: { administratorAccount },
    config,
  }) =>
    pipe([
      () => otherProps,
      defaultsDeep({
        administratorAccountId: getField(administratorAccount, "Id"),
      }),
    ])(),
});
