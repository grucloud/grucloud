const assert = require("assert");
const { pipe, tap, get, pick, eq, omit } = require("rubico");
const { defaultsDeep, callProp, last } = require("rubico/x");
const { getByNameCore } = require("@grucloud/core/Common");

const { buildTags, findNameInTagsOrId } = require("../AwsCommon");
const { createAwsResource } = require("../AwsClient");
const { tagResource, untagResource } = require("./EC2Common");

const createModel = ({ config }) => ({
  package: "ec2",
  client: "EC2",
  ignoreErrorCodes: ["InvalidVpnGatewayID.NotFound"],
  getById: { method: "describeVpnGateways", getField: "VpnGateways" },
  getList: { method: "describeVpnGateways", getParam: "VpnGateways" },
  create: { method: "createVpnGateway" },
  destroy: { method: "deleteVpnGateway" },
});

const findId = pipe([
  get("live.VpnGatewayId"),
  tap((VpnGatewayId) => {
    assert(VpnGatewayId);
  }),
]);

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/EC2.html
exports.EC2VpnGateway = ({ spec, config }) =>
  createAwsResource({
    model: createModel({ config }),
    spec,
    config,
    findName: findNameInTagsOrId({ findId }),
    findId,
    pickId: pipe([
      tap(({ VpnGatewayId }) => {
        assert(VpnGatewayId);
      }),
      ({ VpnGatewayId }) => ({ VpnGatewayIds: [VpnGatewayId] }),
    ]),
    pickIdDestroy: pipe([
      tap(({ VpnGatewayId }) => {
        assert(VpnGatewayId);
      }),
      pick(["VpnGatewayId"]),
    ]),
    decorateList: ({ endpoint, getById }) =>
      pipe([
        tap((params) => {
          assert(getById);
          assert(endpoint);
        }),
      ]),
    pickCreated: ({ payload }) => pipe([get("VpnGateway")]),
    isInstanceUp: pipe([eq(get("State"), "available")]),
    isInstanceDown: pipe([eq(get("State"), "deleted")]),
    getByName: getByNameCore,
    tagResource: tagResource,
    untagResource: untagResource,
    configDefault: ({ name, namespace, properties: { Tags, ...otherProps } }) =>
      pipe([
        () => otherProps,
        defaultsDeep({
          TagSpecifications: [
            {
              ResourceType: "vpn-gateway",
              Tags: buildTags({ config, namespace, name, UserTags: Tags }),
            },
          ],
        }),
      ])(),
  });
