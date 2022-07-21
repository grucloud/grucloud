const assert = require("assert");
const { pipe, tap, get, eq, pick } = require("rubico");
const { defaultsDeep, unless, when } = require("rubico/x");
const { getByNameCore } = require("@grucloud/core/Common");
const { getField } = require("@grucloud/core/ProviderCommon");

const { createAwsResource } = require("../AwsClient");

const logger = require("@grucloud/core/logger")({
  prefix: "ClientVpnAuthorizationRule",
});

const findId = pipe([
  get("live"),
  ({ ClientVpnEndpointId, TargetNetworkCidr }) =>
    `${ClientVpnEndpointId}::${TargetNetworkCidr}`,
]);

const decorate = () =>
  pipe([
    tap((params) => {
      assert(true);
    }),
    ({ DestinationCidr, AccessAll, ...other }) => ({
      TargetNetworkCidr: DestinationCidr,
      AuthorizeAllGroups: AccessAll,
      ...other,
    }),
  ]);

const createModel = ({ config }) => ({
  package: "ec2",
  client: "EC2",
  ignoreErrorCodes: ["InvalidClientVpnEndpointId.NotFound"],
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/EC2.html#describeClientVpnAuthorizationRules-property
  getById: {
    method: "describeClientVpnAuthorizationRules",
    getField: "AuthorizationRules",
    pickId: pipe([
      tap((params) => {
        assert(params);
      }),
      tap(({ ClientVpnEndpointId, TargetNetworkCidr }) => {
        assert(ClientVpnEndpointId);
        assert(TargetNetworkCidr);
      }),
      ({ ClientVpnEndpointId, TargetNetworkCidr }) => ({
        ClientVpnEndpointId,
        Filters: [
          {
            Name: "destination-cidr",
            Values: [TargetNetworkCidr],
          },
        ],
      }),
    ]),
    decorate,
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/EC2.html#authorizeClientVpnIngress-property
  create: {
    method: "authorizeClientVpnIngress",
    pickCreated: ({ payload }) =>
      pipe([
        tap((params) => {
          assert(payload);
        }),
        () => payload,
      ]),
    isInstanceUp: pipe([
      tap(({ Status }) => {
        logger.debug(`authorizeClientVpnIngress state: ${Status.Code}`);
      }),
      eq(get("Status.Code"), "active"),
    ]),
    isInstanceError: eq(get("Status.Code"), "failed"),
    getErrorMessage: get("Status.Message", "error"),
    // configIsUp: { retryCount: 20 * 10, retryDelay: 5e3 },
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/EC2.html#revokeClientVpnIngress-property
  destroy: {
    method: "revokeClientVpnIngress",
    pickId: pipe([
      tap(({ ClientVpnEndpointId, TargetNetworkCidr }) => {
        assert(ClientVpnEndpointId);
        assert(TargetNetworkCidr);
      }),
      pick(["ClientVpnEndpointId", "TargetNetworkCidr", "AccessGroupId"]),
      unless(get("AccessGroupId"), defaultsDeep({ RevokeAllGroups: true })),
    ]),
    isInstanceError: eq(get("Status.Code"), "failed"),
    getErrorMessage: get("Status.Message", "error"),
  },
});

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/EC2.html
exports.EC2ClientVpnAuthorizationRule = ({ spec, config }) =>
  createAwsResource({
    model: createModel({ config }),
    spec,
    config,
    findDependencies: ({ live }) => [
      {
        type: "ClientVpnEndpoint",
        group: "EC2",
        ids: [live.ClientVpnEndpointId],
      },
    ],
    findName: ({ live, lives }) =>
      pipe([
        tap(() => {
          assert(live.TargetNetworkCidr);
          assert(live.ClientVpnEndpointId);
        }),
        () =>
          lives.getById({
            id: live.ClientVpnEndpointId,
            type: "ClientVpnEndpoint",
            group: "EC2",
            providerName: config.providerName,
          }),
        get("name", live.ClientVpnEndpointId),
        (clientVpnEndpoint) =>
          `client-vpn-rule-assoc::${clientVpnEndpoint}::${live.TargetNetworkCidr}`,
      ])(),
    findId,
    // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/EC2.html#describeClientVpnAuthorizationRules-property
    getList: ({ client, endpoint, getById, config }) =>
      pipe([
        () =>
          client.getListWithParent({
            parent: { type: "ClientVpnEndpoint", group: "EC2" },
            pickKey: pipe([pick(["ClientVpnEndpointId"])]),
            method: "describeClientVpnAuthorizationRules",
            getParam: "AuthorizationRules",
            config,
            decorate,
          }),
      ])(),
    getByName: getByNameCore,
    configDefault: ({
      name,
      namespace,
      properties,
      // TODO AD
      dependencies: { clientVpnEndpoint, activeDirectoryGroup },
    }) =>
      pipe([
        tap((params) => {
          assert(clientVpnEndpoint);
        }),
        () => properties,
        defaultsDeep({
          ClientVpnEndpointId: getField(
            clientVpnEndpoint,
            "ClientVpnEndpointId"
          ),
        }),
        // TODO
        // when(
        //   () => activeDirectoryGroup,
        //   defaultsDeep({
        //     AccessGroupId: getField(activeDirectoryGroup, "TODOId"),
        //   })
        // ),
      ])(),
  });
