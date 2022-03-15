const assert = require("assert");
const { assign, pipe, tap, get, eq, pick } = require("rubico");
const { defaultsDeep, callProp, last } = require("rubico/x");

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
  ({ FunctionArn, EventSourceArn }) =>
    `mapping-${nameFromArn(FunctionArn)}-${nameFromArn(EventSourceArn)}`,
]);

exports.EventSourceMapping = ({ spec, config }) => {
  const lambda = createLambda(config);
  const client = AwsClient({ spec, config })(lambda);

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

  const configDefault = ({
    name,
    namespace,
    properties,
    dependencies: { lambdaFunction, sqsQueue },
  }) =>
    pipe([
      tap(() => {
        assert(lambdaFunction);
      }),
      () => properties,
      defaultsDeep({
        FunctionName: getField(lambdaFunction, "Configuration.FunctionName"),
        ...(sqsQueue && {
          EventSourceArn: getField(sqsQueue, "Attributes.QueueArn"),
        }),
      }),
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
