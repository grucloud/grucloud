const assert = require("assert");
const { pipe, tap, get, eq, pick, not, assign } = require("rubico");
const { defaultsDeep, when, prepend } = require("rubico/x");
const { getByNameCore } = require("@grucloud/core/Common");
const { getField } = require("@grucloud/core/ProviderCommon");

const { buildTags, findNameInTagsOrId, arnFromId } = require("../AwsCommon");
const { tagResource, untagResource } = require("./EC2Common");

const logger = require("@grucloud/core/logger")({ prefix: "VpnConnection" });

const findId = () => pipe([get("VpnConnectionId")]);

const decorate = ({ endpoint, config }) =>
  pipe([
    assign({
      Arn: pipe([
        get("VpnConnectionId"),
        prepend("vpn-connection/"),
        arnFromId({ service: "ec2", config }),
      ]),
    }),
  ]);

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/EC2.html
exports.EC2VpnConnection = ({ compare }) => ({
  type: "VpnConnection",
  package: "ec2",
  client: "EC2",
  ignoreErrorCodes: ["InvalidVpnConnectionID.NotFound"],
  findName: findNameInTagsOrId({ findId }),
  findId,
  cannotBeDeleted: () => eq(get("State"), "deleted"),
  // TODO managedByOther ?
  ignoreResource: () => pipe([get("live"), eq(get("State"), "deleted")]),
  omitProperties: [
    "CustomerGatewayId",
    "VpnGatewayId",
    "TransitGatewayId",
    "CoreNetworkArn",
    "State",
    "VpnConnectionId",
    "GatewayAssociationState",
    "VgwTelemetry",
    "Options.TunnelOptions",
    "CustomerGatewayConfiguration",
    "Routes",
    "Arn",
  ],
  //filterLive Sort by PSK
  propertiesDefault: {
    Type: "ipsec.1",
    Options: {
      EnableAcceleration: false,
      LocalIpv4NetworkCidr: "0.0.0.0/0",
      OutsideIpAddressType: "PublicIpv4",
      RemoteIpv4NetworkCidr: "0.0.0.0/0",
      StaticRoutesOnly: false,
      TunnelInsideIpVersion: "ipv4",
    },
  },
  dependencies: {
    customerGateway: {
      type: "CustomerGateway",
      group: "EC2",
      dependencyId: ({ lives, config }) => get("CustomerGatewayId"),
    },
    vpnGateway: {
      type: "VpnGateway",
      group: "EC2",
      dependencyId: ({ lives, config }) => get("VpnGatewayId"),
    },
    transitGateway: {
      type: "TransitGateway",
      group: "EC2",
      dependencyId: ({ lives, config }) => get("TransitGatewayId"),
    },
  },
  getById: {
    method: "describeVpnConnections",
    getField: "VpnConnections",
    pickId: pipe([
      ({ VpnConnectionId }) => ({ VpnConnectionIds: [VpnConnectionId] }),
    ]),
    decorate,
  },
  getList: {
    method: "describeVpnConnections",
    getParam: "VpnConnections",
    filterResource: pipe([not(eq(get("State"), "deleted"))]),
    decorate,
  },
  create: {
    method: "createVpnConnection",
    pickCreated: ({ payload }) => pipe([get("VpnConnection")]),
    isInstanceUp: pipe([
      tap(({ State }) => {
        logger.debug(`createVpnConnection state: ${State}`);
      }),
      eq(get("State"), "available"),
    ]),
    configIsUp: { retryCount: 20 * 10, retryDelay: 5e3 },
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/EC2.html#deleteVpnConnection-property
  destroy: {
    method: "deleteVpnConnection",
    pickId: pipe([pick(["VpnConnectionId"])]),
    isInstanceDown: pipe([eq(get("State"), "deleted")]),
  },
  getByName: getByNameCore,
  tagger: ({ config }) => ({
    tagResource,
    untagResource,
  }),
  configDefault: ({
    name,
    namespace,
    properties: { Tags, ...otherProps },
    dependencies: { customerGateway, vpnGateway, transitGateway },
    config,
  }) =>
    pipe([
      tap((params) => {
        assert(customerGateway);
        assert(
          vpnGateway || transitGateway,
          "either vpnGateway or transitGateway is required"
        );
      }),
      () => otherProps,
      defaultsDeep({
        CustomerGatewayId: getField(customerGateway, "CustomerGatewayId"),
        TagSpecifications: [
          {
            ResourceType: "vpn-connection",
            Tags: buildTags({ config, namespace, name, UserTags: Tags }),
          },
        ],
      }),
      when(
        () => vpnGateway,
        defaultsDeep({
          VpnGatewayId: getField(vpnGateway, "VpnGatewayId"),
        })
      ),
      when(
        () => transitGateway,
        defaultsDeep({
          TransitGatewayId: getField(transitGateway, "TransitGatewayId"),
        })
      ),
    ])(),
});
