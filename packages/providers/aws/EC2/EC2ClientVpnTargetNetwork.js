const assert = require("assert");
const { pipe, tap, get, eq, pick, fork } = require("rubico");
const { defaultsDeep, when } = require("rubico/x");
const { getByNameCore } = require("@grucloud/core/Common");
const { getField } = require("@grucloud/core/ProviderCommon");

const { createAwsResource } = require("../AwsClient");

const logger = require("@grucloud/core/logger")({
  prefix: "ClientVpnEndpoint",
});

const findId = () => pipe([get("AssociationId")]);

const createModel = ({ config }) => ({
  package: "ec2",
  client: "EC2",
  ignoreErrorCodes: ["InvalidClientVpnEndpointId.NotFound"],
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/EC2.html#describeClientVpnTargetNetworks-property
  getById: {
    method: "describeClientVpnTargetNetworks",
    getField: "ClientVpnTargetNetworks",
    pickId: pipe([
      ({ AssociationId, ClientVpnEndpointId }) => ({
        AssociationIds: [AssociationId],
        ClientVpnEndpointId,
      }),
    ]),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/EC2.html#associateClientVpnTargetNetwork-property
  create: {
    method: "associateClientVpnTargetNetwork",
    pickCreated: ({ payload }) =>
      pipe([
        ({ AssociationId }) => ({
          AssociationId,
          ClientVpnEndpointId: payload.ClientVpnEndpointId,
        }),
      ]),
    isInstanceUp: pipe([
      tap(({ Status }) => {
        logger.debug(`associateClientVpnTargetNetwork state: ${Status.Code}`);
      }),
      eq(get("Status.Code"), "associated"),
    ]),
    // configIsUp: { retryCount: 20 * 10, retryDelay: 5e3 },
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/EC2.html#disassociateClientVpnTargetNetwork-property
  destroy: {
    method: "disassociateClientVpnTargetNetwork",
    pickId: pipe([pick(["ClientVpnEndpointId", "AssociationId"])]),
    isInstanceDown: pipe([
      tap(({ Status }) => {
        logger.debug(
          `disassociateClientVpnTargetNetwork state: ${Status.Code}`
        );
      }),
      eq(get("Status.Code"), "disassociated"),
    ]),
  },
});

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/EC2.html
exports.EC2ClientVpnTargetNetwork = ({ spec, config }) =>
  createAwsResource({
    model: createModel({ config }),
    spec,
    config,
    findName:
      ({ lives, config }) =>
      (live) =>
        pipe([
          fork({
            clientVpnEndpoint: pipe([
              tap(() => {
                assert(live.ClientVpnEndpointId);
              }),
              () => live,
              get("ClientVpnEndpointId"),
              lives.getById({
                type: "ClientVpnEndpoint",
                group: "EC2",
                providerName: config.providerName,
              }),
              get("name", live.ClientVpnEndpointId),
            ]),
            subnet: pipe([
              tap(() => {
                assert(live.SubnetId);
              }),
              () => live,
              get("SubnetId"),
              lives.getById({
                type: "Subnet",
                group: "EC2",
                providerName: config.providerName,
              }),
              get("name", live.SubnetId),
            ]),
          }),
          tap(({ clientVpnEndpoint, subnet }) => {
            assert(clientVpnEndpoint);
            assert(subnet);
          }),
          ({ clientVpnEndpoint, subnet }) =>
            `client-vpn-target-assoc::${clientVpnEndpoint}::${subnet}`,
        ])(),
    findId,
    getList: ({ client, endpoint, getById, config }) =>
      pipe([
        () =>
          client.getListWithParent({
            parent: { type: "ClientVpnEndpoint", group: "EC2" },
            pickKey: pipe([pick(["ClientVpnEndpointId"])]),
            method: "describeClientVpnTargetNetworks",
            getParam: "ClientVpnTargetNetworks",
            config,
            decorate: () =>
              pipe([
                ({ TargetNetworkId, ...other }) => ({
                  SubnetId: TargetNetworkId,
                  ...other,
                }),
              ]),
          }),
      ])(),
    getByName: getByNameCore,
    configDefault: ({
      name,
      namespace,
      properties: { Tags, ...otherProps },
      dependencies: { clientVpnEndpoint, subnet },
    }) =>
      pipe([
        tap((params) => {
          assert(clientVpnEndpoint);
          assert(subnet);
        }),
        () => otherProps,
        defaultsDeep({
          ClientVpnEndpointId: getField(
            clientVpnEndpoint,
            "ClientVpnEndpointId"
          ),
          SubnetId: getField(subnet, "SubnetId"),
        }),
      ])(),
  });
