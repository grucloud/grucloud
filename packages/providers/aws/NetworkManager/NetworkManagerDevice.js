const assert = require("assert");
const { pipe, tap, get, pick, eq } = require("rubico");
const { defaultsDeep, when } = require("rubico/x");

const { getByNameCore } = require("@grucloud/core/Common");
const { getField } = require("@grucloud/core/ProviderCommon");

const { buildTags, findNameInTagsOrId } = require("../AwsCommon");
const { createAwsResource } = require("../AwsClient");
const { tagResource, untagResource } = require("./NetworkManagerCommon");

const createModel = ({ config }) => ({
  package: "networkmanager",
  client: "NetworkManager",
  region: "us-west-2",
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
});

const findId = pipe([get("live.DeviceId")]);

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/NetworkManager.html
exports.NetworkManagerDevice = ({ spec, config }) =>
  createAwsResource({
    model: createModel({ config }),
    spec,
    config,
    findName: findNameInTagsOrId({ findId }),
    findId,
    pickId: pipe([pick(["DeviceArn"])]),
    getByName: getByNameCore,
    tagResource: tagResource({ property: "DeviceArn" }),
    untagResource: untagResource({ property: "DeviceArn" }),
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
