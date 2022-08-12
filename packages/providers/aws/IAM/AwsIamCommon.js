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
} = require("rubico");
const {
  isEmpty,
  unless,
  when,
  keys,
  first,
  append,
  find,
  callProp,
} = require("rubico/x");
const querystring = require("querystring");
const { getField } = require("@grucloud/core/ProviderCommon");
const { createEndpoint } = require("../AwsCommon");

const logger = require("@grucloud/core/logger")({ prefix: "IamCommon" });

exports.dependenciesPoliciesKind = [
  { type: "Table", group: "DynamoDB" },
  { type: "Topic", group: "SNS" },
  { type: "Queue", group: "SQS" },
  { type: "FileSystem", group: "EFS" },
  { type: "AccessPoint", group: "EFS" },
  { type: "EventBus", group: "CloudWatchEvents" },
  { type: "StateMachine", group: "StepFunctions" },
  { type: "LogGroup", group: "CloudWatchLogs" },
  { type: "Secret", group: "SecretsManager" },
  { type: "Parameter", group: "SSM" },
  { type: "Organisation", group: "Organisations" },

  //{ type: "Function", group: "Lambda" },
  //{ type: "DBCluster", group: "RDS" },
];

exports.dependenciesPolicy = {
  openIdConnectProvider: {
    type: "OpenIDConnectProvider",
    group: "IAM",
    parent: true,
  },
  table: { type: "Table", group: "DynamoDB", parent: true },
  queue: { type: "Queue", group: "SQS", parent: true },
  snsTopic: { type: "Topic", group: "SNS", parent: true },
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
  eventBus: { type: "EventBus", group: "CloudWatchEvents" },
  // lambdaFunctions: {
  //   type: "Function",
  //   group: "Lambda",
  //   list: true,
  //   ignoreOnDestroy: true,
  // },
  stateMachines: {
    type: "StateMachine",
    group: "StepFunctions",
    list: true,
    ignoreOnDestroy: true,
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

exports.createIAM = createEndpoint("iam", "IAM");

exports.tagResourceIam =
  ({ propertyName, field, method }) =>
  ({ iam }) =>
  ({ live }) =>
    pipe([
      tap((params) => {
        assert(live[field]);
      }),
      (Tags) => ({
        [propertyName || field]: live[field],
        Tags,
      }),
      iam()[method],
    ]);

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/IAM.html#untagUser-property
// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/IAM.html#untagPolicy-property
exports.untagResourceIam =
  ({ propertyName, field, method }) =>
  ({ iam }) =>
  ({ live }) =>
    pipe([
      (TagKeys) => ({
        [propertyName || field]: live[field],
        TagKeys,
      }),
      iam()[method],
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
      "StringEquals.aws:PrincipalOrgID",
      "StringEquals.elasticfilesystem:AccessPointArn",
      "ArnLike.AWS:SourceArn",
      "ArnEquals.aws:SourceArn",
      "ArnEquals.aws:PrincipalArn",
    ],
    map((prop) => get(prop)(Condition)),
  ])();

exports.findInStatement =
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
          () =>
            lives.getByType({
              providerName: config.providerName,
              type,
              group,
            }),
          find(({ id }) => arn.includes(id)),
        ])()
      ),
      tap((params) => {
        assert(true);
      }),
      filter(not(isEmpty)),
    ])();

exports.sortPolicies = callProp("sort", (a, b) =>
  a.PolicyArn.localeCompare(b.PolicyArn)
);
