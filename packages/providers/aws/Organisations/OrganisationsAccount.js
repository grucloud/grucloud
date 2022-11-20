const assert = require("assert");
const { pipe, tap, get, pick } = require("rubico");
const { defaultsDeep } = require("rubico/x");
const { getByNameCore } = require("@grucloud/core/Common");

const { createAwsResource } = require("../AwsClient");
const { buildTags } = require("../AwsCommon");

const pickId = pipe([
  pick(["AccountId"]),
  tap(({ AccountId }) => {
    assert(AccountId);
  }),
]);

const model = ({ config }) => ({
  package: "organizations",
  client: "Organizations",
  ignoreErrorCodes: ["AccountNotFoundException"],
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
    isInstanceUp: pipe([
      tap((params) => {
        assert(true);
      }),
      () => true,
    ]),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Organizations.html#closeAccount-property
  destroy: {
    method: "closeAccount",
    pickId,
    isInstanceDown: () => true,
  },
});

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Organizations.html
exports.OrganisationsAccount = ({ spec, config }) =>
  createAwsResource({
    model: model({ config }),
    spec,
    config,
    managedByOther: () => () => true,
    cannotBeDeleted: () => () => true,
    findName: () => pipe([get("Name")]),
    findId: () => pipe([get("Id")]),
    getByName: getByNameCore,
    configDefault: ({
      name,
      namespace,
      properties: { Tags, ...otherProps },
      dependencies: {},
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
