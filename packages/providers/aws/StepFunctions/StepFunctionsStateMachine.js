const assert = require("assert");
const {
  map,
  pipe,
  tap,
  get,
  pick,
  assign,
  eq,
  switchCase,
  and,
  or,
} = require("rubico");
const {
  defaultsDeep,
  when,
  callProp,
  isString,
  uniq,
  pluck,
  find,
} = require("rubico/x");
const { getField } = require("@grucloud/core/ProviderCommon");

const { buildTags, replaceArnWithAccountAndRegion } = require("../AwsCommon");
const { tagResource, untagResource } = require("./StepFunctionsCommon");
const { getByNameCore } = require("@grucloud/core/Common");
const { cloneDeepWith } = require("lodash/fp");

const { flattenObject } = require("@grucloud/core/Common");

const { replaceWithName } = require("@grucloud/core/Common");

const pickId = pick(["stateMachineArn"]);

const decorate = ({ endpoint }) =>
  pipe([
    assign({
      definition: pipe([get("definition"), JSON.parse]),
      tags: pipe([
        ({ stateMachineArn }) => ({
          resourceArn: stateMachineArn,
        }),
        endpoint().listTagsForResource,
        get("tags"),
      ]),
    }),
  ]);

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/StepFunctions.html
exports.StepFunctionsStateMachine = () => ({
  type: "StateMachine",
  package: "sfn",
  client: "SFN",
  ignoreErrorCodes: ["StateMachineDoesNotExist"],
  inferName: () => get("name"),
  findName: () => get("name"),
  findId: () => get("stateMachineArn"),
  omitProperties: ["roleArn", "creationDate", "stateMachineArn", "status"],
  propertiesDefault: {
    type: "STANDARD",
    loggingConfiguration: { includeExecutionData: false, level: "OFF" },
    tracingConfiguration: {
      enabled: false,
    },
  },
  dependencies: {
    role: {
      type: "Role",
      group: "IAM",
      dependencyId: ({ lives, config }) => get("roleArn"),
    },
    glueJob: {
      type: "Job",
      group: "Glue",
      dependencyId: ({ lives, config }) =>
        pipe([
          get("definition.States"),
          flattenObject({ filterKey: (key) => key === "JobName" }),
          map(
            pipe([
              lives.getById({
                type: "Job",
                group: "Glue",
                providerName: config.providerName,
              }),
              get("id"),
            ])
          ),
          //TODO move uniq to flattenObject
          uniq,
        ]),
    },
    logGroups: {
      type: "LogGroup",
      group: "CloudWatchLogs",
      list: true,
      dependencyIds: ({ lives, config }) =>
        pipe([
          get("loggingConfiguration.destinations"),
          pluck("cloudWatchLogsLogGroup"),
          pluck("logGroupArn"),
          map((logGroupArn) =>
            pipe([
              lives.getByType({
                type: "LogGroup",
                group: "CloudWatchLogs",
                providerName: config.providerName,
              }),
              find(({ id }) => logGroupArn.includes(id)),
              get("id"),
            ])()
          ),
        ]),
    },
    lambdaFunctions: {
      type: "Function",
      group: "Lambda",
      list: true,
      dependencyIds: ({ lives, config }) =>
        pipe([
          get("definition.States"),
          flattenObject({ filterKey: (key) => key === "FunctionName" }),
          map(
            pipe([
              lives.getById({
                type: "Function",
                group: "Lambda",
                providerName: config.providerName,
              }),
              get("id"),
            ])
          ),
          //TODO move uniq to flattenObject
          uniq,
        ]),
    },
    //TODO
    // snsTopics: {
    //   type: "Topic",
    //   group: "SNS",
    //   list: true,
    //   dependencyId: ({ lives, config }) => get("WebACLArn"),
    // },
    sqsQueues: {
      type: "Queue",
      group: "SQS",
      list: true,
      dependencyIds: ({ lives, config }) =>
        pipe([
          get("definition.States"),
          flattenObject({ filterKey: (key) => key === "QueueUrl" }),
          map((QueueUrl) =>
            pipe([
              lives.getByType({
                type: "Queue",
                group: "SQS",
                providerName: config.providerName,
              }),
              find(eq(get("live.QueueUrl"), QueueUrl)),
              get("id"),
            ])()
          ),
          //TODO move uniq to flattenObject
          uniq,
        ]),
    },
  },
  filterLive: ({ lives, providerConfig }) =>
    pipe([
      assign({
        definition: pipe([
          get("definition"),
          cloneDeepWith(
            pipe([
              switchCase([
                and([
                  isString,
                  or([
                    callProp("startsWith", "https://"),
                    callProp("startsWith", "arn:"),
                    callProp("endsWith", ".amazonaws.com"),
                  ]),
                ]),
                pipe([
                  replaceArnWithAccountAndRegion({ providerConfig, lives }),
                ]),
                () => undefined,
              ]),
            ])
          ),
        ]),
      }),
      assign({
        loggingConfiguration: pipe([
          get("loggingConfiguration"),
          when(
            get("destinations"),
            assign({
              destinations: pipe([
                get("destinations"),
                map(
                  assign({
                    cloudWatchLogsLogGroup: pipe([
                      get("cloudWatchLogsLogGroup"),
                      assign({
                        logGroupArn: pipe([
                          get("logGroupArn"),
                          replaceWithName({
                            groupType: "CloudWatchLogs::LogGroup",
                            path: "id",
                            providerConfig,
                            lives,
                            withSuffix: true,
                          }),
                        ]),
                      }),
                    ]),
                  })
                ),
              ]),
            })
          ),
        ]),
      }),
    ]),
  getById: {
    method: "describeStateMachine",
    pickId,
    decorate,
  },
  getList: {
    method: "listStateMachines",
    getParam: "stateMachines",
    decorate: ({ getById }) => getById,
  },
  create: {
    method: "createStateMachine",
    filterPayload: pipe([
      assign({
        definition: pipe([get("definition"), JSON.stringify]),
      }),
    ]),
    shouldRetryOnExceptionCodes: ["AccessDeniedException"],
  },
  update: { method: "updateStateMachine" },
  destroy: { method: "deleteStateMachine", pickId },
  getByName: getByNameCore,
  tagger: () => ({ tagResource: tagResource, untagResource: untagResource }),

  configDefault: ({
    name,
    namespace,
    properties: { tags, ...otherProps },
    dependencies: { role },
    config,
  }) =>
    pipe([
      tap((params) => {
        assert(role);
      }),
      () => otherProps,
      defaultsDeep({
        name,
        tags: buildTags({
          name,
          config,
          namespace,
          UserTags: tags,
          key: "key",
          value: "value",
        }),
        roleArn: getField(role, "Arn"),
      }),
    ])(),
});
