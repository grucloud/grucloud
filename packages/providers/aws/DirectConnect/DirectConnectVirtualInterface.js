const assert = require("assert");
const {
  pipe,
  tap,
  get,
  pick,
  assign,
  eq,
  switchCase,
  omit,
  not,
} = require("rubico");
const { defaultsDeep, identity, when } = require("rubico/x");

const { getField } = require("@grucloud/core/ProviderCommon");
const { getByNameCore, omitIfEmpty } = require("@grucloud/core/Common");
const { buildTags } = require("../AwsCommon");

const { Tagger } = require("./DirectConnectCommon");

const isInstanceDown = pipe([eq(get("virtualInterfaceState"), "deleted")]);

const buildArn = () =>
  pipe([
    get("arn"),
    tap((arn) => {
      assert(arn);
    }),
  ]);

const pickId = pipe([
  tap(({ virtualInterfaceId }) => {
    assert(virtualInterfaceId);
  }),
  pick(["virtualInterfaceId"]),
]);

const decorate = ({ endpoint, config }) =>
  pipe([
    tap((params) => {
      assert(endpoint);
    }),
    ({ siteLinkEnabled, ...other }) => ({
      ...other,
      enableSiteLink: siteLinkEnabled,
    }),
    assign({
      arn: pipe([
        ({ virtualInterfaceId }) =>
          `arn:aws:directconnect:${
            config.region
          }:${config.accountId()}:dxvif/${virtualInterfaceId}`,
      ]),
    }),
    omitIfEmpty(["routeFilterPrefixes"]),
  ]);

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/DirectConnect.html
exports.DirectConnectVirtualInterface = ({ compare }) => ({
  type: "VirtualInterface",
  package: "direct-connect",
  client: "DirectConnect",
  propertiesDefault: {},
  omitProperties: [
    "connectionId",
    "virtualInterfaceState",
    "virtualInterfaceId",
    "virtualGatewayId",
    "directConnectGatewayId",
    "bgpPeers",
    "ownerAccount",
    "arn",
    "awsLogicalDeviceId",
    "awsDeviceV2",
    "region",
    "customerRouterConfig",
    "jumboFrameCapable",
    "amazonSideAsn",
    "location",
  ],
  inferName: () =>
    pipe([
      get("virtualInterfaceName"),
      tap((Name) => {
        assert(Name);
      }),
    ]),
  findName: () =>
    pipe([
      get("virtualInterfaceName"),
      tap((name) => {
        assert(name);
      }),
    ]),
  findId: () =>
    pipe([
      get("virtualInterfaceId"),
      tap((id) => {
        assert(id);
      }),
    ]),
  dependencies: {
    connection: {
      type: "Connection",
      group: "DirectConnect",
      dependencyId: () => pipe([get("connectionId")]),
    },
    lag: {
      type: "Lag",
      group: "DirectConnect",
      dependencyId: () => pipe([get("connectionId")]),
    },
    gateway: {
      type: "Gateway",
      group: "DirectConnect",
      dependencyId: () => pipe([get("directConnectGatewayId")]),
    },
  },
  ignoreErrorCodes: ["ResourceNotFoundException"],
  environmentVariables: [
    {
      path: "authKey",
      suffix: "AUTH_KEY",
    },
  ],
  compare: compare({ filterAll: () => pipe([omit(["authKey"])]) }),
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/DirectConnect.html#describeVirtualInterfaces-property
  getById: {
    method: "describeVirtualInterfaces",
    getField: "virtualInterfaces",
    pickId,
    decorate,
  },
  getList: {
    filterResource: not(isInstanceDown),
    method: "describeVirtualInterfaces",
    getParam: "virtualInterfaces",
    decorate,
  },
  create: {
    filterPayload: ({ connectionId, virtualInterfaceType, ...other }) =>
      pipe([
        () => virtualInterfaceType,
        switchCase([
          eq(identity, "public"),
          () => ({ newPublicVirtualInterface: other }),
          eq(identity, "private"),
          () => ({ newPrivateVirtualInterface: other }),
          eq(identity, "transit"),
          () => ({ newTransitVirtualInterface: other }),
          (payload) => {
            assert(false, `should be public or private`);
          },
        ]),
        defaultsDeep({ connectionId }),
      ])(),
    method: () =>
      pipe([
        switchCase([
          // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/DirectConnect.html#createPublicVirtualInterface-property
          eq(get("virtualInterfaceType"), "public"),
          () => "createPublicVirtualInterface",
          // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/DirectConnect.html#createPrivateVirtualInterface-property
          eq(get("virtualInterfaceType"), "private"),
          () => "createPrivateVirtualInterface",
          // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/DirectConnect.html#createTransitVirtualInterface-property
          eq(get("virtualInterfaceType"), "transit"),
          () => "createPrivateVirtualInterface",
          (payload) => {
            assert(false, `should be public or private`);
          },
        ]),
      ]),
    pickCreated: ({ payload }) => pipe([identity]),
    // directConnectVirtualInterfaceState available
    // stateChangeError
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/DirectConnect.html#updateVirtualInterface-property
  update: {
    method: "updateVirtualInterface",
    filterParams: ({ payload, diff, live }) =>
      pipe([() => payload, defaultsDeep(pickId(live))])(),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/DirectConnect.html#deleteVirtualInterface-property
  destroy: {
    method: "deleteVirtualInterface",
    pickId,
    isInstanceDown: pipe([eq(get("virtualInterfaceState"), "deleted")]),
  },
  getByName: getByNameCore,
  tagger: ({ config }) =>
    Tagger({
      buildArn: buildArn({ config }),
    }),
  configDefault: ({
    name,
    namespace,
    properties: { tags, ...otherProps },
    dependencies: { connection, lag, gateway },
    config,
  }) =>
    pipe([
      () => otherProps,
      defaultsDeep({
        tags: buildTags({
          name,
          config,
          namespace,
          UserTags: tags,
          key: "key",
          value: "value",
        }),
      }),
      switchCase([
        () => connection,
        defaultsDeep({ connectionId: getField(connection, "connectionId") }),
        () => lag,
        defaultsDeep({ connectionId: getField(lag, "lagId") }),
        () => {
          assert(false, "need connection or lag");
        },
      ]),
      when(
        () => gateway,
        defaultsDeep({
          directConnectGatewayId: getField(gateway, "directConnectGatewayId"),
        })
      ),
    ])(),
});
