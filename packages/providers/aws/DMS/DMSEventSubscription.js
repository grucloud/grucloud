const assert = require("assert");
const { pipe, tap, get, pick, eq, assign } = require("rubico");
const { defaultsDeep, when } = require("rubico/x");

const { getField } = require("@grucloud/core/ProviderCommon");
const { buildTags } = require("../AwsCommon");

const { Tagger, listTagsForResource } = require("./DMSCommon");

const buildArn = () =>
  pipe([
    get("EventSubscriptionArn"),
    tap((arn) => {
      assert(arn);
    }),
  ]);

const pickId = pipe([
  tap(({ SubscriptionName }) => {
    assert(SubscriptionName);
  }),
  pick(["SubscriptionName"]),
]);

const decorate = ({ endpoint, config }) =>
  pipe([
    tap((params) => {
      assert(endpoint);
    }),
    ({ CustSubscriptionId, ...other }) => ({
      SubscriptionName: CustSubscriptionId,
      ...other,
    }),
    listTagsForResource({ endpoint, buildArn: buildArn() }),
  ]);

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/DMS.html
exports.DMSEventSubscription = ({ compare }) => ({
  type: "EventSubscription",
  package: "database-migration-service",
  client: "DatabaseMigrationService",
  propertiesDefault: {},
  omitProperties: [
    "EventSubscriptionArn",
    "SnsTopicArn",
    "CustomerAwsId",
    "CustSubscriptionId",
    "SubscriptionCreationTime",
    "Status",
  ],
  inferName: () =>
    pipe([
      get("SubscriptionName"),
      tap((Name) => {
        assert(Name);
      }),
    ]),
  findName: () =>
    pipe([
      get("SubscriptionName"),
      tap((name) => {
        assert(name);
      }),
    ]),
  findId: () =>
    pipe([
      get("SubscriptionName"),
      tap((id) => {
        assert(id);
      }),
    ]),
  dependencies: {
    snsTopic: {
      type: "Topic",
      group: "SNS",
      dependencyId: ({ lives, config }) => pipe([get("SnsTopicArn")]),
    },
  },
  ignoreErrorCodes: ["ResourceNotFoundFault"],
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/DMS.html#getEventSubscription-property
  getById: {
    method: "describeEventSubscriptions",
    getField: "EventSubscriptionsList",
    pickId,
    decorate,
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/DMS.html#listEventSubscriptions-property
  getList: {
    method: "describeEventSubscriptions",
    getParam: "EventSubscriptionsList",
    isInstanceUp: pipe([eq(get("Status"), "active")]),
    decorate,
  },

  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/DMS.html#createEventSubscription-property
  create: {
    method: "createEventSubscription",
    pickCreated: ({ payload }) =>
      pipe([
        get("EventSubscription"),
        ({ CustSubscriptionId, ...other }) => ({
          SubscriptionName: CustSubscriptionId,
          ...other,
        }),
      ]),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/DMS.html#modifyEventSubscription-property
  update: {
    method: "modifyEventSubscription",
    filterParams: ({ payload, diff, live }) =>
      pipe([() => payload, defaultsDeep(pickId(live))])(),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/DMS.html#deleteEventSubscription-property
  destroy: {
    method: "deleteEventSubscription",
    pickId,
  },
  getByName: ({ getById }) =>
    pipe([({ name }) => ({ SubscriptionName: name }), getById({})]),
  tagger: ({ config }) =>
    Tagger({
      buildArn: buildArn({ config }),
    }),
  configDefault: ({
    name,
    namespace,
    properties: { Tags, ...otherProps },
    dependencies: { snsTopic },
    config,
  }) =>
    pipe([
      () => otherProps,
      defaultsDeep({
        Tags: buildTags({ name, config, namespace, UserTags: Tags }),
      }),
      when(
        () => snsTopic,
        defaultsDeep({
          SnsTopicArn: getField(snsTopic, "Attributes.TopicArn"),
        })
      ),
    ])(),
});
