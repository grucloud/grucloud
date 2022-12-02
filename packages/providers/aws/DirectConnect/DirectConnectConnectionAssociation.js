const assert = require("assert");
const {
  pipe,
  tap,
  get,
  pick,
  fork,
  eq,
  flatMap,
  omit,
  map,
} = require("rubico");
const {
  defaultsDeep,
  identity,
  first,
  unless,
  isEmpty,
  find,
} = require("rubico/x");

const { getField } = require("@grucloud/core/ProviderCommon");

const pickId = pipe([
  tap(({ connectionId, lagId }) => {
    assert(connectionId);
    assert(lagId);
  }),
  pick(["connectionId", "lagId"]),
]);

const decorate = ({ endpoint }) =>
  pipe([
    tap((params) => {
      assert(endpoint);
    }),
    omit(["tags"]),
  ]);

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/DirectConnect.html
exports.DirectConnectConnectionAssociation = ({ compare }) => ({
  type: "ConnectionAssociation",
  package: "direct-connect",
  client: "DirectConnect",
  propertiesDefault: {},
  omitProperties: [],
  inferName: ({ dependenciesSpec: { connection, lag } }) =>
    pipe([
      tap((params) => {
        assert(connection);
        assert(lag);
      }),
      () => `${lag}::${connection}`,
    ]),
  findName:
    ({ lives, config }) =>
    (live) =>
      pipe([
        () => live,
        fork({
          connection: pipe([
            get("connectionId"),
            tap((id) => {
              assert(id);
            }),
            lives.getById({
              type: "Connection",
              group: "DirectConnect",
            }),
            get("name", live.connectionId),
          ]),
          lag: pipe([
            get("lagId"),
            tap((id) => {
              assert(id);
            }),
            lives.getById({
              type: "Lag",
              group: "DirectConnect",
            }),
            get("name", live.lagId),
          ]),
        }),
        ({ lag, connection }) => `${lag}::${connection}`,
      ])(),
  findId:
    () =>
    ({ connectionId, lagId }) =>
      pipe([
        () => `${lagId}::${connectionId}`,
        tap((id) => {
          assert(id);
        }),
      ])(),
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
      dependencyId: () => pipe([get("lagId")]),
    },
  },
  ignoreErrorCodes: ["ResourceNotFoundException"],
  compare: compare({ filterAll: () => pipe([pick([])]) }),
  filterLive: ({ lives, providerConfig }) => pipe([pick([])]),
  getById:
    ({ endpoint, config }) =>
    ({ lives }) =>
    (live) =>
      pipe([
        tap((params) => {
          assert(live.connectionId);
        }),
        () => live,
        pick(["lagId"]),
        endpoint().describeLags,
        get("lags"),
        first,
        get("connections"),
        find(eq(get("connectionId"), live.connectionId)),
        unless(isEmpty, decorate({ endpoint })),
      ])(),
  getList:
    ({ client, endpoint, getById, config }) =>
    ({ lives }) =>
      pipe([
        lives.getByType({
          type: "Lag",
          group: "DirectConnect",
          providerName: config.providerName,
        }),
        flatMap(pipe([get("live.connections")])),
        map(decorate({ endpoint })),
      ])(),
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/DirectConnect.html#createConnectionAssociation-property
  create: {
    method: "associateConnectionWithLag",
    pickCreated: ({ payload }) => pipe([identity]),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/DirectConnect.html#updateConnectionAssociation-property
  update: {
    method: "updateConnectionAssociation",
    filterParams: ({ pickId, payload, diff, live }) =>
      pipe([() => payload, defaultsDeep(pickId(live))])(),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/DirectConnect.html#disassociateConnectionFromLag-property
  destroy: {
    method: "disassociateConnectionFromLag",
    pickId,
  },
  getByName:
    ({ getList, endpoint }) =>
    ({ name, resolvedDependencies: { lag, connection } }) =>
      pipe([
        tap((params) => {
          assert(lag);
          assert(connection);
        }),
        () => lag,
        get("live"),
        pick(["lagId"]),
        tap(({ lagId }) => {
          assert(lagId);
        }),
        endpoint().describeLags,
        get("lags"),
        first,
        get("connections"),
        find(eq(get("connectionId"), get("live.connectionId")(connection))),
        unless(isEmpty, decorate({ endpoint })),
      ])(),
  configDefault: ({
    name,
    properties,
    dependencies: { connection, lag },
    config,
  }) =>
    pipe([
      tap((params) => {
        assert(connection);
        assert(lag);
      }),
      () => ({
        connectionId: getField(connection, "connectionId"),
        lagId: getField(lag, "lagId"),
      }),
    ])(),
});
