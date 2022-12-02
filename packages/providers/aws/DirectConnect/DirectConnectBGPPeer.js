const assert = require("assert");
const { pipe, tap, get, pick, flatMap, eq, map, omit } = require("rubico");
const {
  defaultsDeep,
  first,
  find,
  unless,
  isEmpty,
  prepend,
  callProp,
  filterOut,
} = require("rubico/x");

const { getField } = require("@grucloud/core/ProviderCommon");

const pickId = pipe([
  tap(({ bgpPeerId, virtualInterfaceId }) => {
    assert(bgpPeerId);
    assert(virtualInterfaceId);
  }),
  pick(["bgpPeerId", "virtualInterfaceId"]),
]);

const decorate = ({ endpoint }) =>
  pipe([
    tap((params) => {
      assert(endpoint);
    }),
  ]);

const findName = () =>
  pipe([
    get("asn"),
    callProp("toString"),
    prepend("asn::"),
    tap((name) => {
      assert(name);
    }),
  ]);

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/DirectConnect.html
exports.DirectConnectBGPPeer = ({ compare }) => ({
  type: "BGPPeer",
  package: "direct-connect",
  client: "DirectConnect",
  propertiesDefault: {},
  omitProperties: [
    "bgpPeerId",
    "bgpPeerState",
    "bgpStatus",
    "awsDeviceV2",
    "awsLogicalDeviceId",
    "virtualInterfaceId",
  ],
  inferName: findName,
  findName,
  findId: () =>
    pipe([
      get("bgpPeerId"),
      tap((id) => {
        assert(id);
      }),
    ]),
  dependencies: {
    virtualInterface: {
      type: "VirtualInterface",
      group: "DirectConnect",
      parent: true,
      dependencyId: ({ lives, config }) => pipe([get("virtualInterfaceId")]),
    },
  },
  ignoreErrorCodes: ["DirectConnectClientException"],
  environmentVariables: [
    {
      path: "authKey",
      suffix: "AUTH_KEY",
    },
  ],
  compare: compare({ filterAll: () => pipe([omit(["authKey"])]) }),
  getById:
    ({ endpoint, config }) =>
    ({ lives }) =>
    (live) =>
      pipe([
        tap((params) => {
          assert(live.bgpPeerId);
        }),
        () => live,
        pick(["virtualInterfaceId"]),
        endpoint().describeVirtualInterfaces,
        get("virtualInterfaces"),
        first,
        get("bgpPeers"),
        find(eq(get("bgpPeerId"), live.bgpPeerId)),
        unless(isEmpty, decorate({ endpoint })),
      ])(),
  getList:
    ({ endpoint, config }) =>
    ({ lives }) =>
      pipe([
        lives.getByType({
          type: "VirtualInterface",
          group: "DirectConnect",
          providerName: config.providerName,
        }),
        flatMap(
          pipe([
            get("live"),
            ({ bgpPeers, virtualInterfaceId, customerAddress }) =>
              pipe([
                () => bgpPeers,
                filterOut(eq(get("customerAddress"), customerAddress)),
                map(defaultsDeep({ virtualInterfaceId })),
              ])(),
          ])
        ),
      ])(),
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/DirectConnect.html#createBGPPeer-property
  create: {
    filterPayload: ({ virtualInterfaceId, ...other }) =>
      pipe([() => ({ virtualInterfaceId, newBGPPeer: other })])(),
    method: "createBGPPeer",
    pickCreated: ({ payload }) => pipe([get("virtualInterface")]),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/DirectConnect.html#updateBGPPeer-property
  update: {
    method: "updateBGPPeer",
    filterParams: ({ pickId, payload, diff, live }) =>
      pipe([() => payload, defaultsDeep(pickId(live))])(),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/DirectConnect.html#deleteBGPPeer-property
  destroy: {
    method: "deleteBGPPeer",
    pickId,
    isInstanceDown: pipe([eq(get("bgpPeerState"), "deleted")]),
  },
  getByName:
    ({ getList, endpoint }) =>
    ({ name, resolvedDependencies: { virtualInterface } }) =>
      pipe([
        tap((params) => {
          assert(virtualInterface);
        }),
        () => virtualInterface,
        get("live"),
        pick(["virtualInterfaceId"]),
        tap(({ virtualInterfaceId }) => {
          assert(virtualInterfaceId);
        }),
        endpoint().describeVirtualInterfaces,
        get("virtualInterfaces"),
        first,
        get("bgpPeers"),
        find(eq(get("asn"), name)),
        unless(isEmpty, decorate({ endpoint })),
      ]),
  configDefault: ({
    name,
    properties: { ...otherProps },
    dependencies: { virtualInterface },
    config,
  }) =>
    pipe([
      tap((params) => {
        assert(virtualInterface);
      }),
      () => otherProps,
      defaultsDeep({
        virtualInterfaceId: getField(virtualInterface, "virtualInterfaceId"),
      }),
    ])(),
});
