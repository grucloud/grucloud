const assert = require("assert");
const { assign, pipe, tap, get, eq, pick } = require("rubico");
const { defaultsDeep, callProp, last } = require("rubico/x");

const logger = require("@grucloud/core/logger")({
  prefix: "EventSourceMapping",
});
const { getByNameCore } = require("@grucloud/core/Common");

const { createEndpoint, shouldRetryOnException } = require("../AwsCommon");
const { getField } = require("@grucloud/core/ProviderCommon");
const { AwsClient } = require("../AwsClient");

const findId = get("live.UUID");
const pickId = pick(["UUID"]);

const nameFromArn = pipe([callProp("split", ":"), last]);

const findName = pipe([
  tap((params) => {
    assert(true);
  }),
  get("live"),
  ({ FunctionArn, EventSourceArn }) =>
    `mapping-${nameFromArn(FunctionArn)}-${nameFromArn(EventSourceArn)}`,
]);

exports.EventSourceMapping = ({ spec, config }) => {
  const client = AwsClient({ spec, config });

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
          tap((params) => {
            assert(true);
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
    decorate: ({ lives }) =>
      pipe([
        tap((params) => {
          assert(lives);
        }),
        assign({
          Tags: ({ FunctionArn }) =>
            pipe([
              tap((params) => {
                assert(true);
              }),
              () =>
                lives.getById({
                  providerName: config.providerName,
                  id: FunctionArn,
                  type: "Function",
                  group: "Lambda",
                }),
              tap((params) => {
                assert(true);
              }),
              get("live.Tags"),
            ])(),
        }),
      ]),
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
    pickCreated: (payload) => pickId,
    method: "createEventSourceMapping",
    getById,
    config,
  });

  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Lambda.html#updateEventSourceMapping-property
  const update = client.update({
    pickId,
    method: "updateEventSourceMapping",
    //TODO filterParams
    getById,
    config,
  });

  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Lambda.html#deleteEventSourceMapping-property
  const destroy = client.destroy({
    pickId,
    method: "deleteEventSourceMapping",
    getById,
    ignoreError: eq(get("code"), "ResourceNotFoundException"),
    config,
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
        FunctionName: getField(lambdaFunction, "FunctionName"),
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
    shouldRetryOnException,
    findDependencies,
  };
};
