const { getField } = require("@grucloud/core/ProviderCommon");
const assert = require("assert");
const { pipe, tap, get, tryCatch } = require("rubico");
const { defaultsDeep } = require("rubico/x");

const {
  createSNSAttribute,
  updateSNSAttribute,
  getByIdSNSAttribute,
  getListSQSAttribute,
  destroySNSAttribute,
  getByNameSQSAttribute,
  ignoreErrorCodes,
} = require("./SQSCommon");

exports.SQSQueueRedrivePolicy = () => ({
  type: "QueueRedrivePolicy",
  package: "sqs",
  client: "SQS",
  ignoreErrorCodes,
  inferName: ({ dependenciesSpec: { sqsQueue } }) =>
    pipe([
      () => sqsQueue,
      tap((name) => {
        assert(name);
      }),
    ]),
  findName: () =>
    pipe([
      get("QueueName"),
      tap((name) => {
        assert(name);
      }),
    ]),
  findId: () =>
    pipe([
      get("QueueUrl"),
      tap((id) => {
        assert(id);
      }),
    ]),
  propertiesDefault: {},
  dependencies: {
    sqsQueue: {
      type: "Queue",
      group: "SQS",
      parent: true,
      dependencyId: () =>
        pipe([
          get("Attributes.QueueArn"),
          tap((id) => {
            assert(id);
          }),
        ]),
    },
    sqsDeadLetterQueue: {
      type: "Queue",
      group: "SQS",
      dependencyId: () =>
        pipe([
          get("Attributes.RedrivePolicy.deadLetterTargetArn"),
          tap((id) => {
            assert(id);
          }),
        ]),
    },
  },
  omitProperties: [
    "QueueUrl",
    "QueueName",
    "Attributes.QueueArn",
    "Attributes.RedrivePolicy.deadLetterTargetArn",
  ],
  //filterLive: ({ providerConfig, lives }) => pipe([omit(["QueueUrl"])]),
  getById: getByIdSNSAttribute({ attributeName: "RedrivePolicy" }),
  getList: getListSQSAttribute({ attributeName: "RedrivePolicy" }),
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/SQS.html#createMyResource-property
  create: createSNSAttribute({ attributeName: "RedrivePolicy" }),
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/SQS.html#updateMyResource-property
  update: updateSNSAttribute({ attributeName: "RedrivePolicy" }),
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/SQS.html#deleteMyResource-property
  destroy: destroySNSAttribute({ attributeName: "RedrivePolicy" }),
  getByName: getByNameSQSAttribute({ attributeName: "RedrivePolicy" }),
  configDefault: ({
    name,
    namespace,
    properties: { ...otherProps },
    dependencies: { sqsQueue, sqsDeadLetterQueue },
    config,
  }) =>
    pipe([
      tap((params) => {
        assert(sqsQueue);
      }),
      () => otherProps,
      defaultsDeep({
        QueueUrl: getField(sqsQueue, "QueueUrl"),
        Attributes: {
          RedrivePolicy: {
            deadLetterTargetArn: getField(
              sqsDeadLetterQueue,
              "Attributes.QueueArn"
            ),
          },
        },
      }),
    ])(),
});
