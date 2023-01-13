const assert = require("assert");
const { pipe, tap, get, pick, fork, map, eq } = require("rubico");
const { defaultsDeep, when, identity } = require("rubico/x");
const { getByNameCore } = require("@grucloud/core/Common");

const { getField } = require("@grucloud/core/ProviderCommon");

const pickId = pipe([
  tap(({ ClusterIdentifier, Account }) => {
    assert(ClusterIdentifier);
    assert(Account);
  }),
  pick(["ClusterIdentifier", "Account"]),
]);

const decorate = ({ endpoint }) =>
  pipe([
    tap((params) => {
      assert(endpoint);
    }),
    ({ AllowedVPCs, Grantee, ...other }) => ({
      ...other,
      Account: Grantee,
      VpcIds: AllowedVPCs,
    }),
  ]);

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Redshift.html
exports.RedshiftEndpointAuthorization = () => ({
  type: "EndpointAuthorization",
  package: "redshift",
  client: "Redshift",
  propertiesDefault: {},
  omitProperties: [
    "AuthorizeTime",
    "ClusterStatus",
    "Status",
    "EndpointCount",
    "ClusterIdentifier",
    "Grantor",
    "Account",
    "AllowedAllVPCs",
  ],
  inferName: ({ dependenciesSpec: { account, cluster } }) =>
    pipe([
      tap((param) => {
        assert(account);
        assert(cluster);
      }),
      () => `${cluster}::${account}`,
    ]),
  findName:
    ({ lives, config }) =>
    (live) =>
      pipe([
        () => live,
        fork({
          account: pipe([
            get("Account"),
            tap((id) => {
              assert(id);
            }),
            lives.getById({
              type: "Account",
              group: "Organisations",
              providerName: config.providerName,
            }),
            get("name", live.Account),
          ]),
          cluster: pipe([
            get("ClusterIdentifier"),
            tap((id) => {
              assert(id);
            }),
            lives.getById({
              type: "Cluster",
              group: "Redshift",
              providerName: config.providerName,
            }),
            get("name", live.ClusterIdentifier),
          ]),
        }),
        tap(({ account, cluster }) => {
          assert(account);
          assert(cluster);
        }),
        ({ account, cluster }) => `${cluster}::${account}`,
      ])(),
  findId:
    () =>
    ({ ClusterIdentifier, Account }) =>
      pipe([
        tap((params) => {
          assert(ClusterIdentifier);
          assert(Account);
        }),
        () => `${ClusterIdentifier}::${Account}`,
      ])(),
  dependencies: {
    account: {
      type: "Account",
      group: "Organisations",
      parent: true,
      parentForName: true, //TODO
      dependencyId: ({ lives, config }) =>
        pipe([
          get("Account"),
          tap((Account) => {
            assert(Account);
          }),
        ]),
    },
    cluster: {
      type: "Cluster",
      group: "Redshift",
      parent: true,
      parentForName: true,
      dependencyId: ({ lives, config }) => pipe([get("ClusterIdentifier")]),
    },
    vpcs: {
      type: "Vpc",
      group: "EC2",
      list: true,
      dependencyIds: ({ lives, config }) => pipe([get("VpcIds")]),
    },
  },
  ignoreErrorCodes: ["ResourceNotFoundException", "ClusterNotFoundFault"],
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Redshift.html#describeEndpointAuthorization-property
  getById: {
    method: "describeEndpointAuthorization",
    getField: "EndpointAuthorizationList",
    pickId,
    decorate,
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Redshift.html#describeEndpointAuthorization-property
  getList: {
    method: "describeEndpointAuthorization",
    getParam: "EndpointAuthorizationList",
    decorate,
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Redshift.html#createEndpointAuthorization-property
  create: {
    method: "authorizeEndpointAccess",
    pickCreated: ({ payload }) => pipe([() => payload]),
    isInstanceUp: pipe([eq(get("Status"), "authorized")]),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Redshift.html#updateEndpointAuthorization-property
  update: {
    method: "authorizeEndpointAccess",
    filterParams: ({ payload, diff, live }) => pipe([() => payload])(),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Redshift.html#deleteEndpointAuthorization-property
  destroy: {
    method: "revokeEndpointAccess",
    pickId,
  },
  getByName: getByNameCore,
  configDefault: ({
    name,
    properties: { ...otherProps },
    dependencies: { account, cluster, vpcs },
    config,
  }) =>
    pipe([
      tap((params) => {
        assert(cluster);
        assert(account);
      }),
      () => otherProps,
      defaultsDeep({
        Account: getField(account, "Id"),
        ClusterIdentifier: getField(cluster, "ClusterIdentifier"),
      }),
      when(
        () => vpcs,
        defaultsDeep({
          VpcIds: pipe([() => vpcs, map((vpc) => getField(vpc, "VpcId"))])(),
        })
      ),
    ])(),
});
