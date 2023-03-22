const assert = require("assert");
const { pipe, tap, get, pick } = require("rubico");
const { defaultsDeep } = require("rubico/x");

const { getByNameCore } = require("@grucloud/core/Common");
const { getField } = require("@grucloud/core/ProviderCommon");

const pickId = pipe([
  tap(({ VolumeARN }) => {
    assert(VolumeARN);
  }),
  pick(["VolumeARN"]),
]);

const decorate = ({ endpoint, config }) =>
  pipe([
    tap((params) => {
      assert(endpoint);
    }),
  ]);

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/StorageGateway.html
exports.StorageGatewayVolume = () => ({
  type: "Volume",
  package: "storage-gateway",
  client: "StorageGateway",
  propertiesDefault: {},
  omitProperties: ["VolumeARN"],
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
      get("Arn"),
      tap((id) => {
        assert(id);
      }),
    ]),
  ignoreErrorCodes: [
    "ResourceNotFoundException",
    "InvalidGatewayRequestException",
  ],
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/StorageGateway.html#describeCachediSCSIVolumes-property
  getById: {
    method: "describeCachediSCSIVolumes",
    pickId: pipe([
      tap(({ VolumeARN }) => {
        assert(VolumeARN);
      }),
      ({ VolumeARN }) => ({ VolumeARNs: [VolumeARN] }),
    ]),
    decorate,
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/StorageGateway.html#listVolumes-property
  getList: ({ client, endpoint, getById, config }) =>
    pipe([
      () =>
        client.getListWithParent({
          parent: { type: "Gateway", group: "StorageGateway" },
          pickKey: pipe([pick(["GatewayARN"])]),
          method: "listVolumes",
          getParam: "VolumeInfos",
          config,
          decorate: () =>
            pipe([
              tap((params) => {
                assert(true);
              }),
            ]),
        }),
    ])(),
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/StorageGateway.html#createVolume-property
  create: {
    method: "createVolume",
    pickCreated: ({ payload }) => pipe([get("Volume")]),
    // TOOO attachVolume https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/StorageGateway.html#attachVolume-property
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/StorageGateway.html#updateVolume-property
  update: {
    method: "updateVolume",
    filterParams: ({ payload, diff, live }) =>
      pipe([() => payload, defaultsDeep(pickId(live))])(),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/StorageGateway.html#deleteVolume-property
  destroy: {
    // detachVolume
    method: "deleteVolume",
    pickId,
  },
  getByName: getByNameCore,
  configDefault: ({
    name,
    namespace,
    properties: { ...otherProps },
    dependencies: {},
    config,
  }) =>
    pipe([
      () => otherProps,
      defaultsDeep({ GatewayARN: getField(gateway, "GatewayARN") }),
    ])(),
});
