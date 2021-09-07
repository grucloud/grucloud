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
  set,
  not,
} = require("rubico");
const {
  isEmpty,
  defaultsDeep,
  last,
  callProp,
  includes,
  when,
  first,
} = require("rubico/x");

const { buildTagsObject } = require("@grucloud/core/Common");
const { shouldRetryOnException, createEndpoint } = require("../AwsCommon");
const { AwsClient } = require("../AwsClient");

const findId = get("live.QueueUrl");
const pickId = pick(["QueueUrl"]);
const findName = pipe([
  get("live.QueueUrl"),
  tap((QueueUrl) => {
    assert(QueueUrl);
  }),
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

  const assignTags = pipe([
    assign({
      tags: pipe([pickId, sqs().listQueueTags, get("Tags")]),
    }),
  ]);

  const decorate = (params) =>
    pipe([
      tap((input) => {}),
      when(
        get("Policy"),
        assign({
          Policy: pipe([get("Policy"), JSON.parse]),
        })
      ),
      (Attributes) => ({ ...params, Attributes }),
      assignTags,
    ]);

  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/SQS.html#getQueueAttributes-property
  const getById = client.getById({
    pickId,
    extraParams: { AttributeNames: ["All"] },
    method: "getQueueAttributes",
    getField: "Attributes",
    decorate,
    ignoreErrorCodes,
  });

  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/SQS.html#listQueues-property
  const getList = client.getList({
    method: "listQueues",
    getParam: "QueueUrls",
    decorate: pipe([(QueueUrl) => ({ QueueUrl }), getById]),
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

  //Retry on AWS.SimpleQueueService.QueueDeletedRecently
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/SQS.html#createQueue-property
  const create = client.create({
    pickCreated: () => pick(["QueueUrl"]),
    method: "createQueue",
    shouldRetryOnException: eq(
      get("error.code"),
      "AWS.SimpleQueueService.QueueDeletedRecently"
    ),
    getById,
    isInstanceUp: pipe([
      tap((params) => {
        assert(true);
      }),
      (live) => ({ live }),
      findName,
      (QueueNamePrefix) =>
        pipe([
          () => ({ QueueNamePrefix }),
          sqs().listQueues,
          tap((params) => {
            assert(true);
            console.log("q", params);
          }),
          get("QueueUrls"),
          first,
          not(isEmpty),
          tap((params) => {
            assert(true);
          }),
        ])(),
    ]),
    config: { ...config, retryCount: 100 },
    configIsUp: { repeatCount: 5, repeatDelay: 2 },
  });

  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/SQS.html#setQueueAttributes-property
  const update = client.update({
    pickId,
    filterParams: (params) =>
      pipe([
        () => params,
        set("Attributes.Policy", JSON.stringify(params.Attributes.Policy)),
        tap((params) => {
          assert(true);
        }),
      ])(),
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
    properties: { tags, ...otherProps },
    dependencies: {},
  }) =>
    pipe([
      () => otherProps,
      defaultsDeep({
        QueueName: name,
        tags: buildTagsObject({ config, namespace, name, userTags: tags }),
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
    shouldRetryOnException,
    findDependencies,
  };
};
