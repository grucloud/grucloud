const assert = require("assert");
const { tap, pipe, map, get, assign } = require("rubico");
const { defaultsDeep, when } = require("rubico/x");
const { replaceWithName } = require("@grucloud/core/Common");

const { isOurMinion, compareAws } = require("../AwsCommon");
const { CodePipelinePipeline } = require("./CodePipelinePipeline");

const GROUP = "CodePipeline";

const compareCodePipeline = compareAws({ tagsKey: "tags", key: "key" });

module.exports = pipe([
  () => [
    {
      type: "Pipeline",
      Client: CodePipelinePipeline,
      inferName: pipe([get("properties.pipeline.name")]),
      dependencies: {
        role: { type: "Role", group: "IAM" },
        connections: {
          type: "Connection",
          group: "CodeStarConnections",
          list: true,
        },
        codeBuildProject: { type: "Project", group: "CodeBuild", list: true },
        ecrRepository: { type: "Repository", group: "ECR", list: true },
      },
      omitProperties: ["metadata", "pipeline.roleArn"],
      propertiesDefault: {},
      filterLive: ({ lives, providerConfig }) =>
        pipe([
          assign({
            pipeline: pipe([
              get("pipeline"),
              assign({
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
      compare: compareCodePipeline({}),
    })
  ),
]);
