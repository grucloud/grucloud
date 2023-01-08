const assert = require("assert");
const { pipe, tap, get, assign, map, eq, tryCatch } = require("rubico");
const { defaultsDeep, keys, values, first } = require("rubico/x");

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
  tap(({ name, project }) => {
    assert(name);
    assert(project);
  }),
  ({ name, project }) => ({ launch: name, project }),
]);

const decorate = ({ endpoint, config }) =>
  pipe([
    tap((params) => {
      assert(endpoint);
    }),
    ({ scheduledSplitsDefinition, ...other }) => ({
      ...other,
      scheduledSplitsConfig: scheduledSplitsDefinition,
    }),
    assign({
      groups: pipe([
        get("groups"),
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

const filterPayload = pipe([
  assign({
    scheduledSplitsConfig: pipe([
      get("scheduledSplitsConfig"),
      assign({
        steps: pipe([
          get("steps"),
          map(pipe([assign({ startTime: () => new Date() })])),
        ]),
      }),
    ]),
  }),
]);

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Evidently.html
exports.EvidentlyLaunch = () => ({
  type: "Launch",
  package: "evidently",
  client: "Evidently",
  propertiesDefault: { samplingRate: 100000 },
  omitProperties: [
    "arn",
    "project",
    "lastUpdatedTime",
    "createdTime",
    "status",
    "execution",
    "type",
    "scheduledSplitsConfig.steps[].startTime",
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
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Evidently.html#getLaunch-property
  getById: {
    method: "getLaunch",
    getField: "launch",
    pickId,
    decorate,
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Evidently.html#listLaunchs-property
  getList: ({ client, endpoint, getById, config }) =>
    pipe([
      () =>
        client.getListWithParent({
          parent: { type: "Project", group: "Evidently" },
          pickKey: pipe([({ name }) => ({ project: name })]),
          method: "listLaunches",
          getParam: "launches",
          config,
          decorate: ({ endpoint }) => pipe([getById({})]),
        }),
    ])(),
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Evidently.html#createLaunch-property
  create: {
    method: "createLaunch",
    filterPayload,
    pickCreated: ({ payload }) => pipe([get("launch")]),
    isInstanceIp: pipe([eq(get("status"), "CREATED")]),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Evidently.html#updateLaunch-property
  update: {
    method: "updateLaunch",
    filterParams: ({ payload: { name, ...other }, diff, live }) =>
      pipe([
        () => ({ launch: name, ...other }), //
        // TODO addOrUpdateVariations removeVariations
      ])(),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Evidently.html#deleteLaunch-property
  destroy: {
    preDestroy: ({ endpoint }) =>
      tryCatch(
        pipe([
          pickId,
          defaultsDeep({
            desiredState: "CANCELLED",
            reason: "Stopped by GruCloud",
          }),
          endpoint().stopLaunch,
        ]),
        // Launch cannot be cancelled from current status
        (error) => undefined
      ),
    method: "deleteLaunch",
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
