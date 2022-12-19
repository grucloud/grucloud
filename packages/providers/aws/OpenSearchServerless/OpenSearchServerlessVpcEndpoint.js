const assert = require("assert");
const { pipe, tap, get, eq, pick, map } = require("rubico");
const { defaultsDeep } = require("rubico/x");

const { getField } = require("@grucloud/core/ProviderCommon");
const { getByNameCore } = require("@grucloud/core/Common");

const pickId = pipe([
  tap(({ id }) => {
    assert(id);
  }),
  pick(["id"]),
]);

const decorate = ({ endpoint }) =>
  pipe([
    tap((params) => {
      assert(endpoint);
    }),
  ]);

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/OpenSearchServerless.html
exports.OpenSearchServerlessVpcEndpoint = ({ compare }) => ({
  type: "VpcEndpoint",
  package: "opensearchserverless",
  client: "OpenSearchServerless",
  propertiesDefault: {},
  omitProperties: [
    "vpcId",
    "subnetIds",
    "securityGroupIds",
    "createdDate",
    "id",
    "status",
  ],
  inferName: () => pipe([get("name")]),
  findName: () => pipe([get("name")]),
  findId: () =>
    pipe([
      get("id"),
      tap((id) => {
        assert(id);
      }),
    ]),
  dependencies: {
    securityGroups: {
      type: "SecurityGroup",
      group: "EC2",
      list: true,
      dependencyIds: ({ lives, config }) => get("securityGroupIds"),
    },
    subnets: {
      type: "Subnet",
      group: "EC2",
      list: true,
      dependencyIds: ({ lives, config }) => get("subnetIds"),
    },
    vpc: {
      type: "Vpc",
      group: "EC2",
      dependencyId: ({ lives, config }) =>
        pipe([
          tap((params) => {
            assert(true);
          }),
          get("vpcId"),
        ]),
    },
  },
  ignoreErrorCodes: ["ResourceNotFoundException"],
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/OpenSearchServerless.html#describeVpcEndpoint-property
  getById: {
    method: "batchGetVpcEndpoint",
    getField: "vpcEndpointDetails",
    pickId: pipe([
      tap(({ id }) => {
        assert(id);
      }),
      ({ id }) => ({ ids: [id] }),
    ]),
    decorate,
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/OpenSearchServerless.html#listVpcEndpoints-property
  getList: {
    method: "listVpcEndpoints",
    getParam: "vpcEndpointSummaries",
    decorate,
    decorate: ({ getById }) => pipe([getById]),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/OpenSearchServerless.html#createVpcEndpoint-property
  create: {
    method: "createVpcEndpoint",
    pickCreated: ({ payload }) => pipe([get("createVpcEndpointDetail")]),
    isInstanceUp: pipe([eq(get("status"), "ACTIVE")]),
    isInstanceError: pipe([eq(get("status"), "FAILED")]),
    getErrorMessage: get("vpcEndpointErrorDetails", "errorMessage"),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/OpenSearchServerless.html#updateVpcEndpoint-property
  /**
   * TODO
   * var params = {
  id: 'STRING_VALUE',
  addSecurityGroupIds: [
    'STRING_VALUE',
  ],
  addSubnetIds: [
    'STRING_VALUE',
  ],
  clientToken: 'STRING_VALUE',
  removeSecurityGroupIds: [
    'STRING_VALUE',
  ],
  removeSubnetIds: [
    'STRING_VALUE',
  ]
};
   */
  update: {
    method: "updateVpcEndpoint",
    filterParams: ({ payload, diff, live }) =>
      pipe([() => payload, defaultsDeep(pickId(live))])(),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/OpenSearchServerless.html#deleteVpcEndpoint-property
  destroy: {
    method: "deleteVpcEndpoint",
    pickId,
  },
  getByName: getByNameCore,
  configDefault: ({
    name,
    namespace,
    properties: { ...otherProps },
    dependencies: { vpc, subnets, securityGroups },
    config,
  }) =>
    pipe([
      tap((params) => {
        assert(vpc);
        assert(subnets);
        assert(securityGroups);
      }),
      () => otherProps,
      defaultsDeep({
        vpcId: getField(vpc, "VpcId"),
        subnetIds: pipe([
          () => subnets,
          map((subnet) => getField(subnet, "SubnetId")),
        ])(),
        securityGroupIds: pipe([
          () => securityGroups,
          map((sg) => getField(sg, "GroupId")),
        ])(),
      }),
    ])(),
});
