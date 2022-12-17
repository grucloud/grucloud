const assert = require("assert");
const { pipe, tap, get, pick, filter, not, map, eq } = require("rubico");
const { defaultsDeep, keys, isEmpty, when } = require("rubico/x");

const pickId = pipe([
  pick(["SettingId"]),
  tap(({ SettingId }) => {
    assert(SettingId);
  }),
]);

const SettingList = {
  "/ssm/automation/customer-script-log-destination": "None",
  "/ssm/automation/customer-script-log-group-name":
    "/aws/ssm/automation/executeScript",
  "/ssm/documents/console/public-sharing-permission": "Enable",
  "/ssm/managed-instance/activation-tier": "standard",
  "/ssm/opsinsights/opscenter": "Disabled",
  "/ssm/parameter-store/default-parameter-tier": "Standard",
  "/ssm/parameter-store/high-throughput-enabled": "false",
};

const managedByOther = () => (live) =>
  pipe([() => live, eq(get("SettingValue"), SettingList[live.SettingId])])();

const decorate = ({ endpoint }) =>
  pipe([
    tap((params) => {
      assert(true);
    }),
  ]);

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/SSM.html
exports.SSMServiceSetting = () => ({
  type: "ServiceSetting",
  package: "ssm",
  client: "SSM",
  managedByOther,
  cannotBeDeleted: managedByOther,
  findName: () => get("SettingId"),
  findId: () =>
    pipe([
      get("SettingId"),
      tap((id) => {
        assert(id);
      }),
    ]),
  inferName: () =>
    pipe([
      get("SettingId"),
      tap((id) => {
        assert(id);
      }),
    ]),
  omitProperties: ["LastModifiedDate", "LastModifiedUser", "ARN", "Status"],
  ignoreErrorCodes: ["ValidationException"],
  getById: {
    method: "getServiceSetting",
    getField: "ServiceSetting",
    pickId,
    decorate,
  },
  getList: ({ endpoint }) =>
    pipe([
      () => SettingList,
      keys,
      map((SettingId) =>
        pipe([
          () => ({
            SettingId,
          }),
          endpoint().getServiceSetting,
          get("ServiceSetting"),
          tap((params) => {
            assert(true);
          }),
          // when(
          //   eq(get("SettingValue"), SettingList[SettingId]),
          //   () => undefined
          // ),
        ])()
      ),
      filter(not(isEmpty)),
    ]),
  create: {
    method: "updateServiceSetting",
    pickCreated:
      ({ payload }) =>
      () =>
        payload,
    isInstanceUp: () => true,
  },
  update: {
    method: "updateServiceSetting",
    extraParam: { Overwrite: true },
    filterParams: ({ payload, live }) => pipe([() => payload])(),
  },
  destroy: { method: "resetServiceSetting", pickId },
  getByName:
    ({ getById }) =>
    ({ name, lives, config }) =>
      pipe([() => ({ SettingId: name }), getById({ lives, config })])(),
  configDefault: ({
    name,
    namespace,
    properties: { ...otherProps },
    dependencies: {},
    config,
  }) => pipe([() => otherProps, defaultsDeep({})])(),
});
