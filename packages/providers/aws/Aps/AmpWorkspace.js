const assert = require("assert");
const { pipe, tap, get, pick, eq, assign, tryCatch } = require("rubico");
const { defaultsDeep, when, identity } = require("rubico/x");

const { getByNameCore } = require("@grucloud/core/Common");
const { getField } = require("@grucloud/core/ProviderCommon");
const { buildTagsObject } = require("@grucloud/core/Common");
const { updateResourceObject } = require("@grucloud/core/updateResourceObject");

const { Tagger } = require("./AmpCommon");
const { RtmpAdMarkers } = require("@aws-sdk/client-medialive");

const buildArn = () =>
  pipe([
    get("arn"),
    tap((arn) => {
      assert(arn);
    }),
  ]);

const pickId = pipe([
  tap(({ workspaceId }) => {
    assert(workspaceId);
  }),
  pick(["workspaceId"]),
]);

// AlertManagerDefinition
const pickAlertManagerDefinition = pipe([
  tap(({ data, workspaceId }) => {
    assert(data);
    assert(workspaceId);
  }),
  pick(["data", "workspaceId"]),
]);

const assignAlertManagerDefinition =
  ({ endpoint, config }) =>
  (live) =>
    pipe([
      () => live,
      tryCatch(
        pipe([
          pickId,
          endpoint().describeAlertManagerDefinition,
          get("loggingConfiguration.data"),
          (alertManagerDefinition) => ({ ...live, alertManagerDefinition }),
        ]),
        () => live
      ),
    ])();

const createAlertManagerDefinition = ({ endpoint, config }) =>
  pipe([pickAlertManagerDefinition, endpoint().createAlertManagerDefinition]);

const putAlertManagerDefinition = ({ endpoint, config }) =>
  pipe([pickAlertManagerDefinition, endpoint().putAlertManagerDefinition]);

const deleteAlertManagerDefinition = ({ endpoint, config }) =>
  pipe([pickId, endpoint().deleteAlertManagerDefinition]);

// LoggingConfiguration
const pickLoggingConfiguration = pipe([
  tap(({ logGroupArn, workspaceId }) => {
    assert(logGroupArn);
    assert(workspaceId);
  }),
  pick(["logGroupArn", "workspaceId"]),
]);

const assignLogGroupArn =
  ({ endpoint, config }) =>
  (live) =>
    pipe([
      () => live,
      tryCatch(
        pipe([
          pickId,
          endpoint().describeLoggingConfiguration,
          get("loggingConfiguration.logGroupArn"),
          (logGroupArn) => ({ ...live, logGroupArn }),
        ]),
        () => live
      ),
    ])();

const createLoggingConfiguration = ({ endpoint, config }) =>
  pipe([pickLoggingConfiguration, endpoint().createLoggingConfiguration]);

const updateLoggingConfiguration = ({ endpoint, config }) =>
  pipe([pickLoggingConfiguration, endpoint().updateLoggingConfiguration]);

const deleteLoggingConfiguration = ({ endpoint, config }) =>
  pipe([pickId, endpoint().deleteLoggingConfiguration]);

// decorate
const decorate = ({ endpoint, config }) =>
  pipe([
    tap((params) => {
      assert(true);
    }),
    assignLogGroupArn({ endpoint, config }),
    assignAlertManagerDefinition({ endpoint, config }),
    tap((params) => {
      assert(true);
    }),
  ]);

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Amp.html
exports.AmpWorkspace = () => ({
  type: "Workspace",
  package: "amp",
  client: "Amp",
  propertiesDefault: {},
  omitProperties: [
    "arn",
    "createdAt",
    "prometheusEndpoint",
    "status",
    "workspaceId",
  ],
  inferName: () =>
    pipe([
      get("alias"),
      tap((Name) => {
        assert(Name);
      }),
    ]),
  findName: () =>
    pipe([
      get("alias"),
      tap((name) => {
        assert(name);
      }),
    ]),
  findId: () =>
    pipe([
      get("workspaceId"),
      tap((id) => {
        assert(id);
      }),
    ]),
  ignoreErrorCodes: ["ResourceNotFoundException"],
  dependencies: {
    logGroup: {
      type: "LogGroup",
      group: "CloudWatchLogs",
      dependencyId: ({ lives, config }) => get("logGroupArn"),
    },
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Amp.html#getWorkspace-property
  getById: {
    method: "describeWorkspace",
    getField: "workspace",
    pickId,
    decorate,
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Amp.html#listWorkspaces-property
  getList: {
    method: "listWorkspaces",
    getParam: "workspaces",
    decorate: ({ getById }) =>
      pipe([
        tap((params) => {
          assert(true);
        }),
        getById,
      ]),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Amp.html#createWorkspace-property
  create: {
    method: "createWorkspace",
    pickCreated: ({ payload }) => pipe([identity]),
    isInstanceUp: eq(get("status.statusCode"), "ACTIVE"),
    isInstanceError: eq(get("status.statusCode"), "CREATION_FAILED"),
    postCreate:
      ({ endpoint, payload, created }) =>
      (live) =>
        pipe([
          () => payload,
          tap.if(
            get("logGroupArn"),
            pipe([createLoggingConfiguration({ endpoint, live })])
          ),
          tap.if(
            get("alertManagerDefinition"),
            pipe([createAlertManagerDefinition({ endpoint, live })])
          ),
        ])(),
  },
  // Update
  update:
    ({ endpoint, getById }) =>
    async ({ payload, live, diff }) =>
      pipe([
        () => ({ payload, live, diff, endpoint }),
        updateResourceObject({
          path: "logGroupArn",
          onDeleted: deleteLoggingConfiguration,
          onAdded: createLoggingConfiguration,
          onUpdated: updateLoggingConfiguration,
        }),
        () => ({ payload, live, diff, endpoint }),
        updateResourceObject({
          path: "alertManagerDefinition",
          onDeleted: deleteAlertManagerDefinition,
          onAdded: createAlertManagerDefinition,
          onUpdated: putAlertManagerDefinition,
        }),
      ])(),
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Amp.html#deleteWorkspace-property
  destroy: {
    method: "deleteWorkspace",
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
    dependencies: { logGroup },
    config,
  }) =>
    pipe([
      () => otherProps,
      defaultsDeep({
        tags: buildTagsObject({ name, config, namespace, userTags: tags }),
      }),
      when(
        () => logGroup,
        defaultsDeep({ logGroupArn: getField(logGroup, "arn") })
      ),
    ])(),
});
