const assert = require("assert");
const { pipe, tap, get, pick, assign, omit } = require("rubico");
const { defaultsDeep, when } = require("rubico/x");

const { getByNameCore } = require("@grucloud/core/Common");
const { getField } = require("@grucloud/core/ProviderCommon");

const { buildTags } = require("../AwsCommon");
const {
  tagResource,
  untagResource,
  omitEncryptionConfiguration,
} = require("./NetworkFirewallCommon");

const pickId = pipe([pick(["RuleGroupArn"])]);

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/NetworkRuleGroup.html
exports.FirewallRuleGroup = ({ compare }) => ({
  type: "RuleGroup",
  package: "network-firewall",
  client: "NetworkFirewall",
  inferName: ({ properties }) =>
    pipe([() => properties, get("RuleGroupName")])(),
  findName: () => pipe([get("RuleGroupName")]),
  findId: () => pipe([get("RuleGroupArn")]),
  omitProperties: [
    "ConsumedCapacity",
    "LastModifiedTime",
    "RuleGroupArn",
    "RuleGroupStatus",
    "RuleGroupId",
    "NumberOfAssociations",
    "UpdateToken",
  ],
  compare: compare({
    filterLive: () => pipe([omitEncryptionConfiguration]),
  }),
  filterLive: () => pipe([omitEncryptionConfiguration]),
  dependencies: {
    kmsKey: {
      type: "Key",
      group: "KMS",
      dependencyId: ({ lives, config }) => get("EncryptionConfiguration.KeyId"),
    },
  },
  ignoreErrorCodes: [
    "ResourceNotFoundException",
    "InvalidRuleGroupID.NotFound",
  ],
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/NetworkFirewall.html#describeRuleGroup-property
  getById: {
    method: "describeRuleGroup",
    pickId,
    decorate:
      ({ endpoint, live }) =>
      ({ RuleGroup, RuleGroupResponse, UpdateToken }) =>
        pipe([() => ({ RuleGroup, ...RuleGroupResponse, UpdateToken })])(),
  },
  getList: {
    method: "listRuleGroups",
    getParam: "RuleGroups",
    decorate:
      ({ endpoint, getById }) =>
      ({ Name, Arn }) =>
        pipe([
          () => ({ RuleGroupArn: Arn }),
          getById,
          defaultsDeep({ RuleGroupArn: Arn, RuleGroupName: Name }),
        ])(),
  },
  create: {
    method: "createRuleGroup",
    pickCreated: ({ payload }) => pipe([get("RuleGroupResponse")]),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/NetworkFirewall.html#updateRuleGroup-property
  update: {
    method: "updateRuleGroup",
    filterParams: ({ payload, diff, live }) =>
      pipe([
        () => payload,
        defaultsDeep({ UpdateToken: live.UpdateToken }),
        defaultsDeep(pickId(live)),
      ])(),
  },
  destroy: {
    method: "deleteRuleGroup",
    pickId,
    shouldRetryOnExceptionMessages: [
      "Unable to delete the object because it is still in use",
    ],
  },
  getByName: getByNameCore,
  tagResource: tagResource,
  untagResource: untagResource,
  configDefault: ({
    name,
    namespace,
    properties: { Tags, ...otherProps },
    dependencies: { kmsKey },
    config,
  }) =>
    pipe([
      () => otherProps,
      defaultsDeep({
        Tags: buildTags({ config, namespace, name, UserTags: Tags }),
      }),
      when(
        () => kmsKey,
        defaultsDeep({
          EncryptionConfiguration: {
            KeyId: getField(kmsKey, "Arn"),
          },
        })
      ),
    ])(),
});
