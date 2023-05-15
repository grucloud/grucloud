const assert = require("assert");
const { pipe, tap, get, pick, assign } = require("rubico");
const { defaultsDeep, isIn, callProp, last } = require("rubico/x");

const { getByNameCore } = require("@grucloud/core/Common");
const { getField } = require("@grucloud/core/ProviderCommon");
const { buildTags } = require("../AwsCommon");

const { Tagger, assignTags } = require("./DocDBCommon");

const buildArn = () =>
  pipe([
    get("EventSubscriptionArn"),
    tap((EventSubscriptionArn) => {
      assert(EventSubscriptionArn);
    }),
  ]);

const pickId = pipe([
  tap(({ SubscriptionName }) => {
    assert(SubscriptionName);
  }),
  pick(["SubscriptionName"]),
]);

const assignSubscriptionName = assign({
  SubscriptionName: pipe([
    get("EventSubscriptionArn"),
    tap((EventSubscriptionArn) => {
      assert(EventSubscriptionArn);
    }),
    callProp("split", ":es:"),
    last,
  ]),
});

const decorate = ({ endpoint, config }) =>
  pipe([
    tap((params) => {
      assert(endpoint);
    }),
    assignTags({ buildArn: buildArn(config), endpoint }),
    assignSubscriptionName,
    ({ EventCategoriesList, ...other }) => ({
      EventCategories: EventCategoriesList,
      ...other,
    }),
  ]);

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/DocDB.html
exports.DocDBEventSubscription = () => ({
  type: "EventSubscription",
  package: "docdb",
  client: "DocDB",
  propertiesDefault: {},
  omitProperties: [
    "CustomerAwsId",
    "CustSubscriptionId",
    "Status",
    "SubscriptionCreationTime",
    "EventSubscriptionArn",
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
      get("EventSubscriptionArn"),
      tap((id) => {
        assert(id);
      }),
    ]),
  ignoreErrorCodes: ["SubscriptionNotFoundFault"],
  dependencies: {
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
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/DocDB.html#describeEventSubscriptions-property
  getById: {
    method: "describeEventSubscriptions",
    getField: "EventSubscriptionsList",
    pickId,
    decorate,
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/DocDB.html#describeEventSubscriptions-property
  getList: {
    method: "describeEventSubscriptions",
    getParam: "EventSubscriptionsList",
    decorate,
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/DocDB.html#createEventSubscription-property
  create: {
    method: "createEventSubscription",
    pickCreated: ({ payload }) =>
      pipe([get("EventSubscription"), assignSubscriptionName]),
    isInstanceUp: pipe([get("Status"), isIn(["active"])]),
    isInstanceError: pipe([
      get("Status"),
      isIn(["no-permission", "topic-not-exist"]),
    ]),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/DocDB.html#modifyEventSubscription-property
  update: {
    method: "modifyEventSubscription",
    filterParams: ({ payload, diff, live }) =>
      pipe([() => payload, defaultsDeep(pickId(live))])(),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/DocDB.html#deleteEventSubscription-property
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
