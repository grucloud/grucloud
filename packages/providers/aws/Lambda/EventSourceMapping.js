const assert = require("assert");
const { pipe, tap, get, pick } = require("rubico");
const { defaultsDeep, callProp, last, when } = require("rubico/x");

const { getByNameCore } = require("@grucloud/core/Common");

const { getField } = require("@grucloud/core/ProviderCommon");
const { AwsClient } = require("../AwsClient");
const { createLambda, tagResource, untagResource } = require("./LambdaCommon");

const findId = get("live.UUID");
const pickId = pipe([
  tap(({ UUID }) => {
    assert(UUID);
  }),
  pick(["UUID"]),
]);

const nameFromArn = pipe([callProp("split", ":"), last]);

const findName = pipe([
  get("live"),
  tap(({ FunctionArn, EventSourceArn }) => {
    assert(FunctionArn);
    assert(EventSourceArn);
  }),
  ({ FunctionArn, EventSourceArn }) =>
    `mapping-${nameFromArn(FunctionArn)}-${nameFromArn(EventSourceArn)}`,
]);

exports.EventSourceMapping = ({ spec, config }) => {
  const lambda = createLambda(config);
  const client = AwsClient({ spec, config })(lambda);

  /*
  Amazon DynamoDB Streams
Amazon MQ and RabbitMQ
Amazon MSK
Apache Kafka
*/
  const findDependencies = ({ live, lives }) => [
    {
      type: "Function",
      group: "Lambda",
      ids: [
        pipe([
          () =>
            lives.getById({
              providerName: config.providerName,
              id: live.FunctionArn,
              type: "Function",
              group: "Lambda",
            }),
          get("id"),
        ])(),
      ],
    },
    //TODO create function
    {
      type: "Queue",
      group: "SQS",
      ids: [
        pipe([
          () =>
            lives.getById({
              providerName: config.providerName,
              id: live.EventSourceArn,
              type: "Queue",
              group: "SQS",
            }),
          get("id"),
        ])(),
      ],
    },
    {
      type: "Stream",
      group: "Kinesis",
      ids: [
        pipe([
          () =>
            lives.getById({
              providerName: config.providerName,
              id: live.EventSourceArn,
              type: "Stream",
              group: "Kinesis",
            }),
          get("id"),
        ])(),
      ],
    },
    //S3
  ];

  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Lambda.html#listEventSourceMappings-property
  const getList = client.getList({
    method: "listEventSourceMappings",
    getParam: "EventSourceMappings",
  });

  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Lambda.html#getEventSourceMapping-property
  const getById = client.getById({
    pickId,
    method: "getEventSourceMapping",
    ignoreErrorCodes: ["ResourceNotFoundException"],
  });

  const getByName = getByNameCore({ getList, findName });
  //TODO isInstanceUp
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Lambda.html#createEventSourceMapping-property
  const create = client.create({
    method: "createEventSourceMapping",
    getById,
    shouldRetryOnExceptionMessages: [
      "The provided execution role does not have permissions to call ReceiveMessage on SQS",
      "Please add Lambda as a Trusted Entity",
    ],
  });

  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Lambda.html#updateEventSourceMapping-property
  const update = client.update({
    pickId,
    method: "updateEventSourceMapping",
    getById,
  });

  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Lambda.html#deleteEventSourceMapping-property
  const destroy = client.destroy({
    pickId,
    method: "deleteEventSourceMapping",
    getById,
    ignoreErrorCodes: ["ResourceNotFoundException"],
  });

  /*
  TODO
Amazon DynamoDB Streams
Amazon Kinesis
Amazon MQ and RabbitMQ
Amazon MSK
Apache Kafka
  */
  const configDefault = ({
    name,
    namespace,
    properties,
    dependencies: { lambdaFunction, sqsQueue, kinesisStream },
  }) =>
    pipe([
      tap(() => {
        assert(lambdaFunction);
      }),
      () => properties,
      defaultsDeep({
        FunctionName: getField(lambdaFunction, "Configuration.FunctionName"),
      }),
      when(
        () => sqsQueue,
        defaultsDeep({
          EventSourceArn: getField(sqsQueue, "Attributes.QueueArn"),
        })
      ),
      when(
        () => kinesisStream,
        defaultsDeep({
          EventSourceArn: getField(kinesisStream, "StreamARN"),
        })
      ),
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
    getById,
    getByName,
    getList,
    configDefault,
    findDependencies,
    tagResource: tagResource({ lambda }),
    untagResource: untagResource({ lambda }),
  };
};
