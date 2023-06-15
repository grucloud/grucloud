const assert = require("assert");
const {
  pipe,
  tap,
  get,
  pick,
  any,
  omit,
  switchCase,
  assign,
  fork,
  eq,
  tryCatch,
} = require("rubico");
const { defaultsDeep, callProp, when, unless, isEmpty } = require("rubico/x");
const { buildTagsObject, omitIfEmpty } = require("@grucloud/core/Common");
const {
  ignoreErrorCodes,
  LogGroupNameManagedByOther,
  assignTags,
  Tagger,
} = require("./CloudWatchLogsCommon");
const { getField } = require("@grucloud/core/ProviderCommon");

const findId = () => pipe([get("arn"), callProp("replace", ":*", "")]);

const pickId = pick(["logGroupName"]);
const findName = () => get("logGroupName");

const buildArn = () =>
  pipe([
    get("arn"),
    tap((arn) => {
      assert(arn);
    }),
  ]);

const assignArn = ({ config }) =>
  pipe([
    tap(({ logGroupName }) => {
      assert(logGroupName);
    }),
    assign({
      arn: pipe([
        ({ logGroupName }) =>
          `arn:${config.partition}:logs:${
            config.region
          }:${config.accountId()}:log-group:${logGroupName}`,
      ]),
    }),
  ]);

const managedByOther = () =>
  pipe([
    get("logGroupName"),
    (logGroupName) =>
      pipe([
        () => LogGroupNameManagedByOther,
        any((prefix) => logGroupName.startsWith(prefix)),
      ])(),
  ]);

const assignDataProtectionPolicy = ({ endpoint }) =>
  pipe([
    when(
      eq(get("dataProtectionStatus"), "ACTIVATED"),
      pipe([
        assign({
          dataProtectionPolicy: pipe([
            ({ arn }) => ({ logGroupIdentifier: arn }),
            endpoint().getDataProtectionPolicy,
            get("policyDocument"),
            unless(isEmpty, JSON.parse),
          ]),
        }),
        omitIfEmpty(["DataProtectionPolicy"]),
      ])
    ),
  ]);

const putDataProtectionPolicy = ({ endpoint }) =>
  pipe([
    tap.if(
      get("dataProtectionPolicy"),
      pipe([
        fork({
          logGroupIdentifier: pipe([
            get("arn"),
            tap((arn) => {
              assert(arn);
            }),
          ]),
          policyDocument: pipe([get("dataProtectionPolicy"), JSON.stringify]),
        }),
        endpoint().putDataProtectionPolicy,
      ])
    ),
  ]);

const deleteDataProtectionPolicy = ({ endpoint }) =>
  pipe([
    tryCatch(
      pipe([
        fork({ logGroupIdentifier: get("arn") }),
        endpoint().deleteDataProtectionPolicy,
      ]),
      // TODO
      (error) => {
        assert(true);
      }
    ),
  ]);

const putRetentionPolicy = ({ endpoint }) =>
  pipe([
    tap.if(
      get("retentionInDays"),
      pipe([
        pick(["logGroupName", "retentionInDays"]),
        endpoint().putRetentionPolicy,
      ])
    ),
  ]);

const deleteRetentionPolicy = ({ endpoint }) =>
  pipe([pick(["logGroupName"]), endpoint().deleteRetentionPolicy]);

const decorate = ({ endpoint, config }) =>
  pipe([
    assignArn({ config }),
    assignTags({ endpoint, buildArn: buildArn() }),
    assignDataProtectionPolicy({ endpoint }),
  ]);

exports.CloudWatchLogsLogGroup = ({ compare }) => ({
  type: "LogGroup",
  package: "cloudwatch-logs",
  client: "CloudWatchLogs",
  //pickPropertiesCreate: ["retentionInDays"],
  inferName: () => get("logGroupName"),
  compare: compare({
    filterAll: () => pipe([pick(["retentionInDays", "dataProtectionPolicy"])]),
  }),
  // TODO use propertiesCreate ?
  filterLive: () =>
    pipe([pick(["logGroupName", "retentionInDays", "dataProtectionPolicy"])]),
  dependencies: {
    kmsKey: {
      type: "Key",
      group: "KMS",
      dependencyId: ({ lives, config }) => get("kmsKeyId"),
    },
  },
  ignoreErrorCodes,
  omitProperties: [],
  managedByOther,
  findName,
  findId,
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/CloudWatchLogs.html#describeLogGroups-property
  getById: {
    pickId: ({ logGroupName }) => ({ logGroupNamePrefix: logGroupName }),
    method: "describeLogGroups",
    getField: "logGroups",
    decorate,
  },
  getList: { method: "describeLogGroups", getParam: "logGroups", decorate },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/CloudWatchLogs.html#createLogGroup-property
  create: {
    filterPayload: omit(["retentionInDays", "dataProtectionPolicy"]),
    method: "createLogGroup",
    postCreate: ({ endpoint, payload, config }) =>
      pipe([
        tap((params) => {
          assert(config);
        }),
        () => payload,
        assignArn({ config }),
        tap(putRetentionPolicy({ endpoint })),
        tap(putDataProtectionPolicy({ endpoint })),
      ]),
  },
  update:
    ({ endpoint }) =>
    ({ payload, name, config }) =>
      pipe([
        tap((params) => {
          assert(config);
        }),
        () => payload,
        assignArn({ config }),
        tap(
          switchCase([
            get("retentionInDays"),
            putRetentionPolicy({ endpoint }),
            deleteRetentionPolicy({ endpoint }),
          ])
        ),
        tap(
          switchCase([
            get("dataProtectionPolicy"),
            putDataProtectionPolicy({ endpoint }),
            deleteDataProtectionPolicy({ endpoint }),
          ])
        ),
        tap((params) => {
          assert(true);
        }),
      ])(),
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/CloudWatchLogs.html#deleteLogGroup-property
  destroy: {
    pickId,
    method: "deleteLogGroup",
  },
  getByName: ({ getById }) =>
    pipe([({ name }) => ({ logGroupName: name }), getById({})]),
  tagger: ({ config }) =>
    Tagger({
      buildArn: buildArn({ config }),
    }),
  configDefault: ({
    name,
    namespace,
    properties: { tags, ...otherProps },
    dependencies: { kmsKey },
    config,
  }) =>
    pipe([
      () => otherProps,
      defaultsDeep({
        tags: buildTagsObject({ config, namespace, name, userTags: tags }),
      }),
      when(() => kmsKey, defaultsDeep({ kmsKeyId: getField(kmsKey, "Arn") })),
    ])(),
});
