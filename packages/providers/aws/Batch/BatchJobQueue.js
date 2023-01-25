const assert = require("assert");
const { pipe, tap, get, eq, assign, map } = require("rubico");
const { defaultsDeep, when, pluck } = require("rubico/x");
const { retryCall } = require("@grucloud/core/Retry");
const { buildTagsObject } = require("@grucloud/core/Common");
const { getByNameCore } = require("@grucloud/core/Common");
const { replaceWithName } = require("@grucloud/core/Common");

const { Tagger } = require("./BatchCommon");
const { getField } = require("@grucloud/core/ProviderCommon");

const buildArn = () => get("jobQueueArn");

exports.BatchJobQueue = ({}) => ({
  type: "JobQueue",
  package: "batch",
  client: "Batch",
  inferName: () => get("jobQueueName"),
  findName: () => pipe([get("jobQueueName")]),
  findId: () => pipe([get("jobQueueArn")]),
  propertiesDefault: {
    state: "ENABLED",
  },
  omitProperties: [
    "status",
    "statusReason",
    "jobQueueArn",
    "schedulingPolicyArn",
  ],

  dependencies: {
    computeEnvironments: {
      type: "ComputeEnvironment",
      group: "Batch",
      list: true,
      dependencyIds: ({ lives, config }) =>
        pipe([get("computeEnvironmentOrder"), pluck("computeEnvironment")]),
    },
    schedulingPolicy: {
      type: "SchedulingPolicy",
      group: "Batch",
      dependencyId: ({ lives, config }) => pipe([get("schedulingPolicyArn")]),
    },
  },
  filterLive: ({ lives, providerConfig }) =>
    pipe([
      assign({
        computeEnvironmentOrder: pipe([
          get("computeEnvironmentOrder"),
          map(
            assign({
              computeEnvironment: pipe([
                get("computeEnvironment"),
                replaceWithName({
                  groupType: "Batch::ComputeEnvironment",
                  path: "id",
                  providerConfig,
                  lives,
                }),
              ]),
            })
          ),
        ]),
      }),
    ]),
  getByName: getByNameCore,
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
    preDestroy: ({ endpoint, getById }) =>
      tap((live) =>
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
        ])()
      ),
    method: "deleteJobQueue",
    pickId: ({ jobQueueName }) => ({
      jobQueue: jobQueueName,
    }),
  },
  tagger: ({ config }) =>
    Tagger({
      buildArn: buildArn({ config }),
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
          schedulingPolicyArn: pipe([() => getField(schedulingPolicy, "arn")]),
        })
      ),
    ])(),
});
