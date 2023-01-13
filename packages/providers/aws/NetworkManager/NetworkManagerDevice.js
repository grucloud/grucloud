const assert = require("assert");
const { pipe, tap, get, pick, eq } = require("rubico");
const { defaultsDeep, when } = require("rubico/x");

const { getByNameCore } = require("@grucloud/core/Common");
const { getField } = require("@grucloud/core/ProviderCommon");

const { buildTags, findNameInTagsOrId } = require("../AwsCommon");
const { Tagger } = require("./NetworkManagerCommon");

const buildArn = () =>
  pipe([
    get("DeviceArn"),
    tap((arn) => {
      assert(arn);
    }),
  ]);

const findId = () => pipe([get("DeviceId")]);

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/NetworkManager.html
exports.NetworkManagerDevice = () => ({
  type: "Device",
  package: "networkmanager",
  client: "NetworkManager",
  findName: findNameInTagsOrId({ findId }),
  findId,
  pickId: pipe([pick(["DeviceArn"])]),
  omitProperties: [
    "GlobalNetworkId",
    "SiteId",
    "DeviceId",
    "DeviceArn",
    "CreatedAt",
    "State",
  ],
  dependencies: {
    globalNetwork: {
      type: "GlobalNetwork",
      group: "NetworkManager",
      parent: true,
      dependencyId: ({ lives, config }) => get("GlobalNetworkId"),
    },
    site: {
      type: "Site",
      group: "NetworkManager",
      parent: true,
      dependencyId: ({ lives, config }) => get("SiteId"),
    },
  },
  ignoreErrorCodes: ["ResourceNotFoundException", "ValidationException"],
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/NetworkManager.html#getDevices-property
  getById: {
    method: "getDevices",
    pickId: pipe([
      ({ GlobalNetworkId, SiteId, DeviceId }) => ({
        GlobalNetworkId,
        SiteId,
        DeviceIds: [DeviceId],
      }),
    ]),
    getField: "Devices",
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/NetworkManager.html#createDevice-property
  create: {
    method: "createDevice",
    pickCreated: ({ payload }) => pipe([get("Device")]),
    isInstanceUp: pipe([eq(get("State"), "AVAILABLE")]),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/NetworkManager.html#updateDevice-property
  update: {
    method: "updateDevice",
    filterParams: ({ payload }) =>
      pipe([
        () => payload,
        defaultsDeep(
          pipe([() => live, pick(["DeviceId", "SiteId", "GlobalNetworkId"])])()
        ),
      ]),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/NetworkManager.html#deleteDevice-property
  destroy: {
    method: "deleteDevice",
    pickId: pipe([pick(["GlobalNetworkId", "SiteId", "DeviceId"])]),
  },
  getByName: getByNameCore,
  tagger: ({ config }) =>
    Tagger({
      buildArn: buildArn({ config }),
    }),
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/NetworkManager.html#getDevices-property
  getList: ({ client, endpoint, getById, config }) =>
    pipe([
      () =>
        client.getListWithParent({
          parent: { type: "GlobalNetwork", group: "NetworkManager" },
          pickKey: pipe([pick(["GlobalNetworkId"])]),
          method: "getDevices",
          getParam: "Devices",
          config,
        }),
    ])(),
  configDefault: ({
    name,
    namespace,
    properties: { Tags, ...otherProps },
    dependencies: { globalNetwork, site },
    config,
  }) =>
    pipe([
      tap((params) => {
        assert(globalNetwork);
      }),
      () => otherProps,
      defaultsDeep({
        GlobalNetworkId: getField(globalNetwork, "GlobalNetworkId"),
        Tags: buildTags({ config, namespace, name, UserTags: Tags }),
      }),
      when(
        () => site,
        defaultsDeep({
          SiteId: getField(site, "SiteId"),
        })
      ),
    ])(),
});
