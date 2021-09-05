const assert = require("assert");
const {
  assign,
  pipe,
  tap,
  get,
  eq,
  pick,
  switchCase,
  tryCatch,
} = require("rubico");
const { defaultsDeep, last, callProp, includes } = require("rubico/x");

const { buildTagsObject } = require("@grucloud/core/Common");
const { shouldRetryOnException, createEndpoint } = require("../AwsCommon");
const { AwsClient } = require("../AwsClient");

const findId = get("live.QueueUrl");
const pickId = pick(["QueueUrl"]);
const findName = pipe([
  get("live.QueueUrl"),
  callProp("split", "/"),
  last,
  tap((name) => {
    assert(name);
  }),
]);

const ignoreErrorCodes = ["AWS.SimpleQueueService.NonExistentQueue"];

exports.SQSQueue = ({ spec, config }) => {
  const client = AwsClient({ spec, config });
  const sqs = () => createEndpoint({ endpointName: "SQS" })(config);

  const findDependencies = ({ live, lives }) => [];

  const decorate = pipe([
    tap((params) => {
      assert(true);
    }),
    (QueueUrl) => ({ QueueUrl }),
    assign({
      tags: pipe([sqs().listQueueTags, get("Tags")]),
    }),
    tap((params) => {
      assert(true);
    }),
  ]);

  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/SQS.html#listQueues-property
  const getList = client.getList({
    method: "listQueues",
    getParam: "QueueUrls",
    decorate,
  });

  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/SQS.html#getQueueAttributes-property
  const getById = client.getById({
    pickId,
    method: "getQueueAttributes",
    getField: "Attributes",
    decorate,
    ignoreErrorCodes,
  });

  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/SQS.html#getQueueUrl-property
  const getByName = pipe([
    ({ name }) => ({ QueueName: name }),
    tap((params) => {
      assert(true);
    }),
    tryCatch(
      pipe([
        sqs().getQueueUrl,
        tap((params) => {
          assert(true);
        }),
        getById,
      ]),
      (error) =>
        pipe([
          () => ignoreErrorCodes,
          switchCase([
            includes(error.code),
            () => undefined,
            () => {
              throw error;
            },
          ]),
        ])()
    ),
  ]);

  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/SQS.html#createQueue-property
  const create = client.create({
    pickCreated: () => pick(["QueueUrl"]),
    method: "createQueue",
    getById,
    config: { ...config, retryCount: 100 },
  });

  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/SQS.html#setQueueAttributes-property
  const update = client.update({
    pickId,
    method: "setQueueAttributes",
    getById,
    config,
  });

  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/SQS.html#deleteQueue-property
  const destroy = client.destroy({
    pickId,
    method: "deleteQueue",
    getById,
    ignoreError: eq(get("code"), "AWS.SimpleQueueService.NonExistentQueue"),
    config,
  });

  const configDefault = async ({
    name,
    namespace,
    properties,
    dependencies: {},
  }) =>
    pipe([
      () => properties,
      defaultsDeep({
        QueueName: name,
        tags: buildTagsObject({ config, namespace, name }),
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
    getList,
    configDefault,
    shouldRetryOnException,
    findDependencies,
  };
};
