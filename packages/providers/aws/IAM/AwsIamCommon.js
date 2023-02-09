const assert = require("assert");
const {
  map,
  pipe,
  tap,
  tryCatch,
  get,
  assign,
  filter,
  not,
  any,
  eq,
  flatMap,
  switchCase,
} = require("rubico");
const {
  isEmpty,
  isObject,
  unless,
  when,
  values,
  keys,
  first,
  append,
  find,
  callProp,
  includes,
} = require("rubico/x");
const querystring = require("querystring");
const { getField } = require("@grucloud/core/ProviderCommon");
const {
  createEndpoint,
  replaceDependency,
  replaceArnWithAccountAndRegion,
  sortObject,
} = require("../AwsCommon");
const { omitIfEmpty, replaceWithName } = require("@grucloud/core/Common");

const logger = require("@grucloud/core/logger")({ prefix: "IamCommon" });

exports.ignoreErrorCodes = ["NoSuchEntity", "NoSuchEntityException"];

const dependenciesFromPolicies = {
  apiGatewayRestApis: {
    pathLive: "live.arnv2",
    type: "RestApi",
    group: "APIGateway",
  },
  apiGatewayV2Apis: {
    pathLive: "live.ArnV2",
    type: "Api",
    group: "ApiGatewayV2",
  },
  appsyncGraphqlApis: {
    pathLive: "live.uris.GRAPHQL",
    type: "GraphqlApi",
    group: "AppSync",
  },
  cognitoUserPools: {
    pathLive: "id",
    type: "UserPool",
    group: "CognitoIdentityServiceProvider",
  },
  cognitoUserPoolClient: {
    pathLive: "id",
    type: "UserPoolClient",
    group: "CognitoIdentityServiceProvider",
  },
  rdsDbClusters: {
    pathLive: "live.DBClusterArn",
    type: "DBCluster",
    group: "RDS",
  },
  secretsManagerSecrets: {
    pathLive: "live.ARN",
    type: "Secret",
    group: "SecretsManager",
  },
  snsTopics: {
    pathLive: "id",
    type: "Topic",
    group: "SNS",
  },
};

exports.dependenciesPoliciesKind = [
  { type: "IdentityPool", group: "Cognito" },
  { type: "Table", group: "DynamoDB" },
  { type: "FileSystem", group: "EFS" },
  { type: "AccessPoint", group: "EFS" },
  { type: "Secret", group: "SecretsManager" },
  { type: "Organisation", group: "Organisations" },
];

//TODO
exports.dependenciesPolicy = {
  openIdConnectProvider: {
    type: "OpenIDConnectProvider",
    group: "IAM",
    parent: true,
  },
  cognitoIdentityPool: { type: "IdentityPool", group: "Cognito", parent: true },
  table: { type: "Table", group: "DynamoDB", parent: true },
  efsFileSystems: {
    type: "FileSystem",
    group: "EFS",
    list: true,
  },
  efsAccessPoints: {
    type: "AccessPoint",
    group: "EFS",
    list: true,
  },
  logGroups: {
    type: "LogGroup",
    group: "CloudWatchLogs",
    list: true,
    ignoreOnDestroy: true,
  },
  secrets: {
    type: "Secret",
    group: "SecretsManager",
    list: true,
  },
  ssmParameters: {
    type: "Parameter",
    group: "SSM",
    list: true,
  },
  organisations: {
    type: "Organisation",
    group: "Organisations",
    list: true,
  },
  //dbClusters: { type: "DBCluster", group: "RDS", list: true },
};

const replacePolicy = replaceDependency(dependenciesFromPolicies);
exports.replacePolicy = replacePolicy;

const assignPolicyResource = ({ providerConfig, lives }) =>
  pipe([
    tap((params) => {
      assert(lives);
      assert(providerConfig);
    }),
    when(
      get("Resource"),
      assign({
        Resource: pipe([
          get("Resource"),
          switchCase([
            Array.isArray,
            map(replacePolicy({ providerConfig, lives })),
            replacePolicy({ providerConfig, lives }),
          ]),
        ]),
      })
    ),
  ]);

exports.assignPolicyResource = assignPolicyResource;

const replacePrincipal = ({ providerConfig, lives, principalKind }) =>
  pipe([
    when(
      get(principalKind),
      assign({
        [principalKind]: pipe([
          get(principalKind),
          switchCase([
            Array.isArray,
            map(replaceArnWithAccountAndRegion({ providerConfig, lives })),
            replaceArnWithAccountAndRegion({ providerConfig, lives }),
          ]),
        ]),
      })
    ),
  ]);

const replaceCondition = ({ conditionCriteria, providerConfig, lives }) =>
  when(
    get(conditionCriteria),
    assign({
      [conditionCriteria]: pipe([
        get(conditionCriteria),
        map(
          pipe([
            switchCase([
              Array.isArray,
              map(
                replaceArnWithAccountAndRegion({
                  providerConfig,
                  lives,
                })
              ),
              replaceArnWithAccountAndRegion({
                providerConfig,
                lives,
              }),
            ]),
          ])
        ),
      ]),
    })
  );

const replaceStatement = ({ providerConfig, lives }) =>
  pipe([
    tap((params) => {
      assert(lives);
    }),
    when(
      get("Principal"),
      assign({
        Principal: pipe([
          get("Principal"),
          replacePrincipal({ providerConfig, lives, principalKind: "Service" }),
          replacePrincipal({ providerConfig, lives, principalKind: "AWS" }),
          replacePrincipal({
            providerConfig,
            lives,
            principalKind: "Federated",
          }),
          when(
            get("AWS"),
            assign({
              AWS: pipe([
                get("AWS"),
                when(
                  includes("CloudFront Origin Access Identity"),
                  pipe([
                    replaceWithName({
                      groupType: "CloudFront::OriginAccessIdentity",
                      path: "id",
                      providerConfig,
                      lives,
                    }),
                  ])
                ),
              ]),
            })
          ),
        ]),
      })
    ),
    when(
      get("Condition"),
      assign({
        Condition: pipe([
          get("Condition"),
          replaceCondition({
            conditionCriteria: "ArnLike",
            providerConfig,
            lives,
          }),
          replaceCondition({
            conditionCriteria: "StringLike",
            providerConfig,
            lives,
          }),
          when(
            get("StringEquals"),
            assign({
              StringEquals: pipe([
                get("StringEquals"),
                map(
                  switchCase([
                    Array.isArray,
                    map(
                      replaceArnWithAccountAndRegion({
                        providerConfig,
                        lives,
                      })
                    ),
                    replaceArnWithAccountAndRegion({
                      providerConfig,
                      lives,
                    }),
                  ])
                ),
                when(
                  get("elasticfilesystem:AccessPointArn"),
                  assign({
                    "elasticfilesystem:AccessPointArn": pipe([
                      get("elasticfilesystem:AccessPointArn"),
                      replaceWithName({
                        groupType: "EFS::AccessPoint",
                        path: "id",
                        providerConfig,
                        lives,
                      }),
                    ]),
                  })
                ),
                sortObject,
              ]),
            })
          ),
          when(
            get("ArnEquals"),
            assign({
              ArnEquals: pipe([
                get("ArnEquals"),
                when(
                  get("aws:PrincipalArn"),
                  assign({
                    "aws:PrincipalArn": pipe([
                      get("aws:PrincipalArn"),
                      replaceArnWithAccountAndRegion({
                        providerConfig,
                        lives,
                      }),
                    ]),
                  })
                ),
                when(
                  get("aws:SourceArn"),
                  assign({
                    "aws:SourceArn": pipe([
                      get("aws:SourceArn"),
                      replaceArnWithAccountAndRegion({
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
      })
    ),
    assignPolicyResource({ providerConfig, lives }),
  ]);

const assignPolicyAccountAndRegion = ({ providerConfig, lives }) =>
  pipe([
    tap((params) => {
      assert(true);
    }),
    assign({
      Statement: pipe([
        get("Statement"),
        tap((params) => {
          assert(true);
        }),
        switchCase([
          Array.isArray,
          map(replaceStatement({ providerConfig, lives })),
          replaceStatement({ providerConfig, lives }),
        ]),
      ]),
    }),
  ]);

exports.assignPolicyAccountAndRegion = assignPolicyAccountAndRegion;

exports.assignPolicyDocumentAccountAndRegion = ({ providerConfig, lives }) =>
  assign({
    PolicyDocument: pipe([
      tap((params) => {
        assert(true);
      }),
      get("PolicyDocument"),
      assignPolicyAccountAndRegion({ providerConfig, lives }),
    ]),
  });

exports.createIAM = createEndpoint("iam", "IAM");

exports.tagResourceIam =
  ({ propertyName, field, method }) =>
  ({ endpoint }) =>
  ({ live }) =>
    pipe([
      tap((params) => {
        assert(live[field]);
      }),
      (Tags) => ({
        [propertyName || field]: live[field],
        Tags,
      }),
      endpoint()[method],
    ]);

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/IAM.html#untagUser-property
// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/IAM.html#untagPolicy-property
exports.untagResourceIam =
  ({ propertyName, field, method }) =>
  ({ endpoint }) =>
  ({ live }) =>
    pipe([
      (TagKeys) => ({
        [propertyName || field]: live[field],
        TagKeys,
      }),
      endpoint()[method],
    ]);

exports.createFetchPolicyDocument =
  ({ iam }) =>
  ({ Versions, PolicyArn }) =>
    pipe([
      tap(() => {
        assert(PolicyArn, "PolicyArn");
        assert(Versions, "Versions");
      }),
      () => Versions,
      find(get("IsDefaultVersion")),
      ({ VersionId }) => ({
        PolicyArn,
        VersionId,
      }),
      iam().getPolicyVersion,
      get("PolicyVersion.Document"),
      querystring.decode,
      keys,
      first,
      tryCatch(JSON.parse, (error, document) => {
        logger.error(`FetchPolicyDocument ${error}, ${document}`);
      }),
    ])();

exports.assignAttachedPolicies = ({ policies = [] }) =>
  assign({
    AttachedPolicies: pipe([
      () => policies,
      map(
        pipe([
          tap((policy) => {
            assert(policy.config.PolicyName);
          }),
          (policy) => ({
            PolicyArn: getField(policy, "Arn"),
            PolicyName: policy.config.PolicyName,
          }),
        ])
      ),
    ]),
  });

const findArnInCondition = ({ Condition }) =>
  pipe([
    () => [
      "StringEquals",
      "StringEquals.aws:PrincipalOrgID",
      "StringEquals.elasticfilesystem:AccessPointArn",
      "ArnLike.AWS:SourceArn",
      "ArnEquals.aws:SourceArn",
      "ArnEquals.aws:PrincipalArn",
    ],
    map((prop) => get(prop)(Condition)),
  ])();

const findInStatement =
  ({ type, group, lives, config }) =>
  ({ Condition, Resource }) =>
    pipe([
      tap(() => {
        assert(true);
      }),
      () => Resource,
      unless(Array.isArray, (resource) => [resource]),
      append(findArnInCondition({ Condition })),
      filter(not(isEmpty)),
      map((arn) =>
        pipe([
          lives.getByType({
            providerName: config.providerName,
            type,
            group,
          }),
          find(({ id }) =>
            pipe([
              () => arn,
              when(isObject, pipe([values, first])),
              includes(id),
            ])()
          ),
        ])()
      ),
      filter(not(isEmpty)),
    ])();

exports.findInStatement = findInStatement;

exports.sortPolicies = callProp("sort", (a, b) =>
  a.PolicyArn.localeCompare(b.PolicyArn)
);

exports.filterAttachedPolicies = ({ lives }) =>
  pipe([
    assign({
      AttachedPolicies: pipe([
        get("AttachedPolicies"),
        filter(
          not(({ PolicyArn }) =>
            pipe([() => lives, any(eq(get("id"), PolicyArn))])()
          )
        ),
      ]),
    }),
    omitIfEmpty(["AttachedPolicies"]),
  ]);

const buildDependencyPolicy = ({ type, group }) => ({
  type,
  group,
  list: true,
  dependencyIds: ({ lives, config }) =>
    pipe([
      get("PolicyDocument.Statement"),
      unless(isEmpty, flatMap(findInStatement({ type, group, lives, config }))),
    ]),
});

exports.buildDependenciesPolicy = () =>
  pipe([
    () => dependenciesFromPolicies,
    map(buildDependencyPolicy),
    tap((params) => {
      assert(true);
    }),
  ])();
