const assert = require("assert");
const { pipe, tap, get, pick, map, not } = require("rubico");
const { defaultsDeep, identity } = require("rubico/x");

const { getByNameCore } = require("@grucloud/core/Common");
const { getField } = require("@grucloud/core/ProviderCommon");
const { buildTags } = require("../AwsCommon");

const { Tagger, assignTags } = require("./QuickSightCommon");

const buildArn = () =>
  pipe([
    get("Arn"),
    tap((arn) => {
      assert(arn);
    }),
  ]);

const pickId = pipe([
  tap(({ DataSourceId, AwsAccountId }) => {
    assert(DataSourceId);
    assert(AwsAccountId);
  }),
  pick(["DataSourceId", "AwsAccountId"]),
]);

const decorate = ({ endpoint, config }) =>
  pipe([
    tap((params) => {
      assert(endpoint);
    }),
    defaultsDeep({ AwsAccountId: config.accountId() }),
    assignTags({ buildArn: buildArn(config), endpoint }),
  ]);

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/QuickSight.html
exports.QuickSightDataSource = () => ({
  type: "DataSource",
  package: "quicksight",
  client: "QuickSight",
  propertiesDefault: {},
  omitProperties: ["DataSourceId", "AwsAccountId"],
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
      get("DataSourceId"),
      tap((id) => {
        assert(id);
      }),
    ]),
  ignoreErrorCodes: ["ResourceNotFoundException"],
  dependencies: {
    // iamRole: {
    //   type: "Role",
    //   group: "IAM",
    //   dependsOnTypeOnly: true,
    //   dependencyId: ({ lives, config }) => pipe([get("IamRoleArn")]),
    // },
    // securityGroups: {
    //   type: "SecurityGroup",
    //   group: "EC2",
    //   list: true,
    //   dependencyIds: ({ lives, config }) =>
    //     get("VpcConnectionProperties.SecurityGroupIds"),
    // },
    // subnets: {
    //   type: "Subnet",
    //   group: "EC2",
    //   list: true,
    //   dependencyIds: ({ lives, config }) =>
    //     get("VpcConnectionProperties.VpcConnectionArn"),
    // },
    s3Buckets: {
      type: "Bucket",
      group: "S3",
      list: true,
      dependencyIds: ({ lives, config }) =>
        pipe([
          get("Credentials.CredentialPair.AlternateDataSourceParameters"),
          map(get("S3Parameters.ManifestFileLocation.Bucket")),
        ]),
    },
  },
  environmentVariables: [
    {
      path: "Credentials.CredentialPair.Username",
      suffix: "USERNAME",
      rejectEnvironmentVariable: () =>
        pipe([not(get("Credentials.CredentialPair"))]),
    },
    {
      path: "Credentials.CredentialPair.Password",
      suffix: "PASSWORD",
      rejectEnvironmentVariable: () =>
        pipe([not(get("Credentials.CredentialPair"))]),
    },
  ],

  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/QuickSight.html#describeDataSource-property
  getById: {
    method: "describeDataSource",
    getField: "DataSource",
    pickId,
    decorate,
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/QuickSight.html#listDataSources-property
  getList: {
    enhanceParams:
      ({ config }) =>
      () => ({ AwsAccountId: config.accountId() }),
    method: "listDataSources",
    getParam: "DataSources",
    decorate,
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/QuickSight.html#createDataSource-property
  create: {
    method: "createDataSource",
    pickCreated: ({ payload }) => pipe([identity]),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/QuickSight.html#updateDataSource-property
  update: {
    method: "updateDataSource",
    filterParams: ({ payload, diff, live }) =>
      pipe([() => payload, defaultsDeep(pickId(live))])(),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/QuickSight.html#deleteDataSource-property
  destroy: {
    method: "deleteDataSource",
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
    dependencies: {},
    config,
  }) =>
    pipe([
      () => otherProps,
      defaultsDeep({
        AwsAccountId: config.accountId(),
        Tags: buildTags({ name, config, namespace, UserTags: Tags }),
      }),
    ])(),
});
