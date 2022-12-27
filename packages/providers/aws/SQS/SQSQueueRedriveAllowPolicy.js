const assert = require("assert");
const { pipe, tap, get, map } = require("rubico");
const { defaultsDeep } = require("rubico/x");
const { getField } = require("@grucloud/core/ProviderCommon");

const {
  createSNSAttribute,
  updateSNSAttribute,
  getByIdSNSAttribute,
  getListSQSAttribute,
  destroySNSAttribute,
  getByNameSQSAttribute,
  ignoreErrorCodes,
} = require("./SQSCommon");

exports.SQSQueueRedriveAllowPolicy = () => ({
  type: "QueueRedriveAllowPolicy",
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
  findId: () => pipe([get("QueueUrl")]),
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
    sqsSourceQueues: {
      type: "Queue",
      group: "SQS",
      list: true,
      dependencyIds: () =>
        pipe([
          tap((params) => {
            assert(true);
          }),
          get("Attributes.RedriveAllowPolicy.sourceQueueArns"),
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
    "Attributes.RedriveAllowPolicy.sourceQueueArns",
  ],
  getById: getByIdSNSAttribute({
    attributeName: "RedriveAllowPolicy",
  }),
  getList: getListSQSAttribute({ attributeName: "RedriveAllowPolicy" }),
  create: createSNSAttribute({ attributeName: "RedriveAllowPolicy" }),
  update: updateSNSAttribute({ attributeName: "RedriveAllowPolicy" }),
  destroy: destroySNSAttribute({ attributeName: "RedriveAllowPolicy" }),
  getByName: getByNameSQSAttribute({ attributeName: "RedriveAllowPolicy" }),
  configDefault: ({
    name,
    namespace,
    properties: { ...otherProps },
    dependencies: { sqsQueue, sqsSourceQueues = [] },
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
          RedriveAllowPolicy: {
            sourceQueueArns: pipe([
              () => sqsSourceQueues,
              map((queue) => getField(queue, "Attributes.QueueArn")),
            ])(),
          },
        },
      }),
    ])(),
});
