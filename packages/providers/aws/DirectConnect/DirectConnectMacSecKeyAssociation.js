const assert = require("assert");
const {
  pipe,
  tap,
  get,
  pick,
  flatMap,
  eq,
  map,
  switchCase,
  omit,
} = require("rubico");
const {
  defaultsDeep,
  first,
  find,
  unless,
  isEmpty,
  callProp,
} = require("rubico/x");

const { deleteSecret } = require("./DirectConnectCommon");

const { getField } = require("@grucloud/core/ProviderCommon");

const pickId = pipe([
  tap(({ connectionId, secretARN }) => {
    assert(connectionId);
    assert(secretARN);
  }),
  pick(["connectionId", "secretARN"]),
]);

const decorate = ({ endpoint }) =>
  pipe([
    tap((params) => {
      assert(endpoint);
    }),
  ]);

const fetchLagOrConnection = ({ endpoint }) =>
  pipe([
    tap(({ connectionId }) => {
      assert(connectionId);
    }),
    switchCase([
      pipe([get("connectionId"), callProp("startsWith", "dxcon-")]),
      pipe([
        pick(["connectionId"]),
        endpoint().describeConnections,
        get("connections"),
      ]),
      pipe([get("connectionId"), callProp("startsWith", "dxlag-")]),
      pipe([
        ({ connectionId }) => ({ lagId: connectionId }),
        endpoint().describeLags,
        get("lags"),
      ]),
      () => {
        assert(false, "should be connection or a lag");
      },
    ]),
    first,
    tap((params) => {
      assert(true);
    }),
  ]);

const isInstanceDisassociated = pipe([eq(get("state"), "disassociated")]);

const cannotBeDeleted = () => isInstanceDisassociated;

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/DirectConnect.html
exports.DirectConnectMacSecKeyAssociation = ({ compare }) => ({
  type: "MacSecKeyAssociation",
  package: "direct-connect",
  client: "DirectConnect",
  propertiesDefault: {},
  omitProperties: ["connectionId", "secretARN", "state", "startOn"],
  cannotBeDeleted,
  managedByOther: cannotBeDeleted,
  inferName: () => get("ckn"),
  findName: () => get("ckn"),
  findId: () => get("ckn"),
  dependencies: {
    connection: {
      type: "Connection",
      group: "DirectConnect",
      parent: true,
      dependencyId: () => pipe([get("connectionId")]),
    },
    lag: {
      type: "Lag",
      group: "DirectConnect",
      parent: true,
      dependencyId: () => pipe([get("connectionId")]),
    },
  },
  ignoreErrorCodes: ["DirectConnectClientException"],
  compare: compare({
    filterAll: () => pipe([omit(["cak"])]),
  }),
  environmentVariables: [
    {
      path: "ckn",
      suffix: "CKN",
    },
    { path: "cak", suffix: "CAK" },
  ],
  getById:
    ({ endpoint, config }) =>
    ({ lives }) =>
    (live) =>
      pipe([
        tap(() => {
          assert(live.connectionId);
          assert(live.secretARN);
        }),
        () => live,
        fetchLagOrConnection({ endpoint }),
        get("macSecKeys"),
        find(eq(get("secretARN"), live.secretARN)),
        unless(isEmpty, decorate({ endpoint })),
      ])(),
  getList:
    ({ endpoint, config }) =>
    ({ lives }) =>
      pipe([
        //TODO list Connection
        tap((params) => {
          assert(lives);
        }),
        lives.getByType({
          type: "Lag",
          group: "DirectConnect",
          providerName: config.providerName,
        }),
        flatMap(
          pipe([
            get("live"),
            ({ lagId, macSecKeys }) =>
              pipe([
                () => macSecKeys,
                map(defaultsDeep({ connectionId: lagId })),
              ])(),
          ])
        ),
      ])(),
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/DirectConnect.html#associateMacSecKey-property
  create: {
    method: "associateMacSecKey",
    pickCreated: ({ payload: { ckn, connectionId } }) =>
      pipe([
        tap((params) => {
          assert(ckn);
          assert(connectionId);
        }),
        get("macSecKeys"),
        find(eq(get("ckn"), ckn)),
        defaultsDeep({ connectionId }),
        tap((params) => {
          assert(true);
        }),
      ]),
    isInstanceUp: pipe([eq(get("state"), "associated")]),
  },
  //TODO update
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/DirectConnect.html#disassociateMacSecKey-property
  destroy: {
    //postDestroy: deleteSecret,
    method: "disassociateMacSecKey",
    pickId,
    isInstanceDown: isInstanceDisassociated,
  },
  getByName:
    ({ getList, endpoint }) =>
    ({ name, resolvedDependencies: { connection, lag } }) =>
      pipe([
        // TODO add connection
        tap((params) => {
          assert(name);
        }),
        () => lag,
        get("live"),
        pick(["lagId"]),
        endpoint().describeLags,
        tap((params) => {
          assert(true);
        }),
        get("lags"),
        first,
        get("macSecKeys"),
        find(eq(get("ckn"), name)),
        unless(isEmpty, decorate({ endpoint })),
        tap((params) => {
          assert(true);
        }),
      ])(),
  configDefault: ({
    name,
    properties: { ...otherProps },
    dependencies: { connection, lag },
    config,
  }) =>
    pipe([
      () => otherProps,
      switchCase([
        () => connection,
        defaultsDeep({
          connectionId: getField(connection, "connectionId"),
        }),
        () => lag,
        defaultsDeep({
          connectionId: getField(lag, "lagId"),
        }),
        () => {
          assert(false, "connection or lag missing");
        },
      ]),
    ])(),
});
