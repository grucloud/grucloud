const assert = require("assert");
const { pipe, tap, get, pick, eq } = require("rubico");
const { defaultsDeep, identity } = require("rubico/x");
const { getByNameCore } = require("@grucloud/core/Common");

const { buildTags, findNameInTagsOrId } = require("../AwsCommon");
const { createAwsResource } = require("../AwsClient");
const { tagResource, untagResource } = require("./NetworkManagerCommon");

const createModel = ({ config }) => ({
  package: "networkmanager",
  client: "NetworkManager",
  ignoreErrorCodes: ["ResourceNotFoundException"],
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
  destroy: {
    method: "deleteGlobalNetwork",
    pickId: pipe([pick(["GlobalNetworkId"])]),
  },
});
const findId = pipe([get("live.GlobalNetworkId")]);

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/NetworkManager.html
exports.NetworkManagerGlobalNetwork = ({ spec, config }) =>
  createAwsResource({
    model: createModel({ config }),
    spec,
    config,
    findName: findNameInTagsOrId({ findId }),
    findId,
    pickId: pipe([pick(["GlobalNetworkArn"])]),
    getByName: getByNameCore,
    tagResource: tagResource({ property: "GlobalNetworkArn" }),
    untagResource: untagResource({ property: "GlobalNetworkArn" }),
    configDefault: ({ name, namespace, properties: { Tags, ...otherProps } }) =>
      pipe([
        () => otherProps,
        defaultsDeep({
          Tags: buildTags({ config, namespace, name, UserTags: Tags }),
        }),
      ])(),
  });
