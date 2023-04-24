const assert = require("assert");
const {
  pipe,
  tap,
  get,
  pick,
  eq,
  switchCase,
  assign,
  fork,
} = require("rubico");
const {
  defaultsDeep,
  identity,
  unless,
  isEmpty,
  find,
  includes,
} = require("rubico/x");

const { getByNameCore } = require("@grucloud/core/Common");

const { getField } = require("@grucloud/core/ProviderCommon");

const pickId = pipe([
  tap(({ FolderId, AwsAccountId, MemberId, MemberType }) => {
    assert(FolderId);
    assert(AwsAccountId);
    assert(MemberId);
    assert(MemberType);
  }),
  pick(["FolderId", "AwsAccountId", "MemberId", "MemberType"]),
]);

const decorate = ({ endpoint, config, live }) =>
  pipe([
    tap(({ MemberArn }) => {
      assert(MemberArn);
      assert(config);
      assert(live.FolderId);
    }),
    defaultsDeep({
      AwsAccountId: config.accountId(),
      FolderId: live.FolderId,
    }),
    assign({
      MemberType: pipe([
        get("MemberArn"),
        switchCase([
          includes("analysis"),
          () => "ANALYSIS",
          includes("dashboard"),
          () => "DASHBOARD",
          includes("dataset"),
          () => "DATASET",
          () => {
            assert(
              false,
              "MemberArn should includes analysis, dashboard, or dataset"
            );
          },
        ]),
      ]),
    }),
  ]);

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/QuickSight.html
exports.QuickSightFolderMembership = () => ({
  type: "FolderMembership",
  package: "quicksight",
  client: "QuickSight",
  propertiesDefault: {},
  omitProperties: ["Arn", "AwsAccountId", "FolderId", "Status"],
  inferName:
    ({ dependenciesSpec: { folder, analysis, dashboard, dataSet } }) =>
    () =>
      pipe([
        tap(() => {
          assert(folder);
          assert(analysis || dashboard || dataSet);
        }),
        () => `${folder}::${analysis || dashboard || dataSet}`,
      ])(),
  findName:
    ({ lives, config }) =>
    (live) =>
      pipe([
        tap(() => {
          assert(live.MemberId);
        }),
        () => live,
        fork({
          folder: pipe([
            get("FolderId"),
            tap((id) => {
              assert(id);
            }),
            lives.getById({
              type: "Folder",
              group: "QuickSight",
              providerName: config.providerName,
            }),
            get("name", live.FolderId),
          ]),
          analysis: pipe([
            get("MemberId"),
            lives.getById({
              type: "Analysis",
              group: "QuickSight",
              providerName: config.providerName,
            }),
            get("name"),
          ]),
          dashboard: pipe([
            get("MemberId"),
            lives.getById({
              type: "Dashboard",
              group: "QuickSight",
              providerName: config.providerName,
            }),
            get("name"),
          ]),
          dataSet: pipe([
            get("MemberId"),
            lives.getById({
              type: "DataSet",
              group: "QuickSight",
              providerName: config.providerName,
            }),
            get("name"),
          ]),
        }),
        ({ folder, analysis, dashboard, dataSet }) =>
          `${folder}::${analysis || dashboard || dataSet}`,
      ])(),
  findId: () =>
    pipe([
      tap(({ FolderId, MemberId, MemberType }) => {
        assert(FolderId);
        assert(MemberType);
        assert(MemberId);
      }),
      ({ FolderId, MemberType, MemberId }) =>
        `${FolderId}::${MemberType}::${MemberId}`,
    ]),
  ignoreErrorCodes: ["ResourceNotFoundException"],
  dependencies: {
    folder: {
      type: "Folder",
      group: "QuickSight",
      parent: true,
      dependencyId: ({ lives, config }) =>
        pipe([
          get("FolderId"),
          tap((FolderId) => {
            assert(FolderId);
          }),
        ]),
    },
    analysis: {
      type: "Analysis",
      group: "QuickSight",
      dependencyId: ({ lives, config }) =>
        pipe([
          get("MemberId"),
          tap((MemberId) => {
            assert(MemberId);
          }),
        ]),
    },
    dashboard: {
      type: "Dashboard",
      group: "QuickSight",
      dependencyId: ({ lives, config }) =>
        pipe([
          get("MemberId"),
          tap((MemberId) => {
            assert(MemberId);
          }),
        ]),
    },
    dataSet: {
      type: "DataSet",
      group: "QuickSight",
      dependencyId: ({ lives, config }) =>
        pipe([
          get("MemberId"),
          tap((MemberId) => {
            assert(MemberId);
          }),
        ]),
    },
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/QuickSight.html#listFolderMembers-property
  getById: {
    method: "listFolderMembers",
    pickId,
    decorate: ({ live, config }) =>
      pipe([
        tap(() => {
          assert(live.FolderId);
        }),
        get("FolderMemberList"),
        find(eq(get("MemberId"), live.MemberId)),
        unless(isEmpty, decorate({ config, live })),
      ]),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/QuickSight.html#listFolderMembers-property
  getList: ({ client, endpoint, getById, config }) =>
    pipe([
      () =>
        client.getListWithParent({
          parent: { type: "Folder", group: "QuickSight" },
          pickKey: pipe([
            pick(["FolderId"]),
            tap(({ FolderId }) => {
              assert(FolderId);
            }),
          ]),
          method: "listFolderMembers",
          getParam: "FolderMemberList",
          config,
          decorate: ({ parent }) =>
            pipe([
              defaultsDeep({
                AwsAccountId: config.accountId(),
                FolderId: parent.FolderId,
              }),
              decorate({ config, live: parent }),
            ]),
        }),
    ])(),
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/QuickSight.html#createFolderMembership-property
  create: {
    method: "createFolderMembership",
    pickCreated: ({ payload }) => pipe([identity]),
  },
  // No update
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/QuickSight.html#deleteFolderMembership-property
  destroy: {
    method: "deleteFolderMembership",
    pickId,
  },
  getByName: getByNameCore,
  configDefault: ({
    name,
    namespace,
    properties: { ...otherProps },
    dependencies: { folder, analysis, dashboard, dataSet },
    config,
  }) =>
    pipe([
      tap(() => {
        assert(folder);
      }),
      () => otherProps,
      defaultsDeep({
        AwsAccountId: config.accountId(),
        FolderId: getField(folder, "FolderId"),
      }),
      switchCase([
        () => analysis,
        defaultsDeep({ MemberId: getField(analysis, "AnalysisId") }),
        () => dashboard,
        defaultsDeep({ MemberId: getField(analysis, "DashboardId") }),
        () => dataSet,
        defaultsDeep({ MemberId: getField(analysis, "DataSetId") }),
        () => {
          assert(false, "analysis, dashboard or dataSet is required");
        },
      ]),
    ])(),
});
