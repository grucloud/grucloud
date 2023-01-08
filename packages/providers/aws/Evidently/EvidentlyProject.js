const assert = require("assert");
const { pipe, tap, get, eq } = require("rubico");
const { defaultsDeep } = require("rubico/x");

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
  tap(({ name }) => {
    assert(name);
  }),
  ({ name }) => ({ project: name }),
]);

const decorate = ({ endpoint, config }) =>
  pipe([
    tap((params) => {
      assert(endpoint);
    }),
    omitIfEmpty([
      "dataDelivery.s3Destination.bucket",
      "dataDelivery.s3Destination.prefix",
      "dataDelivery.s3Destination",
      "description",
    ]),
  ]);

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Evidently.html
exports.EvidentlyProject = () => ({
  type: "Project",
  package: "evidently",
  client: "Evidently",
  propertiesDefault: {},
  omitProperties: [
    "arn",
    "createdTime",
    "appConfigResource",
    "activeLaunchCount",
    "activeExperimentCount",
    "experimentCount",
    "featureCount",
    "lastUpdatedTime",
    "launchCount",
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
    getField: "project",
    pickId,
    decorate,
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Evidently.html#listProjects-property
  getList: {
    method: "listProjects",
    getParam: "projects",
    decorate: ({ getById }) => pipe([getById]),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Evidently.html#createProject-property
  create: {
    method: "createProject",
    pickCreated: ({ payload }) => pipe([get("project")]),
    isInstanceIp: pipe([eq(get("status"), "AVAILABLE")]),
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
