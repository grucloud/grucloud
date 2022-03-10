const assert = require("assert");
const { assign, map, pipe, get, tryCatch, tap } = require("rubico");
const { find, first, keys } = require("rubico/x");
const { IAM } = require("@aws-sdk/client-iam");
const querystring = require("querystring");
const { getField } = require("@grucloud/core/ProviderCommon");
const { createEndpoint } = require("../AwsCommon");

const logger = require("@grucloud/core/logger")({ prefix: "IamCommon" });

exports.createIAM = createEndpoint(IAM);

exports.tagResourceIam =
  ({ field, method }) =>
  ({ iam }) =>
  ({ live }) =>
    pipe([
      (Tags) => ({
        [field]: live[field],
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
