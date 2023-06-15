const assert = require("assert");
const { pipe, tap, get, pick, eq, assign } = require("rubico");
const { defaultsDeep } = require("rubico/x");

const { getByNameCore } = require("@grucloud/core/Common");
const { buildTags } = require("../AwsCommon");

const { Tagger } = require("./CloudWatchEventCommon");

const isDefault = () => eq(get("Name"), "default");

const buildArn = () =>
  pipe([
    get("Arn"),
    tap((arn) => {
      assert(arn);
    }),
  ]);

const pickId = pipe([
  tap(({ Name }) => {
    assert(Name);
  }),
  pick(["Name"]),
]);

const assignArn = ({ config }) =>
  pipe([
    assign({
      Arn: pipe([
        tap(({ Name }) => {
          assert(Name);
        }),
        ({ Name }) =>
          `arn:${config.partition}:events:${
            config.region
          }:${config.accountId()}:event-bus/${Name}`,
      ]),
    }),
  ]);

const assignTags = ({ endpoint }) =>
  pipe([
    assign({
      Tags: pipe([
        ({ Arn }) => ({ ResourceARN: Arn }),
        // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/CloudWatchEvents.html#listTagsForResource-property
        endpoint().listTagsForResource,
        get("Tags"),
      ]),
    }),
  ]);

const decorate = ({ endpoint, config }) =>
  pipe([
    tap((params) => {
      assert(endpoint);
    }),
    assignArn({ config }),
    assignTags({ endpoint }),
  ]);

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/CloudWatchEvents.html
exports.CloudWatchEventBus = () => ({
  type: "EventBus",
  package: "cloudwatch-events",
  client: "CloudWatchEvents",
  inferName: () => get("Name", "default"),
  findName: () => get("Name", "default"),
  findId: () =>
    pipe([
      get("Arn"),
      tap((id) => {
        assert(id);
      }),
    ]),
  ignoreErrorCodes: ["ResourceNotFoundException"],
  omitProperties: ["Arn"],
  filterLive: () => pipe([pick(["Name"])]),
  cannotBeDeleted: isDefault,
  managedByOther: isDefault,
  isDefault,
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/CloudWatchEvents.html#getEventBus-property
  getById: {
    method: "describeEventBus",
    pickId,
    decorate,
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/CloudWatchEvents.html#listEventBuss-property
  getList: {
    method: "listEventBuses",
    getParam: "EventBuses",
    decorate,
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/CloudWatchEvents.html#createEventBus-property
  create: {
    method: "createEventBus",
    pickCreated: ({ payload }) => pipe([() => payload]),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/CloudWatchEvents.html#updateEventBus-property
  // TODO
  // update: {
  //   method: "updateEventBus",
  //   filterParams: ({ payload, diff, live }) =>
  //     pipe([() => payload, defaultsDeep(pickId(live))])(),
  // },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/CloudWatchEvents.html#deleteEventBus-property
  destroy: {
    method: "deleteEventBus",
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
    properties: { Tags, ...otherProp },
    dependencies: {},
    config,
  }) =>
    pipe([
      () => otherProp,
      defaultsDeep({
        Name: name,
        Tags: buildTags({ config, namespace, name, UserTags: Tags }),
      }),
    ])(),
});
