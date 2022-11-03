const assert = require("assert");
const { pipe, tap, get, eq, map, omit, or } = require("rubico");
const { defaultsDeep, when, unless } = require("rubico/x");
const { omitIfEmpty } = require("@grucloud/core/Common");
const { buildTagsObject } = require("@grucloud/core/Common");
const { getByNameCore } = require("@grucloud/core/Common");
const { getField } = require("@grucloud/core/ProviderCommon");
const { retryCall } = require("@grucloud/core/Retry");

const { createAwsResource } = require("../AwsClient");

const { tagResource, untagResource } = require("./BatchCommon");

const buildArn = () => get("computeEnvironmentArn");

const decorate = () =>
  pipe([
    omitIfEmpty([
      "computeResources.ec2Configuration",
      "computeResources.instanceTypes",
      "computeResources.tags",
    ]),
  ]);

const model = ({ config }) => ({
  package: "batch",
  client: "Batch",
  ignoreErrorCodes: ["ResourceNotFoundException"],
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
    preDestroy: ({ endpoint, live, getById }) =>
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
      ])(),
    method: "deleteComputeEnvironment",
    pickId: ({ computeEnvironmentName }) => ({
      computeEnvironment: computeEnvironmentName,
    }),
  },
});

exports.BatchComputeEnvironment = ({ spec, config }) =>
  createAwsResource({
    model: model({ config }),
    spec,
    config,
    findName: pipe([get("live.computeEnvironmentName")]),
    findId: pipe([get("live.computeEnvironmentArn")]),
    getByName: getByNameCore,
    tagResource: tagResource({
      buildArn: buildArn(config),
    }),
    untagResource: untagResource({
      buildArn: buildArn(config),
    }),
    configDefault: ({
      name,
      namespace,
      properties: { tags, ...otherProps },
      dependencies: {
        ecsCluster,
        eksCluster,
        instanceRole,
        keyPair,
        launchTemplate,
        placementGroup,
        subnets,
        securityGroups,
      },
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
          () => ecsCluster,
          defaultsDeep({
            ecsClusterArn: getField(ecsCluster, "clusterArn"),
          })
        ),
        when(
          () => eksCluster,
          defaultsDeep({
            eksConfiguration: {
              eksClusterArn: getField(eksCluster, "arn"),
            },
          })
        ),
        when(
          () => instanceRole,
          defaultsDeep({
            computeResources: {
              instanceRole: getField(instanceRole, "Arn"),
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
