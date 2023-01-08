const assert = require("assert");
const { pipe, tap, get, assign, map } = require("rubico");
const { defaultsDeep, keys, values, first } = require("rubico/x");

const { getByNameCore, omitIfEmpty } = require("@grucloud/core/Common");
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
  tap(({ name, project }) => {
    assert(name);
    assert(project);
  }),
  ({ name, project }) => ({ experiment: name, project }),
]);

const decorate = ({ endpoint, config }) =>
  pipe([
    tap((params) => {
      assert(endpoint);
    }),
    omitIfEmpty(["description"]),
    ({ onlineAbDefinition, ...other }) => ({
      ...other,
      onlineAbConfig: onlineAbDefinition,
    }),
    assign({
      treatments: pipe([
        get("treatments"),
        map(
          pipe([
            ({ featureVariations, ...other }) => ({
              feature: pipe([keys, first])(featureVariations),
              variation: pipe([values, first])(featureVariations),
              ...other,
            }),
          ])
        ),
      ]),
    }),
  ]);

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Evidently.html
exports.EvidentlyExperiment = () => ({
  type: "Experiment",
  package: "evidently",
  client: "Evidently",
  propertiesDefault: { samplingRate: 100000 },
  omitProperties: [
    "arn",
    "createdTime",
    "lastUpdatedTime",
    "project",
    "status",
    "type",
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
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Evidently.html#getExperiment-property
  getById: {
    method: "getExperiment",
    getField: "experiment",
    pickId,
    decorate,
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Evidently.html#listExperiments-property
  getList: ({ client, endpoint, getById, config }) =>
    pipe([
      () =>
        client.getListWithParent({
          parent: { type: "Project", group: "Evidently" },
          pickKey: pipe([({ name }) => ({ project: name })]),
          method: "listExperiments",
          getParam: "experiments",
          config,
          decorate: ({ endpoint }) => pipe([getById({})]),
        }),
    ])(),
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Evidently.html#createExperiment-property
  create: {
    method: "createExperiment",
    pickCreated: ({ payload }) => pipe([get("experiment")]),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Evidently.html#updateExperiment-property
  update: {
    method: "updateExperiment",
    filterParams: ({ payload: { name, ...other }, diff, live }) =>
      pipe([
        () => ({ experiment: name, ...other }), //
        // TODO addOrUpdateVariations removeVariations
      ])(),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Evidently.html#deleteExperiment-property
  destroy: {
    method: "deleteExperiment",
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
        project: getField(project, "name"),
        tags: buildTagsObject({ name, config, namespace, userTags: tags }),
      }),
    ])(),
});
