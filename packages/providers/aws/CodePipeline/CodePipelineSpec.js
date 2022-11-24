const assert = require("assert");
const { tap, pipe, map, get, assign, flatMap, filter, eq } = require("rubico");
const { defaultsDeep, when } = require("rubico/x");
const { replaceWithName } = require("@grucloud/core/Common");

const { isOurMinion, compareAws, replaceRegion } = require("../AwsCommon");
const { CodePipelinePipeline } = require("./CodePipelinePipeline");

const GROUP = "CodePipeline";
const tagsKey = "tags";
const compareCodePipeline = compareAws({ tagsKey, key: "key" });

module.exports = pipe([
  () => [
    {
      type: "Pipeline",
      Client: CodePipelinePipeline,
      inferName: () => pipe([get("pipeline.name")]),
      dependencies: {
        role: {
          type: "Role",
          group: "IAM",
          dependencyId: ({ lives, config }) => get("pipeline.roleArn"),
        },
        connections: {
          type: "Connection",
          group: "CodeStarConnections",
          list: true,
          dependencyIds: ({ lives, config }) =>
            pipe([
              get("pipeline.stages"),
              flatMap(
                pipe([
                  pipe([
                    get("actions"),
                    filter(
                      eq(
                        get("actionTypeId.provider"),
                        "CodeStarSourceConnection"
                      )
                    ),
                    map(get("configuration.ConnectionArn")),
                  ]),
                ])
              ),
            ]),
        },
        codeBuildProject: {
          type: "Project",
          group: "CodeBuild",
          list: true,
          dependencyIds: ({ lives, config }) =>
            pipe([
              get("pipeline.stages"),
              flatMap(
                pipe([
                  pipe([
                    get("actions"),
                    filter(eq(get("actionTypeId.provider"), "CodeBuild")),
                    map(
                      pipe([
                        get("configuration.ProjectName"),
                        lives.getByName({
                          type: "Project",
                          group: "CodeBuild",
                          providerName: config.providerName,
                        }),
                        get("id"),
                      ])
                    ),
                  ]),
                ])
              ),
            ]),
        },
        ecrRepository: {
          type: "Repository",
          group: "ECR",
          list: true,
          dependencyIds: ({ lives, config }) =>
            pipe([
              get("pipeline.stages"),
              flatMap(
                pipe([
                  pipe([
                    get("actions"),
                    filter(eq(get("actionTypeId.provider"), "ECR")),
                    map(
                      pipe([
                        get("configuration.RepositoryName"),
                        lives.getByName({
                          type: "Repository",
                          group: "ECR",
                          providerName: config.providerName,
                        }),
                        get("id"),
                      ])
                    ),
                  ]),
                ])
              ),
            ]),
        },
        s3Bucket: {
          type: "Bucket",
          group: "S3",
          dependencyId: ({ lives, config }) =>
            pipe([get("pipeline.artifactStore.location")]),
        },
      },
      omitProperties: ["metadata", "pipeline.roleArn"],
      propertiesDefault: {},
      filterLive: ({ lives, providerConfig }) =>
        pipe([
          assign({
            pipeline: pipe([
              get("pipeline"),
              assign({
                artifactStore: pipe([
                  get("artifactStore"),
                  assign({
                    location: pipe([
                      get("location"),
                      replaceRegion({ lives, providerConfig }),
                    ]),
                  }),
                ]),
                stages: pipe([
                  get("stages"),
                  map(
                    assign({
                      actions: pipe([
                        get("actions"),
                        map(
                          assign({
                            configuration: pipe([
                              get("configuration"),
                              when(
                                get("ConnectionArn"),
                                assign({
                                  ConnectionArn: pipe([
                                    get("ConnectionArn"),
                                    tap((params) => {
                                      assert(true);
                                    }),
                                    replaceWithName({
                                      groupType:
                                        "CodeStarConnections::Connection",
                                      path: "id",
                                      pathLive: "id",
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
                    })
                  ),
                ]),
              }),
            ]),
          }),
        ]),
    },
  ],
  map(
    defaultsDeep({
      group: GROUP,
      isOurMinion,
      tagsKey,
      compare: compareCodePipeline({}),
    })
  ),
]);
