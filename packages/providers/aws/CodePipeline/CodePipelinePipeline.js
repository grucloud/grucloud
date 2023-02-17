const assert = require("assert");
const {
  pipe,
  map,
  tap,
  get,
  pick,
  assign,
  flatMap,
  filter,
  eq,
} = require("rubico");
const { defaultsDeep, when } = require("rubico/x");
const { getField } = require("@grucloud/core/ProviderCommon");
const {
  buildTags,
  replaceRegion,
  replaceAccountAndRegion,
} = require("../AwsCommon");
const { replaceWithName } = require("@grucloud/core/Common");

const { Tagger } = require("./CodePipelineCommon");

const buildArn = () =>
  pipe([
    get("metadata.pipelineArn"),
    tap((arn) => {
      assert(arn);
    }),
  ]);

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/CodePipeline.html#listTagsForResource-property
const assignTags = ({ endpoint }) =>
  pipe([
    assign({
      tags: pipe([
        get("metadata.pipelineArn"),
        (resourceArn) => ({ resourceArn }),
        endpoint().listTagsForResource,
        get("tags"),
      ]),
    }),
  ]);

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/CodePipeline.html
exports.CodePipelinePipeline = ({}) => ({
  type: "Pipeline",
  package: "codepipeline",
  client: "CodePipeline",
  inferName: () => pipe([get("pipeline.name")]),
  findName: () => pipe([get("pipeline.name")]),
  findId: () => pipe([get("metadata.pipelineArn")]),
  ignoreErrorCodes: ["PipelineNotFoundException", "ResourceNotFoundException"],
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
                  eq(get("actionTypeId.provider"), "CodeStarSourceConnection")
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
    kmsKey: {
      type: "Key",
      group: "KMS",
      dependencyId: ({ lives, config }) =>
        get("pipeline.artifactStore.encryptionKey.id"),
    },
    s3Bucket: {
      type: "Bucket",
      group: "S3",
      dependencyId: ({ lives, config }) =>
        pipe([get("pipeline.artifactStore.location")]),
    },
  },
  omitProperties: [
    "metadata",
    "pipeline.roleArn",
    "pipeline.artifactStore.encryptionKey",
  ],
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
                      pipe([
                        when(
                          get("roleArn"),
                          assign({
                            roleArn: pipe([
                              get("roleArn"),
                              replaceAccountAndRegion({
                                providerConfig,
                                lives,
                              }),
                            ]),
                          })
                        ),
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
                        }),
                      ])
                    ),
                  ]),
                })
              ),
            ]),
          }),
        ]),
      }),
    ]),
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/CodePipeline.html#getPipeline-property
  getById: {
    method: "getPipeline",
    pickId: pipe([get("pipeline"), pick(["name"])]),
    decorate: ({ endpoint }) => pipe([assignTags({ endpoint })]),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/CodePipeline.html#listPipelines-property
  getList: {
    method: "listPipelines",
    getParam: "pipelines",
    decorate: ({ getById }) =>
      pipe([({ name }) => ({ pipeline: { name } }), getById]),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/CodePipeline.html#createPipeline-property
  create: {
    method: "createPipeline",
    pickCreated: ({ payload }) => pipe([() => payload]),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/CodePipeline.html#updatePipeline-property
  //TODO
  update: {
    method: "updatePipeline",
    filterParams: ({ payload, live }) =>
      pipe([
        tap((params) => {
          assert(true);
        }),
        () => payload,
      ])(),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/CodePipeline.html#deletePipeline-property
  destroy: {
    method: "deletePipeline",
    pickId: pipe([get("pipeline"), pick(["name"])]),
  },
  getByName: ({ getById }) =>
    pipe([({ name }) => ({ pipeline: { name } }), getById({})]),
  tagger: ({ config }) =>
    Tagger({
      buildArn: buildArn({ config }),
    }),
  configDefault: ({
    name,
    namespace,
    properties: { tags, ...otherProps },
    dependencies: { role, kmsKey },
    config,
  }) =>
    pipe([
      () => otherProps,
      defaultsDeep({
        pipeline: { roleArn: getField(role, "Arn") },
        tags: buildTags({
          name,
          config,
          namespace,
          UserTags: tags,
          key: "key",
          value: "value",
        }),
      }),
      when(
        () => kmsKey,
        defaultsDeep({
          pipeline: {
            artifactStore: {
              encryptionKey: {
                id: getField(kmsKey, "Arn"),
                type: "KMS",
              },
            },
          },
        })
      ),
    ])(),
});
