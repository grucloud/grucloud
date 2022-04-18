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
} = require("rubico/x");
const querystring = require("querystring");
const { getField } = require("@grucloud/core/ProviderCommon");
const { createEndpoint } = require("../AwsCommon");

const logger = require("@grucloud/core/logger")({ prefix: "IamCommon" });

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
exports.untagResourceIam =
  ({ field, method }) =>
  ({ iam }) =>
  ({ live }) =>
    pipe([
      (TagKeys) => ({
        [field]: live[field],
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

exports.findInStatement =
  ({ type, group, lives, config }) =>
  ({ Condition, Resource }) =>
    pipe([
      tap(() => {
        //assert(Resource);
      }),
      () => Resource,
      unless(Array.isArray, (resource) => [resource]),
      when(
        () => Condition,
        append(get("StringEquals.elasticfilesystem:AccessPointArn")(Condition))
      ),
      filter(not(isEmpty)),
      map((id) =>
        lives.getById({
          id,
          providerName: config.providerName,
          type,
          group,
        })
      ),
      filter(not(isEmpty)),
    ])();

exports.dependenciesPoliciesKind = [
  { type: "Table", group: "DynamoDB" },
  { type: "Topic", group: "SNS" },
  { type: "Queue", group: "SQS" },
  { type: "FileSystem", group: "EFS" },
  { type: "AccessPoint", group: "EFS" },
  { type: "AccessPoint", group: "EFS" },
  { type: "EventBus", group: "CloudWatchEvents" },
  { type: "Function", group: "Lambda" },
  { type: "StateMachine", group: "StepFunctions" },
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
  lambdaFunctions: {
    type: "Function",
    group: "Lambda",
    list: true,
    ignoreOnDestroy: true,
  },
  stateMachines: {
    type: "StateMachine",
    group: "StepFunctions",
    list: true,
    ignoreOnDestroy: true,
  },
};
