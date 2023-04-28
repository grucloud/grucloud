const assert = require("assert");
const { pipe, tap, get, pick, eq, map, assign, or, omit } = require("rubico");
const { defaultsDeep, when, pluck, callProp } = require("rubico/x");

const { getField } = require("@grucloud/core/ProviderCommon");

const { buildTags } = require("../AwsCommon");

const { Tagger, assignTags } = require("./DAXCommon");

const pickId = pipe([
  tap(({ ClusterName }) => {
    assert(ClusterName);
  }),
  pick(["ClusterName"]),
]);

const buildArn = () =>
  pipe([
    get("ClusterArn"),
    tap((arn) => {
      assert(arn);
    }),
  ]);

const SSEDescriptionToSpecification = pipe([
  get("Status"),
  callProp("startsWith", "ENA"),
]);

const decorate = ({ endpoint, config }) =>
  pipe([
    ({
      SubnetGroup,
      NotificationConfiguration = {},
      ParameterGroup = {},
      SecurityGroups,
      SSEDescription,
      TotalNodes,
      ...other
    }) => ({
      ParameterGroupName: ParameterGroup.ParameterGroupName,
      SubnetGroupName: SubnetGroup,
      NotificationTopicArn: NotificationConfiguration.TopicArn,
      SecurityGroupIds: pluck("SecurityGroupIdentifier")(SecurityGroups),
      SSESpecification: {
        Enabled: SSEDescriptionToSpecification(SSEDescription),
      },
      ReplicationFactor: TotalNodes,
      ...other,
    }),
    assignTags({ buildArn: buildArn(config), endpoint }),
  ]);

exports.DAXCluster = ({ compare }) => ({
  type: "Cluster",
  package: "dax",
  client: "DAX",
  ignoreErrorCodes: ["ClusterNotFound", "ClusterNotFoundFault"],
  findName: () =>
    pipe([
      get("ClusterName"),
      tap((ClusterName) => {
        assert(ClusterName);
      }),
    ]),
  findId: () =>
    pipe([
      get("ClusterArn"),
      tap((id) => {
        assert(id);
      }),
    ]),
  propertiesDefault: {},
  omitProperties: [
    "ClusterArn",
    "TotalNodes",
    "ActiveNodes",
    "Status",
    "ClusterDiscoveryEndpoint",
    "NodeIdsToRemove",
    "Nodes",
    "NotificationTopicArn",
    "SSEDescription",
    "IamRoleArn",
    "VpcId",
    "SecurityGroupIds", //TODO
    "ParameterGroupName",
    "SubnetGroupName",
  ],
  inferName: () => get("ClusterName"),
  dependencies: {
    subnetGroup: {
      type: "SubnetGroup",
      group: "DAX",
      excludeDefaultDependencies: true,
      dependencyId: ({ lives, config }) => get("SubnetGroupName"),
    },
    parameterGroup: {
      type: "ParameterGroup",
      group: "DAX",
      excludeDefaultDependencies: true,
      dependencyId: ({ lives, config }) => pipe([get("ParameterGroupName")]),
    },
    iamRole: {
      type: "Role",
      group: "IAM",
      dependencyId: ({ lives, config }) => pipe([get("IamRoleArn")]),
    },
    snsTopic: {
      type: "Topic",
      group: "SNS",
      dependencyId: ({ lives, config }) => get("NotificationTopicArn"),
    },
    securityGroups: {
      type: "SecurityGroup",
      group: "EC2",
      list: true,
      dependencyIds: ({ lives, config }) => pipe([get("SecurityGroupIds")]),
    },
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/DAX.html#describeClusters-property
  getById: {
    method: "describeClusters",
    getField: "Clusters",
    pickId: pipe([
      tap(({ ClusterName }) => {
        assert(ClusterName);
      }),
      ({ ClusterName }) => ({
        ClusterName: [ClusterName],
      }),
    ]),
    decorate,
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/DAX.html#describeClusters-property
  getList: {
    method: "describeClusters",
    getParam: "Clusters",
    decorate,
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/DAX.html#createCluster-property
  create: {
    method: "createCluster",
    pickCreated: ({ payload }) => pipe([() => payload]),
    isInstanceUp: pipe([eq(get("Status"), "available")]),
    // TODO check
    isInstanceError: pipe([eq(get("Status"), "failed")]),
    shouldRetryOnExceptionMessages: ["No permission to assume role"],
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/DAX.html#updateCluster-property
  update: {
    method: "updateCluster",
    filterParams: ({ payload, diff, live }) => pipe([() => payload])(),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/DAX.html#deleteCluster-property
  destroy: {
    method: "deleteCluster",
    pickId,
  },
  getByName: ({ getList, endpoint, getById }) =>
    pipe([
      ({ name }) => ({
        ClusterName: name,
      }),
      getById({}),
    ]),
  tagger: ({ config }) =>
    Tagger({
      buildArn: buildArn({ config }),
    }),
  configDefault: ({
    name,
    namespace,
    properties: { Tags, ...otherProps },
    dependencies: {
      iamRole,
      parameterGroup,
      securityGroups,
      snsTopic,
      subnetGroup,
    },
    config,
  }) =>
    pipe([
      () => otherProps,
      defaultsDeep({
        Tags: buildTags({
          name,
          config,
          namespace,
          userTags: Tags,
        }),
      }),
      when(
        () => iamRole,
        defaultsDeep({ IamRoleArn: getField(iamRole, "Arn") })
      ),
      when(
        () => parameterGroup,
        assign({
          ParameterGroupName: () => parameterGroup.config.ParameterGroupName,
        })
      ),
      when(
        () => securityGroups,
        assign({
          SecurityGroupIds: pipe([
            () => securityGroups,
            map((sg) => getField(sg, "GroupId")),
          ]),
        })
      ),
      when(
        () => snsTopic,
        assign({
          NotificationTopicArn: () => getField(snsTopic, "Attributes.TopicArn"),
        })
      ),
      when(
        () => subnetGroup,
        assign({
          SubnetGroupName: () => subnetGroup.config.SubnetGroupName,
        })
      ),
    ])(),
});
