const assert = require("assert");
const { pipe, tap, get, pick, eq, map } = require("rubico");
const { defaultsDeep, pluck, when, identity } = require("rubico/x");

const { getField } = require("@grucloud/core/ProviderCommon");

const pickId = pipe([
  tap(({ EndpointName }) => {
    assert(EndpointName);
  }),
  pick(["EndpointName"]),
]);

const decorate = ({ endpoint }) =>
  pipe([
    tap((params) => {
      assert(endpoint);
    }),
    ({ VpcSecurityGroups, ...other }) => ({
      ...other,
      VpcSecurityGroupIds: pluck("VpcSecurityGroupId")(VpcSecurityGroups),
    }),
  ]);

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Redshift.html
exports.RedshiftEndpointAccess = () => ({
  type: "EndpointAccess",
  package: "redshift",
  client: "Redshift",
  propertiesDefault: {},
  omitProperties: [
    "EndpointStatus",
    "ResourceOwner",
    "EndpointCreateTime",
    "Address",
    "VpcSecurityGroups",
    "VpcEndpoint",
  ],
  inferName: () =>
    pipe([
      get("EndpointName"),
      tap((Name) => {
        assert(Name);
      }),
    ]),
  findName: () =>
    pipe([
      get("EndpointName"),
      tap((name) => {
        assert(name);
      }),
    ]),
  findId: () =>
    pipe([
      get("EndpointName"),
      tap((id) => {
        assert(id);
      }),
    ]),
  dependencies: {
    cluster: {
      type: "Cluster",
      group: "Redshift",
      dependencyId: ({ lives, config }) => pipe([get("ClusterIdentifier")]),
    },
    securityGroups: {
      type: "SecurityGroup",
      group: "EC2",
      list: true,
      dependencyIds: ({ lives, config }) => pipe([get("VpcSecurityGroupIds")]),
    },
    subnetGroup: {
      type: "SubnetGroup",
      group: "Redshift",
      dependencyId: ({ lives, config }) => pipe([get("SubnetGroupName")]),
    },
  },
  ignoreErrorCodes: ["ResourceNotFoundException", "EndpointNotFoundFault"],
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Redshift.html#describeEndpointAccess-property
  getById: {
    method: "describeEndpointAccess",
    getField: "EndpointAccessList",
    pickId,
    decorate,
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Redshift.html#describeEndpointAccess-property
  getList: {
    method: "describeEndpointAccess",
    getParam: "EndpointAccessList",
    decorate,
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Redshift.html#createEndpointAccess-property
  create: {
    method: "createEndpointAccess",
    pickCreated: ({ payload }) => pipe([() => payload]),
    //isInstanceUp: pipe([eq(get("EndpointStatus"), "AVAILABLE")]),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Redshift.html#updateEndpointAccess-property
  update: {
    method: "modifyEndpointAccess",
    filterParams: ({ payload, diff, live }) => pipe([() => payload])(),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Redshift.html#deleteEndpointAccess-property
  destroy: {
    method: "deleteEndpointAccess",
    pickId,
  },
  getByName: ({ getById }) =>
    pipe([({ name }) => ({ EndpointName: name }), getById({})]),
  configDefault: ({
    name,
    properties: { ...otherProps },
    dependencies: { cluster, subnetGroup, securityGroups },
    config,
  }) =>
    pipe([
      tap((params) => {
        assert(cluster);
        assert(subnetGroup);
      }),
      () => otherProps,
      defaultsDeep({
        ClusterIdentifier: getField(cluster, "ClusterIdentifier"),
        SubnetGroupName: getField(subnetGroup, "ClusterSubnetGroupName"),
      }),
      when(
        () => securityGroups,
        defaultsDeep({
          VpcSecurityGroupIds: pipe([
            () => securityGroups,
            map((sg) => getField(sg, "GroupId")),
          ])(),
        })
      ),
    ])(),
});
