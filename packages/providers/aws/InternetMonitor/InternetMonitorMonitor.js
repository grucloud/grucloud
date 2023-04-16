const assert = require("assert");
const { pipe, tap, get, pick, switchCase, assign, map, eq } = require("rubico");
const { defaultsDeep, isIn, callProp, find } = require("rubico/x");

const { getByNameCore } = require("@grucloud/core/Common");
const { buildTagsObject } = require("@grucloud/core/Common");
const { replaceWithName } = require("@grucloud/core/Common");

const { Tagger } = require("./InternetMonitorCommon");

const buildArn = () =>
  pipe([
    get("MonitorArn"),
    tap((arn) => {
      assert(arn);
    }),
  ]);

const pickId = pipe([
  tap(({ MonitorName }) => {
    assert(MonitorName);
  }),
  pick(["MonitorName"]),
]);

const decorate = ({ endpoint, config }) =>
  pipe([
    tap((params) => {
      assert(endpoint);
    }),
  ]);

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/InternetMonitor.html
exports.InternetMonitorMonitor = () => ({
  type: "Monitor",
  package: "internetmonitor",
  client: "InternetMonitor",
  propertiesDefault: {},
  omitProperties: [
    "MonitorArn",
    "Status",
    "CreatedAt",
    "ModifiedAt",
    "ProcessingStatus",
    "ProcessingStatusInfo",
  ],
  inferName: () =>
    pipe([
      get("MonitorName"),
      tap((Name) => {
        assert(Name);
      }),
    ]),
  findName: () =>
    pipe([
      get("MonitorName"),
      tap((name) => {
        assert(name);
      }),
    ]),
  findId: () =>
    pipe([
      get("MonitorArn"),
      tap((id) => {
        assert(id);
      }),
    ]),
  ignoreErrorCodes: ["ResourceNotFoundException", "AccessDeniedException"],
  dependencies: {
    s3Bucket: {
      type: "Bucket",
      group: "S3",
      dependencyId: ({ lives, config }) =>
        pipe([get("InternetMeasurementsLogDelivery.S3Config.BucketName")]),
    },
    cloudFrontDistributions: {
      type: "Distribution",
      group: "CloudFront",
      list: true,
      dependencyIds: ({ lives, config }) => pipe([get("Resources")]),
    },
    vpcs: {
      type: "Vpc",
      group: "EC2",
      list: true,
      dependencyIds: ({ lives, config }) =>
        pipe([
          get("Resources"),
          map((Arn) =>
            pipe([
              lives.getByType({
                type: "Vpc",
                group: "EC2",
                providerName: config.providerName,
              }),
              find(eq(get("live.VpcArn"), Arn)),
              get("id"),
            ])()
          ),
        ]),
    },
    workspaces: {
      type: "Workspace",
      group: "Workspaces",
      list: true,
      dependencyIds: ({ lives, config }) => pipe([get("Resources")]),
    },
  },
  filterLive: ({ lives, providerConfig }) =>
    pipe([
      tap((params) => {
        assert(true);
      }),
      assign({
        Resources: pipe([
          get("Resources"),
          map(
            pipe([
              switchCase([
                callProp("startsWith", "arn:aws:cloudfront"),
                replaceWithName({
                  groupType: "CloudFront::Distribution",
                  path: "live.VpcArn",
                  pathLive: "live.VpcArn",
                  providerConfig,
                  lives,
                }),
                callProp("startsWith", "arn:aws:ec2"),
                replaceWithName({
                  groupType: "EC2::Vpc",
                  path: "live.VpcArn",
                  pathLive: "live.VpcArn",
                  providerConfig,
                  lives,
                }),
                callProp("startsWith", "arn:aws:workspace"),
                replaceWithName({
                  groupType: "Workspaces::Workspace",
                  path: "id",
                  providerConfig,
                  lives,
                }),
                () => {
                  assert(false);
                },
              ]),
            ])
          ),
        ]),
      }),
      tap((params) => {
        assert(true);
      }),
    ]),
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/InternetMonitor.html#getMonitor-property
  getById: {
    method: "getMonitor",
    pickId,
    decorate,
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/InternetMonitor.html#listMonitors-property
  getList: {
    method: "listMonitors",
    getParam: "Monitors",
    decorate: ({ getById }) => pipe([getById]),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/InternetMonitor.html#createMonitor-property
  create: {
    method: "createMonitor",
    pickCreated: ({ payload }) => pipe([() => payload]),
    isInstanceUp: pipe([get("Status"), isIn(["ACTIVE"])]),
    isInstanceError: pipe([get("Status"), isIn(["ERROR"])]),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/InternetMonitor.html#updateMonitor-property
  // TODO ResourcesToAdd ResourcesToRemove
  update: {
    method: "updateMonitor",
    filterParams: ({ payload, diff, live }) =>
      pipe([() => payload, defaultsDeep(pickId(live))])(),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/InternetMonitor.html#deleteMonitor-property
  destroy: {
    preDestroy: ({ endpoint }) =>
      tap(
        pipe([
          pick(["MonitorName"]),
          assign({ Status: () => "INACTIVE" }),
          endpoint().updateMonitor,
        ])
      ),
    method: "deleteMonitor",
    pickId,
    shouldRetryOnExceptionMessages: [
      "must be in inactive state before deletion",
    ],
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
    dependencies: {},
    config,
  }) =>
    pipe([
      () => otherProps,
      defaultsDeep({
        Tags: buildTagsObject({ name, config, namespace, userTags: Tags }),
      }),
    ])(),
});
