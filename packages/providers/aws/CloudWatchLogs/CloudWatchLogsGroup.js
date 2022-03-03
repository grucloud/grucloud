const assert = require("assert");
const {
  pipe,
  tap,
  get,
  eq,
  pick,
  any,
  omit,
  switchCase,
  assign,
} = require("rubico");
const { defaultsDeep, callProp } = require("rubico/x");
const { createEndpoint } = require("../AwsCommon");
const { AwsClient } = require("../AwsClient");
const { buildTagsObject, omitIfEmpty } = require("@grucloud/core/Common");

const findId = pipe([get("live.arn"), callProp("replace", ":*", "")]);
const pickId = pick(["logGroupName"]);
const findName = get("live.logGroupName");

exports.CloudWatchLogsGroup = ({ spec, config }) => {
  const cloudWatchLogs = () =>
    createEndpoint({ endpointName: "CloudWatchLogs" })(config);
  const client = AwsClient({ spec, config });

  const findDependencies = ({ live, lives }) => [
    {
      type: "Key",
      group: "kms",
      ids: [live.kmsKeyId],
    },
  ];

  const cannotBeDeleted = pipe([
    tap((params) => {
      assert(true);
    }),
    get("live.logGroupName"),
    (logGroupName) =>
      pipe([
        () => ["/aws/", "/ecs/"],
        any((prefix) => logGroupName.startsWith(prefix)),
      ])(),
    tap((params) => {
      assert(true);
    }),
  ]);

  const decorate = () =>
    pipe([
      assign({
        tags: pipe([
          pick(["logGroupName"]),
          cloudWatchLogs().listTagsLogGroup,
          get("tags"),
        ]),
        arn: pipe([get("arn"), callProp("replace", ":*", "")]),
      }),
      omitIfEmpty(["Tags"]),
    ]);

  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/CloudWatchLogs.html#describeLogGroups-property
  const getList = client.getList({
    method: "describeLogGroups",
    getParam: "logGroups",
    decorate,
  });

  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/CloudWatchLogs.html#describeLogGroups-property
  const getById = client.getById({
    pickId: ({ logGroupName }) => ({ logGroupNamePrefix: logGroupName }),
    method: "describeLogGroups",
    getField: "logGroups",
    decorate,
  });

  const getByName = pipe([({ name }) => ({ logGroupName: name }), getById]);

  const putRetentionPolicy = pipe([
    tap.if(
      get("retentionInDays"),
      pipe([
        pick(["logGroupName", "retentionInDays"]),
        cloudWatchLogs().putRetentionPolicy,
      ])
    ),
  ]);

  const deleteRetentionPolicy = pipe([
    pick(["logGroupName"]),
    cloudWatchLogs().deleteRetentionPolicy,
  ]);

  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/CloudWatchLogs.html#createLogGroup-property
  const create = client.create({
    filterPayload: omit(["retentionInDays"]),
    method: "createLogGroup",
    pickId,
    getById,
    config,
    postCreate: pipe([get("payload"), putRetentionPolicy]),
  });

  const update = ({ payload, name, diff }) =>
    pipe([
      () => payload,
      switchCase([
        get("retentionInDays"),
        putRetentionPolicy,
        deleteRetentionPolicy,
      ]),
    ])();

  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/CloudWatchLogs.html#deleteLogGroup-property
  const destroy = client.destroy({
    pickId,
    method: "deleteLogGroup",
    getById,
    ignoreErrorCodes: ["ResourceNotFoundException"],
    config,
  });

  const configDefault = ({ name, namespace, properties, dependencies: {} }) =>
    pipe([
      () => properties,
      defaultsDeep({
        logGroupName: name,
        tags: buildTagsObject({ config, namespace, name }),
        // TODO kmsKeyId
      }),
    ])();

  return {
    spec,
    findName,
    findId,
    create,
    update,
    destroy,
    getByName,
    getById,
    getList,
    configDefault,
    findDependencies,
    cannotBeDeleted,
    managedByOther: cannotBeDeleted,
  };
};
