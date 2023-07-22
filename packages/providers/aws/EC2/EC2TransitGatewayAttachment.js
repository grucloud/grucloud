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
        resourceName: pipe([
          switchCase([
            eq(get("ResourceType"), "vpn"),
            pipe([
              get("ResourceId"),
              lives.getById({
                type: "VpnConnection",
                group: "EC2",
                providerName: config.providerName,
              }),
              get("name", live.ResourceId),
              prepend("vpn::"),
            ]),
            eq(get("ResourceType"), "vpc"),
            pipe([
              get("ResourceId"),
              lives.getById({
                type: "Vpc",
                group: "EC2",
                providerName: config.providerName,
              }),
              get("name", live.ResourceId),
              prepend("vpc::"),
            ]),
            eq(get("ResourceType"), "peering"),
            pipe([
              get("ResourceId"),
              lives.getById({
                type: "TransitGateway",
                group: "EC2",
                providerName: config.providerName,
              }),
              get("name", live.ResourceId),
              prepend("tgw::"),
            ]),
            ({ ResourceType }) => {
              assert(false, `ResourceType '${ResourceType}' not handled`);
            },
          ]),
        ]),
      }),
      ({ tgwName, resourceName }) => `tgw-attach::${tgwName}::${resourceName}`,
    ])();

const findId = () =>
  pipe([
    get("TransitGatewayAttachmentId"),
    tap((TransitGatewayAttachmentId) => {
      assert(TransitGatewayAttachmentId);
    }),
  ]);

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/EC2.html
exports.EC2TransitGatewayAttachment = ({}) => ({
  type: "TransitGatewayAttachment",
  package: "ec2",
  client: "EC2",
  findName: findNameInTagsOrId({ findId: findNameInDependency }),
  findId,
  omitProperties: [
    "TransitGatewayOwnerId",
    "ResourceOwnerId",
    "ResourceId",
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
    //TODO do we need vpc ?
    vpc: {
      type: "Vpc",
      group: "EC2",
      dependencyId: ({ lives, config }) => get("ResourceId"),
    },
    vpnConnection: {
      type: "VpnConnection",
      group: "EC2",
      dependencyId: ({ lives, config }) => get("ResourceId"),
    },
  },
  cannotBeDeleted: () => () => true,
  managedByOther: () => () => true,
  ignoreErrorCodes: ["InvalidTransitGatewayAttachmentID.NotFound"],
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/EC2.html#describeTransitGatewayAttachments-property
  getList: {
    method: "describeTransitGatewayAttachments",
    getParam: "TransitGatewayAttachments",
    transformListPre: () => pipe([filter(not(isInstanceDown))]),
  },
});
