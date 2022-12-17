const { getField } = require("@grucloud/core/ProviderCommon");
const assert = require("assert");
const { pipe, tap, get, pick, omit, switchCase, eq } = require("rubico");
const { defaultsDeep, first, find, when, unless } = require("rubico/x");

const pickId = pipe([
  pick(["WindowId", "WindowTargetId"]),
  tap(({ WindowId, WindowTargetId }) => {
    assert(WindowId);
    assert(WindowTargetId);
  }),
]);

const decorate = ({ endpoint }) =>
  pipe([
    tap((params) => {
      assert(true);
    }),
  ]);

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/SSM.html
exports.SSMMaintenanceWindowTarget = () => ({
  type: "MaintenanceWindowTarget",
  package: "ssm",
  client: "SSM",
  findName: () => get("Name"),
  findId: () =>
    pipe([
      get("WindowTargetId"),
      tap((id) => {
        assert(id);
      }),
    ]),
  inferName: () => get("Name"),
  propertiesDefault: { Enabled: true },
  omitProperties: ["WindowTargetId", "WindowId"],
  ignoreErrorCodes: ["DoesNotExistException"],
  dependencies: {
    maintenanceWindow: {
      type: "MaintenanceWindow",
      group: "SSM",
      parent: true,
      dependencyId: () => get("WindowId"),
    },
  },
  getById: {
    pickId: pipe([
      tap(({ WindowTargetId, WindowId }) => {
        assert(WindowTargetId);
        assert(WindowId);
      }),
      ({ WindowTargetId, WindowId }) => ({
        WindowId,
        Filters: [{ Key: "WindowTargetId", Values: [WindowTargetId] }],
      }),
    ]),
    method: "describeMaintenanceWindowTargets",
    getField: "Targets",
    decorate,
  },
  getList: {
    method: "describeMaintenanceWindowTargets",
    getParam: "Targets",
    decorate,
  },
  getList: ({ client, endpoint, getById, config }) =>
    pipe([
      () =>
        client.getListWithParent({
          parent: { type: "MaintenanceWindow", group: "SSM" },
          pickKey: pipe([
            pick(["WindowId"]),
            tap(({ WindowId }) => {
              assert(WindowId);
            }),
          ]),
          method: "describeMaintenanceWindowTargets",
          getParam: "Targets",
          config,
          decorate,
        }),
    ])(),
  create: {
    method: "registerTargetWithMaintenanceWindow",
    pickCreated: ({ payload }) =>
      pipe([defaultsDeep({ WindowId: payload.WindowId })]),
  },
  update: {
    method: "updateMaintenanceWindowTarget",
    filterParams: ({ payload, diff, live }) =>
      pipe([() => payload, defaultsDeep(pickId(live))])(),
  },
  destroy: {
    method: "deregisterTargetFromMaintenanceWindow",
    pickId,
  },
  getByName:
    ({ getById, endpoint }) =>
    ({ name, lives, config, resolvedDependencies: { maintenanceWindow } }) =>
      pipe([
        () => ({
          WindowId: maintenanceWindow.live.WindowId,
        }),
        endpoint().describeMaintenanceWindowTargets,
        get("Targets"),
        find(eq(get("Name"), name)),
      ])(),
  configDefault: ({
    name,
    namespace,
    properties: { Tags, ...otherProps },
    dependencies: { maintenanceWindow },
    config,
  }) =>
    pipe([
      () => otherProps,
      defaultsDeep({ WindowId: getField(maintenanceWindow, "WindowId") }),
    ])(),
});
