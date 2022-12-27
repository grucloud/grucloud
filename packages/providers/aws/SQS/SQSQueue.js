const assert = require("assert");
const {
  assign,
  pipe,
  tap,
  get,
  pick,
  tryCatch,
  set,
  omit,
  eq,
  flatMap,
} = require("rubico");
const { defaultsDeep, last, callProp, when } = require("rubico/x");

const { buildTagsObject } = require("@grucloud/core/Common");
const { findInStatement } = require("../IAM/AwsIamCommon");

const {
  throwIfNotAwsError,
  assignPolicyAccountAndRegion,
} = require("../AwsCommon");

const { Tagger, ignoreErrorCodes } = require("./SQSCommon");

const buildArn = () =>
  pipe([
    get("QueueUrl"),
    tap((arn) => {
      assert(arn);
    }),
  ]);

const findId = () => get("Attributes.QueueArn");
const pickId = pipe([pick(["QueueUrl"])]);

const queueUrlToName = pipe([
  get("QueueUrl"),
  tap((QueueUrl) => {
    assert(QueueUrl);
  }),
  callProp("split", "/"),
  last,
  tap((name) => {
    assert(name);
  }),
]);

const omitDefaultPolicy = assign({
  Attributes: pipe([
    get("Attributes"),
    when(eq(get("Policy.Id"), "__default_policy_ID"), omit(["Policy"])),
  ]),
});

const findName = () => pipe([queueUrlToName]);

const assignTags = ({ endpoint }) =>
  pipe([
    assign({
      tags: pipe([pickId, endpoint().listQueueTags, get("Tags")]),
    }),
  ]);

const decorate = ({ endpoint, live }) =>
  pipe([
    (QueueUrl) => ({ QueueUrl }),
    assign({
      Attributes: pipe([
        pickId,
        defaultsDeep({ AttributeNames: ["All"] }),
        endpoint().getQueueAttributes,
        get("Attributes"),
        when(
          get("Policy"),
          assign({
            Policy: pipe([get("Policy"), JSON.parse]),
          })
        ),
      ]),
    }),
    omitDefaultPolicy,
    assign({ QueueName: pipe([queueUrlToName]) }),
    assignTags({ endpoint }),
  ]);

exports.SQSQueue = () => ({
  type: "Queue",
  package: "sqs",
  client: "SQS",
  ignoreErrorCodes,
  findName,
  findId,
  inferName: () => get("QueueName"),
  propertiesDefault: {
    Attributes: {
      VisibilityTimeout: "30",
      MaximumMessageSize: "262144",
      MessageRetentionPeriod: "345600",
      DelaySeconds: "0",
      ReceiveMessageWaitTimeSeconds: "0",
    },
  },
  dependencies: {
    snsTopics: {
      type: "Topic",
      group: "SNS",
      list: true,
      dependencyIds: ({ lives, config }) =>
        pipe([
          get("Attributes.Policy.Statement", []),
          flatMap(
            findInStatement({ type: "Topic", group: "SNS", lives, config })
          ),
        ]),
    },
  },
  omitProperties: [
    "QueueUrl",
    "Attributes.QueueArn",
    "Attributes.ApproximateNumberOfMessages",
    "Attributes.ApproximateNumberOfMessagesNotVisible",
    "Attributes.ApproximateNumberOfMessagesDelayed",
    "Attributes.CreatedTimestamp",
    "Attributes.LastModifiedTimestamp",
    "Attributes.SqsManagedSseEnabled",
    "Attributes.RedrivePolicy",
    "Attributes.RedriveAllowPolicy",
  ],
  filterLive: ({ providerConfig, lives }) =>
    pipe([
      omit(["QueueUrl"]),
      assign({
        Attributes: pipe([
          get("Attributes"),
          when(
            get("Policy"),
            assign({
              Policy: pipe([
                get("Policy"),
                assignPolicyAccountAndRegion({ providerConfig, lives }),
              ]),
            })
          ),
        ]),
      }),
    ]),
  getById: {
    pickId: pipe([queueUrlToName, (QueueNamePrefix) => ({ QueueNamePrefix })]),
    method: "listQueues",
    getField: "QueueUrls",
    decorate,
    ignoreErrorCodes,
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/MyModule.html#listMyResources-property
  getList: {
    method: "listQueues",
    getParam: "QueueUrls",
    decorate: ({ getById }) => pipe([(QueueUrl) => ({ QueueUrl }), getById]),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/MyModule.html#createMyResource-property
  create: {
    method: "createQueue",
    shouldRetryOnExceptionCodes: [
      "AWS.SimpleQueueService.QueueDeletedRecently",
      "QueueDeletedRecently",
    ],
    filterPayload: pipe([
      assign({
        Attributes: pipe([
          get("Attributes"),
          assign({
            Policy: pipe([get("Policy"), JSON.stringify]),
          }),
        ]),
      }),
    ]),
    //config: { retryDelay: 65e3, retryCount: 2 },
    configIsUp: { repeatCount: 1, repeatDelay: 60e3 },
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/MyModule.html#updateMyResource-property
  update: {
    pickId,
    filterParams: ({ payload, live }) =>
      pipe([
        () => payload,
        when(
          get("Attributes.Policy"),
          set("Attributes.Policy", JSON.stringify(payload.Attributes.Policy))
        ),
        defaultsDeep(pickId(live)),
      ])(),
    method: "setQueueAttributes",
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/MyModule.html#deleteMyResource-property
  destroy: {
    pickId,
    method: "deleteQueue",
    ignoreErrorCodes,
  },
  getByName: ({ endpoint, getById }) =>
    pipe([
      tryCatch(
        pipe([
          ({ name }) => ({ QueueName: name }),
          endpoint().getQueueUrl,
          getById({}),
        ]),
        throwIfNotAwsError("QueueDoesNotExist")
      ),
    ]),
  tagger: ({ config }) =>
    Tagger({
      buildArn: buildArn(config),
    }),
  configDefault: ({
    name,
    namespace,
    properties: { tags, ...otherProps },
    dependencies: {},
    config,
  }) =>
    pipe([
      () => otherProps,
      defaultsDeep({
        QueueName: name,
        tags: buildTagsObject({ config, namespace, name, userTags: tags }),
      }),
    ])(),
});
