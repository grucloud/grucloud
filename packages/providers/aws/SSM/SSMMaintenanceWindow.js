const assert = require("assert");
const { pipe, tap, get, pick, assign } = require("rubico");
const { defaultsDeep, first, identity } = require("rubico/x");

const { Tagger } = require("./SSMCommon");

const buildArn = () => get("WindowId");

const pickId = pipe([
  pick(["WindowId"]),
  tap(({ WindowId }) => {
    assert(WindowId);
  }),
]);

const decorate = ({ endpoint }) =>
  pipe([
    assign({
      Tags: pipe([
        ({ WindowId }) => ({
          ResourceId: WindowId,
          ResourceType: "MaintenanceWindow",
        }),
        endpoint().listTagsForResource,
        get("TagList"),
      ]),
    }),
  ]);

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/SSM.html
exports.SSMMaintenanceWindow = () => ({
  type: "MaintenanceWindow",
  package: "ssm",
  client: "SSM",
  findName: () => get("Name"),
  findId: () =>
    pipe([
      get("WindowId"),
      tap((id) => {
        assert(id);
      }),
    ]),
  inferName: () => get("Name"),
  propertiesDefault: { Enabled: true },
  omitProperties: [
    "NextExecutionTime",
    "WindowId",
    "CreatedDate",
    "ModifiedDate",
  ],
  ignoreErrorCodes: ["DoesNotExistException"],
  getById: {
    pickId,
    method: "getMaintenanceWindow",
    decorate,
  },
  getList: {
    method: "describeMaintenanceWindows",
    getParam: "WindowIdentities",
    decorate: ({ getById }) => pipe([getById]),
  },
  create: {
    method: "createMaintenanceWindow",
    pickCreated: ({ payload }) => identity,
  },
  update: {
    method: "updateMaintenanceWindow",
    extraParam: { Overwrite: true },
    filterParams: ({ payload, diff, live }) =>
      pipe([() => payload, defaultsDeep(pickId(live))])(),
  },
  destroy: { method: "deleteMaintenanceWindow", pickId },
  getByName:
    ({ getById, endpoint }) =>
    ({ name, lives, config }) =>
      pipe([
        () => ({ Filters: [{ Key: "Name", Values: [name] }] }),
        endpoint().describeMaintenanceWindows,
        get("WindowIdentities"),
        first,
      ])(),
  tagger: ({ config }) =>
    Tagger({
      buildArn: buildArn(config),
      additionalParams: pipe([() => ({ ResourceType: "MaintenanceWindow" })]),
    }),
  configDefault: ({
    name,
    namespace,
    properties: { Tags, ...otherProps },
    dependencies: {},
    config,
  }) => pipe([() => otherProps, defaultsDeep({})])(),
});
