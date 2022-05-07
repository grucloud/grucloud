const assert = require("assert");
const { pipe, tap, get, pick, assign, omit } = require("rubico");
const { defaultsDeep, pluck } = require("rubico/x");
const { getByNameCore } = require("@grucloud/core/Common");

const { buildTags } = require("../AwsCommon");
const { createAwsResource } = require("../AwsClient");
const { tagResource, untagResource } = require("./NetworkFirewallCommon");

const createModel = ({ config }) => ({
  package: "network-firewall",
  client: "NetworkFirewall",
  ignoreErrorCodes: [
    "ResourceNotFoundException",
    "InvalidFirewallPolicyID.NotFound",
  ],
  getById: {
    method: "describeFirewallPolicy",
    decorate:
      ({ endpoint, live }) =>
      ({ FirewallPolicy, FirewallPolicyResponse }) =>
        pipe([
          () => ({ FirewallPolicy, ...FirewallPolicyResponse }),
          tap((params) => {
            assert(true);
          }),
        ])(),
  },
  getList: {
    method: "listFirewallPolicies",
    getParam: "FirewallPolicies",
    decorate: ({ endpoint, getById }) =>
      pipe([({ Arn }) => ({ FirewallPolicyArn: Arn }), getById]),
  },
  create: {
    method: "createFirewallPolicy",
    pickCreated: ({ payload }) =>
      pipe([
        tap((params) => {
          assert(true);
        }),
        get("FirewallPolicyResponse"),
      ]),
  },
  //TODO update test
  update: { method: "updateFirewallPolicy" },
  destroy: {
    method: "deleteFirewallPolicy",
    shouldRetryOnExceptionMessages: [
      "Unable to delete the object because it is still in use",
    ],
  },
});

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/NetworkFirewallPolicy.html
exports.FirewallPolicy = ({ spec, config }) =>
  createAwsResource({
    model: createModel({ config }),
    spec,
    config,
    findName: pipe([get("live.FirewallPolicyName")]),
    findId: pipe([get("live.FirewallPolicyArn")]),
    pickId: pipe([pick(["FirewallPolicyArn"])]),
    findDependencies: ({ live }) => [
      {
        type: "Key",
        group: "KMS",
        ids: [get("EncryptionConfiguration.KeyId")(live)],
      },
      {
        type: "RuleGroup",
        group: "NetworkFirewall",
        ids: pipe([
          () => live,
          get("FirewallPolicy"),
          ({
            StatefulRuleGroupReferences = [],
            StatelessRuleGroupReferences = [],
          }) => [
            ...StatefulRuleGroupReferences,
            ...StatelessRuleGroupReferences,
          ],
          pluck("ResourceArn"),
        ])(),
      },
    ],

    getByName: getByNameCore,
    tagResource: tagResource,
    untagResource: untagResource,
    configDefault: ({
      name,
      namespace,
      properties: { Tags, ...otherProps },
      dependencies: { key },
    }) =>
      pipe([
        tap((params) => {}),
        () => otherProps,
        defaultsDeep({
          Tags: buildTags({ config, namespace, name, UserTags: Tags }),
        }),
      ])(),
  });
