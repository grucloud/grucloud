const assert = require("assert");
const { pipe, tap, get, pick, eq } = require("rubico");
const { defaultsDeep } = require("rubico/x");
const { getByNameCore } = require("@grucloud/core/Common");

const { buildTags, findNameInTagsOrId } = require("../AwsCommon");
const { Tagger } = require("./NetworkManagerCommon");

const buildArn = () =>
  pipe([
    get("GlobalNetworkArn"),
    tap((arn) => {
      assert(arn);
    }),
  ]);

const findId = () => pipe([get("GlobalNetworkId")]);

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/NetworkManager.html
exports.NetworkManagerGlobalNetwork = () => ({
  type: "GlobalNetwork",
  package: "networkmanager",
  client: "NetworkManager",
  ignoreErrorCodes: ["ResourceNotFoundException"],
  omitProperties: ["GlobalNetworkId", "GlobalNetworkArn", "State", "CreatedAt"],
  findName: findNameInTagsOrId({ findId }),
  findId,
  pickId: pipe([pick(["GlobalNetworkArn"])]),
  getById: {
    method: "describeGlobalNetworks",
    getField: "GlobalNetworks",
    pickId: pipe([
      ({ GlobalNetworkId }) => ({ GlobalNetworkIds: [GlobalNetworkId] }),
    ]),
  },
  getList: {
    method: "describeGlobalNetworks",
    getParam: "GlobalNetworks",
  },
  create: {
    method: "createGlobalNetwork",
    pickCreated: () => pipe([get(["GlobalNetwork"])]),
    isInstanceUp: pipe([eq(get("State"), "AVAILABLE")]),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/NetworkManager.html#updateGlobalNetwork-property
  update: { method: "updateGlobalNetwork" },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/NetworkManager.html#deleteGlobalNetwork-property
  destroy: {
    method: "deleteGlobalNetwork",
    pickId: pipe([
      pick(["GlobalNetworkId"]),
      tap(({ GlobalNetworkId }) => {
        assert(GlobalNetworkId);
      }),
    ]),
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
    config,
  }) =>
    pipe([
      () => otherProps,
      defaultsDeep({
        Tags: buildTags({ config, namespace, name, UserTags: Tags }),
      }),
    ])(),
});
