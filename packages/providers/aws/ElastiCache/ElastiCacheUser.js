const assert = require("assert");
const { pipe, tap, get, eq, pick } = require("rubico");
const { defaultsDeep, identity } = require("rubico/x");
const { getByNameCore } = require("@grucloud/core/Common");

const { buildTags } = require("../AwsCommon");

const { Tagger, assignTags } = require("./ElastiCacheCommon");

const pickId = pipe([pick(["UserId"])]);
const buildArn = () => pipe([get("ARN")]);

const managedByOther = () => pipe([eq(get("UserName"), "default")]);

const decorate = ({ endpoint }) =>
  pipe([
    ({ Authentication, ...other }) => ({
      ...other,
      AuthenticationMode: Authentication,
    }),
    assignTags({ endpoint, buildArn: buildArn() }),
  ]);

exports.ElastiCacheUser = () => ({
  type: "User",
  package: "elasticache",
  client: "ElastiCache",
  inferName: get("properties.UserName"),
  findName: () => pipe([get("UserName")]),
  findId: () => pipe([get("UserId")]),
  managedByOther,
  cannotBeDeleted: managedByOther,
  ignoreErrorCodes: ["UserNotFound", "UserNotFoundFault"],
  omitProperties: [
    "ARN",
    "Status",
    "UserGroupIds",
    "AuthenticationMode.PasswordCount",
    "MinimumEngineVersion",
  ],
  environmentVariables: [
    {
      path: "Passwords",
      suffix: "ELASTICACHE_USER_PASSWORDS",
      array: true,
      rejectEnvironmentVariable: () =>
        pipe([eq(get("AuthenticationMode.Type"), "iam")]),
    },
  ],
  // compare: compare({
  //   filterAll: () => pipe([omit(["Authentication"])]),
  // }),
  filterLiveExtra: () =>
    pipe([
      when(
        eq(get("Authentication.Type"), "no-password"),
        omit(["Authentication"])
      ),
    ]),
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/ElastiCache.html#describeUsers-property
  getById: {
    method: "describeUsers",
    getField: "Users",
    pickId,
    decorate,
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/ElastiCache.html#describeUsers-property
  getList: {
    method: "describeUsers",
    getParam: "Users",
    decorate,
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/ElastiCache.html#createUser-property
  create: {
    method: "createUser",
    pickCreated: ({ payload }) => pipe([identity]),
    isInstanceUp: pipe([eq(get("Status"), "active")]),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/ElastiCache.html#updateUser-property
  update: {
    method: "modifyUser",
    //TODO
    filterParams: ({ payload }) => pipe([() => payload])(),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/ElastiCache.html#deleteUser-property
  destroy: {
    method: "deleteUser",
    pickId,
  },
  getByName: getByNameCore,
  tagger: ({ config }) =>
    Tagger({
      buildArn: buildArn({ config }),
    }),
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
