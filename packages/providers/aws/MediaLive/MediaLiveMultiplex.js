const assert = require("assert");
const { pipe, tap, get, pick, map, eq, assign } = require("rubico");
const { defaultsDeep } = require("rubico/x");

const { getByNameCore, omitIfEmpty } = require("@grucloud/core/Common");
const { buildTagsObject } = require("@grucloud/core/Common");

const { Tagger } = require("./MediaLiveCommon");
const { replaceAccountAndRegion } = require("../AwsCommon");

const buildArn = () =>
  pipe([
    get("Arn"),
    tap((arn) => {
      assert(arn);
    }),
  ]);

const pickId = pipe([
  tap(({ MultiplexId }) => {
    assert(MultiplexId);
  }),
  pick(["MultiplexId"]),
]);

const toMultiplexId = ({ Id, ...other }) => ({ MultiplexId: Id, ...other });

const decorate = ({ endpoint, config }) =>
  pipe([
    tap((params) => {
      assert(endpoint);
    }),
    toMultiplexId,
    ({ SecurityGroups, ...other }) => ({
      MultiplexSecurityGroups: SecurityGroups,
      ...other,
    }),
    omitIfEmpty([
      "MultiplexDevices",
      "MultiplexPartnerIds",
      "MediaConnectFlows",
      "Sources",
    ]),
  ]);

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/MediaLive.html
exports.MediaLiveMultiplex = () => ({
  type: "Multiplex",
  package: "medialive",
  client: "MediaLive",
  propertiesDefault: {},
  omitProperties: [
    "RoleArn",
    "MultiplexId",
    "Arn",
    "State",
    "Vpc",
    "PipelinesRunningCount",
    "PipelineDetails",
    "Destinations",
    "AttachedChannels",
    "MultiplexSecurityGroups",
    "ProgramCount",
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
      tap((params) => {
        assert(true);
      }),
      get("MultiplexId"),
      tap((id) => {
        assert(id);
      }),
    ]),
  ignoreErrorCodes: ["NotFoundException"],
  dependencies: {},
  filterLive: ({ lives, providerConfig }) =>
    pipe([
      assign({
        AvailabilityZones: pipe([
          get("AvailabilityZones"),
          map(replaceAccountAndRegion({ lives, providerConfig })),
        ]),
      }),
    ]),
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/MediaLive.html#describeMultiplex-property
  getById: {
    method: "describeMultiplex",
    pickId,
    decorate,
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/MediaLive.html#listMultiplexes-property
  getList: {
    method: "listMultiplexes",
    getParam: "Multiplexes",
    decorate: ({ getById }) => pipe([toMultiplexId, getById]),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/MediaLive.html#createMultiplex-property
  create: {
    method: "createMultiplex",
    pickCreated: ({ payload }) => pipe([get("Multiplex"), toMultiplexId]),
    isInstanceUp: pipe([eq(get("State"), "IDLE")]),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/MediaLive.html#updateMultiplex-property
  update: {
    method: "updateMultiplex",
    filterParams: ({ payload, diff, live }) =>
      pipe([() => payload, defaultsDeep(pickId(live))])(),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/MediaLive.html#deleteMultiplex-property
  destroy: {
    method: "deleteMultiplex",
    pickId,
    isInstanceDown: pipe([eq(get("State"), "DELETED")]),
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
