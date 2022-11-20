const assert = require("assert");
const { pipe, map, tap, get, pick, assign } = require("rubico");
const { defaultsDeep } = require("rubico/x");
const { getField } = require("@grucloud/core/ProviderCommon");
const { buildTags } = require("../AwsCommon");

const { createAwsResource } = require("../AwsClient");
const { tagResource, untagResource } = require("./CodePipelineCommon");

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

const model = ({ config }) => ({
  package: "codepipeline",
  client: "CodePipeline",
  ignoreErrorCodes: ["PipelineNotFoundException", "ResourceNotFoundException"],
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
});

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/CodePipeline.html
exports.CodePipelinePipeline = ({ spec, config }) =>
  createAwsResource({
    model: model({ config }),
    spec,
    config,
    findName: () => pipe([get("pipeline.name")]),
    findId: () => pipe([get("metadata.pipelineArn")]),
    getByName: ({ getById }) =>
      pipe([({ name }) => ({ pipeline: { name } }), getById({})]),
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
