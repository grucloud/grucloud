const assert = require("assert");
const { pipe, tap, get } = require("rubico");
const { defaultsDeep, when } = require("rubico/x");

const { getByNameCore } = require("@grucloud/core/Common");
const { buildTagsObject } = require("@grucloud/core/Common");

const { Tagger } = require("./ImagebuilderCommon");
const { getField } = require("@grucloud/core/ProviderCommon");

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
  ({ arn }) => ({ imageBuildVersionArn: arn }),
]);

const putImagePolicy = ({ endpoint }) =>
  pipe([
    ({ arn, policy }) => ({ imageArn: arn, policy }),
    endpoint().putImagePolicy,
  ]);

const decorate = ({ endpoint, config }) =>
  pipe([
    tap((params) => {
      assert(endpoint);
    }),
    (live) =>
      tryCatch(
        pipe([
          () => ({ imageArn: live.arn }),
          endpoint().getImagePolicy,
          get("policy"),
          JSON.parse,
          (policy) => ({ ...live, policy }),
        ]),
        () => live
      )(),
  ]);

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Imagebuilder.html
exports.ImagebuilderImage = () => ({
  type: "Image",
  package: "imagebuilder",
  client: "Imagebuilder",
  propertiesDefault: {},
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
    "owner",
    "arn",
    "state",
    "kmsKeyId",
    "dateCreated",
    "dateUpdated",
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
  ignoreErrorCodes: [
    "ResourceNotFoundException",
    "InvalidParameterValueException",
  ],
  filterLive: ({ lives, providerConfig }) =>
    pipe([
      tap((params) => {
        assert(true);
      }),
    ]),
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Imagebuilder.html#getImage-property
  getById: {
    method: "getImage",
    getField: "image",
    pickId,
    decorate,
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Imagebuilder.html#listImages-property
  getList: {
    method: "listImages",
    getParam: "imageSummaryList",
    decorate: ({ getById }) => pipe([getById]),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Imagebuilder.html#createImage-property
  create: {
    method: "createImage",
    pickCreated: ({ payload }) =>
      pipe([({ imageBuildVersionArn }) => ({ arn: imageBuildVersionArn })]),
    postCreate:
      ({ endpoint, payload, created }) =>
      (live) =>
        pipe([
          () => payload,
          tap.if(get("policy"), pipe([putImagePolicy({ endpoint, live })])),
        ])(),
  },
  // No Update
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Imagebuilder.html#deleteImage-property
  destroy: {
    method: "deleteImage",
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
      infrastructureConfiguration,
      imageRecipe,
    },
    config,
  }) =>
    pipe([
      tap((params) => {
        assert(infrastructureConfiguration);
      }),
      () => otherProps,
      defaultsDeep({
        infrastructureConfigurationArn: getField(
          infrastructureConfiguration,
          "arn"
        ),
        tags: buildTagsObject({ name, config, namespace, userTags: tags }),
      }),
      when(
        () => containerRecipe,
        defaultsDeep({ containerRecipeArn: getField(containerRecipe, "arn") })
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
        defaultsDeep({ imageRecipeArn: getField(imageRecipe, "arn") })
      ),
    ])(),
});
