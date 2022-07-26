const assert = require("assert");
const { pipe, tap, get, pick, assign, omit } = require("rubico");
const { defaultsDeep } = require("rubico/x");
const { getByNameCore } = require("@grucloud/core/Common");

const { buildTags } = require("../AwsCommon");
const { createAwsResource } = require("../AwsClient");
const { tagResource, untagResource } = require("./NetworkFirewallCommon");

const pickId = pipe([pick(["RuleGroupArn"])]);

const createModel = ({ config }) => ({
  package: "network-firewall",
  client: "NetworkFirewall",
  ignoreErrorCodes: [
    "ResourceNotFoundException",
    "InvalidRuleGroupID.NotFound",
  ],
  getById: {
    method: "describeRuleGroup",
    pickId,
    decorate:
      ({ endpoint, live }) =>
      ({ RuleGroup, RuleGroupResponse }) =>
        pipe([
          () => ({ RuleGroup, ...RuleGroupResponse }),
          tap((params) => {
            assert(true);
          }),
        ])(),
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
    pickCreated: ({ payload }) =>
      pipe([
        tap((params) => {
          assert(true);
        }),
        get("RuleGroupResponse"),
      ]),
  },
  destroy: {
    method: "deleteRuleGroup",
    pickId,
    shouldRetryOnExceptionMessages: [
      "Unable to delete the object because it is still in use",
    ],
  },
});

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/NetworkRuleGroup.html
exports.FirewallRuleGroup = ({ spec, config }) =>
  createAwsResource({
    model: createModel({ config }),
    spec,
    config,
    findName: pipe([get("live.RuleGroupName")]),
    findId: pipe([get("live.RuleGroupArn")]),

    findDependencies: ({ live }) => [
      {
        type: "Key",
        group: "KMS",
        ids: [get("EncryptionConfiguration.KeyId")(live)],
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
        () => otherProps,
        defaultsDeep({
          Tags: buildTags({ config, namespace, name, UserTags: Tags }),
        }),
      ])(),
  });
