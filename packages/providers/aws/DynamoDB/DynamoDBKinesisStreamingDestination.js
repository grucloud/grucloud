const assert = require("assert");
const { pipe, tap, get, map, pick, fork, flatMap } = require("rubico");
const { defaultsDeep, pluck } = require("rubico/x");
const { getField } = require("@grucloud/core/ProviderCommon");

const { getByNameCore } = require("@grucloud/core/Common");

const pickId = pipe([
  tap(({ StreamArn, TableName }) => {
    assert(StreamArn);
    assert(TableName);
  }),
  pick(["StreamArn", "TableName"]),
]);

const findId = () =>
  pipe([
    tap(({ StreamArn, TableName }) => {
      assert(StreamArn);
      assert(TableName);
    }),
    ({ TableName, StreamArn }) =>
      `table-kinesis-stream::${TableName}::${StreamArn}`,
  ]);

exports.DynamoDBKinesisStreamingDestination = () => ({
  type: "KinesisStreamingDestination",
  package: "dynamodb",
  client: "DynamoDB",
  inferName: ({ dependenciesSpec: { table, kinesisStream } }) =>
    pipe([
      tap((params) => {
        assert(table);
        assert(kinesisStream);
      }),
      () => `table-kinesis-stream::${table}::${kinesisStream}`,
    ]),
  findName:
    ({ lives, config }) =>
    (live) =>
      pipe([
        fork({
          table: () => live.TableName,
          stream: pipe([
            () => live,
            get("StreamArn"),
            lives.getById({
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
  omitProperties: ["TableName", "StreamArn", "DestinationStatus"],
  dependencies: {
    table: {
      type: "Table",
      group: "DynamoDB",
      parent: true,
      dependencyId: ({ lives, config }) =>
        pipe([
          get("TableName"),
          lives.getByName({
            type: "Table",
            group: "DynamoDB",
            providerName: config.providerName,
          }),
          get("id"),
          tap((id) => {
            assert(id);
          }),
        ]),
    },
    kinesisStream: {
      type: "Stream",
      group: "Kinesis",
      dependencyId: ({ lives, config }) => get("StreamArn"),
    },
  },
  //TODO getListWithParent
  ignoreErrorCodes: ["ResourceNotFoundException"],
  // TODO getById
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/DynamoDB.html#enableKinesisStreamingDestination-property
  create: { method: "enableKinesisStreamingDestination" },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/DynamoDB.html#disableKinesisStreamingDestination-property
  destroy: {
    method: "disableKinesisStreamingDestination",
    pickId,
  },
  getList:
    ({ endpoint }) =>
    ({ lives, config }) =>
      pipe([
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
  configDefault: ({
    properties,
    dependencies: { table, kinesisStream },
    config,
  }) =>
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
