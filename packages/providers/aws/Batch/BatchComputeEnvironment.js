const assert = require("assert");
const { pipe, tap, get, eq, map, omit, or, assign } = require("rubico");
const { defaultsDeep, when, unless } = require("rubico/x");
const { omitIfEmpty } = require("@grucloud/core/Common");
const { buildTagsObject } = require("@grucloud/core/Common");
const { getByNameCore } = require("@grucloud/core/Common");
const { getField } = require("@grucloud/core/ProviderCommon");
const { retryCall } = require("@grucloud/core/Retry");
const { replaceAccountAndRegion } = require("../AwsCommon");

const { Tagger } = require("./BatchCommon");

const buildArn = () => get("computeEnvironmentArn");

const decorate = () =>
  pipe([
    omitIfEmpty([
      "computeResources.ec2Configuration",
      "computeResources.instanceTypes",
      "computeResources.tags",
    ]),
  ]);

exports.BatchComputeEnvironment = ({}) => ({
  type: "ComputeEnvironment",
  package: "batch",
  client: "Batch",
  inferName: () => get("computeEnvironmentName"),
  findName: () => pipe([get("computeEnvironmentName")]),
  findId: () => pipe([get("computeEnvironmentArn")]),
  getByName: getByNameCore,
  propertiesDefault: {
    state: "ENABLED",
  },
  omitProperties: [
    "status",
    "statusReason",
    "ecsClusterArn",
    "eksConfiguration.eksClusterArn",
    "computeEnvironmentArn",
    "computeResources.ec2KeyPair",
    "computeResources.instanceRole",
    "computeResources.launchTemplate",
    "computeResources.placementGroup",
    "computeResources.securityGroupIds",
    "computeResources.subnets",
    "uuid",
  ],

  dependencies: {
    eksCluster: {
      type: "Cluster",
      group: "EKS",
      dependencyId: ({ lives, config }) =>
        pipe([get("eksConfiguration.eksClusterArn")]),
    },
    keyPair: {
      type: "KeyPair",
      group: "EC2",
      dependencyId: ({ lives, config }) =>
        pipe([get("computeResources.ec2KeyPair")]),
    },
    instanceProfile: {
      type: "InstanceProfile",
      group: "IAM",
      dependencyId: ({ lives, config }) =>
        pipe([
          get("computeResources.instanceRole"),
          lives.getByName({
            type: "InstanceProfile",
            group: "IAM",
            providerName: config.providerName,
          }),
          get("id"),
        ]),
    },
    launchTemplate: {
      type: "LaunchTemplate",
      group: "EC2",
      dependencyId: ({ lives, config }) =>
        pipe([get("computeResources.launchTemplate.launchTemplateId")]),
    },
    placementGroup: {
      type: "PlacementGroup",
      group: "EC2",
      dependencyId: ({ lives, config }) =>
        pipe([get("computeResources.placementGroup")]),
    },
    securityGroups: {
      type: "SecurityGroup",
      group: "EC2",
      list: true,
      dependencyIds: ({ lives, config }) =>
        get("computeResources.securityGroupIds"),
    },
    serviceRole: {
      type: "Role",
      group: "IAM",
      dependencyId: ({ lives, config }) => pipe([get("serviceRole")]),
    },
    subnets: {
      type: "Subnet",
      group: "EC2",
      list: true,
      dependencyIds: ({ lives, config }) => get("computeResources.subnets"),
    },
  },
  filterLive: ({ lives, providerConfig }) =>
    pipe([
      assign({
        serviceRole: pipe([
          get("serviceRole"),
          replaceAccountAndRegion({ providerConfig }),
        ]),
      }),
    ]),
  ignoreErrorCodes: ["ResourceNotFoundException", "ClientException"],
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Batch.html#describeComputeEnvironments-property
  getById: {
    method: "describeComputeEnvironments",
    pickId: pipe([
      tap(({ computeEnvironmentName }) => {
        assert(computeEnvironmentName);
      }),
      ({ computeEnvironmentName }) => ({
        computeEnvironments: [computeEnvironmentName],
      }),
    ]),
    getField: "computeEnvironments",
    decorate,
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Batch.html#describeComputeEnvironments-property
  getList: {
    method: "describeComputeEnvironments",
    getParam: "computeEnvironments",
    decorate,
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Batch.html#createComputeEnvironment-property
  create: {
    method: "createComputeEnvironment",
    pickCreated: ({ payload }) => pipe([() => payload]),
    isInstanceUp: eq(get("status"), "VALID"),
    isInstanceError: eq(get("status"), "INVALID"),
    getErrorMessage: get("statusReason", "failed"),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Batch.html#updateComputeEnvironment-property
  update: {
    method: "updateComputeEnvironment",
    filterParams: ({ payload: { computeEnvironmentName, ...other }, live }) =>
      pipe([
        () => ({ computeEnvironment: computeEnvironmentName, ...other }),
        omit(["computeResources.type"]),
      ])(),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Batch.html#deleteComputeEnvironment-property
  destroy: {
    preDestroy: ({ endpoint, getById }) =>
      tap((live) =>
        pipe([
          () => live,
          unless(
            eq(get("state"), "DISABLED"),
            pipe([
              () => ({
                computeEnvironment: live.computeEnvironmentName,
                state: "DISABLED",
              }),
              endpoint().updateComputeEnvironment,
              () =>
                retryCall({
                  name: `describeComputeEnvironments`,
                  fn: pipe([() => live, getById]),
                  isExpectedResult: or([
                    eq(get("status"), "VALID"),
                    eq(get("status"), "INVALID"),
                  ]),
                }),
            ])
          ),
        ])()
      ),
    method: "deleteComputeEnvironment",
    pickId: ({ computeEnvironmentName }) => ({
      computeEnvironment: computeEnvironmentName,
    }),
  },
  tagger: ({ config }) =>
    Tagger({
      buildArn: buildArn({ config }),
    }),
  configDefault: ({
    name,
    namespace,
    properties: { tags, ...otherProps },
    dependencies: {
      eksCluster,
      instanceProfile,
      keyPair,
      launchTemplate,
      placementGroup,
      subnets,
      securityGroups,
    },
    config,
  }) =>
    pipe([
      () => otherProps,
      defaultsDeep({
        computeResources: {
          securityGroupIds: pipe([
            () => securityGroups,
            map((sg) => getField(sg, "GroupId")),
          ])(),
          subnets: pipe([
            () => subnets,
            map((subnet) => getField(subnet, "SubnetId")),
          ])(),
        },
        tags: buildTagsObject({ name, config, namespace, userTags: tags }),
      }),
      when(
        () => eksCluster,
        defaultsDeep({
          eksConfiguration: {
            eksClusterArn: getField(eksCluster, "arn"),
          },
        })
      ),
      when(
        () => instanceProfile,
        defaultsDeep({
          computeResources: {
            instanceRole: getField(instanceProfile, "InstanceProfileName"),
          },
        })
      ),
      when(
        () => keyPair,
        defaultsDeep({
          computeResources: {
            ec2KeyPair: getField(keyPair, "KeyPairId"),
          },
        })
      ),
      when(
        () => launchTemplate,
        defaultsDeep({
          computeResources: {
            launchTemplate: {
              launchTemplateId: getField(launchTemplate, "GroupId"),
            },
          },
        })
      ),
      when(
        () => placementGroup,
        defaultsDeep({
          computeResources: {
            placementGroup: getField(placementGroup, "GroupId"),
          },
        })
      ),
    ])(),
});
