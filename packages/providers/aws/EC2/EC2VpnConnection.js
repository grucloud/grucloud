const assert = require("assert");
const { pipe, tap, get, eq, pick } = require("rubico");
const { defaultsDeep, when } = require("rubico/x");
const { getByNameCore } = require("@grucloud/core/Common");
const { getField } = require("@grucloud/core/ProviderCommon");

const { buildTags, findNameInTagsOrId } = require("../AwsCommon");
const { createAwsResource } = require("../AwsClient");
const { tagResource, untagResource } = require("./EC2Common");

const logger = require("@grucloud/core/logger")({ prefix: "VpnConnection" });

const createModel = ({ config }) => ({
  package: "ec2",
  client: "EC2",
  ignoreErrorCodes: ["InvalidVpnConnectionID.NotFound"],
  getById: {
    method: "describeVpnConnections",
    getField: "VpnConnections",
    pickId: pipe([
      ({ VpnConnectionId }) => ({ VpnConnectionIds: [VpnConnectionId] }),
    ]),
  },
  getList: {
    method: "describeVpnConnections",
    getParam: "VpnConnections",
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
});

const findId = pipe([get("live.VpnConnectionId")]);

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/EC2.html
exports.EC2VpnConnection = ({ spec, config }) =>
  createAwsResource({
    model: createModel({ config }),
    spec,
    config,
    findName: findNameInTagsOrId({ findId }),
    findId,
    cannotBeDeleted: eq(get("live.State"), "deleted"),
    getByName: getByNameCore,
    tagResource: tagResource,
    untagResource: untagResource,
    configDefault: ({
      name,
      namespace,
      properties: { Tags, ...otherProps },
      dependencies: { customerGateway, vpnGateway, transitGateway },
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
