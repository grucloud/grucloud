const assert = require("assert");
const { pipe, tap, get, pick, assign, map } = require("rubico");
const { defaultsDeep, when } = require("rubico/x");

const { getField } = require("@grucloud/core/ProviderCommon");
const { buildTags } = require("../AwsCommon");
const { replaceWithName } = require("@grucloud/core/Common");

const { Tagger } = require("./OpenSearchCommon");

const buildArn = () =>
  pipe([
    get("ARN"),
    tap((arn) => {
      assert(arn);
    }),
  ]);

const pickId = pipe([
  tap(({ DomainName }) => {
    assert(DomainName);
  }),
  pick(["DomainName"]),
]);

const tagsToPayload = ({ Tags, ...other }) => ({
  ...other,
  TagList: Tags,
});

const assignTags = ({ endpoint }) =>
  assign({
    Tags: pipe([pick(["ARN"]), endpoint().listTags, get("TagList")]),
  });

const accessPoliciesStringify = when(
  get("AccessPolicies"),
  assign({
    AccessPolicies: pipe([get("AccessPolicies"), JSON.stringify]),
  })
);

const decorate = ({ endpoint }) =>
  pipe([
    tap((params) => {
      assert(endpoint);
    }),
    when(
      get("AccessPolicies"),
      assign({ AccessPolicies: pipe([get("AccessPolicies"), JSON.parse]) })
    ),
    assignTags({ endpoint }),
  ]);

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/OpenSearch.html
exports.OpenSearchDomain = () => ({
  type: "Domain",
  package: "opensearch",
  client: "OpenSearch",
  propertiesDefault: {},
  omitProperties: [
    "DomainId",
    "ARN",
    "Created",
    "Deleted",
    "Endpoint",
    "Endpoints",
    "Processing",
    "UpgradeProcessing",
    "VPCOptions",
    "CognitoOptions.UserPoolId",
    "CognitoOptions.IdentityPoolId",
    "CognitoOptions.RoleArn",
    "ChangeProgressDetails",
  ],
  inferName: () =>
    pipe([
      get("DomainName"),
      tap((Name) => {
        assert(Name);
      }),
    ]),
  findName: () =>
    pipe([
      get("DomainName"),
      tap((name) => {
        assert(name);
      }),
    ]),
  findId: () =>
    pipe([
      get("ARN"),
      tap((id) => {
        assert(id);
      }),
    ]),
  dependencies: {
    cloudWatchLogGroups: {
      type: "LogGroup",
      group: "CloudWatchLogs",
      list: true,
      dependencyIds: ({ lives, config }) =>
        pipe([
          get("LogPublishingOptions"),
          map(get("CloudWatchLogsLogGroupArn")),
        ]),
    },
    cognitoRole: {
      type: "Role",
      group: "IAM",
      dependencyId: ({ lives, config }) =>
        pipe([get("CognitoOptions.RoleArn")]),
    },
    cognitoIdentityPool: {
      type: "IdentityPool",
      group: "Cognito",
      dependencyId: ({ lives, config }) => get("CognitoOptions.IdentityPoolId"),
    },
    cognitoUserPool: {
      type: "UserPool",
      group: "Cognito",
      dependencyId: ({ lives, config }) => get("CognitoOptions.UserPoolId"),
    },
    kmsKey: {
      type: "Key",
      group: "KMS",
      excludeDefaultDependencies: true,
      dependencyId: ({ lives, config }) =>
        get("EncryptionAtRestOptions.KmsKeyId"),
    },
    securityGroups: {
      type: "SecurityGroup",
      group: "EC2",
      list: true,
      excludeDefaultDependencies: true,
      dependencyIds: ({ lives, config }) => get("VPCOptions.SecurityGroupIds"),
    },
    subnets: {
      type: "Subnet",
      group: "EC2",
      list: true,
      excludeDefaultDependencies: true,
      dependencyIds: ({ lives, config }) => get("VPCOptions.SubnetIds"),
    },
  },
  ignoreErrorCodes: ["ResourceNotFoundException"],
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/OpenSearch.html#getDomain-property
  getById: {
    method: "describeDomain",
    getField: "DomainStatus",
    pickId,
    decorate,
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/OpenSearch.html#listDomains-property
  getList: {
    enhanceParams: () => () => ({ DomainNames: [] }),
    method: "describeDomains",
    getParam: "DomainStatusList",
    decorate,
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/OpenSearch.html#createDomain-property
  create: {
    filterPayload: pipe([tagsToPayload, accessPoliciesStringify]),
    method: "createDomain",
    pickCreated: ({ payload }) => pipe([() => payload]),
    isInstanceUp: pipe([get("Created")]),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/OpenSearch.html#updateDomain-property
  update: {
    method: "updateDomainConfig",
    filterParams: ({ pickId, payload, diff, live }) =>
      pipe([() => payload, accessPoliciesStringify])(),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/OpenSearch.html#deleteDomain-property
  destroy: {
    method: "deleteDomain",
    pickId,
    isInstanceDown: pipe([get("Deleted")]),
  },
  getByName: ({ getById }) =>
    pipe([({ name }) => ({ DomainName: name }), getById({})]),
  filterLive: ({ lives, providerConfig }) =>
    pipe([
      assign({
        LogPublishingOptions: pipe([
          get("LogPublishingOptions"),
          map(
            assign({
              CloudWatchLogsLogGroupArn: pipe([
                get("CloudWatchLogsLogGroupArn"),
                replaceWithName({
                  groupType: "CloudWatchLogs::LogGroup",
                  path: "id",
                  providerConfig,
                  lives,
                }),
              ]),
            })
          ),
        ]),
      }),
    ]),
  tagger: ({ config }) =>
    Tagger({
      buildArn: buildArn({ config }),
    }),
  configDefault: ({
    name,
    namespace,
    properties: { Tags, ...otherProps },
    dependencies: {
      subnets,
      securityGroups,
      cognitoUserPool,
      cognitoIdentityPool,
      cognitoIamRole,
    },
    config,
  }) =>
    pipe([
      () => otherProps,
      defaultsDeep({
        Tags: buildTags({ name, config, namespace, UserTags: Tags }),
      }),
      when(
        () => cognitoIamRole,
        defaultsDeep({
          CognitoOptions: {
            RoleArn: getField(cognitoIamRole, "Arn"),
          },
        })
      ),
      when(
        () => cognitoIdentityPool,
        defaultsDeep({
          CognitoOptions: {
            IdentityPoolId: getField(cognitoIdentityPool, "IdentityPoolId"),
          },
        })
      ),
      when(
        () => cognitoUserPool,
        defaultsDeep({
          CognitoOptions: { UserId: getField(cognitoUserPool, "Id") },
        })
      ),
      when(
        () => kmsKey,
        defaultsDeep({
          EncryptionAtRestOptions: { KmsKeyId: getField(kmsKey, "Arn") },
        })
      ),
      when(
        () => subnets,
        defaultsDeep({
          VPCOptions: {
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
          VPCOptions: {
            SecurityGroupIds: pipe([
              () => securityGroups,
              map((sg) => getField(sg, "GroupId")),
            ])(),
          },
        })
      ),
    ])(),
});
