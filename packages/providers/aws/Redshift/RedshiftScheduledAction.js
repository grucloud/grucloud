const assert = require("assert");
const { pipe, tap, get, pick, assign, map } = require("rubico");
const { prepend, append, filterOut, when, isEmpty } = require("rubico/x");

const { getByNameCore } = require("@grucloud/core/Common");
const { getField } = require("@grucloud/core/ProviderCommon");

const pickId = pipe([
  tap(({ ScheduledActionName }) => {
    assert(ScheduledActionName);
  }),
  pick(["ScheduledActionName"]),
]);

const decorate = ({ endpoint, config }) =>
  pipe([
    tap((params) => {
      assert(endpoint);
    }),
    when(
      get("TargetAction"),
      assign({
        TargetAction: pipe([get("TargetAction"), JSON.parse]),
      })
    ),
  ]);

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Redshift.html
exports.RedshiftScheduledAction = () => ({
  type: "ScheduledAction",
  package: "redshift",
  client: "Redshift",
  propertiesDefault: {},
  omitProperties: ["NextInvocations", "StartTime"],
  inferName: () =>
    pipe([
      get("ScheduledActionName"),
      tap((Name) => {
        assert(Name);
      }),
    ]),
  findName: () =>
    pipe([
      get("ScheduledActionName"),
      tap((name) => {
        assert(name);
      }),
    ]),
  findId: () =>
    pipe([
      get("ScheduledActionName"),
      tap((id) => {
        assert(id);
      }),
    ]),
  ignoreErrorCodes: ["ScheduledActionNotFoundFault"],
  dependencies: {
    cluster: {
      type: "Cluster",
      group: "Redshift",
      list: true,
      dependencyIds:
        ({ lives, config }) =>
        (live) =>
          pipe([
            () => ["PauseCluster", "ResizeCluster", "ResumeCluster"],
            map(
              pipe([
                prepend("TargetAction"),
                append("ClusterIdentifier"),
                (ClusterIdentifier) =>
                  pipe([() => live, get(ClusterIdentifier)])(),
              ])
            ),
            filterOut(isEmpty),
          ])(),
    },
    iamRole: {
      type: "Role",
      group: "IAM",
      pathId: "IamRole",
      optional: true,
      dependencyId: ({ lives, config }) => pipe([get("IamRole")]),
    },
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Redshift.html#describeScheduledActions-property
  getById: {
    method: "describeScheduledActions",
    getField: "ScheduledActions",
    pickId,
    decorate,
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Redshift.html#describeScheduledActions-property
  getList: {
    method: "describeScheduledActions",
    getParam: "ScheduledActions",
    decorate,
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Redshift.html#createScheduledAction-property
  create: {
    method: "createScheduledAction",
    pickCreated: ({ payload }) => pipe([() => payload]),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Redshift.html#modifyScheduledAction-property
  update: {
    method: "modifyScheduledAction",
    filterParams: ({ payload, diff, live }) => pipe([() => payload])(),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Redshift.html#deleteScheduledAction-property
  destroy: {
    method: "deleteScheduledAction",
    pickId,
  },
  getByName: getByNameCore,
  configDefault: ({
    name,
    namespace,
    properties: { ...otherProps },
    dependencies: { iamRole },
    config,
  }) =>
    pipe([
      tap(() => {
        assert(iamRole);
      }),
      () => otherProps,
      when(() => iamRole, assign({ IamRole: () => getField(iamRole, "Arn") })),
      assign({
        StartTime: pipe([() => new Date(Date.now() + 30 * 60e3)]),
      }),
    ])(),
});
