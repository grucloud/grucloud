const assert = require("assert");
const { pipe, tap, get, pick, assign } = require("rubico");
const { defaultsDeep, isIn, when } = require("rubico/x");

const { getByNameCore } = require("@grucloud/core/Common");
const { getField } = require("@grucloud/core/ProviderCommon");

const pickId = pipe([
  tap(({ workspaceId }) => {
    assert(workspaceId);
  }),
  pick(["workspaceId"]),
]);

const filterPayload = pipe([
  assign({
    data: pipe([
      get("data"),
      tap((data) => {
        assert(data);
      }),
      (data) => Buffer.from(data),
    ]),
  }),
]);

const decorate = ({ endpoint, config, live }) =>
  pipe([
    tap((params) => {
      assert(live.workspaceId);
    }),
    when(
      get("data"),
      assign({
        data: pipe([get("data"), (data) => Buffer.from(data).toString()]),
      })
    ),
    defaultsDeep({ workspaceId: live.workspaceId }),
  ]);

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Amp.html
exports.AmpAlertManagerDefinition = () => ({
  type: "AlertManagerDefinition",
  package: "amp",
  client: "Amp",
  propertiesDefault: {},
  omitProperties: ["createdAt", "modifiedAt", "status"],
  inferName:
    ({ dependenciesSpec: { workspace } }) =>
    () =>
      pipe([
        tap((params) => {
          assert(workspace);
        }),
        () => `${workspace}`,
      ])(),
  findName:
    ({ lives, config }) =>
    ({ workspaceId }) =>
      pipe([
        tap((params) => {
          assert(workspaceId);
        }),
        () => workspaceId,
        lives.getById({
          type: "Workspace",
          group: "Aps",
          providerName: config.providerName,
        }),
        get("name"),
        tap((name) => {
          assert(name);
        }),
      ])(),
  findId: () =>
    pipe([
      get("workspaceId"),
      tap((id) => {
        assert(id);
      }),
    ]),
  ignoreErrorCodes: ["ResourceNotFoundException"],
  dependencies: {
    workspace: {
      type: "Workspace",
      group: "Aps",
      parent: true,
      pathId: "workspaceId",
      dependencyId: ({ lives, config }) =>
        pipe([
          get("workspaceId"),
          tap((workspaceId) => {
            assert(workspaceId);
          }),
        ]),
    },
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Amp.html#describeAlertManagerDefinition-property
  getById: {
    method: "describeAlertManagerDefinition",
    getField: "alertManagerDefinition",
    pickId,
    decorate,
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Amp.html#describeAlertManagerDefinition-property
  getList: ({ client, config }) =>
    pipe([
      () =>
        client.getListWithParent({
          parent: { type: "Workspace", group: "Aps" },
          pickKey: pipe([pickId]),
          method: "describeAlertManagerDefinition",
          getParam: "alertManagerDefinition",
          config,
          decorate: ({ endpoint, config, parent }) =>
            pipe([decorate({ endpoint, config, live: parent })]),
        }),
    ])(),
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Amp.html#createAlertManagerDefinition-property
  create: {
    filterPayload,
    method: "createAlertManagerDefinition",
    pickCreated: ({ payload }) => pipe([() => payload]),
    isInstanceUp: pipe([get("status.statusCode"), isIn(["ACTIVE"])]),
    isInstanceError: pipe([
      get("status.statusCode"),
      isIn(["CREATION_FAILED"]),
    ]),
    getErrorMessage: pipe([get("status.statusReason", "CREATION_FAILED")]),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Amp.html#putAlertManagerDefinition-property
  update: {
    method: "putAlertManagerDefinition",
    filterParams: ({ payload, diff, live }) => pipe([() => payload])(),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Amp.html#deleteAlertManagerDefinition-property
  destroy: {
    method: "deleteAlertManagerDefinition",
    pickId,
  },
  getByName: getByNameCore,
  configDefault: ({
    name,
    namespace,
    properties: { ...otherProps },
    dependencies: { workspace },
    config,
  }) =>
    pipe([
      tap((params) => {
        assert(workspace);
      }),
      () => otherProps,
      defaultsDeep({
        workspaceId: getField(workspace, "workspaceId"),
      }),
    ])(),
});
