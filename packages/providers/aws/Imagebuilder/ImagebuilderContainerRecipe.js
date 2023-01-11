const assert = require("assert");
const { pipe, tap, get, assign, map, tryCatch } = require("rubico");
const { defaultsDeep, when, pluck } = require("rubico/x");

const { omitIfEmpty } = require("@grucloud/core/Common");
const { getByNameCore } = require("@grucloud/core/Common");
const { getField } = require("@grucloud/core/ProviderCommon");
const { buildTagsObject } = require("@grucloud/core/Common");
const { replaceWithName } = require("@grucloud/core/Common");

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
  ({ arn }) => ({ containerRecipeArn: arn }),
]);

const putContainerRecipePolicy = ({ endpoint }) =>
  pipe([
    ({ arn, policy }) => ({ containerRecipeArn: arn, policy }),
    endpoint().putContainerRecipePolicy,
  ]);

const decorate =
  ({ endpoint, config }) =>
  (payload) =>
    pipe([
      tap((params) => {
        assert(endpoint);
      }),
      () => payload,
      JSON.stringify,
      JSON.parse,
      ({ version, ...other }) => ({ semanticVersion: version, ...other }),
      (live) =>
        tryCatch(
          pipe([
            () => ({ containerRecipeArn: live.arn }),
            endpoint().getContainerRecipePolicy,
            get("policy"),
            JSON.parse,
            (policy) => ({ ...live, policy }),
            omitIfEmpty(["policy"]),
          ]),
          () => live
        )(),
    ])();

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Imagebuilder.html
exports.ImagebuilderContainerRecipe = () => ({
  type: "ContainerRecipe",
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
    kmsKey: {
      type: "Key",
      group: "KMS",
      excludeDefaultDependencies: true,
      dependencyId: ({ lives, config }) => get("kmsKeyId"),
    },
    components: {
      type: "Component",
      group: "Imagebuilder",
      list: true,
      dependencyIds: ({ lives, config }) =>
        pipe([get("components"), pluck("componentArn")]),
    },
  },
  ignoreErrorCodes: ["ResourceNotFoundException"],
  filterLive: ({ lives, providerConfig }) =>
    pipe([
      assign({
        components: pipe([
          get("components"),
          map(
            assign({
              componentArn: pipe([
                get("componentArn"),
                replaceWithName({
                  groupType: "Imagebuilder::Component",
                  path: "id",
                  pathLive: "live.id",
                  providerConfig,
                  lives,
                }),
              ]),
            })
          ),
        ]),
      }),
    ]),
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Imagebuilder.html#getContainerRecipe-property
  getById: {
    method: "getContainerRecipe",
    getField: "containerRecipe",
    pickId,
    decorate,
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Imagebuilder.html#listContainerRecipes-property
  getList: {
    method: "listContainerRecipes",
    getParam: "containerRecipeSummaryList",
    decorate: ({ getById }) => pipe([getById]),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Imagebuilder.html#createContainerRecipe-property
  create: {
    method: "createContainerRecipe",
    pickCreated: ({ payload }) =>
      pipe([({ containerRecipeArn }) => ({ arn: containerRecipeArn })]),
    postCreate:
      ({ endpoint, payload, created }) =>
      (live) =>
        pipe([
          () => payload,
          tap.if(
            get("policy"),
            pipe([putContainerRecipePolicy({ endpoint, live })])
          ),
        ])(),
  },
  // No Update
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Imagebuilder.html#deleteContainerRecipe-property
  destroy: {
    method: "deleteContainerRecipe",
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
    dependencies: { kmsKey },
    config,
  }) =>
    pipe([
      () => otherProps,
      defaultsDeep({
        tags: buildTagsObject({ name, config, namespace, userTags: tags }),
      }),
      when(
        () => kmsKey,
        defaultsDeep({
          kmsKeyId: getField(kmsKey, "Arn"),
        })
      ),
    ])(),
});
