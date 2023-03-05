const assert = require("assert");
const { pipe, tap, get, pick, eq } = require("rubico");
const { defaultsDeep, append } = require("rubico/x");

const { getByNameCore } = require("@grucloud/core/Common");

const { getField } = require("@grucloud/core/ProviderCommon");

const pickId = pipe([
  pick(["StreamARN", "ConsumerName", "ConsumerARN"]),
  tap(({ StreamARN, ConsumerARN }) => {
    assert(StreamARN);
    assert(ConsumerARN);
  }),
]);

const decorate = ({ endpoint, config, live }) =>
  pipe([
    tap((params) => {
      assert(endpoint);
      assert(live.StreamARN);
    }),
    defaultsDeep({ StreamARN: live.StreamARN }),
  ]);

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Kinesis.html
exports.KinesisStreamConsumer = ({}) => ({
  type: "StreamConsumer",
  package: "kinesis",
  client: "Kinesis",
  inferName:
    ({ dependenciesSpec: { stream } }) =>
    ({ ConsumerName }) =>
      pipe([
        tap((params) => {
          assert(stream);
          assert(ConsumerName);
        }),
        () => `${stream}::${ConsumerName}`,
      ])(),
  findName:
    ({ lives, config }) =>
    ({ ConsumerName, StreamARN }) =>
      pipe([
        tap((params) => {
          assert(StreamARN);
          assert(ConsumerName);
        }),
        () => StreamARN,
        lives.getById({
          type: "Stream",
          group: "Kinesis",
          providerName: config.providerName,
        }),
        get("name"),
        tap((name) => {
          assert(name);
        }),
        append(`::${ConsumerName}`),
      ])(),

  findId: () => pipe([get("ConsumerARN")]),
  omitProperties: [
    "ConsumerARN",
    "ConsumerStatus",
    "ConsumerCreationTimestamp",
    "StreamARN",
  ],
  dependencies: {
    stream: {
      type: "Stream",
      group: "Kinesis",
      parent: true,
      dependencyId: () =>
        pipe([
          get("StreamARN"),
          tap((StreamARN) => {
            assert(StreamARN);
          }),
        ]),
    },
  },
  propertiesDefault: {},
  getByName: getByNameCore,
  ignoreErrorCodes: ["ResourceNotFoundException"],
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Kinesis.html#describeStreamConsumer-property
  getById: {
    method: "describeStreamConsumer",
    pickId,
    getField: "ConsumerDescription",
    decorate,
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Kinesis.html#listStreamConsumers-property
  getList: ({ client, endpoint, getById, config }) =>
    pipe([
      () =>
        client.getListWithParent({
          parent: { type: "Stream", group: "Kinesis" },
          pickKey: pipe([
            pick(["StreamARN"]),
            tap(({ StreamARN }) => {
              assert(StreamARN);
            }),
          ]),
          method: "listStreamConsumers",
          getParam: "Consumers",
          config,
          decorate: ({ endpoint, parent }) =>
            pipe([
              tap((params) => {
                assert(parent.StreamARN);
              }),
              decorate({ endpoint, live: parent }),
              tap((params) => {
                assert(true);
              }),
            ]),
        }),
    ])(),

  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Kinesis.html#registerStreamConsumer-property
  create: {
    method: "registerStreamConsumer",
    pickCreated: ({ payload }) =>
      pipe([get("Consumer"), defaultsDeep(payload)]),
    isInstanceUp: eq(get("ConsumerStatus"), "ACTIVE"),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Kinesis.html#deregisterStreamConsumer-property
  destroy: {
    method: "deregisterStreamConsumer",
    pickId,
  },
  configDefault: ({
    name,
    namespace,
    properties: { ...otherProps },
    dependencies: { stream },
    config,
  }) =>
    pipe([
      tap((params) => {
        assert(stream);
        assert(otherProps.ConsumerName);
      }),
      () => otherProps,
      defaultsDeep({ StreamARN: getField(stream, "StreamARN") }),
    ])(),
});
