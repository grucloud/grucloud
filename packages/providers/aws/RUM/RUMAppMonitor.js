const assert = require("assert");
const { pipe, tap, get, pick, eq, assign, set } = require("rubico");
const { defaultsDeep, when, callProp } = require("rubico/x");

const { getByNameCore, omitIfEmpty } = require("@grucloud/core/Common");
const { getField } = require("@grucloud/core/ProviderCommon");
const { buildTagsObject } = require("@grucloud/core/Common");

const { Tagger } = require("./RUMCommon");

const buildArn = () =>
  pipe([
    get("Arn"),
    tap((arn) => {
      assert(arn);
    }),
  ]);

const assignArn = ({ config }) =>
  pipe([
    assign({
      Arn: pipe([
        ({ Name }) =>
          `arn:${config.partition}:rum:${
            config.region
          }:${config.accountId()}:appmonitor/${Name}`,
      ]),
    }),
  ]);

const pickId = pipe([
  tap(({ Name }) => {
    assert(Name);
  }),
  pick(["Name"]),
]);

const decorate = ({ endpoint, config }) =>
  pipe([
    tap((params) => {
      assert(endpoint);
    }),
    omitIfEmpty([
      "AppMonitorConfiguration.ExcludedPages",
      "AppMonitorConfiguration.IncludedPages",
    ]),
    assignArn({ config }),
    ({
      DataStorage: {
        CwLog: { CwLogEnabled },
      },
      ...other
    }) => ({ ...other, CwLogEnabled }),
    set(
      "AppMonitorConfiguration.Telemetries",
      pipe([get("AppMonitorConfiguration.Telemetries"), callProp("sort")])
    ),
  ]);

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/RUM.html
exports.RUMAppMonitor = () => ({
  type: "AppMonitor",
  package: "rum",
  client: "RUM",
  propertiesDefault: {
    AppMonitorConfiguration: {
      AllowCookies: true,
      EnableXRay: false,
      SessionSampleRate: 1,
      Telemetries: ["errors", "http", "performance"],
    },
    CustomEvents: {
      Status: "DISABLED",
    },
    CwLogEnabled: false,
  },
  omitProperties: [
    "Created",
    "Id",
    "LastModified",
    "State",
    "AppMonitorConfiguration.GuestRoleArn",
    "AppMonitorConfiguration.IdentityPoolId",
    "Arn",
  ],
  inferName: () =>
    pipe([
      get("Name"),
      tap((Name) => {
        assert(Name);
      }),
    ]),
  findName: () =>
    pipe([
      get("Name"),
      tap((name) => {
        assert(name);
      }),
    ]),
  findId: () =>
    pipe([
      get("Name"),
      tap((id) => {
        assert(id);
      }),
    ]),
  ignoreErrorCodes: ["ResourceNotFoundException"],
  dependencies: {
    identityPool: {
      type: "IdentityPool",
      group: "Cognito",
      dependencyId: ({ lives, config }) =>
        pipe([get("AppMonitorConfiguration.IdentityPoolId")]),
    },
    iamRoleGuest: {
      type: "Role",
      group: "IAM",
      dependencyId: ({ lives, config }) =>
        pipe([get("AppMonitorConfiguration.GuestRoleArn")]),
    },
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/RUM.html#getAppMonitor-property
  getById: {
    method: "getAppMonitor",
    getField: "AppMonitor",
    pickId,
    decorate,
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/RUM.html#listAppMonitors-property
  getList: {
    method: "listAppMonitors",
    getParam: "AppMonitorSummaries",
    decorate: ({ getById }) => pipe([getById]),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/RUM.html#createAppMonitor-property
  create: {
    method: "createAppMonitor",
    pickCreated: ({ payload }) => pipe([() => payload]),
    isInstanceUp: pipe([eq(get("State"), "CREATED")]),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/RUM.html#updateAppMonitor-property
  update: {
    method: "updateAppMonitor",
    filterParams: ({ payload, diff, live }) =>
      pipe([
        () => payload,
        tap((params) => {
          assert(true);
        }),
        defaultsDeep(pickId(live)),
        tap((params) => {
          assert(true);
        }),
      ])(),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/RUM.html#deleteAppMonitor-property
  destroy: {
    method: "deleteAppMonitor",
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
    properties: { Tags, ...otherProps },
    dependencies: { iamRoleGuest, identityPool },
    config,
  }) =>
    pipe([
      () => otherProps,
      defaultsDeep({
        Tags: buildTagsObject({ name, config, namespace, userTags: Tags }),
      }),
      when(
        () => iamRoleGuest,
        defaultsDeep({
          AppMonitorConfiguration: {
            GuestRoleArn: getField(iamRoleGuest, "Arn"),
          },
        })
      ),
      when(
        () => identityPool,
        defaultsDeep({
          AppMonitorConfiguration: {
            IdentityPoolId: getField(identityPool, "IdentityPoolId"),
          },
        })
      ),
    ])(),
});
