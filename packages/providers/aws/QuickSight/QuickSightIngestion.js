const assert = require("assert");
const { pipe, tap, get, pick } = require("rubico");
const { defaultsDeep, identity } = require("rubico/x");

const { getByNameCore } = require("@grucloud/core/Common");
const { getField } = require("@grucloud/core/ProviderCommon");

const pickId = pipe([
  tap(({ IngestionId, AwsAccountId, DataSetId }) => {
    assert(IngestionId);
    assert(AwsAccountId);
    //assert(DataSetId);
  }),
  pick(["IngestionId", "AwsAccountId", "DataSetId"]),
]);

const decorate = ({ endpoint, config, live }) =>
  pipe([
    tap((params) => {
      assert(live.DataSetId);
    }),
    defaultsDeep({ DataSetId: live.DataSetId }),
    defaultsDeep({ AwsAccountId: config.accountId() }),
  ]);

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/QuickSight.html
exports.QuickSightIngestion = () => ({
  type: "Ingestion",
  package: "quicksight",
  client: "QuickSight",
  propertiesDefault: {},
  omitProperties: [
    "DataSetId",
    "Arn",
    "CreatedTime",
    "LastUpdatedTime",
    "IngestionSizeInBytes",
    "IngestionStatus",
    "AwsAccountId",
  ],
  inferName: () =>
    pipe([
      get("IngestionId"),
      tap((Name) => {
        assert(Name);
      }),
    ]),
  findName: () =>
    pipe([
      get("IngestionId"),
      tap((name) => {
        assert(name);
      }),
    ]),
  findId: () =>
    pipe([
      get("IngestionId"),
      tap((id) => {
        assert(id);
      }),
    ]),
  ignoreErrorCodes: [
    "ResourceNotFoundException",
    "UnsupportedUserEditionException",
  ],
  dependencies: {
    dataSet: {
      type: "DataSet",
      group: "QuickSight",
      parent: true,
      dependencyId: ({ lives, config }) =>
        pipe([
          get("DataSetId"),
          tap((DataSetId) => {
            assert(DataSetId);
          }),
        ]),
    },
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/QuickSight.html#describeIngestion-property
  getById: {
    method: "describeIngestion",
    getField: "Ingestion",
    pickId,
    decorate,
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/QuickSight.html#listIngestions-property
  getList: ({ client, endpoint, getById, config }) =>
    pipe([
      () =>
        client.getListWithParent({
          parent: { type: "DataSet", group: "QuickSight" },
          pickKey: pipe([
            pick(["DataSetId"]),
            defaultsDeep({ AwsAccountId: config.accountId() }),
          ]),
          ignoreErrorCodes: ["UnsupportedUserEditionException"],
          method: "listIngestions",
          getParam: "Ingestions",
          config,
          decorate: ({ parent }) =>
            pipe([
              tap((params) => {
                assert(parent.DataSetId);
              }),
              decorate({ config, live: parent }),
            ]),
        }),
    ])(),

  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/QuickSight.html#createIngestion-property
  create: {
    method: "createIngestion",
    pickCreated: ({ payload }) => pipe([identity, defaultsDeep(payload)]),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/QuickSight.html#updateIngestion-property
  update: {
    method: "updateIngestion",
    filterParams: ({ payload, diff, live }) =>
      pipe([() => payload, defaultsDeep(pickId(live))])(),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/QuickSight.html#cancelIngestion-property
  destroy: {
    method: "cancelIngestion",
    pickId,
  },
  getByName: getByNameCore,
  configDefault: ({
    name,
    namespace,
    properties: { ...otherProps },
    dependencies: { dataSet },
    config,
  }) =>
    pipe([
      () => otherProps,
      defaultsDeep({
        AwsAccountId: config.accountId(),
        DataSetId: getField(dataSet, "DataSetId"),
      }),
    ])(),
});
