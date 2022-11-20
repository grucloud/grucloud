const assert = require("assert");
const { pipe, tap, get, pick, eq, map } = require("rubico");
const { defaultsDeep, pluck, when } = require("rubico/x");

const { getField } = require("@grucloud/core/ProviderCommon");
const { buildTags } = require("../AwsCommon");

const { Tagger } = require("./RedshiftServerlessCommon");

const buildArn = () =>
  pipe([
    get("endpointArn"),
    tap((arn) => {
      assert(arn);
    }),
  ]);

const pickId = pipe([
  tap(({ endpointName }) => {
    assert(endpointName);
  }),
  pick(["endpointName"]),
]);

const decorate = ({ endpoint }) =>
  pipe([
    tap((params) => {
      assert(endpoint);
    }),
    ({ vpcSecurityGroups, ...other }) => ({
      ...other,
      vpcSecurityGroupIds: pluck("vpcSecurityGroupId")(vpcSecurityGroups),
    }),
  ]);

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/RedshiftServerless.html
exports.RedshiftServerlessEndpointAccess = () => ({
  type: "EndpointAccess",
  package: "redshift-serverless",
  client: "RedshiftServerless",
  propertiesDefault: {},
  omitProperties: [
    "address",
    "endpointArn",
    "endpointCreateTime",
    "endpointStatus",
    "subnetIds",
    "vpcSecurityGroupIds",
    "port",
  ],
  inferName: pipe([
    get("properties.endpointName"),
    tap((Name) => {
      assert(Name);
    }),
  ]),
  findName: () =>
    pipe([
      get("endpointName"),
      tap((name) => {
        assert(name);
      }),
    ]),
  findId: () =>
    pipe([
      get("endpointName"),
      tap((id) => {
        assert(id);
      }),
    ]),
  dependencies: {
    workgroup: {
      type: "Workgroup",
      group: "RedshiftServerless",
      dependencyId: ({ lives, config }) => pipe([get("workgroupName")]),
    },
    securityGroups: {
      type: "SecurityGroup",
      group: "EC2",
      list: true,
      dependencyIds: ({ lives, config }) => pipe([get("vpcSecurityGroupIds")]),
    },
    subnets: {
      type: "Subnet",
      group: "EC2",
      list: true,
      dependencyIds: ({ lives, config }) => pipe([get("subnetIds")]),
    },
  },
  ignoreErrorCodes: ["ResourceNotFoundException"],
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/RedshiftServerless.html#getEndpointAccess-property
  getById: {
    method: "getEndpointAccess",
    getField: "endpoint",
    pickId,
    decorate,
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/RedshiftServerless.html#listEndpointAccess-property
  getList: {
    method: "listEndpointAccess",
    getParam: "endpoints",
    decorate,
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/RedshiftServerless.html#createEndpointAccess-property
  create: {
    method: "createEndpointAccess",
    pickCreated: ({ payload }) => pipe([get("endpoint")]),
    isInstanceUp: pipe([eq(get("status"), "AVAILABLE")]),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/RedshiftServerless.html#updateEndpointAccess-property
  update: {
    method: "updateEndpointAccess",
    filterParams: ({ pickId, payload, diff, live }) => pipe([() => payload])(),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/RedshiftServerless.html#deleteEndpointAccess-property
  destroy: {
    method: "deleteEndpointAccess",
    pickId,
  },
  getByName: ({ getById }) =>
    pipe([({ name }) => ({ endpointName: name }), getById({})]),
  tagger: ({ config }) =>
    Tagger({
      buildArn: buildArn({ config }),
    }),
  configDefault: ({
    name,
    properties: { tags, ...otherProps },
    dependencies: { workgroup, subnets, securityGroups },
    config,
  }) =>
    pipe([
      tap((params) => {
        assert(workgroup);
      }),
      () => otherProps,
      defaultsDeep({
        workgroupName: getField(workgroup, "workgroupName"),
        tags: buildTags({
          name,
          config,
          UserTags: tags,
          key: "key",
          value: "value",
        }),
      }),
      when(
        () => securityGroups,
        defaultsDeep({
          vpcSecurityGroupIds: pipe([
            () => securityGroups,
            map((sg) => getField(sg, "GroupId")),
          ])(),
        })
      ),
      when(
        () => subnets,
        defaultsDeep({
          subnetIds: pipe([
            () => subnets,
            map((subnet) => getField(subnet, "SubnetId")),
          ])(),
        })
      ),
    ])(),
});
