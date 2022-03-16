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
const { AwsClient } = require("../AwsClient");
const { buildTagsObject, omitIfEmpty } = require("@grucloud/core/Common");
const {
  createCloudWatchLogs,
  ignoreErrorCodes,
  tagResource,
  untagResource,
} = require("./CloudWatchLogsCommon");

const findId = pipe([get("live.arn"), callProp("replace", ":*", "")]);
const pickId = pick(["logGroupName"]);
const findName = get("live.logGroupName");

exports.CloudWatchLogsGroup = ({ spec, config }) => {
  const cloudWatchLogs = createCloudWatchLogs(config);
  const client = AwsClient({ spec, config })(cloudWatchLogs);

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
        () => ["/aws/apigateway/", "/aws/lambda/", "/ecs/"],
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
        (params) => cloudWatchLogs().putRetentionPolicy(params),
      ])
    ),
  ]);

  const deleteRetentionPolicy = pipe([
    pick(["logGroupName"]),
    (params) => cloudWatchLogs().deleteRetentionPolicy(params),
  ]);

  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/CloudWatchLogs.html#createLogGroup-property
  const create = client.create({
    filterPayload: omit(["retentionInDays"]),
    method: "createLogGroup",
    getById,
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
    ignoreErrorCodes,
  });

  const configDefault = ({
    name,
    namespace,
    properties: { tags, ...otherProps },
    dependencies: {},
  }) =>
    pipe([
      () => otherProps,
      defaultsDeep({
        logGroupName: name,
        tags: buildTagsObject({ config, namespace, name, userTags: tags }),
        // TODO kmsKeyId
      }),
      tap((params) => {
        assert(true);
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
    tagResource: tagResource({ cloudWatchLogs }),
    untagResource: untagResource({ cloudWatchLogs }),
  };
};
