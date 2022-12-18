const assert = require("assert");
const { pipe, tap, get, pick, eq, map } = require("rubico");
const { defaultsDeep, when } = require("rubico/x");

const { getField } = require("@grucloud/core/ProviderCommon");
const { buildTags } = require("../AwsCommon");

const { Tagger, assignTags } = require("./RedshiftServerlessCommon");

const buildArn = () =>
  pipe([
    get("workgroupArn"),
    tap((arn) => {
      assert(arn);
    }),
  ]);

const pickId = pipe([
  tap(({ workgroupName }) => {
    assert(workgroupName);
  }),
  pick(["workgroupName"]),
]);

const decorate = ({ endpoint }) =>
  pipe([
    tap((params) => {
      assert(endpoint);
    }),
    assignTags({ endpoint, buildArn }),
  ]);

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/RedshiftServerless.html
exports.RedshiftServerlessWorkgroup = () => ({
  type: "Workgroup",
  package: "redshift-serverless",
  client: "RedshiftServerless",
  propertiesDefault: {
    configParameters: [
      {
        parameterKey: "auto_mv",
        parameterValue: "true",
      },
      {
        parameterKey: "datestyle",
        parameterValue: "ISO, MDY",
      },
      {
        parameterKey: "enable_case_sensitive_identifier",
        parameterValue: "false",
      },
      {
        parameterKey: "enable_user_activity_logging",
        parameterValue: "true",
      },
      {
        parameterKey: "query_group",
        parameterValue: "default",
      },
      {
        parameterKey: "search_path",
        parameterValue: "$user, public",
      },
      {
        parameterKey: "max_query_execution_time",
        parameterValue: "14400",
      },
    ],
  },
  omitProperties: [
    "workgroupArn",
    "creationDate",
    "endpoint",
    "namespaceName",
    "securityGroupIds",
    "status",
    "subnetIds",
    "workgroupId",
  ],
  inferName: () =>
    pipe([
      get("workgroupName"),
      tap((Name) => {
        assert(Name);
      }),
    ]),
  findName: () =>
    pipe([
      get("workgroupName"),
      tap((name) => {
        assert(name);
      }),
    ]),
  findId: () =>
    pipe([
      get("workgroupName"),
      tap((id) => {
        assert(id);
      }),
    ]),
  dependencies: {
    namespace: {
      type: "Namespace",
      group: "RedshiftServerless",
      dependencyId: ({ lives, config }) => pipe([get("namespaceName")]),
    },
    securityGroups: {
      type: "SecurityGroup",
      group: "EC2",
      list: true,
      dependencyIds: ({ lives, config }) => pipe([get("securityGroupIds")]),
    },
    subnets: {
      type: "Subnet",
      group: "EC2",
      list: true,
      dependencyIds: ({ lives, config }) => pipe([get("subnetIds")]),
    },
  },
  ignoreErrorCodes: ["ResourceNotFoundException"],
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/RedshiftServerless.html#getWorkgroup-property
  getById: {
    method: "getWorkgroup",
    getField: "workgroup",
    pickId,
    decorate,
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/RedshiftServerless.html#listWorkgroups-property
  getList: {
    method: "listWorkgroups",
    getParam: "workgroups",
    decorate,
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/RedshiftServerless.html#createWorkgroup-property
  create: {
    method: "createWorkgroup",
    pickCreated: ({ payload }) => pipe([get("workgroup")]),
    isInstanceUp: pipe([eq(get("status"), "AVAILABLE")]),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/RedshiftServerless.html#updateWorkgroup-property
  update: {
    method: "updateWorkgroup",
    filterParams: ({ payload, diff, live }) => pipe([() => payload])(),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/RedshiftServerless.html#deleteWorkgroup-property
  destroy: {
    method: "deleteWorkgroup",
    pickId,
  },
  getByName: ({ getById }) =>
    pipe([({ name }) => ({ workgroupName: name }), getById({})]),
  tagger: ({ config }) =>
    Tagger({
      buildArn: buildArn({ config }),
    }),
  configDefault: ({
    name,
    properties: { tags, ...otherProps },
    dependencies: { namespace, subnets, securityGroups },
    config,
  }) =>
    pipe([
      tap((params) => {
        assert(namespace);
      }),
      () => otherProps,
      defaultsDeep({
        namespaceName: getField(namespace, "namespaceName"),
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
          securityGroupIds: pipe([
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
