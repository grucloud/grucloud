const assert = require("assert");
const { pipe, tap, get, eq, pick, map } = require("rubico");
const { defaultsDeep } = require("rubico/x");

const { getField } = require("@grucloud/core/ProviderCommon");
const { getByNameCore } = require("@grucloud/core/Common");

const pickId = pipe([
  tap(({ VpcEndpointId }) => {
    assert(VpcEndpointId);
  }),
  pick(["VpcEndpointId"]),
]);

const decorate = ({ endpoint }) =>
  pipe([
    tap((params) => {
      assert(endpoint);
    }),
  ]);

const managedByOtherAccount = ({ config }) =>
  pipe([
    tap((params) => {
      assert(config);
      assert(config.accountId());
    }),
    not(eq(get("VpcEndpointOwner"), config.accountId())),
  ]);

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/OpenSearch.html
exports.OpenSearchVpcEndpoint = ({ compare }) => ({
  type: "VpcEndpoint",
  package: "opensearch",
  client: "OpenSearch",
  propertiesDefault: {},
  omitProperties: [
    "VpcEndpointId",
    "VpcOptions",
    "Status",
    "DomainArn",
    "VpcEndpointOwner",
    "Endpoint",
  ],
  inferName: ({ dependenciesSpec: { openSearchDomain, vpc } }) =>
    pipe([
      tap((params) => {
        assert(openSearchDomain);
        assert(vpc);
      }),
      () => `vpce::${openSearchDomain}::${vpc}`,
    ]),
  findName:
    ({ lives, config }) =>
    (live) =>
      pipe([
        () => live,
        fork({
          openSearchDomain: pipe([
            get("DomainArn"),
            tap((id) => {
              assert(id);
            }),
            lives.getById({
              type: "Domain",
              group: "OpenSearch",
            }),
            get("name"),
          ]),
          vpc: pipe([
            get("VpcOptions.VPCId"),
            tap((id) => {
              assert(id);
            }),
            lives.getById({
              type: "Vpc",
              group: "EC2",
              providerName: config.providerName,
            }),
            get("name"),
          ]),
        }),
        tap(({ openSearchDomain, vpc }) => {
          assert(openSearchDomain);
          assert(vpc);
        }),
        ({ openSearchDomain, vpc }) => `vpce::${openSearchDomain}::${vpc}`,
      ])(),
  findId: () =>
    pipe([
      get("VpcEndpointId"),
      tap((id) => {
        assert(id);
      }),
    ]),
  managedByOther: managedByOtherAccount,
  dependencies: {
    openSearchDomain: {
      type: "Domain",
      group: "OpenSearch",
      parent: true,
      dependencyId: ({ lives, config }) => get("DomainArn"),
    },
    vpc: {
      type: "Vpc",
      group: "EC2",
      parent: true,
      dependencyId: ({ lives, config }) => get("VpcOptions.VPCId"),
    },
    securityGroups: {
      type: "SecurityGroup",
      group: "EC2",
      list: true,
      excludeDefaultDependencies: true,
      dependencyIds: ({ lives, config }) => get("VpcOptions.SecurityGroupIds"),
    },
    subnets: {
      type: "Subnet",
      group: "EC2",
      list: true,
      excludeDefaultDependencies: true,
      dependencyIds: ({ lives, config }) => get("VpcOptions.SubnetIds"),
    },
  },
  ignoreErrorCodes: ["ResourceNotFoundException"],
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/OpenSearch.html#describeVpcEndpoint-property
  getById: {
    method: "describeVpcEndpoints",
    getField: "VpcEndpoints",
    pickId: pipe([
      tap(({ VpcEndpointId }) => {
        assert(VpcEndpointId);
      }),
      ({ VpcEndpointId }) => ({ VpcEndpointIds: [VpcEndpointId] }),
    ]),
    decorate,
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/OpenSearch.html#describeVpcEndpoints-property
  getList: {
    method: "listVpcEndpoints",
    getParam: "VpcEndpointSummaryList",
    decorate: ({ getById }) => pipe([getById]),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/OpenSearch.html#createVpcEndpoint-property
  create: {
    method: "createVpcEndpoint",
    pickCreated: ({ payload }) => pipe([get("VpcEndpoint")]),
    isInstanceUp: pipe([eq(get("Status"), "ACTIVE")]),
    isInstanceError: pipe([eq(get("Status"), "CREATE_FAILED")]),
    getErrorMessage: get("VpcEndpointErrors.ErrorMessage", "error"),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/OpenSearch.html#updateVpcEndpoint-property
  update: {
    method: "updateVpcEndpoint",
    filterParams: ({ payload, diff, live }) =>
      pipe([() => payload, defaultsDeep(pickId(live))])(),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/OpenSearch.html#deleteVpcEndpoint-property
  destroy: {
    method: "deleteVpcEndpoint",
    pickId,
  },
  getByName: getByNameCore,
  configDefault: ({
    name,
    namespace,
    properties: { ...otherProps },
    dependencies: { openSearchDomain, subnets, securityGroups },
    config,
  }) =>
    pipe([
      tap((params) => {
        assert(openSearchDomain);
        assert(subnets);
        assert(securityGroups);
      }),
      () => otherProps,
      defaultsDeep({
        DomainArn: getField(openSearchDomain, "ARN"),
        VpcOptions: {
          SubnetIds: pipe([
            () => subnets,
            map((subnet) => getField(subnet, "SubnetId")),
          ])(),
          SecurityGroupIds: pipe([
            () => securityGroups,
            map((sg) => getField(sg, "GroupId")),
          ])(),
        },
      }),
    ])(),
});
