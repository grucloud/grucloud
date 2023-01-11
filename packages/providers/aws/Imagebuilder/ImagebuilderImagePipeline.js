const assert = require("assert");
const { pipe, tap, get } = require("rubico");
const { defaultsDeep, when, identity } = require("rubico/x");

const { getByNameCore } = require("@grucloud/core/Common");
const { getField } = require("@grucloud/core/ProviderCommon");
const { buildTagsObject } = require("@grucloud/core/Common");

const { Tagger } = require("./ImagebuilderCommon");

const buildArn = () =>
  pipe([
    get("arn"),
    tap((arn) => {
      assert(arn);
    }),
  ]);

const pickId = pipe([
  tap(({ arn }) => {
    assert(arn);
  }),
  ({ arn, ...other }) => ({ imagePipelineArn: arn, ...other }),
]);

const decorate = ({ endpoint, config }) =>
  pipe([
    tap((params) => {
      assert(endpoint);
    }),
  ]);

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Imagebuilder.html
exports.ImagebuilderImagePipeline = () => ({
  type: "ImagePipeline",
  package: "imagebuilder",
  client: "Imagebuilder",
  propertiesDefault: {
    status: "ENABLED",
    enhancedImageMetadataEnabled: true,
    imageTestsConfiguration: {
      imageTestsEnabled: true,
      timeoutMinutes: 720,
    },
  },
  inferName: () =>
    pipe([
      get("name"),
      tap((Name) => {
        assert(Name);
      }),
    ]),
  findName: () =>
    pipe([
      get("name"),
      tap((name) => {
        assert(name);
      }),
    ]),
  findId: () =>
    pipe([
      get("arn"),
      tap((id) => {
        assert(id);
      }),
    ]),
  omitProperties: [
    "arn",
    "imageRecipeArn",
    "containerRecipeArn",
    "infrastructureConfigurationArn",
    "distributionConfigurationArn",
    "dateCreated",
    "dateUpdated",
    "dateLastRun",
    "dateNextRun",
  ],
  dependencies: {
    containerRecipe: {
      type: "ContainerRecipe",
      group: "Imagebuilder",
      dependencyId: ({ lives, config }) => pipe([get("containerRecipeArn")]),
    },
    distributionConfiguration: {
      type: "DistributionConfiguration",
      group: "Imagebuilder",
      dependencyId: ({ lives, config }) =>
        pipe([get("distributionConfigurationArn")]),
    },
    imageRecipe: {
      type: "ImageRecipe",
      group: "Imagebuilder",
      dependencyId: ({ lives, config }) => pipe([get("imageRecipeArn")]),
    },
    infrastructureConfiguration: {
      type: "InfrastructureConfiguration",
      group: "Imagebuilder",
      dependencyId: ({ lives, config }) =>
        pipe([get("infrastructureConfigurationArn")]),
    },
  },
  ignoreErrorCodes: ["ResourceNotFoundException"],
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Imagebuilder.html#getImagePipeline-property
  getById: {
    method: "getImagePipeline",
    getField: "imagePipeline",
    pickId,
    decorate,
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Imagebuilder.html#listImagePipelines-property
  getList: {
    method: "listImagePipelines",
    getParam: "imagePipelineList",
    decorate: ({ getById }) =>
      pipe([
        tap((params) => {
          assert(true);
        }),
        getById,
      ]),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Imagebuilder.html#createImagePipeline-property
  create: {
    method: "createImagePipeline",
    pickCreated: ({ payload }) =>
      pipe([({ imagePipelineArn }) => ({ arn: imagePipelineArn })]),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Imagebuilder.html#updateImagePipeline-property
  update: {
    method: "updateImagePipeline",
    filterParams: ({ payload, diff, live }) =>
      pipe([() => payload, defaultsDeep(pickId(live))])(),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Imagebuilder.html#deleteImagePipeline-property
  destroy: {
    method: "deleteImagePipeline",
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
    dependencies: {
      containerRecipe,
      distributionConfiguration,
      imageRecipe,
      infrastructureConfiguration,
    },
    config,
  }) =>
    pipe([
      () => otherProps,
      defaultsDeep({
        tags: buildTagsObject({ name, config, namespace, userTags: tags }),
      }),
      when(
        () => containerRecipe,
        defaultsDeep({
          containerRecipeArn: getField(containerRecipe, "arn"),
        })
      ),
      when(
        () => distributionConfiguration,
        defaultsDeep({
          distributionConfigurationArn: getField(
            distributionConfiguration,
            "arn"
          ),
        })
      ),
      when(
        () => imageRecipe,
        defaultsDeep({
          imageRecipeArn: getField(imageRecipe, "arn"),
        })
      ),
      when(
        () => infrastructureConfiguration,
        defaultsDeep({
          infrastructureConfigurationArn: getField(
            infrastructureConfiguration,
            "arn"
          ),
        })
      ),
    ])(),
});
