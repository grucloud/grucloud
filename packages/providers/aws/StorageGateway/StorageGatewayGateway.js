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

const { getByNameCore } = require("@grucloud/core/Common");
const { getField } = require("@grucloud/core/ProviderCommon");
const { buildTags } = require("../AwsCommon");

const {
  Tagger,
  //assignTags,
} = require("./StorageGatewayCommon");

const buildArn = () =>
  pipe([
    get("GatewayARN"),
    tap((arn) => {
      assert(arn);
    }),
  ]);

const pickId = pipe([
  tap(({ GatewayARN }) => {
    assert(GatewayARN);
  }),
  pick(["GatewayARN"]),
]);

const decorate = ({ endpoint, config }) =>
  pipe([
    tap((params) => {
      assert(endpoint);
    }),
  ]);

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/StorageGateway.html
exports.StorageGatewayGateway = () => ({
  type: "Gateway",
  package: "storage-gateway",
  client: "StorageGateway",
  propertiesDefault: {},
  omitProperties: [
    "GatewayId",
    "GatewayARN",
    "Ec2InstanceId",
    "HostEnvironmentId",
    "LastSoftwareUpdate",
    "NextUpdateAvailabilityDate",
    "GatewayNetworkInterfaces",
  ],
  inferName: () =>
    pipe([
      get("GatewayName"),
      tap((Name) => {
        assert(Name);
      }),
    ]),
  findName: () =>
    pipe([
      get("GatewayName"),
      tap((name) => {
        assert(name);
      }),
    ]),
  findId: () =>
    pipe([
      get("GatewayARN"),
      tap((id) => {
        assert(id);
      }),
    ]),
  ignoreErrorCodes: ["InvalidGatewayRequestException"],
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/StorageGateway.html#describeGatewayInformation-property
  getById: {
    method: "describeGatewayInformation",
    pickId,
    decorate,
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/StorageGateway.html#listGateways-property
  getList: {
    method: "listGateways",
    getParam: "Gateways",
    decorate: ({ getById }) => pipe([getById]),
  },

  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/StorageGateway.html#activateGateway-property
  create: {
    method: "activateGateway",
    pickCreated: ({ payload }) => pipe([identity]),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/StorageGateway.html#updateGatewayInformation-property
  update: {
    method: "updateGatewayInformation",
    filterParams: ({ payload, diff, live }) =>
      pipe([() => payload, defaultsDeep(pickId(live))])(),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/StorageGateway.html#deleteGateway-property
  destroy: {
    method: "deleteGateway",
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
        Tags: buildTags({ name, config, namespace, UserTags: Tags }),
      }),
    ])(),
});
