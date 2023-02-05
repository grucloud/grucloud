const assert = require("assert");
const { pipe, tap, get, pick } = require("rubico");
const { defaultsDeep } = require("rubico/x");

const { getByNameCore } = require("@grucloud/core/Common");
const { buildTagsObject } = require("@grucloud/core/Common");

const { Tagger, ignoreErrorCodes } = require("./SchemasCommon");
const { getField } = require("@grucloud/core/ProviderCommon");

const buildArn = () =>
  pipe([
    get("DiscovererArn"),
    tap((arn) => {
      assert(arn);
    }),
  ]);

const pickId = pipe([
  tap(({ DiscovererId }) => {
    assert(DiscovererId);
  }),
  pick(["DiscovererId"]),
]);

const decorate = ({ endpoint, config }) =>
  pipe([
    tap((params) => {
      assert(endpoint);
    }),
  ]);

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Schema.html
exports.SchemasDiscoverer = () => ({
  type: "Discoverer",
  package: "schemas",
  client: "Schemas",
  propertiesDefault: {},
  omitProperties: ["DiscovererArn", "State", "DiscovererId", "SourceArn"],
  inferName:
    ({ dependenciesSpec: { eventBus } }) =>
    ({}) =>
      pipe([
        tap((params) => {
          assert(eventBus);
        }),
        () => `${eventBus}`,
      ])(),
  findName:
    ({ lives, config }) =>
    ({ SourceArn }) =>
      pipe([
        tap((params) => {
          assert(SourceArn);
        }),
        () => SourceArn,
        lives.getById({
          type: "EventBus",
          group: "CloudWatchEvents",
          providerName: config.providerName,
        }),
        get("name"),
        tap((name) => {
          assert(name);
        }),
      ])(),
  findId: () =>
    pipe([
      get("DiscovererArn"),
      tap((id) => {
        assert(id);
      }),
    ]),
  ignoreErrorCodes,
  dependencies: {
    eventBus: {
      type: "EventBus",
      group: "CloudWatchEvents",
      parent: true,
      dependencyId: ({ lives, config }) =>
        pipe([
          get("SourceArn"),
          tap((SourceArn) => {
            assert(SourceArn);
          }),
        ]),
    },
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Schema.html#describeDiscoverer-property
  getById: {
    method: "describeDiscoverer",
    pickId,
    decorate,
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Schemas.html#listDiscoverers-property
  getList: {
    method: "listDiscoverers",
    getParam: "Discoverers",
    decorate: ({ getById }) => pipe([getById]),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Schema.html#createDiscoverer-property
  create: {
    method: "createDiscoverer",
    pickCreated: ({ payload }) => pipe([() => payload]),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Schema.html#updateSchema-property
  update: {
    method: "updateDiscoverer",
    filterParams: ({ payload, diff, live }) => pipe([() => payload])(),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Schema.html#deleteDiscoverer-property
  destroy: {
    method: "deleteDiscoverer",
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
      tap((params) => {
        assert(eventBus);
      }),
      () => otherProps,
      defaultsDeep({
        Tags: buildTagsObject({ name, config, namespace, userTags: Tags }),
        SourceArn: getField(eventBus, "Arn"),
      }),
    ])(),
});
