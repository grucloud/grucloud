const assert = require("assert");
const { pipe, map, tap, get, pick, assign, flatMap } = require("rubico");
const { defaultsDeep, when, callProp } = require("rubico/x");
const { getByNameCore } = require("@grucloud/core/Common");
const { omitIfEmpty } = require("@grucloud/core/Common");
const { getField } = require("@grucloud/core/ProviderCommon");
const { buildTags } = require("../AwsCommon");
const { replaceWithName } = require("@grucloud/core/Common");

const { Tagger } = require("./CodeDeployCommon");

const pickId = pipe([
  tap(({ applicationName, deploymentGroupName }) => {
    assert(applicationName);
    assert(deploymentGroupName);
  }),
  pick(["applicationName", "deploymentGroupName"]),
]);

const omitDeploymentGroupProperties = omitIfEmpty([
  "ec2TagFilters",
  "autoScalingGroups",
  "onPremisesInstanceTagFilters",
]);

const sortAutoRollbackConfigurationEvents = assign({
  autoRollbackConfiguration: pipe([
    get("autoRollbackConfiguration"),
    assign({
      events: pipe([
        get("events"),
        callProp("sort", (a, b) => a.localeCompare(b)),
      ]),
    }),
  ]),
});

const buildArn =
  ({ config }) =>
  ({ applicationName, deploymentGroupName }) =>
    `arn:${config.partition}:codedeploy:${
      config.region
    }:${config.accountId()}:deploymentgroup:${applicationName}/${deploymentGroupName}`;

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/CodeDeploy.html#listTagsForResource-property
const assignTags = ({ endpoint, config }) =>
  pipe([
    assign({
      tags: pipe([
        buildArn({ config }),
        (ResourceArn) => ({ ResourceArn }),
        endpoint().listTagsForResource,
        get("Tags"),
      ]),
    }),
  ]);

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/CodeDeploy.html
exports.CodeDeployDeploymentGroup = ({ compare }) => ({
  type: "DeploymentGroup",
  package: "codedeploy",
  client: "CodeDeploy",
  inferName: () =>
    pipe([
      ({ applicationName, deploymentGroupName }) =>
        `${applicationName}::${deploymentGroupName}`,
    ]),
  findName: () =>
    pipe([
      ({ applicationName, deploymentGroupName }) =>
        `${applicationName}::${deploymentGroupName}`,
    ]),
  findId: () =>
    pipe([
      get("deploymentGroupId"),
      tap((id) => {
        assert(id);
      }),
    ]),
  dependencies: {
    application: {
      type: "Application",
      group: "CodeDeploy",
      parent: true,
      dependencyId: ({ lives, config }) =>
        pipe([
          get("applicationName"),
          lives.getByName({
            type: "Application",
            group: "CodeDeploy",
            providerName: config.providerName,
          }),
          get("id"),
        ]),
    },
    serviceRole: {
      type: "Role",
      group: "IAM",
      dependencyId: ({ lives, config }) => get("serviceRoleArn"),
    },
    deploymentConfig: {
      type: "DeploymentConfig",
      group: "CodeDeploy",
      dependencyId: ({ lives, config }) => get("deploymentConfigName"),
    },
    autoScalingGroups: {
      type: "AutoScalingGroup",
      group: "AutoScaling",
      list: true,
      dependencyIds: ({ lives, config }) =>
        pipe([
          get("autoScalingGroups", []),
          map(
            pipe([
              lives.getByName({
                type: "AutoScalingGroup",
                group: "AutoScaling",
                providerName: config.providerName,
              }),
              get("id"),
            ])
          ),
        ]),
    },
    ecsServices: {
      type: "Service",
      group: "ECS",
      list: true,
      dependencyIds: ({ lives, config }) =>
        pipe([
          get("ecsServices", []),
          map(
            pipe([
              get("serviceName"),
              lives.getByName({
                type: "Service",
                group: "ECS",
                providerName: config.providerName,
              }),
              get("id"),
            ])
          ),
        ]),
    },
    ecsClusters: {
      type: "Cluster",
      group: "ECS",
      list: true,
      dependencyIds: ({ lives, config }) =>
        pipe([
          get("ecsServices", []),
          map(
            pipe([
              get("clusterName"),
              lives.getByName({
                type: "Cluster",
                group: "ECS",
                providerName: config.providerName,
              }),
              get("id"),
            ])
          ),
        ]),
    },
    targetGroups: {
      type: "TargetGroup",
      group: "ElasticLoadBalancingV2",
      dependencyIds: ({ lives, config }) =>
        pipe([
          get("loadBalancerInfo.targetGroupPairInfoList", []),
          flatMap(
            pipe([
              get("targetGroups"),
              map(
                pipe([
                  get("name"),
                  lives.getByName({
                    type: "TargetGroup",
                    group: "ElasticLoadBalancingV2",
                    providerName: config.providerName,
                  }),
                  get("id"),
                ])
              ),
            ])
          ),
        ]),
      list: true,
    },
    listeners: {
      type: "Listener",
      group: "ElasticLoadBalancingV2",
      list: true,
      dependencyIds: ({ lives, config }) =>
        pipe([
          get("loadBalancerInfo.targetGroupPairInfoList", []),
          flatMap(
            pipe([
              get("prodTrafficRoute.listenerArns"),
              map(
                pipe([
                  lives.getById({
                    type: "Listener",
                    group: "ElasticLoadBalancingV2",
                    providerName: config.providerName,
                  }),
                  get("id"),
                ])
              ),
            ])
          ),
        ]),
    },
    // SNS
  },
  //compare: compare({ filterLive: () => pipe([]) }),
  filterLive: ({ lives, providerConfig }) =>
    pipe([
      tap((params) => {
        assert(true);
      }),
      assign({
        loadBalancerInfo: pipe([
          get("loadBalancerInfo"),
          assign({
            targetGroupPairInfoList: pipe([
              get("targetGroupPairInfoList", []),
              map(
                assign({
                  prodTrafficRoute: pipe([
                    get("prodTrafficRoute"),
                    assign({
                      listenerArns: pipe([
                        get("listenerArns", []),
                        map(
                          replaceWithName({
                            groupType: "ElasticLoadBalancingV2::Listener",
                            path: "id",
                            pathLive: "id",
                            providerConfig,
                            lives,
                          })
                        ),
                      ]),
                    }),
                  ]),
                  targetGroups: pipe([
                    get("targetGroups", []),
                    map(
                      assign({
                        name: pipe([
                          get("name"),
                          replaceWithName({
                            groupType: "ElasticLoadBalancingV2::TargetGroup",
                            path: "name",
                            pathLive: "name",
                            providerConfig,
                            lives,
                          }),
                        ]),
                      })
                    ),
                  ]),
                })
              ),
            ]),
          }),
        ]),
      }),
      when(
        get("triggerConfigurations"),
        assign({
          triggerConfigurations: pipe([
            get("triggerConfigurations"),
            map(
              assign({
                triggerTargetArn: pipe([
                  get("triggerTargetArn"),
                  tap((params) => {
                    assert(true);
                  }),
                ]),
              })
            ),
          ]),
        })
      ),
    ]),
  omitProperties: ["deploymentGroupId", "serviceRoleArn"],
  propertiesDefault: {
    outdatedInstancesStrategy: "UPDATE",
    triggerConfigurations: [],
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/CodeDeploy.html#listDeploymentGroups-property
  getList: ({ client, endpoint, getById, config }) =>
    pipe([
      () =>
        client.getListWithParent({
          parent: { type: "Application", group: "CodeDeploy" },
          pickKey: pipe([pick(["applicationName"])]),
          method: "listDeploymentGroups",
          getParam: "deploymentGroups",
          decorate: ({ lives, parent }) =>
            pipe([
              (deploymentGroupName) => ({
                applicationName: parent.applicationName,
                deploymentGroupName,
              }),
              getById({}),
            ]),
          config,
        }),
    ])(),
  ignoreErrorCodes: [
    "ApplicationDoesNotExistException",
    "DeploymentGroupDoesNotExistException",
  ],
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/CodeDeploy.html#getDeploymentGroup-property
  getById: {
    method: "getDeploymentGroup",
    pickId,
    getField: "deploymentGroupInfo",
    decorate: ({ endpoint, config }) =>
      pipe([
        assignTags({ endpoint, config }),
        sortAutoRollbackConfigurationEvents,
        omitDeploymentGroupProperties,
      ]),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/CodeDeploy.html#createDeploymentGroup-property
  create: {
    method: "createDeploymentGroup",
    pickCreated:
      ({ payload }) =>
      () =>
        payload,
    shouldRetryOnExceptionMessages: [
      "AWS CodeDeploy does not have the permissions required to assume the role",
    ],
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/CodeDeploy.html#updateDeploymentGroup-property
  update: {
    method: "updateDeploymentGroup",
    filterParams: ({ payload, live }) => pipe([() => payload]),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/CodeDeploy.html#deleteDeploymentGroup-property
  destroy: {
    method: "deleteDeploymentGroup",
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
    //TODO add other dependencies
    dependencies: { autoScalingGroups, deploymentConfig, serviceRole },
    config,
  }) =>
    pipe([
      tap((params) => {
        assert(serviceRole);
      }),
      () => otherProps,
      defaultsDeep({
        serviceRoleArn: getField(serviceRole, "Arn"),
        tags: buildTags({
          name,
          config,
          namespace,
          UserTags: tags,
        }),
      }),
      when(
        () => autoScalingGroups,
        defaultsDeep({
          autoScalingGroups: pipe([
            () => autoScalingGroups,
            // TODO AutoScalingGroupName or AutoScalingGroupARN ?
            map((autoScalingGroup) =>
              getField(autoScalingGroup, "AutoScalingGroupName")
            ),
          ]),
        })
      ),
      when(
        () => deploymentConfig,
        defaultsDeep({
          deploymentConfigName: getField(
            deploymentConfig,
            "deploymentConfigName"
          ),
        })
      ),
    ])(),
});
