const assert = require("assert");
const { pipe, tap, get, eq, assign } = require("rubico");
const { defaultsDeep, when } = require("rubico/x");
const { retryCall } = require("@grucloud/core/Retry");
const { buildTagsObject } = require("@grucloud/core/Common");
const { getByNameCore } = require("@grucloud/core/Common");

const { createAwsResource } = require("../AwsClient");

const { tagResource, untagResource } = require("./BatchCommon");
const { getField } = require("@grucloud/core/ProviderCommon");

const buildArn = () => get("jobQueueArn");

const model = ({ config }) => ({
  package: "batch",
  client: "Batch",
  ignoreErrorCodes: ["ClientException"],
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Batch.html#describeJobQueues-property
  getById: {
    method: "describeJobQueues",
    pickId: pipe([
      ({ jobQueueName }) => ({
        jobQueues: [jobQueueName],
      }),
    ]),
    getField: "jobQueues",
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Batch.html#describeJobQueues-property
  getList: {
    method: "describeJobQueues",
    getParam: "jobQueues",
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Batch.html#createJobQueue-property
  create: {
    method: "createJobQueue",
    pickCreated: ({ payload }) => pipe([() => payload]),
    isInstanceUp: eq(get("status"), "VALID"),
    isInstanceError: eq(get("status"), "INVALID"),
    getErrorMessage: get("statusReason", "failed"),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Batch.html#updateJobQueue-property
  update: {
    method: "updateJobQueue",
    filterParams: ({ payload: { jobQueueName, ...other }, live }) =>
      pipe([() => ({ jobQueue: jobQueueName, ...other })])(),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Batch.html#deleteJobQueue-property
  destroy: {
    preDestroy:
      ({ endpoint, getById }) =>
      (live) =>
        pipe([
          () => ({
            jobQueue: live.jobQueueName,
            state: "DISABLED",
          }),
          endpoint().updateJobQueue,
          () =>
            retryCall({
              name: `describeJobQueues`,
              fn: pipe([() => live, getById]),
              isExpectedResult: eq(get("status"), "VALID"),
            }),
        ])(),
    method: "deleteJobQueue",
    pickId: ({ jobQueueName }) => ({
      jobQueue: jobQueueName,
    }),
  },
});

exports.BatchJobQueue = ({ spec, config }) =>
  createAwsResource({
    model: model({ config }),
    spec,
    config,
    findName: () => pipe([get("jobQueueName")]),
    findId: () => pipe([get("jobQueueArn")]),
    getByName: getByNameCore,
    tagResource: tagResource({
      buildArn: buildArn(config),
    }),
    untagResource: untagResource({
      buildArn: buildArn(config),
    }),
    configDefault: ({
      name,
      namespace,
      properties: { tags, ...otherProps },
      dependencies: { schedulingPolicy },
      config,
    }) =>
      pipe([
        () => otherProps,
        defaultsDeep({
          tags: buildTagsObject({ name, config, namespace, userTags: tags }),
        }),
        when(
          () => schedulingPolicy,
          assign({
            schedulingPolicyArn: pipe([
              () => getField(schedulingPolicy, "arn"),
            ]),
          })
        ),
      ])(),
  });
