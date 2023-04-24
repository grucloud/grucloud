const assert = require("assert");
const { pipe, tap, get, pick } = require("rubico");
const { defaultsDeep, identity } = require("rubico/x");

const { getByNameCore } = require("@grucloud/core/Common");

const { getField } = require("@grucloud/core/ProviderCommon");

const pickId = pipe([
  tap(({ ScheduleId, DataSetId, AwsAccountId }) => {
    assert(DataSetId);
    assert(ScheduleId);
    assert(AwsAccountId);
  }),
  pick(["DataSetId", "ScheduleId", "AwsAccountId"]),
]);

const filterPayload = ({ DataSetId, AwsAccountId, Schedule }) => ({
  DataSetId,
  AwsAccountId,
  ...Schedule,
});

const decorate = ({ endpoint, config, live }) =>
  pipe([
    tap((params) => {
      assert(config);
      assert(live.DataSetId);
    }),
    defaultsDeep({
      AwsAccountId: config.accountId(),
      DataSetId: live.DataSetId,
    }),
  ]);

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/QuickSight.html
exports.QuickSightRefreshSchedule = () => ({
  type: "RefreshSchedule",
  package: "quicksight",
  client: "QuickSight",
  propertiesDefault: {},
  omitProperties: ["Arn", "AwsAccountId", "ScheduleId", "DataSetId"],
  inferName: () =>
    pipe([
      get("Name"),
      tap((Name) => {
        assert(Name);
      }),
    ]),
  inferName:
    ({ dependenciesSpec: { dataSet } }) =>
    () =>
      pipe([
        tap((params) => {
          assert(dataSet);
        }),
        () => `${dataSet}`,
      ])(),
  findName:
    ({ lives, config }) =>
    ({ DataSetId }) =>
      pipe([
        tap(() => {
          assert(DataSetId);
        }),
        () => DataSetId,
        lives.getById({
          type: "DataSet",
          group: "QuickSight",
          providerName: config.providerName,
        }),
        get("name"),
        tap((name) => {
          assert(name);
        }),
      ])(),
  findId: () =>
    pipe([
      get("ScheduleId"),
      tap((id) => {
        assert(id);
      }),
    ]),
  ignoreErrorCodes: ["ResourceNotFoundException"],
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
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/QuickSight.html#describeRefreshSchedule-property
  getById: {
    method: "describeRefreshSchedule",
    getField: "RefreshSchedule",
    pickId,
    decorate,
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/QuickSight.html#listRefreshSchedules-property
  getList: ({ client, endpoint, getById, config }) =>
    pipe([
      () =>
        client.getListWithParent({
          parent: { type: "DataSet", group: "QuickSight" },
          pickKey: pipe([
            pick(["DataSetId"]),
            tap(({ DataSetId }) => {
              assert(DataSetId);
            }),
          ]),
          method: "listRefreshSchedules",
          getParam: "RefreshSchedules",
          config,
          decorate: ({ parent }) =>
            pipe([
              defaultsDeep({
                AwsAccountId: config.accountId(),
                DataSetId: parent.DataSetId,
              }),
              getById({}),
            ]),
        }),
    ])(),
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/QuickSight.html#createRefreshSchedule-property
  create: {
    filterPayload,
    method: "createRefreshSchedule",
    pickCreated: ({ payload }) => pipe([identity]),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/QuickSight.html#updateRefreshSchedule-property
  update: {
    method: "updateRefreshSchedule",
    filterParams: ({ payload, diff, live }) =>
      pipe([() => payload, defaultsDeep(pickId(live)), filterPayload])(),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/QuickSight.html#deleteRefreshSchedule-property
  destroy: {
    method: "deleteRefreshSchedule",
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
      tap(() => {
        assert(dataSet);
      }),
      () => otherProps,
      defaultsDeep({
        AwsAccountId: config.accountId(),
        DataSetId: getField(dataSet, "DataSetId"),
      }),
    ])(),
});
