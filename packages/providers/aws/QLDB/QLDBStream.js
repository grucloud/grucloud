const assert = require("assert");
const { pipe, tap, get, pick } = require("rubico");
const { defaultsDeep, isIn, identity } = require("rubico/x");

const { getByNameCore } = require("@grucloud/core/Common");
const { getField } = require("@grucloud/core/ProviderCommon");
const { buildTagsObject } = require("@grucloud/core/Common");

const { Tagger, assignTags } = require("./QLDBCommon");

const buildArn = () =>
  pipe([
    get("Arn"),
    tap((arn) => {
      assert(arn);
    }),
  ]);

const pickId = pipe([
  tap(({ LedgerName, StreamId }) => {
    assert(StreamId);
    assert(LedgerName);
  }),
  pick(["LedgerName", "StreamId"]),
]);

const decorate = ({ endpoint, config }) =>
  pipe([
    tap((params) => {
      assert(endpoint);
    }),
    assignTags({ buildArn: buildArn(config), endpoint }),
  ]);

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/QLDB.html
exports.QLDBStream = () => ({
  type: "Stream",
  package: "qldb",
  client: "QLDB",
  propertiesDefault: {},
  omitProperties: [
    "LedgerName",
    "CreationTime",
    "InclusiveStartTime",
    "ExclusiveEndTime",
    "RoleArn",
    "StreamId",
    "Arn",
    "Status",
    "ErrorCause",
    "KinesisConfiguration.StreamArn",
  ],
  inferName: () =>
    pipe([
      get("StreamName"),
      tap((Name) => {
        assert(Name);
      }),
    ]),
  findName: () =>
    pipe([
      get("StreamName"),
      tap((name) => {
        assert(name);
      }),
    ]),
  findId: () =>
    pipe([
      get("Arn"),
      tap((id) => {
        assert(id);
      }),
    ]),
  ignoreErrorCodes: ["ResourceNotFoundException"],
  dependencies: {
    iamRole: {
      type: "Role",
      group: "IAM",
      dependencyId: ({ lives, config }) =>
        pipe([
          get("RoleArn"),
          tap((RoleArn) => {
            assert(RoleArn);
          }),
        ]),
    },
    kinesisStream: {
      type: "Stream",
      group: "Kinesis",
      dependencyId: () =>
        pipe([
          get("KinesisConfiguration.StreamArn"),
          tap((StreamArn) => {
            assert(StreamArn);
          }),
        ]),
    },
    ledger: {
      type: "Ledger",
      group: "QLDB",
      parent: true,
      dependencyId: ({ lives, config }) =>
        pipe([
          get("LedgerName"),
          tap((LedgerName) => {
            assert(LedgerName);
          }),
        ]),
    },
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/QLDB.html#describeJournalKinesisStream-property
  getById: {
    method: "describeJournalKinesisStream",
    getField: "Stream",
    pickId,
    decorate,
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/QLDB.html#listJournalKinesisStreamsForLedger-property
  getList: ({ client, endpoint, getById, config }) =>
    pipe([
      () =>
        client.getListWithParent({
          parent: { type: "Ledger", group: "QLDB" },
          pickKey: pipe([pick(["LedgerName"])]),
          method: "listJournalKinesisStreamsForLedger",
          getParam: "Streams",
          config,
          decorate,
        }),
    ])(),
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/QLDB.html#createStream-property
  create: {
    method: "streamJournalToKinesis",
    pickCreated: ({ payload }) => pipe([identity, defaultsDeep(payload)]),
    isInstanceUp: pipe([get("Status"), isIn(["ACTIVE"])]),
    isInstanceError: pipe([get("State"), isIn(["FAILED", "IMPAIRED"])]),
    getErrorMessage: pipe([get("ErrorCause.Message", "FAILED")]),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/QLDB.html#updateStream-property
  // TODO update
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/QLDB.html#cancelJournalKinesisStream-property
  destroy: {
    method: "cancelJournalKinesisStream",
    pickId,
    isInstanceDown: pipe([get("Status"), isIn(["COMPLETED", "CANCELED"])]),
  },
  getByName: getByNameCore,
  tagger: ({ config }) =>
    Tagger({
      buildArn: buildArn({ config }),
    }),
  configDefault: ({
    name,
    namespace,
    properties: { Tags, ...otherProps },
    dependencies: { iamRole, kinesisStream, ledger },
    config,
  }) =>
    pipe([
      tap(() => {
        assert(ledger);
        assert(iamRole);
        assert(kinesisStream);
      }),
      () => otherProps,
      defaultsDeep({
        LedgerName: ledger.config.Name,
        RoleArn: getField(iamRole, "Arn"),
        KinesisConfiguration: {
          StreamArn: getField(kinesisStream, "StreamARN"),
        },
        Tags: buildTagsObject({ name, config, namespace, userTags: Tags }),
      }),
    ])(),
});
