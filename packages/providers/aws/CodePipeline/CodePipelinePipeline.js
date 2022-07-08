const assert = require("assert");
const {
  pipe,
  map,
  tap,
  get,
  pick,
  filter,
  eq,
  flatMap,
  assign,
} = require("rubico");
const { defaultsDeep, when } = require("rubico/x");
const { getField } = require("@grucloud/core/ProviderCommon");
const { buildTags } = require("../AwsCommon");

const { createAwsResource } = require("../AwsClient");
const { tagResource, untagResource } = require("./CodePipelineCommon");

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/CodePipeline.html#listTagsForResource-property
const assignTags = ({ endpoint }) =>
  pipe([
    tap((params) => {
      assert(true);
    }),
    assign({
      tags: pipe([
        get("metadata.pipelineArn"),
        (resourceArn) => ({ resourceArn }),
        endpoint().listTagsForResource,
        get("tags"),
      ]),
    }),
  ]);

const model = ({ config }) => ({
  package: "codepipeline",
  client: "CodePipeline",
  ignoreErrorCodes: ["PipelineNotFoundException", "ResourceNotFoundException"],
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/CodePipeline.html#getPipeline-property
  getById: {
    method: "getPipeline",
    pickId: pipe([
      tap(({ pipeline }) => {
        assert(pipeline);
      }),
      get("pipeline"),
      tap((params) => {
        assert(true);
      }),
      pick(["name"]),
    ]),
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
    pickCreated: ({ payload }) =>
      pipe([
        tap((params) => {
          assert(true);
        }),
        () => payload,
      ]),
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
});

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/CodePipeline.html
exports.CodePipelinePipeline = ({ spec, config }) =>
  createAwsResource({
    model: model({ config }),
    spec,
    config,
    findName: pipe([get("live.pipeline.name")]),
    findId: pipe([get("live.metadata.pipelineArn")]),
    findDependencies: ({ live, lives }) => [
      {
        type: "Role",
        group: "IAM",
        ids: [pipe([() => live, get("pipeline.roleArn")])()],
      },
      {
        type: "Connection",
        group: "CodeStarConnections",
        ids: pipe([
          () => live,
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
        ])(),
      },
      {
        type: "Project",
        group: "CodeBuild",
        ids: pipe([
          () => live,
          get("pipeline.stages"),
          flatMap(
            pipe([
              pipe([
                get("actions"),
                filter(eq(get("actionTypeId.provider"), "CodeBuild")),
                map(
                  pipe([
                    get("configuration.ProjectName"),
                    (name) =>
                      lives.getByName({
                        name,
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
        ])(),
      },
      {
        type: "Repository",
        group: "ECR",
        ids: pipe([
          () => live,
          get("pipeline.stages"),
          flatMap(
            pipe([
              pipe([
                get("actions"),
                filter(eq(get("actionTypeId.provider"), "ECR")),
                map(
                  pipe([
                    get("configuration.RepositoryName"),
                    (name) =>
                      lives.getByName({
                        name,
                        type: "Repository",
                        group: "ECR",
                        providerName: config.providerName,
                      }),
                    tap((params) => {
                      assert(true);
                    }),
                    get("id"),
                  ])
                ),
              ]),
            ])
          ),
        ])(),
      },
    ],
    getByName: ({ getById }) =>
      pipe([({ name }) => ({ pipeline: { name } }), getById]),
    tagResource: tagResource({ property: "metadata.pipelineArn" }),
    untagResource: untagResource({ property: "metadata.pipelineArn" }),
    configDefault: ({
      name,
      namespace,
      properties: { tags, ...otherProps },
      dependencies: { role },
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
      ])(),
  });
