const assert = require("assert");
const { tap, pipe, map, get, assign, flatMap } = require("rubico");
const { defaultsDeep, when } = require("rubico/x");

const { replaceWithName } = require("@grucloud/core/Common");
const { isOurMinion, compareAws } = require("../AwsCommon");
const { CodeDeployApplication } = require("./CodeDeployApplication");
const { CodeDeployDeploymentGroup } = require("./CodeDeployDeploymentGroup");

const GROUP = "CodeDeploy";

const compareCodeDeploy = compareAws({
  tagsKey: "tags",
  // getTargetTags: () => [],
  // getLiveTags: () => [],
});

module.exports = pipe([
  () => [
    {
      type: "Application",
      Client: CodeDeployApplication,
      inferName: pipe([get("properties.applicationName")]),
      omitProperties: ["applicationId", "createTime", "linkedToGitHub"],
      propertiesDefault: {},
    },
    {
      type: "DeploymentGroup",
      Client: CodeDeployDeploymentGroup,
      inferName: pipe([
        get("properties"),
        ({ applicationName, deploymentGroupName }) =>
          `${applicationName}::${deploymentGroupName}`,
      ]),
      dependencies: {
        application: {
          type: "Application",
          group: "CodeDeploy",
          parent: true,
          dependencyId: ({ lives, config }) =>
            pipe([
              (live) =>
                lives.getByName({
                  name: live.applicationName,
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
        autoScalingGroups: {
          type: "AutoScalingGroup",
          group: "AutoScaling",
          list: true,
          dependencyIds: ({ lives, config }) =>
            pipe([
              get("autoScalingGroups", []),
              map((autoScalingGroup) =>
                pipe([
                  () =>
                    lives.getByName({
                      name: autoScalingGroup,
                      type: "AutoScalingGroup",
                      group: "AutoScaling",
                      providerName: config.providerName,
                    }),
                  get("id"),
                ])()
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
              map(({ serviceName }) =>
                pipe([
                  () =>
                    lives.getByName({
                      name: serviceName,
                      type: "Service",
                      group: "ECS",
                      providerName: config.providerName,
                    }),
                  get("id"),
                ])()
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
              map(({ clusterName }) =>
                pipe([
                  () =>
                    lives.getByName({
                      name: clusterName,
                      type: "Cluster",
                      group: "ECS",
                      providerName: config.providerName,
                    }),
                  get("id"),
                ])()
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
                      ({ name }) =>
                        lives.getByName({
                          name,
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
                      (id) =>
                        lives.getById({
                          id,
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
      compare: compareAws({ filterLive: () => pipe([]) }),
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
                                groupType:
                                  "ElasticLoadBalancingV2::TargetGroup",
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
            () => get("ecsServices"),
            assign({
              ecsServices: pipe([
                get("ecsServices"),
                map(
                  assign({
                    clusterName: pipe([
                      get("clusterName"),
                      replaceWithName({
                        groupType: "ECS::Cluster",
                        path: "name",
                        pathLive: "name",
                        providerConfig,
                        lives,
                      }),
                    ]),
                    serviceName: pipe([
                      get("serviceName"),
                      replaceWithName({
                        groupType: "ECS::Service",
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
          when(
            () => get("triggerConfigurations"),
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
    },
  ],
  map(
    defaultsDeep({
      group: GROUP,
      isOurMinion,
      compare: compareCodeDeploy({}),
    })
  ),
]);
