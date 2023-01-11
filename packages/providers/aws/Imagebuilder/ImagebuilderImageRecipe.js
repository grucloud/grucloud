const assert = require("assert");
const { pipe, tap, get, assign, map, tryCatch, not, or } = require("rubico");
const { defaultsDeep, pluck, isEmpty } = require("rubico/x");
const { v4: uuidv4 } = require("uuid");

const { getByNameCore, omitIfEmpty } = require("@grucloud/core/Common");
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
  ({ arn }) => ({ imageRecipeArn: arn }),
]);

const putImageRecipePolicy = ({ endpoint }) =>
  pipe([
    tap(({ arn }) => {
      assert(arn);
    }),
    ({ arn, policy }) => ({ imageRecipeArn: arn, policy }),
    endpoint().putImageRecipePolicy,
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
            () => ({ imageRecipeArn: live.arn }),
            endpoint().getImageRecipePolicy,
            get("policy"),
            JSON.parse,
            (policy) => ({ ...live, policy }),
            omitIfEmpty(["policy"]),
          ]),
          () => live
        )(),
    ])();

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Imagebuilder.html
exports.ImagebuilderImageRecipe = () => ({
  type: "ImageRecipe",
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
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Imagebuilder.html#getImageRecipe-property
  getById: {
    method: "getImageRecipe",
    getField: "imageRecipe",
    pickId,
    decorate,
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Imagebuilder.html#listImageRecipes-property
  getList: {
    method: "listImageRecipes",
    getParam: "imageRecipeSummaryList",
    decorate: ({ getById }) => pipe([getById]),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Imagebuilder.html#createImageRecipe-property
  create: {
    method: "createImageRecipe",
    filterPayload: assign({
      ClientToken: uuidv4,
    }),
    pickCreated: ({ payload }) =>
      pipe([({ imageRecipeArn }) => ({ arn: imageRecipeArn })]),
    postCreate:
      ({ endpoint, payload, created }) =>
      (live) =>
        pipe([
          () => payload,
          tap.if(
            pipe([get("policy"), not(isEmpty)]),
            pipe([putImageRecipePolicy({ endpoint, live })])
          ),
        ])(),
  },
  update:
    ({ endpoint, getById }) =>
    async ({ payload, live, diff }) =>
      pipe([
        () => diff,
        tap.if(
          or([get("liveDiff.added.policy", "liveDiff.updated.policy")]),
          pipe([() => payload, putImageRecipePolicy({ endpoint, live })])
        ),
      ])(),

  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Imagebuilder.html#deleteImageRecipe-property
  destroy: {
    method: "deleteImageRecipe",
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
    dependencies: {},
    config,
  }) =>
    pipe([
      () => otherProps,
      defaultsDeep({
        tags: buildTagsObject({ name, config, namespace, userTags: tags }),
      }),
    ])(),
});
