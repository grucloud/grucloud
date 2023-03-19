const assert = require("assert");
const { pipe, tap, get, pick } = require("rubico");
const { defaultsDeep, identity } = require("rubico/x");

const { getByNameCore } = require("@grucloud/core/Common");
const { buildTags } = require("../AwsCommon");

const { Tagger, assignTags } = require("./QuickSightCommon");
const { getField } = require("@grucloud/core/ProviderCommon");

const buildArn = () =>
  pipe([
    get("Arn"),
    tap((arn) => {
      assert(arn);
    }),
  ]);

const pickId = pipe([
  tap(({ AnalysisId, AwsAccountId }) => {
    assert(AnalysisId);
    assert(AwsAccountId);
  }),
  pick(["AnalysisId", "AwsAccountId"]),
]);

const decorate = ({ endpoint, config }) =>
  pipe([
    tap((params) => {
      assert(endpoint);
    }),
    assignTags({ buildArn: buildArn(config), endpoint }),
    defaultsDeep({ AwsAccountId: config.accountId() }),
    // TODO
    // DataSetArns
    // endpoint().describeAnalysisDefinition
    // get("Definition")
    // get the sheets
  ]);

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/QuickSight.html
exports.QuickSightAnalysis = () => ({
  type: "Analysis",
  package: "quicksight",
  client: "QuickSight",
  propertiesDefault: {},
  omitProperties: [
    "Arn",
    "CreatedTime",
    "LastUpdatedTime",
    "AwsAccountId",
    "ThemeArn",
    "Status",
    "Errors",
    "SourceEntity.SourceTemplate.Arn",
  ],
  inferName: () =>
    pipe([
      get("Name"),
      tap((Name) => {
        assert(Name);
      }),
    ]),
  findName: () =>
    pipe([
      get("Name"),
      tap((name) => {
        assert(name);
      }),
    ]),
  findId: () =>
    pipe([
      get("AnalysisId"),
      tap((id) => {
        assert(id);
      }),
    ]),
  ignoreErrorCodes: [
    "ResourceNotFoundException",
    "UnsupportedUserEditionException",
  ],
  dependencies: {
    dataSets: {
      type: "DataSet",
      group: "QuickSight",
      list: true,
      dependencyIds: ({ lives, config }) =>
        pipe([get("SourceEntity.SourceTemplate.DataSetReferences")]),
    },
    // TODO: How to get the template ARN from describeAnalysis ?
    template: {
      type: "Template",
      group: "QuickSight",
      dependencyId: ({ lives, config }) =>
        pipe([get("SourceEntity.SourceTemplate.Arn")]),
    },
    theme: {
      type: "Theme",
      group: "QuickSight",
      dependencyId: ({ lives, config }) => pipe([get("ThemeArn")]),
    },
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/QuickSight.html#describeAnalysis-property
  getById: {
    method: "describeAnalysis",
    getField: "Analysis",
    pickId,
    decorate,
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/QuickSight.html#listAnalyses-property
  getList: {
    enhanceParams:
      ({ config }) =>
      () => ({ AwsAccountId: config.accountId() }),
    method: "listAnalyses",
    getParam: "AnalysisSummaryList",
    decorate,
    ignoreErrorCodes: ["UnsupportedUserEditionException"],
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/QuickSight.html#createAnalysis-property
  create: {
    method: "createAnalysis",
    pickCreated: ({ payload }) => pipe([identity]),
    // Status CREATION_SUCCESSFUL
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/QuickSight.html#updateAnalysis-property
  update: {
    method: "updateAnalysis",
    filterParams: ({ payload, diff, live }) =>
      pipe([() => payload, defaultsDeep(pickId(live))])(),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/QuickSight.html#deleteAnalysis-property
  destroy: {
    method: "deleteAnalysis",
    pickId,
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
    dependencies: { template, theme },
    config,
  }) =>
    pipe([
      () => otherProps,
      defaultsDeep({
        AwsAccountId: config.accountId(),
        Tags: buildTags({ name, config, namespace, UserTags: Tags }),
      }),
      when(() => theme, defaultsDeep({ ThemeArn: getField(theme, "Arn") })),
      when(
        () => template,
        defaultsDeep({
          SourceEntity: { SourceTemplate: { Arn: getField(template, "Arn") } },
        })
      ),
    ])(),
});
