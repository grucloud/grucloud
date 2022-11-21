const assert = require("assert");
const { pipe, tap, get, pick } = require("rubico");
const { defaultsDeep } = require("rubico/x");
const { getByNameCore } = require("@grucloud/core/Common");

const { buildTags } = require("../AwsCommon");

const pickId = pipe([
  pick(["AccountId"]),
  tap(({ AccountId }) => {
    assert(AccountId);
  }),
]);

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Organizations.html
exports.OrganisationsAccount = ({}) => ({
  type: "Account",
  package: "organizations",
  client: "Organizations",
  ignoreErrorCodes: ["AccountNotFoundException"],
  managedByOther: () => () => true,
  cannotBeDeleted: () => () => true,
  omitProperties: ["Arn", "Id", "Status", "JoinedTimestamp", "JoinedMethod"],
  inferName: get("properties.Name"),
  findName: () => pipe([get("Name")]),
  findId: () => pipe([get("Id")]),
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Organizations.html#describeAccount-property
  getById: {
    method: "describeAccount",
    getField: "Account",
    pickId,
  },
  //https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Organizations.html#listAccounts-property
  getList: {
    method: "listAccounts",
    getParam: "Accounts",
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Organizations.html#createAccount-property
  create: {
    method: "createAccount",
    filterPayload: pipe([
      ({ Name, ...other }) => ({ AccountName: Name, ...other }),
    ]),
    pickCreated: ({ payload }) =>
      pipe([
        tap((params) => {
          assert(true);
        }),
        get("CreateAccountStatus"),
      ]),
    isInstanceUp: pipe([() => true]),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Organizations.html#closeAccount-property
  destroy: {
    method: "closeAccount",
    pickId,
    isInstanceDown: () => true,
  },
  getByName: getByNameCore,
  configDefault: ({
    name,
    namespace,
    properties: { Tags, ...otherProps },
    dependencies: {},
    config,
  }) =>
    pipe([
      () => otherProps,
      defaultsDeep({
        Tags: buildTags({
          name,
          config,
          namespace,
          UserTags: Tags,
        }),
      }),
    ])(),
});
