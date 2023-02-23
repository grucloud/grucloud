const assert = require("assert");
const { pipe, tap, get, pick, eq, map, omit, switchCase } = require("rubico");
const { defaultsDeep, pluck, when, find } = require("rubico/x");

const logger = require("@grucloud/core/logger")({ prefix: "EKSNodeGroup" });
const { tos } = require("@grucloud/core/tos");

const { getByNameCore, omitIfEmpty } = require("@grucloud/core/Common");
const { getField } = require("@grucloud/core/ProviderCommon");
const { buildTagsObject } = require("@grucloud/core/Common");

const { Tagger, waitForUpdate } = require("./EKSCommon");

const omitLaunchTemplateProps = pipe([
  when(get("launchTemplate"), omit(["instanceTypes", "amiType", "diskSize"])),
  omit(["launchTemplate"]),
]);

const buildArn = () =>
  pipe([
    get("nodegroupArn"),
    tap((arn) => {
      assert(arn);
    }),
  ]);

const pickId = pipe([
  tap(({ nodegroupName, clusterName }) => {
    assert(nodegroupName);
    assert(clusterName);
  }),
  pick(["nodegroupName", "clusterName"]),
]);

const decorate = ({ endpoint, config }) =>
  pipe([
    tap((params) => {
      assert(endpoint);
    }),
    omitIfEmpty(["labels"]),
  ]);

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/EKS.html
exports.EKSNodeGroup = ({ compare }) => ({
  type: "NodeGroup",
  package: "eks",
  client: "EKS",
  inferName: () =>
    pipe([
      get("nodegroupName"),
      tap((Name) => {
        assert(Name);
      }),
    ]),
  findName: () =>
    pipe([
      get("nodegroupName"),
      tap((name) => {
        assert(name);
      }),
    ]),
  findId: () =>
    pipe([
      get("nodegroupArn"),
      tap((id) => {
        assert(id);
      }),
    ]),
  ignoreErrorCodes: ["ResourceNotFoundException"],
  dependencies: {
    cluster: {
      type: "Cluster",
      group: "EKS",
      parent: true,
      dependencyId: ({ lives, config }) =>
        pipe([
          get("clusterName"),
          lives.getByName({
            type: "Cluster",
            group: "EKS",
            providerName: config.providerName,
          }),
          get("id"),
        ]),
    },
    subnets: {
      type: "Subnet",
      group: "EC2",
      list: true,
      dependencyIds: ({ lives, config }) => get("subnets"),
    },
    role: {
      type: "Role",
      group: "IAM",
      dependencyId: ({ lives, config }) =>
        pipe([
          get("nodeRole"),
          tap((nodeRole) => {
            assert(nodeRole);
          }),
        ]),
    },
    launchTemplate: {
      type: "LaunchTemplate",
      group: "EC2",
      dependencyId: ({ lives, config }) => get("launchTemplate.id"),
    },
    autoScaling: {
      type: "AutoScalingGroup",
      group: "AutoScaling",
      dependencyId: ({ lives, config }) =>
        pipe([
          get("resources.autoScalingGroups"),
          pluck("name"),
          map((name) =>
            pipe([
              lives.getByType({
                type: "AutoScalingGroup",
                group: "AutoScaling",
                providerName: config.providerName,
              }),
              find(eq(get("live.AutoScalingGroupName"), name)),
              get("id"),
            ])()
          ),
        ]),
    },
  },
  propertiesDefault: {
    resourcesVpcConfig: {
      endpointPublicAccess: true,
      endpointPrivateAccess: false,
    },
  },
  omitProperties: [
    "arn",
    "createdAt",
    "endpoint",
    "resourcesVpcConfig.clusterSecurityGroupId",
    "resourcesVpcConfig.vpcId",
    "resourcesVpcConfig.subnetIds",
    "resourcesVpcConfig.publicAccessCidrs",
    "kubernetesNetworkConfig",
    "identity",
    "logging",
    "status",
    "certificateAuthority",
    "clientRequestToken",
    "eks.2",
    "version",
    "platformVersion",
  ],
  compare: compare({
    filterTarget: () =>
      pipe([
        pick([
          "amiType",
          "capacityType",
          "diskSize",
          "instanceTypes",
          "scalingConfig",
          "diskSize",
        ]),
      ]),
    filterLive: () =>
      pipe([
        pick([
          "amiType",
          "capacityType",
          "diskSize",
          "instanceTypes",
          "scalingConfig",
          "diskSize",
          "launchTemplate",
        ]),
        omitLaunchTemplateProps,
      ]),
  }),
  filterLive: () =>
    pipe([
      pick([
        "nodegroupName",
        "capacityType",
        "scalingConfig",
        "instanceTypes",
        "amiType",
        "labels",
        "diskSize",
        "launchTemplate",
      ]),
      omitLaunchTemplateProps,
    ]),
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/EKS.html#getNodeGroup-property
  getById: {
    method: "describeNodegroup",
    getField: "nodegroup",
    pickId,
    decorate,
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/EKS.html#listNodeGroups-property
  getList: ({ client, endpoint, getById, config }) =>
    pipe([
      () =>
        client.getListWithParent({
          parent: { type: "Cluster", group: "EKS" },
          pickKey: ({ name }) => ({ clusterName: name }),
          method: "listNodegroups",
          getParam: "nodegroups",
          config,
          decorate: ({ lives, parent: { name } }) =>
            pipe([
              tap(() => {
                assert(name);
              }),
              (nodegroupName) => ({ clusterName: name, nodegroupName }),
              getById({}),
            ]),
        }),
    ])(),
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/EKS.html#createNodeGroup-property
  create: {
    method: "createNodegroup",
    pickId,
    pickCreated: () => get("nodegroup"),
    isInstanceError: eq(get("status"), "CREATE_FAILED"),
    isInstanceUp: eq(get("status"), "ACTIVE"),
    configIsUp: { retryCount: 12 * 25, retryDelay: 5e3 },
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/EKS.html#updateNodeGroup-property
  update:
    ({ endpoint, getById }) =>
    async ({ name, payload, live, diff }) =>
      pipe([
        tap(() => {
          logger.info(`updateNodegroupConfig: ${name}`);
          logger.debug(tos({ payload, diff, live }));
        }),
        () => payload,
        pick([
          "clusterName",
          "nodegroupName",
          //"labels", //TODO
          "scalingConfig",
          //"taints", //TODO
          "updateConfig",
        ]),
        eks().updateNodegroupConfig,
        get("update"),
        tap((result) => {
          logger.info(`updateNodegroupConfig: ${tos({ result })}`);
        }),
        get("id"),
        (updateId) =>
          waitForUpdate({ endpoint })({
            name: live.clusterName,
            nodegroupName: live.nodegroupName,
            updateId,
          }),
      ])(),
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/EKS.html#deleteNodeGroup-property
  destroy: {
    method: "deleteNodegroup",
    pickId,
  },
  getByName: getByNameCore,
  tagger: ({ config }) =>
    Tagger({
      buildArn: buildArn({ config }),
    }),
  configDefault: ({
    name,
    namespace,
    properties: { tags, ...otherProps },
    dependencies: { cluster, role, subnets, launchTemplate },
    config,
  }) =>
    pipe([
      () => otherProps,
      tap((params) => {
        assert(cluster, "missing 'cluster' dependency");
        assert(role, "missing 'role' dependency");
        assert(subnets, "missing 'subnets' dependency");
      }),
      defaultsDeep({
        subnets: map((subnet) => getField(subnet, "SubnetId"))(subnets),
        nodeRole: getField(role, "Arn"),
        clusterName: cluster.config.name,
        nodegroupName: name,
        capacityType: "ON_DEMAND",
        scalingConfig: {
          minSize: 1,
          maxSize: 1,
          desiredSize: 1,
        },
        tags: buildTagsObject({ config, namespace, name, userTags: tags }),
      }),
      switchCase([
        () => launchTemplate,
        defaultsDeep({
          launchTemplate: {
            id: getField(launchTemplate, "LaunchTemplateId"),
          },
        }),
        defaultsDeep({
          amiType: "AL2_x86_64",
          instanceTypes: ["t3.medium"],
          diskSize: 20,
        }),
      ]),
    ])(),
});
