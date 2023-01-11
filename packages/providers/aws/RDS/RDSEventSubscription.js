const assert = require("assert");
const { pipe, tap, get, pick, eq } = require("rubico");
const { defaultsDeep } = require("rubico/x");

const { getField } = require("@grucloud/core/ProviderCommon");
const { buildTags } = require("../AwsCommon");
const { createAwsResource } = require("../AwsClient");

const { Tagger } = require("./RDSCommon");

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

const decorate = ({ endpoint }) =>
  pipe([
    tap((params) => {
      assert(endpoint);
    }),
  ]);

const buildSourceDependenciesId =
  ({ SourceType }) =>
  ({ lives, config }) =>
    pipe([
      switchCase([
        eq(get("SourceType"), SourceType),
        get("SourceIds"),
        () => undefined,
      ]),
    ]);

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/RDS.html
exports.RDSEventSubscription = ({ compare }) => ({
  type: "EventSubscription",
  package: "rds",
  client: "RDS",
  ignoreErrorCodes: ["SubscriptionNotFoundFault"],
  propertiesDefault: { Enabled: true },
  omitProperties: [
    "CustomerAwsId",
    "CustSubscriptionId",
    "SnsTopicArn",
    "Status",
    "SubscriptionCreationTime",
    "SourceIdsList",
    "EventSubscriptionArn",
  ],
  inferName: () => get("SubscriptionName"),
  // compare: compare({
  //   filterTarget: () => pipe([omit(["compare"])]),
  // }),
  dependencies: {
    snsTopic: {
      type: "Topic",
      group: "SNS",
      dependencyId: ({ lives, config }) => pipe([get("SnsTopicArn")]),
    },
    dbClusters: {
      type: "DBCluster",
      group: "RDS",
      list: true,
      dependencyIds: buildSourceDependenciesId({ SourceType: "db-cluster" }),
    },
    dbInstances: {
      type: "DBInstance",
      group: "RDS",
      list: true,
      dependencyIds: buildSourceDependenciesId({ SourceType: "db-instance" }),
    },
    dbParameterGroups: {
      type: "DBClusterParameterGroup",
      group: "RDS",
      list: true,
      dependencyIds: buildSourceDependenciesId({
        SourceType: "db-parameter-group",
      }),
    },
    // TODO db-security-group | db-snapshot | db-cluster-snapshot
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/RDS.html#getEventSubscription-property
  getById: {
    method: "describeEventSubscriptions",
    getField: "EventSubscriptionsList",
    pickId,
    decorate,
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/RDS.html#describeEventSubscriptions-property
  getList: {
    method: "describeEventSubscriptions",
    getParam: "EventSubscriptionsList",
    decorate,
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/RDS.html#createEventSubscription-property
  create: {
    method: "createEventSubscription",
    pickCreated: ({ payload }) => pipe([() => payload]),
    isInstanceUp: pipe([eq(get("Status"), "active")]),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/RDS.html#modifyEventSubscription-property
  update: {
    method: "modifyEventSubscription",
    filterParams: ({ payload, diff, live }) => pipe([() => payload])(),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/RDS.html#deleteEventSubscription-property
  destroy: {
    method: "deleteEventSubscription",
    pickId,
  },
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
      tap((params) => {
        assert(snsTopic);
      }),
      () => otherProps,
      defaultsDeep({
        SnsTopicArn: getField(snsTopic, "Attributes.TopicArn"),
        Tags: buildTags({ name, config, namespace, UserTags: Tags }),
      }),
    ])(),
});
