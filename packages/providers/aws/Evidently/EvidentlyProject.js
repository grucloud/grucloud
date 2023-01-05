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
const { buildTags } = require("../AwsCommon");
const { buildTagsObject } = require("@grucloud/core/Common");
const { replaceWithName } = require("@grucloud/core/Common");

const { Tagger } = require("./EvidentlyCommon");

const buildArn = () =>
  pipe([
    get("Arn"),
    tap((arn) => {
      assert(arn);
    }),
  ]);

const pickId = pipe([
  tap(({ project }) => {
    assert(project);
  }),
  pick(["project"]),
]);

const decorate = ({ endpoint, config }) =>
  pipe([
    tap((params) => {
      assert(endpoint);
    }),
  ]);

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Evidently.html
exports.EvidentlyProject = () => ({
  type: "Project",
  package: "evidently",
  client: "Evidently",
  propertiesDefault: {},
  omitProperties: [],
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
      get("Arn"),
      tap((id) => {
        assert(id);
      }),
    ]),
  ignoreErrorCodes: ["ResourceNotFoundException"],
  dependencies: {
    appConfigApplication: {
      type: "Application",
      group: "AppConfig",
      dependencyId: () => get("appConfigResource.applicationId"),
    },
    appConfigEnvironment: {
      type: "Environment",
      group: "AppConfig",
      dependencyId: () => get("appConfigResource.environmentId"),
    },
    logGroup: {
      type: "LogGroup",
      group: "CloudWatchLog",
      dependencyId: () => get("appConfigResource.environmentId"),
    },
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Evidently.html#getProject-property
  getById: {
    method: "getProject",
    getField: "Project",
    pickId,
    decorate,
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Evidently.html#listProjects-property
  getList: {
    method: "listProjects",
    getParam: "Projects",
    decorate: ({ getById }) => pipe([getById]),
  },

  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Evidently.html#createProject-property
  create: {
    method: "createProject",
    pickCreated: ({ payload }) => pipe([get("Project")]),
    // pickCreated: ({ payload }) => pipe([() => payload]),
    // pickCreated: ({ payload }) => pipe([identity]),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Evidently.html#updateProject-property
  update: {
    method: "updateProject",
    filterParams: ({ payload, diff, live }) =>
      pipe([() => payload, defaultsDeep(pickId(live))])(),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Evidently.html#deleteProject-property
  destroy: {
    method: "deleteProject",
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
    dependencies: { appConfigApplication, appConfigEnvironment },
    config,
  }) =>
    pipe([
      tap((params) => {
        assert(appConfigApplication);
        assert(appConfigEnvironment);
      }),
      () => otherProps,
      defaultsDeep({
        appConfigResource: {
          applicationId: getField(appConfigApplication, "Id"),
          environmentId: getField(appConfigEnvironment, "Id"),
        },
        tags: buildTagsObject({ name, config, namespace, userTags: tags }),
      }),
    ])(),
});
