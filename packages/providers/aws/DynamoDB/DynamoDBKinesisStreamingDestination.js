const assert = require("assert");
const { pipe, tap, get, map, pick, fork, flatMap } = require("rubico");
const { defaultsDeep, pluck } = require("rubico/x");
const { getField } = require("@grucloud/core/ProviderCommon");

const { createAwsResource } = require("../AwsClient");
const { getByNameCore } = require("@grucloud/core/Common");

const pickId = pipe([
  tap(({ StreamArn, TableName }) => {
    assert(StreamArn);
    assert(TableName);
  }),
  pick(["StreamArn", "TableName"]),
]);

const createModel = ({ config }) => ({
  package: "dynamodb",
  client: "DynamoDB",
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/DynamoDB.html#enableKinesisStreamingDestination-property
  create: { method: "enableKinesisStreamingDestination" },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/DynamoDB.html#disableKinesisStreamingDestination-property
  destroy: {
    method: "disableKinesisStreamingDestination",
    pickId,
  },
});

const findId = pipe([
  get("live"),
  tap(({ StreamArn, TableName }) => {
    assert(StreamArn);
    assert(TableName);
  }),
  ({ TableName, StreamArn }) =>
    `table-kinesis-stream::${TableName}::${StreamArn}`,
]);

exports.DynamoDBKinesisStreamingDestination = ({ spec, config }) =>
  createAwsResource({
    model: createModel({ config }),
    spec,
    config,
    findName: ({ live, lives }) =>
      pipe([
        fork({
          table: () => live.TableName,
          stream: pipe([
            () =>
              lives.getById({
                id: live.StreamArn,
                type: "Stream",
                group: "Kinesis",
                providerName: config.providerName,
              }),
            get("name", live.StreamArn),
          ]),
        }),
        ({ table, stream }) => `table-kinesis-stream::${table}::${stream}`,
      ])(),
    findId,
    getList:
      ({ endpoint }) =>
      ({ lives }) =>
        pipe([
          () =>
            lives.getByType({
              providerName: config.providerName,
              type: "Table",
              group: "DynamoDB",
            }),
          pluck("live"),
          flatMap(({ TableName }) =>
            pipe([
              () => ({ TableName }),
              endpoint().describeKinesisStreamingDestination,
              get("KinesisDataStreamDestinations"),
              map(pipe([defaultsDeep({ TableName })])),
            ])()
          ),
        ])(),
    // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/EC2.html#describeVpcs-property
    getByName: getByNameCore,
    configDefault: ({ properties, dependencies: { table, kinesisStream } }) =>
      pipe([
        tap(() => {
          assert(table);
          assert(kinesisStream);
        }),
        () => ({
          TableName: getField(table, "TableName"),
          StreamArn: getField(kinesisStream, "StreamARN"),
        }),
      ])(),
  });
