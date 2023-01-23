const assert = require("assert");
const { pipe, tap, get, pick, eq, not } = require("rubico");
const { defaultsDeep } = require("rubico/x");
const { getByNameCore } = require("@grucloud/core/Common");

const { buildTags, findNameInTagsOrId } = require("../AwsCommon");
const { tagResource, untagResource } = require("./EC2Common");

const findId = () => pipe([get("VpnGatewayId")]);

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/EC2.html
exports.EC2VpnGateway = ({ compare }) => ({
  type: "VpnGateway",
  package: "ec2",
  client: "EC2",
  findName: findNameInTagsOrId({ findId }),
  findId,
  omitProperties: ["VpnGatewayId", "State", "VpcAttachments"],
  propertiesDefault: { Type: "ipsec.1" },
  compare: compare({ filterAll: () => pick([]) }),
  ignoreResource: () => pipe([get("live"), eq(get("State"), "deleted")]),
  cannotBeDeleted: () => eq(get("State"), "deleted"),
  ignoreErrorCodes: ["InvalidVpnGatewayID.NotFound"],
  getById: {
    method: "describeVpnGateways",
    getField: "VpnGateways",
    pickId: pipe([({ VpnGatewayId }) => ({ VpnGatewayIds: [VpnGatewayId] })]),
  },
  getList: {
    method: "describeVpnGateways",
    getParam: "VpnGateways",
    filterResource: pipe([not(eq(get("State"), "deleted"))]),
  },
  create: {
    method: "createVpnGateway",
    pickCreated: ({ payload }) => pipe([get("VpnGateway")]),
    isInstanceUp: pipe([eq(get("State"), "available")]),
  },
  destroy: {
    method: "deleteVpnGateway",
    pickId: pipe([pick(["VpnGatewayId"])]),
    isInstanceDown: pipe([eq(get("State"), "deleted")]),
  },
  getByName: getByNameCore,
  tagger: () => ({ tagResource: tagResource, untagResource: untagResource }),
  configDefault: ({
    name,
    namespace,
    properties: { Tags, ...otherProps },
    config,
  }) =>
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
