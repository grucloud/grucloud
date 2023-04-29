const assert = require("assert");
const { pipe, tap, get, eq, filter, not, fork, switchCase } = require("rubico");
const { prepend } = require("rubico/x");

const { findNameInTagsOrId } = require("../AwsCommon");

const isInstanceDown = pipe([eq(get("State"), "deleted")]);

const findNameInDependency =
  ({ lives, config }) =>
  (live) =>
    pipe([
      tap((params) => {
        assert(config);
      }),
      () => live,
      fork({
        tgwName: pipe([
          get("TransitGatewayId"),
          tap((TransitGatewayId) => {
            assert(TransitGatewayId);
          }),
          lives.getById({
            type: "TransitGateway",
            group: "EC2",
            providerName: config.providerName,
          }),
          get("name", live.TransitGatewayId),
        ]),
        vpnConnection: pipe([
          get("ResourceId"),
          tap((ResourceId) => {
            assert(ResourceId);
          }),
          lives.getById({
            type: "VpnConnection",
            group: "EC2",
            providerName: config.providerName,
          }),
          get("name", live.ResourceId),
          prepend("vpn::"),
        ]),
      }),
      ({ tgwName, vpnConnection }) =>
        `tgw-attach::${tgwName}::${vpnConnection}`,
    ])();

const findId = () =>
  pipe([
    get("TransitGatewayAttachmentId"),
    tap((TransitGatewayAttachmentId) => {
      assert(TransitGatewayAttachmentId);
    }),
  ]);

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/EC2.html
exports.EC2TransitGatewayVpnAttachment = ({}) => ({
  type: "TransitGatewayVpnAttachment",
  package: "ec2",
  client: "EC2",
  findName: findNameInTagsOrId({ findId: findNameInDependency }),
  findId,
  omitProperties: [
    "TransitGatewayOwnerId",
    "ResourceOwnerId",
    "ResourceId",
    "ResourceType",
    "Association",
    "TransitGatewayAttachmentId",
    "TransitGatewayId",
    "CreationTime",
    "State",
  ],
  dependencies: {
    transitGateway: {
      type: "TransitGateway",
      group: "EC2",
      dependencyId: ({ lives, config }) => get("TransitGatewayId"),
    },
    vpnConnection: {
      type: "VpnConnection",
      group: "EC2",
      dependencyId: ({ lives, config }) =>
        pipe([
          get("ResourceId"),
          tap((ResourceId) => {
            assert(ResourceId);
          }),
        ]),
    },
  },
  cannotBeDeleted: () => () => true,
  managedByOther: () => () => true,
  ignoreErrorCodes: ["InvalidTransitGatewayAttachmentID.NotFound"],
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/EC2.html#describeTransitGatewayAttachments-property
  getList: {
    enhanceParams: () => () => ({
      Filters: [{ Name: "resource-type", Values: ["vpn"] }],
    }),
    method: "describeTransitGatewayAttachments",
    getParam: "TransitGatewayAttachments",
    transformListPre: () => pipe([filter(not(isInstanceDown))]),
  },
});
