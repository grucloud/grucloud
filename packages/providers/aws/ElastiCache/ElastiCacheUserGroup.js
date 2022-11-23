const assert = require("assert");
const { pipe, tap, get, eq, pick, assign, map } = require("rubico");
const { defaultsDeep, identity } = require("rubico/x");
const { getByNameCore } = require("@grucloud/core/Common");

const { buildTags } = require("../AwsCommon");

const {
  Tagger,
  tagResource,
  untagResource,
  assignTags,
} = require("./ElastiCacheCommon");

const pickId = pipe([pick(["UserGroupId"])]);
const buildArn = () => pipe([get("ARN")]);

const decorate = ({ endpoint }) =>
  pipe([assignTags({ endpoint, buildArn: buildArn() })]);

exports.ElastiCacheUserGroup = () => ({
  type: "UserGroup",
  package: "elasticache",
  client: "ElastiCache",
  ignoreErrorCodes: ["UserGroupNotFound", "UserGroupNotFoundFault"],
  omitProperties: [
    "ARN",
    "Status",
    "MinimumEngineVersion",
    "ReplicationGroups",
  ],
  inferName: () => get("UserGroupId"),
  findName: () => pipe([get("UserGroupId")]),
  findId: () => pipe([get("UserGroupId")]),
  dependencies: {
    users: {
      type: "User",
      group: "ElastiCache",
      list: true,
      excludeDefaultDependencies: true,
      dependencyIds: () => pipe([get(["UserIds"])]),
    },
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/ElastiCache.html#describeUserGroups-property
  getById: {
    method: "describeUserGroups",
    getField: "UserGroups",
    pickId,
    decorate,
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/ElastiCache.html#describeUserGroups-property
  getList: {
    method: "describeUserGroups",
    getParam: "UserGroups",
    decorate,
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/ElastiCache.html#createUserGroup-property
  create: {
    method: "createUserGroup",
    pickCreated: ({ payload }) => pipe([identity]),
    isInstanceUp: pipe([eq(get("Status"), "active")]),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/ElastiCache.html#modifyUserGroup-property
  update: {
    method: "modifyUserGroup",
    // TODO update UserIdsToAdd and UserIdsToRemove
    filterParams: ({ payload, diff }) => pipe([() => payload])(),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/ElastiCache.html#deleteUserGroup-property
  destroy: {
    method: "deleteUserGroup",
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
