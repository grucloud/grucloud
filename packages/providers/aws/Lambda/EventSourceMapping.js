const assert = require("assert");
const { pipe, tap, get, pick, switchCase, fork } = require("rubico");
const { defaultsDeep } = require("rubico/x");

const { getByNameCore } = require("@grucloud/core/Common");

const { getField } = require("@grucloud/core/ProviderCommon");
const { AwsClient } = require("../AwsClient");
const { createLambda } = require("./LambdaCommon");

const findId = () => get("UUID");
const pickId = pipe([pick(["UUID"])]);

const getNameFromSource = ({ lives, config, type, group }) =>
  pipe([
    get("EventSourceArn"),
    tap((id) => {
      assert(id);
    }),
    (id) =>
      lives.getById({
        providerName: config.providerName,
        id,
        type,
        group,
      }),
    get("name"),
  ]);

const findName =
  ({ lives, config }) =>
  (live) =>
    pipe([
      () => live,
      tap(({ FunctionArn, EventSourceArn }) => {
        assert(FunctionArn);
        assert(EventSourceArn);
      }),
      fork({
        functionName: pipe([
          get("FunctionArn"),
          (id) =>
            lives.getById({
              providerName: config.providerName,
              id,
              type: "Function",
              group: "Lambda",
            }),
          get("name"),
        ]),
        sqsQueueName: getNameFromSource({
          lives,
          config,
          type: "Queue",
          group: "SQS",
        }),
        kinesisStreamName: getNameFromSource({
          lives,
          config,
          type: "Stream",
          group: "Kinesis",
        }),
      }),
      ({ functionName, sqsQueueName, kinesisStreamName }) =>
        `mapping::${functionName}::${sqsQueueName || kinesisStreamName}`,
    ])();

exports.EventSourceMapping = ({ spec, config }) => {
  const lambda = createLambda(config);
  const client = AwsClient({ spec, config })(lambda);

  /*
  Amazon DynamoDB Streams
Amazon MQ and RabbitMQ
Amazon MSK
Apache Kafka
*/
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
      switchCase([
        () => sqsQueue,
        defaultsDeep({
          EventSourceArn: getField(sqsQueue, "Attributes.QueueArn"),
        }),
        () => kinesisStream,
        defaultsDeep({
          EventSourceArn: getField(kinesisStream, "StreamARN"),
        }),
        () => {
          assert(false, "missing EventSourceMapping dependency");
        },
      ]),
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
  };
};
