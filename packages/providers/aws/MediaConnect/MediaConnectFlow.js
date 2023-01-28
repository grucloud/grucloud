const assert = require("assert");
const {
  pipe,
  tap,
  get,
  pick,
  eq,
  assign,
  map,
  and,
  or,
  not,
  filter,
  fork,
} = require("rubico");
const {
  defaultsDeep,
  first,
  pluck,
  callProp,
  when,
  isEmpty,
  unless,
  identity,
} = require("rubico/x");

const { getByNameCore, omitIfEmpty } = require("@grucloud/core/Common");
const { getField } = require("@grucloud/core/ProviderCommon");
const { buildTagsObject } = require("@grucloud/core/Common");
const { replaceWithName } = require("@grucloud/core/Common");

const { Tagger, assignTags } = require("./MediaConnectCommon");
const { replaceAccountAndRegion } = require("../AwsCommon");

const buildArn = () =>
  pipe([
    get("FlowArn"),
    tap((arn) => {
      assert(arn);
    }),
  ]);

const pickId = pipe([
  tap(({ FlowArn }) => {
    assert(FlowArn);
  }),
  pick(["FlowArn"]),
]);

const decorate = ({ endpoint, config }) =>
  pipe([
    tap((params) => {
      assert(endpoint);
    }),
    assignTags({ buildArn: buildArn(config), endpoint }),
    omitIfEmpty(["Entitlements", "MediaStreams"]),
    assign({
      Source: pipe([
        get("Source"),
        ({ Transport, ...other }) => ({ ...other, ...Transport }),
      ]),
    }),
  ]);

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/MediaConnect.html
exports.MediaConnectFlow = () => ({
  type: "Flow",
  package: "mediaconnect",
  client: "MediaConnect",
  propertiesDefault: {},
  omitProperties: [
    "FlowArn",
    "Status",
    "EgressIp",
    "Source.IngestIp",
    "Source.SourceArn",
    "Outputs",
    //"Outputs[].MediaLiveInputArn",
    //"Outputs[].OutputArn",
    "Sources",
  ],
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
      get("FlowArn"),
      tap((id) => {
        assert(id);
      }),
    ]),
  ignoreErrorCodes: ["NotFoundException"],
  filterLive: ({ lives, providerConfig }) =>
    pipe([
      assign({
        AvailabilityZone: pipe([
          get("AvailabilityZone"),
          replaceAccountAndRegion({ lives, providerConfig }),
        ]),
      }),
    ]),
  dependencies: {},
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/MediaConnect.html#getFlow-property
  getById: {
    method: "describeFlow",
    getField: "Flow",
    pickId,
    decorate,
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/MediaConnect.html#listFlows-property
  getList: {
    method: "listFlows",
    getParam: "Flows",
    decorate: ({ getById }) => pipe([getById]),
  },

  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/MediaConnect.html#createFlow-property
  create: {
    method: "createFlow",
    pickCreated: ({ payload }) => pipe([get("Flow")]),
    // Status ACTIVE
    postCreate:
      ({ endpoint, payload, created }) =>
      (live) =>
        pipe([
          () => live,
          tap(({ FlowArn }) => {
            assert(FlowArn);
          }),
          ({ FlowArn }) => ({ ResourceArn: FlowArn, Tags: payload.Tags }),
          endpoint().tagResource,
        ])(),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/MediaConnect.html#updateFlow-property
  update: {
    method: "updateFlow",
    filterParams: ({ payload, diff, live }) =>
      pipe([() => payload, defaultsDeep(pickId(live))])(),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/MediaConnect.html#deleteFlow-property
  destroy: {
    method: "deleteFlow",
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
        Tags: buildTagsObject({ name, config, namespace, userTags: Tags }),
      }),
    ])(),
});
