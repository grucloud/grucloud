const assert = require("assert");
const {
  pipe,
  tap,
  get,
  pick,
  eq,
  assign,
  map,
  and,
  or,
  not,
  filter,
  fork,
} = require("rubico");
const {
  defaultsDeep,
  first,
  pluck,
  callProp,
  when,
  isEmpty,
  unless,
  identity,
} = require("rubico/x");

const { getByNameCore } = require("@grucloud/core/Common");
const { getField } = require("@grucloud/core/ProviderCommon");
const { buildTagsObject } = require("@grucloud/core/Common");

const { Tagger } = require("./EvidentlyCommon");

const buildArn = () =>
  pipe([
    get("arn"),
    tap((arn) => {
      assert(arn);
    }),
  ]);

const pickId = pipe([
  tap(({ feature, project }) => {
    assert(feature);
    assert(project);
  }),
  pick(["feature", "project"]),
]);

const decorate = ({ endpoint, config }) =>
  pipe([
    tap((params) => {
      assert(endpoint);
    }),
  ]);

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Evidently.html
exports.EvidentlyFeature = () => ({
  type: "Feature",
  package: "evidently",
  client: "Evidently",
  propertiesDefault: {},
  omitProperties: [
    "arn",
    "createdTime",
    "lastUpdatedTime",
    "project",
    "status",
  ],
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
  ignoreErrorCodes: ["ResourceNotFoundException"],
  dependencies: {
    project: {
      type: "Project",
      group: "Evidently",
      parent: true,
      dependencyId: () => get("project"),
    },
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Evidently.html#getFeature-property
  getById: {
    method: "getFeature",
    getField: "feature",
    pickId,
    decorate,
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Evidently.html#listFeatures-property
  getList: ({ client, endpoint, getById, config }) =>
    pipe([
      () =>
        client.getListWithParent({
          parent: { type: "Project", group: "Evidently" },
          pickKey: pipe([pick(["project"])]),
          method: "listFeatures",
          getParam: "features",
          config,
          decorate,
        }),
    ])(),
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Evidently.html#createFeature-property
  create: {
    method: "createFeature",
    pickCreated: ({ payload }) => pipe([get("feature")]),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Evidently.html#updateFeature-property
  update: {
    method: "updateFeature",
    filterParams: ({ payload: { name, ...other }, diff, live }) =>
      pipe([
        () => ({ feature: name, ...other }), //
        // TODO addOrUpdateVariations removeVariations
      ])(),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Evidently.html#deleteFeature-property
  destroy: {
    method: "deleteFeature",
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
    dependencies: { project },
    config,
  }) =>
    pipe([
      tap((params) => {
        assert(project);
      }),
      () => otherProps,
      defaultsDeep({
        project: getField(project, "arn"),
        tags: buildTagsObject({ name, config, namespace, userTags: tags }),
      }),
    ])(),
});
