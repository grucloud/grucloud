const assert = require("assert");
const { pipe, tap, get, pick, eq, assign, map } = require("rubico");
const { defaultsDeep, when } = require("rubico/x");

const { getByNameCore } = require("@grucloud/core/Common");
const { getField } = require("@grucloud/core/ProviderCommon");
const { buildTagsObject } = require("@grucloud/core/Common");

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Grafana.html

const { Tagger } = require("./GrafanaCommon");

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

const assignArn = ({ config }) =>
  pipe([
    assign({
      arn: pipe([
        ({ workspaceId }) =>
          `arn:aws:grafana:${
            config.region
          }:${config.accountId()}:workspace/${workspaceId}`,
      ]),
    }),
  ]);

const decorate = ({ endpoint, config }) =>
  pipe([
    tap((params) => {
      assert(endpoint);
    }),
    ({
      name,
      id,
      description,
      dataSources,
      authentication,
      notificationDestinations,
      organizationalUnits,
      ...other
    }) => ({
      workspaceName: name,
      workspaceId: id,
      workspaceDescription: description,
      authenticationProviders: authentication.providers,
      workspaceDataSources: dataSources,
      workspaceNotificationDestinations: notificationDestinations,
      workspaceOrganizationalUnits: organizationalUnits,
      ...other,
    }),
    assignArn({ config }),
  ]);

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Grafana.html
exports.GrafanaWorkspace = () => ({
  type: "Workspace",
  package: "grafana",
  client: "Grafana",
  propertiesDefault: {},
  omitProperties: [
    "workspaceId",
    "arn",
    "modified",
    "endpoint",
    "created",
    "status",
    "freeTrialConsumed",
    "freeTrialExpiration",
    "grafanaVersion",
    "licenseExpiration",
    "licenseType",
    "workspaceOrganizationalUnits",
    "authentication.samlConfigurationStatus",
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
      get("workspaceName"),
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
  dependencies: {
    role: {
      type: "Role",
      group: "IAM",
      dependencyId: ({ lives, config }) => pipe([get("workspaceRoleArn")]),
    },
    organizationalUnits: {
      type: "OrganizationalUnit",
      group: "Organisations",
      list: true,
      dependencyIds: ({ lives, config }) =>
        pipe([get("workspaceOrganizationalUnits")]),
    },
  },
  ignoreErrorCodes: ["ResourceNotFoundException"],
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Grafana.html#getWorkspace-property
  getById: {
    method: "describeWorkspace",
    getField: "Workspace",
    pickId,
    decorate,
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Grafana.html#listWorkspaces-property
  getList: {
    method: "listWorkspaces",
    getParam: "workspaces",
    decorate: ({ getById }) => pipe([getById]),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Grafana.html#createWorkspace-property
  create: {
    method: "createWorkspace",
    pickCreated: ({ payload }) => pipe([get("workspace")]),
    isInstanceUp: pipe([eq(get("status"), "ACTIVE")]),
    isInstanceError: pipe([eq(get("Status"), "CREATION_FAILED")]),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Grafana.html#updateWorkspace-property
  update: {
    method: "updateWorkspace",
    filterParams: ({ pickId, payload, diff, live }) =>
      pipe([() => payload, defaultsDeep(pickId(live))])(),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Grafana.html#deleteWorkspace-property
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
    dependencies: { workspaceRoleArn, organizationalUnits },
    config,
  }) =>
    pipe([
      () => otherProps,
      defaultsDeep({
        Tags: buildTagsObject({ name, config, namespace, userTags: Tags }),
      }),
      when(
        () => workspaceRoleArn,
        assign({ workspaceRoleArn: getField(workspaceRoleArn, "Arn") })
      ),
      when(
        () => organizationalUnits,
        defaultsDeep({
          workspaceOrganizationalUnits: pipe([
            () => organizationalUnits,
            map((ou) => getField(ou, "Id")),
          ])(),
        })
      ),
    ])(),
});
