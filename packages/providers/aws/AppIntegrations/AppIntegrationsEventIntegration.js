const assert = require("assert");
const { pipe, tap, get, pick } = require("rubico");
const { defaultsDeep, when } = require("rubico/x");

const { getByNameCore } = require("@grucloud/core/Common");
const { getField } = require("@grucloud/core/ProviderCommon");
const { buildTagsObject } = require("@grucloud/core/Common");

const { Tagger } = require("./AppIntegrationsCommon");

const buildArn = () =>
  pipe([
    get("EventIntegrationArn"),
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

const decorate = ({ endpoint, config }) =>
  pipe([
    tap((params) => {
      assert(endpoint);
    }),
  ]);

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/AppIntegrations.html
exports.AppIntegrationsEventIntegration = () => ({
  type: "EventIntegration",
  package: "appintegrations",
  client: "AppIntegrations",
  propertiesDefault: {},
  omitProperties: ["EventIntegrationArn", "EventBridgeBus"],
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
      tap((name) => {
        assert(name);
      }),
    ]),
  findId: () =>
    pipe([
      get("EventIntegrationArn"),
      tap((id) => {
        assert(id);
      }),
    ]),
  ignoreErrorCodes: ["ResourceNotFoundException"],
  dependencies: {
    eventBus: {
      type: "EventBus",
      group: "CloudWatchEvents",
      excludeDefaultDependencies: true,
      dependencyId: ({ lives, config }) => get("EventBridgeBus"),
    },
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/AppIntegrations.html#getEventIntegration-property
  getById: {
    method: "getEventIntegration",
    pickId,
    decorate,
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/AppIntegrations.html#listEventIntegrations-property
  getList: {
    method: "listEventIntegrations",
    getParam: "EventIntegrations",
    decorate: ({ getById }) => pipe([getById]),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/AppIntegrations.html#createEventIntegration-property
  create: {
    method: "createEventIntegration",
    pickCreated: ({ payload }) => pipe([() => payload]),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/AppIntegrations.html#updateEventIntegration-property
  update: {
    method: "updateEventIntegration",
    filterParams: ({ payload, diff, live }) =>
      pipe([() => payload, defaultsDeep(pickId(live))])(),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/AppIntegrations.html#deleteEventIntegration-property
  destroy: {
    method: "deleteEventIntegration",
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
    dependencies: { eventBus },
    config,
  }) =>
    pipe([
      () => otherProps,
      defaultsDeep({
        Tags: buildTagsObject({ name, config, namespace, userTags: Tags }),
      }),
      when(
        () => eventBus,
        defaultsDeep({
          EventBridgeBus: getField(eventBus, "Arn"),
        })
      ),
    ])(),
});
