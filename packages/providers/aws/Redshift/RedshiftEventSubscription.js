const assert = require("assert");
const { pipe, tap, get, pick, assign } = require("rubico");
const { defaultsDeep, isIn } = require("rubico/x");

const { getByNameCore } = require("@grucloud/core/Common");
const { getField } = require("@grucloud/core/ProviderCommon");
const { buildTags } = require("../AwsCommon");

const { Tagger } = require("./RedshiftCommon");

// TODO CustomerAwsId managedByOther

const assignArn = ({ config }) =>
  pipe([
    tap((params) => {
      assert(config);
    }),
    assign({
      Arn: pipe([
        tap(({ SubscriptionName }) => {
          assert(SubscriptionName);
        }),
        ({ SubscriptionName }) =>
          `arn:aws:redshift:${
            config.region
          }:${config.accountId()}:eventsubscription:${SubscriptionName}`,
      ]),
    }),
  ]);

const buildArn = () =>
  pipe([
    get("Arn"),
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

const toServiceIdentifier = pipe([
  tap(({ CustSubscriptionId }) => {
    assert(CustSubscriptionId);
  }),
  ({ CustSubscriptionId, ...other }) => ({
    SubscriptionName: CustSubscriptionId,
    ...other,
  }),
]);

const decorate = ({ endpoint, config }) =>
  pipe([
    tap((params) => {
      assert(endpoint);
    }),
    toServiceIdentifier,
    assignArn({ config }),
  ]);

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Redshift.html
exports.RedshiftEventSubscription = () => ({
  type: "EventSubscription",
  package: "redshift",
  client: "Redshift",
  propertiesDefault: {},
  omitProperties: [
    "Arn",
    "Status",
    "CustomerAwsId",
    "SubscriptionCreationTime",
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
  ignoreErrorCodes: ["SubscriptionNotFoundFault"],
  dependencies: {
    cluster: {
      type: "Cluster",
      group: "Redshift",
      pathId: "SourceIds",
      list: true,
      dependencyIds: ({ lives, config }) => pipe([get("SourceIds")]),
    },
    snsTopic: {
      type: "Topic",
      group: "SNS",
      pathId: "SnsTopicArn",
      required: true,
      dependencyId: ({ lives, config }) =>
        pipe([
          get("SnsTopicArn"),
          tap((SnsTopicArn) => {
            assert(SnsTopicArn);
          }),
        ]),
    },
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Redshift.html#describeEventSubscriptions-property
  getById: {
    method: "describeEventSubscriptions",
    getField: "EventSubscriptionsList",
    pickId,
    decorate,
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Redshift.html#describeEventSubscriptions-property
  getList: {
    method: "describeEventSubscriptions",
    getParam: "EventSubscriptionsList",
    decorate,
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Redshift.html#createEventSubscription-property
  create: {
    method: "createEventSubscription",
    pickCreated: ({ payload }) => pipe([() => payload]),
    isInstanceUp: pipe([get("Status"), isIn(["active"])]),
    isInstanceError: pipe([
      get("Status"),
      isIn(["no-permission", "topic-not-exist"]),
    ]),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Redshift.html#updateEventSubscription-property
  update: {
    method: "updateEventSubscription",
    filterParams: ({ payload, diff, live }) => pipe([() => payload])(),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Redshift.html#deleteEventSubscription-property
  destroy: {
    method: "deleteEventSubscription",
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
    dependencies: { snsTopic },
    config,
  }) =>
    pipe([
      tap(() => {
        assert(snsTopic);
      }),
      () => otherProps,
      defaultsDeep({
        Tags: buildTags({ name, config, namespace, UserTags: Tags }),
        SnsTopicArn: getField(snsTopic, "Attributes.TopicArn"),
      }),
    ])(),
});
