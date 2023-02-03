const assert = require("assert");
const { pipe, tap, get, eq, pick, assign } = require("rubico");
const { defaultsDeep } = require("rubico/x");

const { getField } = require("@grucloud/core/ProviderCommon");
const { buildTagsObject } = require("@grucloud/core/Common");

const { getByNameCore } = require("@grucloud/core/Common");
const { ignoreErrorCodes } = require("./Macie2Common");

const {
  Tagger,
  //assignTags,
} = require("./Macie2Common");

const buildArn = () =>
  pipe([
    get("arn"),
    tap((arn) => {
      assert(arn);
    }),
  ]);

const pickId = pipe([
  tap(({ accountId }) => {
    assert(accountId);
  }),
  ({ accountId }) => ({ id: accountId }),
]);

const decorate = ({ endpoint, live }) =>
  pipe([
    tap((params) => {
      assert(endpoint);
    }),
  ]);

const ignoreErrorMessages = [];

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Macie2.html
exports.Macie2Member = () => ({
  type: "Member",
  package: "macie2",
  client: "Macie2",
  propertiesDefault: {},
  omitProperties: [
    "accountId",
    "administratorAccountId",
    "arn",
    "invitedAt",
    "masterAccountId",
    "relationshipStatus",
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
      get("accountId"),
      tap((id) => {
        assert(id);
      }),
      lives.getById({
        type: "Account",
        group: "Organisations",
        providerName: config.providerName,
      }),
      get("name"),
      tap((name) => {
        assert(name);
      }),
    ]),
  findId: () =>
    pipe([
      get("arn"),
      tap((id) => {
        assert(id);
      }),
    ]),
  dependencies: {
    account: {
      type: "Account",
      group: "Organisations",
      parent: true,
      dependencyId: ({ lives, config }) =>
        pipe([
          get("accountId"),
          tap((accountId) => {
            assert(accountId);
          }),
        ]),
    },
  },
  ignoreErrorCodes,
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Macie2.html#getMembers-property
  getById: {
    method: "getMember",
    pickId,
    decorate,
    ignoreErrorMessages,
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Macie2.html#listMembers-property
  getList: {
    method: "listMembers",
    getParam: "members",
    decorate: ({ getById }) => pipe([getById]),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Macie2.html#createMember-property
  create: {
    filterPayload: ({ tags, ...account }) =>
      pipe([() => ({ account, tags })])(),
    method: "createMember",
    pickCreated: ({ payload }) => pipe([() => payload]),
    shouldRetryOnExceptionMessages: [],
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Macie2.html#deleteMember-property
  destroy: {
    method: "deleteMember",
    pickId,
    isInstanceDown: pipe([eq(get("relationshipStatus"), "Removed")]),
    ignoreErrorMessages,
  },
  getByName: getByNameCore,
  tagger: ({ config }) =>
    Tagger({
      buildArn: buildArn({ config }),
    }),
  configDefault: ({
    name,
    namespace,
    properties: { tags, ...otherProps },
    dependencies: { account },
    config,
  }) =>
    pipe([
      tap((params) => {
        assert(account);
      }),
      () => otherProps,
      defaultsDeep({
        accountId: getField(account, "Id"),
        email: getField(account, "Email"),
        tags: buildTagsObject({ name, config, namespace, userTags: Tags }),
      }),
    ])(),
});
