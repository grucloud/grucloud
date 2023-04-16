const assert = require("assert");
const { pipe, tap, get, pick, map } = require("rubico");
const { defaultsDeep, isIn, when } = require("rubico/x");

const { getByNameCore } = require("@grucloud/core/Common");
const { getField } = require("@grucloud/core/ProviderCommon");
const { buildTags } = require("../AwsCommon");

const { Tagger, assignTags } = require("./KinesisAnalyticsV2Common");

const buildArn = () =>
  pipe([
    get("ApplicationARN"),
    tap((arn) => {
      assert(arn);
    }),
  ]);

const pickId = pipe([
  tap(({ ApplicationName }) => {
    assert(ApplicationName);
  }),
  pick(["ApplicationName", "CreateTimestamp"]),
]);

const decorate = ({ endpoint, config }) =>
  pipe([
    tap((params) => {
      assert(endpoint);
    }),
  ]);

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/KinesisAnalyticsV2.html
exports.KinesisAnalyticsV2Application = () => ({
  type: "Application",
  package: "kinesis-analytics-v2",
  client: "KinesisAnalyticsV2",
  propertiesDefault: {},
  omitProperties: [
    "ApplicationStatus",
    "ApplicationARN",
    "ApplicationVersionId",
    "CreateTimestamp",
    "LastUpdateTimestamp",
    "VpcConfigurationDescriptions",
    "ConditionalToken",
    "ServiceExecutionRole",
  ],
  inferName: () =>
    pipe([
      get("ApplicationName"),
      tap((Name) => {
        assert(Name);
      }),
    ]),
  findName: () =>
    pipe([
      get("ApplicationName"),
      tap((name) => {
        assert(name);
      }),
    ]),
  findId: () =>
    pipe([
      get("ApplicationARN"),
      tap((id) => {
        assert(id);
      }),
    ]),
  ignoreErrorCodes: ["ResourceNotFoundException"],
  dependencies: {
    iamRoleServiceExecution: {
      type: "Role",
      group: "IAM",
      dependencyId: ({ lives, config }) => pipe([get("ServiceExecutionRole")]),
    },
    subnets: {
      type: "Subnet",
      group: "EC2",
      list: true,
      dependencyIds: ({ lives, config }) =>
        get("VpcConfigurationDescriptions.SubnetIds"),
    },
    securityGroups: {
      type: "SecurityGroup",
      group: "EC2",
      list: true,
      dependencyIds: ({ lives, config }) =>
        get("VpcConfigurationDescriptions.SecurityGroupIds"),
    },
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/KinesisAnalyticsV2.html#describeApplication-property
  getById: {
    method: "describeApplication",
    getField: "ApplicationDetail",
    pickId,
    decorate,
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/KinesisAnalyticsV2.html#listApplications-property
  getList: {
    method: "listApplications",
    getParam: "ApplicationSummaries",
    decorate: ({ getById }) => pipe([getById]),
  },

  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/KinesisAnalyticsV2.html#createApplication-property
  create: {
    method: "createApplication",
    pickCreated: ({ payload }) => pipe([get("ApplicationDetail")]),
    isInstanceUp: pipe([get("ApplicationStatus"), isIn(["READY"])]),
    shouldRetryOnExceptionMessages: [
      "Kinesis Analytics service doesn't have sufficient privileges to assume the role",
    ],
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/KinesisAnalyticsV2.html#updateApplication-property
  update: {
    method: "updateApplication",
    filterParams: ({ payload, diff, live }) =>
      pipe([() => payload, defaultsDeep(pickId(live))])(),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/KinesisAnalyticsV2.html#deleteApplication-property
  destroy: {
    method: "deleteApplication",
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
    dependencies: { iamRoleServiceExecution, securityGroups, subnets },
    config,
  }) =>
    pipe([
      () => otherProps,
      defaultsDeep({
        Tags: buildTags({ name, config, namespace, UserTags: Tags }),
        ServiceExecutionRole: getField(iamRoleServiceExecution, "Arn"),
      }),
      when(
        () => subnets,
        defaultsDeep({
          VpcConfigurationDescriptions: {
            //TODO
            //VpcId: getField(subnets[0], "VpcId"),
            SubnetIds: pipe([
              () => subnets,
              map((subnet) => getField(subnet, "SubnetId")),
            ])(),
          },
        })
      ),
      when(
        () => securityGroups,
        defaultsDeep({
          VpcConfigurationDescriptions: {
            SecurityGroupIds: pipe([
              () => securityGroups,
              map((securityGroup) => getField(securityGroup, "GroupId")),
            ])(),
          },
        })
      ),
    ])(),
});
