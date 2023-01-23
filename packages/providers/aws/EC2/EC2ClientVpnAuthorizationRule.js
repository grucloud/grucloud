const assert = require("assert");
const { pipe, tap, get, eq, pick } = require("rubico");
const { defaultsDeep, unless } = require("rubico/x");
const { getByNameCore } = require("@grucloud/core/Common");
const { getField } = require("@grucloud/core/ProviderCommon");
const { omitIfEmpty } = require("@grucloud/core/Common");

const logger = require("@grucloud/core/logger")({
  prefix: "ClientVpnAuthorizationRule",
});

const findId = () =>
  pipe([
    ({ ClientVpnEndpointId, TargetNetworkCidr }) =>
      `${ClientVpnEndpointId}::${TargetNetworkCidr}`,
  ]);

const decorate = () =>
  pipe([
    ({ DestinationCidr, AccessAll, ...other }) => ({
      TargetNetworkCidr: DestinationCidr,
      AuthorizeAllGroups: AccessAll,
      ...other,
    }),
  ]);

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/EC2.html
exports.EC2ClientVpnAuthorizationRule = ({ compare }) => ({
  type: "ClientVpnAuthorizationRule",
  package: "ec2",
  client: "EC2",
  ignoreErrorCodes: ["InvalidClientVpnEndpointId.NotFound"],
  findName:
    ({ lives, config }) =>
    (live) =>
      pipe([
        tap(() => {
          assert(live.TargetNetworkCidr);
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
        (clientVpnEndpoint) =>
          `client-vpn-rule-assoc::${clientVpnEndpoint}::${live.TargetNetworkCidr}`,
      ])(),
  findId,
  omitProperties: ["ClientVpnEndpointId", "Status"],
  inferName:
    ({ dependenciesSpec: { clientVpnEndpoint } }) =>
    ({ TargetNetworkCidr }) =>
      pipe([
        tap((params) => {
          assert(clientVpnEndpoint);
          assert(TargetNetworkCidr);
        }),
        () =>
          `client-vpn-rule-assoc::${clientVpnEndpoint}::${TargetNetworkCidr}`,
      ])(),
  propertiesDefault: {},
  compare: compare({ filterAll: () => pick([]) }),
  filterLive: () =>
    pipe([
      tap((params) => {
        assert(true);
      }),
      omitIfEmpty(["GroupId"]),
    ]),
  dependencies: {
    clientVpnEndpoint: {
      type: "ClientVpnEndpoint",
      group: "EC2",
      parent: true,
      dependencyId: ({ lives, config }) => get("ClientVpnEndpointId"),
    },
  },
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
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/EC2.html#describeClientVpnAuthorizationRules-property
  getById: {
    method: "describeClientVpnAuthorizationRules",
    getField: "AuthorizationRules",
    pickId: pipe([
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
    pickCreated: ({ payload }) => pipe([() => payload]),
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
      pick(["ClientVpnEndpointId", "TargetNetworkCidr", "AccessGroupId"]),
      unless(get("AccessGroupId"), defaultsDeep({ RevokeAllGroups: true })),
    ]),
    isInstanceError: eq(get("Status.Code"), "failed"),
    getErrorMessage: get("Status.Message", "error"),
  },
  getByName: getByNameCore,
  configDefault: ({
    name,
    namespace,
    properties,
    // TODO AD
    dependencies: { clientVpnEndpoint, activeDirectoryGroup },
    config,
  }) =>
    pipe([
      tap((params) => {
        assert(clientVpnEndpoint);
      }),
      () => properties,
      defaultsDeep({
        ClientVpnEndpointId: getField(clientVpnEndpoint, "ClientVpnEndpointId"),
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
