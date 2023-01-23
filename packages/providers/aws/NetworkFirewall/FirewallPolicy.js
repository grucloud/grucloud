const assert = require("assert");
const { pipe, tap, get, pick, assign, map } = require("rubico");
const { defaultsDeep, pluck } = require("rubico/x");
const { getByNameCore } = require("@grucloud/core/Common");
const { replaceWithName } = require("@grucloud/core/Common");

const { buildTags } = require("../AwsCommon");
const {
  tagResource,
  untagResource,
  omitEncryptionConfiguration,
} = require("./NetworkFirewallCommon");

const pickId = pipe([pick(["FirewallPolicyArn"])]);

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/NetworkFirewallPolicy.html
exports.FirewallPolicy = ({ compare }) => ({
  type: "Policy",
  package: "network-firewall",
  client: "NetworkFirewall",
  findName: () => pipe([get("FirewallPolicyName")]),
  findId: () => pipe([get("FirewallPolicyArn")]),
  ignoreErrorCodes: [
    "ResourceNotFoundException",
    "InvalidFirewallPolicyID.NotFound",
  ],
  inferName: () => pipe([get("FirewallPolicyName")]),
  compare: compare({
    filterLive: () => pipe([omitEncryptionConfiguration]),
  }),
  omitProperties: [
    "ConsumedStatefulRuleCapacity",
    "ConsumedStatelessRuleCapacity",
    "FirewallPolicyArn",
    "FirewallPolicyId",
    "FirewallPolicyStatus",
    "LastModifiedTime",
    "NumberOfAssociations",
  ],
  filterLive: ({ lives, providerConfig }) =>
    pipe([
      omitEncryptionConfiguration,
      assign({
        FirewallPolicy: pipe([
          get("FirewallPolicy"),
          assign({
            StatefulRuleGroupReferences: pipe([
              get("StatefulRuleGroupReferences"),
              map(
                pipe([
                  assign({
                    ResourceArn: pipe([
                      get("ResourceArn"),
                      replaceWithName({
                        groupType: "NetworkFirewall::RuleGroup",
                        path: "id",
                        providerConfig,
                        lives,
                      }),
                    ]),
                  }),
                ])
              ),
            ]),
            StatelessRuleGroupReferences: pipe([
              get("StatelessRuleGroupReferences"),
              map(
                pipe([
                  assign({
                    ResourceArn: pipe([
                      get("ResourceArn"),
                      replaceWithName({
                        groupType: "NetworkFirewall::RuleGroup",
                        path: "id",
                        providerConfig,
                        lives,
                      }),
                    ]),
                  }),
                ])
              ),
            ]),
          }),
        ]),
      }),
    ]),
  dependencies: {
    kmsKey: {
      type: "Key",
      group: "KMS",
      dependencyId: ({ lives, config }) => get("EncryptionConfiguration.KeyId"),
    },
    ruleGroups: {
      type: "RuleGroup",
      group: "NetworkFirewall",
      list: true,
      dependencyIds: ({ lives, config }) =>
        pipe([
          get("FirewallPolicy"),
          ({
            StatefulRuleGroupReferences = [],
            StatelessRuleGroupReferences = [],
          }) => [
            ...StatefulRuleGroupReferences,
            ...StatelessRuleGroupReferences,
          ],
          pluck("ResourceArn"),
        ]),
    },
  },
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
    pickId,
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
    pickId,
    shouldRetryOnExceptionMessages: [
      "Unable to delete the object because it is still in use",
    ],
  },
  getByName: getByNameCore,
  tagger: () => ({ tagResource: tagResource, untagResource: untagResource }),

  configDefault: ({
    name,
    namespace,
    properties: { Tags, ...otherProps },
    //TODO
    dependencies: { kmskey },
    config,
  }) =>
    pipe([
      () => otherProps,
      defaultsDeep({
        Tags: buildTags({ config, namespace, name, UserTags: Tags }),
      }),
    ])(),
});
