const assert = require("assert");
const { pipe, map, tap, get, pick } = require("rubico");
const { defaultsDeep, identity } = require("rubico/x");

const { getByNameCore } = require("@grucloud/core/Common");
const { buildTagsObject } = require("@grucloud/core/Common");

const { Tagger } = require("./CodeStarNotificationsCommon");

const pickId = pipe([
  tap(({ Arn }) => {
    assert(Arn);
  }),
  pick(["Arn"]),
]);

const buildArn = () =>
  pipe([
    get("Arn"),
    tap((arn) => {
      assert(arn);
    }),
  ]);

const decorate = ({ endpoint }) =>
  pipe([
    tap((params) => {
      assert(endpoint);
    }),
  ]);

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/CodeStarNotifications.html
exports.CodeStarNotificationsNotificationRule = ({}) => ({
  type: "NotificationRule",
  package: "codestar-notifications",
  client: "CodestarNotifications",
  inferName: () =>
    pipe([
      get("Name"),
      tap((Name) => {
        assert(Name);
      }),
    ]),
  findName: () =>
    pipe([
      get("Name"),
      tap((Name) => {
        assert(Name);
      }),
    ]),
  findId: () => pipe([get("Arn")]),
  getByName: getByNameCore,
  ignoreErrorCodes: ["ResourceNotFoundException"],
  omitProperties: [
    "Arn",
    "Id",
    "Targets[].TargetStatus",
    "CreatedBy",
    "CreatedTimestamp",
    "LastModifiedTimestamp",
  ],
  dependencies: {
    codeCommitRepository: {
      type: "Repository",
      group: "CodeCommmit",
      dependencyId: ({ lives, config }) => pipe([get("Resource")]),
    },
    snsTopicTargets: {
      type: "Topic",
      group: "Target",
      list: true,
      dependencyIds: ({ lives, config }) =>
        pipe([
          get("Targets"),
          filter(eq(get("TargetType"), "SNS")),
          pluck("TargetAddress"),
        ]),
    },
  },
  propertiesDefault: { Status: "ENABLED" },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/CodeStarNotifications.html#describeNotificationRule-property
  getById: {
    method: "describeNotificationRule",
    pickId,
    decorate,
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/CodeStarNotifications.html#listNotificationRules-property
  getList: {
    method: "listNotificationRules",
    getParam: "NotificationRules",
    decorate: ({ getById }) => pipe([getById]),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/CodeStarNotifications.html#createNotificationRule-property
  create: {
    method: "createNotificationRule",
    pickCreated: ({ payload }) => identity,
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/CodeStarNotifications.html#deleteNotificationRule-property
  destroy: { method: "deleteNotificationRule", pickId },
  tagger: ({ config }) =>
    Tagger({
      buildArn: buildArn({ config }),
    }),
  configDefault: ({
    name,
    namespace,
    properties: { tags, ...otherProps },
    dependencies: {},
    config,
  }) =>
    pipe([
      () => otherProps,
      defaultsDeep({
        Tags: buildTagsObject({
          name,
          config,
          namespace,
          userTags: tags,
        }),
      }),
    ])(),
});
