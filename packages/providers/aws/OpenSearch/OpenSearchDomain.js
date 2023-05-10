const assert = require("assert");
const { pipe, tap, get, eq, pick, assign, map, omit } = require("rubico");
const { defaultsDeep, when, callProp } = require("rubico/x");

const { getField } = require("@grucloud/core/ProviderCommon");
const { buildTags } = require("../AwsCommon");
const { assignPolicyAccountAndRegion } = require("../IAM/IAMCommon");
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
    when(eq(get("CognitoOptions.Enabled"), false), omit(["CognitoOptions"])),
    when(
      pipe([get("AutoTuneOptions.State"), callProp("startsWith", "ENABLE")]),
      defaultsDeep({ AutoTuneOptions: { DesiredState: "ENABLED" } })
    ),
  ]);

const rejectEnvironmentVariable = () =>
  pipe([get("AdvancedSecurityOptions.MasterUserOptions.MasterUserARN")]);

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/OpenSearch.html
exports.OpenSearchDomain = ({ compare }) => ({
  type: "Domain",
  package: "opensearch",
  client: "OpenSearch",
  propertiesDefault: {
    AdvancedOptions: {
      "indices.fielddata.cache.size": "20",
      "indices.query.bool.max_clause_count": "1024",
      override_main_response_version: "false",
      "rest.action.multi.allow_explicit_index": "true",
    },
    EncryptionAtRestOptions: {
      Enabled: true,
    },
    DomainEndpointOptions: { TLSSecurityPolicy: "Policy-Min-TLS-1-0-2019-07" },
    EBSOptions: {
      EBSEnabled: true,
      Iops: 3000,
      Throughput: 125,
      VolumeSize: 10,
      VolumeType: "gp3",
    },
    NodeToNodeEncryptionOptions: {
      Enabled: true,
    },
    SnapshotOptions: {},
    OffPeakWindowOptions: {
      Enabled: true,
      OffPeakWindow: {
        WindowStartTime: {
          Hours: 3,
          Minutes: 0,
        },
      },
    },
  },
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
    "DomainEndpointOptions.CustomEndpointCertificateArn",
    "ServiceSoftwareOptions",
    "EncryptionAtRestOptions.KmsKeyId",
    "AutoTuneOptions.State",
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
  environmentVariables: [
    {
      path: "AdvancedSecurityOptions.MasterUserOptions.MasterUserName",
      suffix: "MASTER_USERNAME",
      rejectEnvironmentVariable,
    },
    {
      path: "AdvancedSecurityOptions.MasterUserOptions.MasterUserPassword",
      suffix: "MASTER_USER_PASSWORD",
      rejectEnvironmentVariable,
    },
  ],
  dependencies: {
    certificate: {
      type: "Certificate",
      group: "ACM",
      dependencyId: ({ lives, config }) =>
        pipe([get("DomainEndpointOptions.CustomEndpointCertificateArn")]),
    },
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
    iamUser: {
      type: "User",
      group: "IAM",
      dependencyId: ({ lives, config }) =>
        get("AdvancedSecurityOptions.MasterUserOptions.MasterUserARN"),
    },
    kmsKey: {
      type: "Key",
      group: "KMS",
      excludeDefaultDependencies: true,
      dependencyId: ({ lives, config }) =>
        pipe([get("EncryptionAtRestOptions.KmsKeyId")]),
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
  compare: compare({
    filterTarget: () => omit(["AdvancedSecurityOptions.MasterUserOptions"]),
  }),
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/OpenSearch.html#describeDomain-property
  getById: {
    method: "describeDomain",
    getField: "DomainStatus",
    pickId,
    decorate,
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/OpenSearch.html#describeDomains-property
  getList: {
    enhanceParams: () => () => ({ EngineType: "OpenSearch" }),
    method: "listDomainNames",
    getParam: "DomainNames",
    decorate: ({ getById }) => pipe([getById]),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/OpenSearch.html#createDomain-property
  create: {
    filterPayload: pipe([tagsToPayload, accessPoliciesStringify]),
    method: "createDomain",
    pickCreated: ({ payload }) => pipe([() => payload]),
    isInstanceUp: pipe([eq(get("Processing"), false)]),
    configIsUp: { retryCount: 40 * 12, retryDelay: 5e3 },
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/OpenSearch.html#updateDomainConfig-property
  update: {
    method: "updateDomainConfig",
    filterParams: ({ payload, diff, live }) =>
      pipe([() => payload, accessPoliciesStringify])(),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/OpenSearch.html#deleteDomain-property
  destroy: {
    method: "deleteDomain",
    pickId,
  },
  getByName: ({ getById }) =>
    pipe([({ name }) => ({ DomainName: name }), getById({})]),
  filterLive: ({ lives, providerConfig }) =>
    pipe([
      when(
        get("AccessPolicies"),
        assign({
          AccessPolicies: pipe([
            get("AccessPolicies"),
            assignPolicyAccountAndRegion({ providerConfig, lives }),
          ]),
        })
      ),
      when(
        get("LogPublishingOptions"),
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
        })
      ),
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
      certificate,
      cognitoUserPool,
      cognitoIdentityPool,
      cognitoIamRole,
      iamUser,
      kmsKey,
      subnets,
      securityGroups,
    },
    config,
  }) =>
    pipe([
      () => otherProps,
      defaultsDeep({
        Tags: buildTags({ name, config, namespace, UserTags: Tags }),
      }),
      when(
        () => certificate,
        defaultsDeep({
          DomainEndpointOptions: {
            CustomEndpointCertificateArn: getField(
              certificate,
              "CertificateArn"
            ),
          },
        })
      ),
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
        () => iamUser,
        defaultsDeep({
          AdvancedSecurityOptions: {
            MasterUserOptions: {
              MasterUserARN: getField(iamUser, "Arn"),
            },
          },
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
