const assert = require("assert");
const { pipe, tap, get, pick, map, assign } = require("rubico");
const { defaultsDeep, pluck } = require("rubico/x");
const { getByNameCore } = require("@grucloud/core/Common");
const { getField } = require("@grucloud/core/ProviderCommon");

const { buildTags } = require("../AwsCommon");
const {
  tagResource,
  untagResource,
  omitEncryptionConfiguration,
} = require("./NetworkFirewallCommon");

const pickId = pipe([pick(["FirewallArn"])]);

const decorate =
  ({ endpoint }) =>
  ({ Firewall, ...otherProp }) =>
    pipe([
      () => ({ ...Firewall, ...otherProp }),
      assign({
        Tags: pipe([
          ({ FirewallArn }) => ({ ResourceArn: FirewallArn }),
          endpoint().listTagsForResource,
          get("Tags"),
        ]),
      }),
    ])();

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/NetworkFirewall.html
exports.Firewall = ({ compare }) => ({
  type: "Firewall",
  package: "network-firewall",
  client: "NetworkFirewall",
  findName: () => get("FirewallName"),
  findId: () => pipe([get("FirewallArn")]),
  inferName: () => pipe([get("FirewallName")]),
  compare: compare({
    filterLive: () => pipe([omitEncryptionConfiguration]),
  }),
  filterLive: ({ resource, programOptions }) =>
    pipe([omitEncryptionConfiguration]),
  omitProperties: [
    "UpdateToken",
    "FirewallStatus",
    "FirewallArn",
    "FirewallId",
    "FirewallPolicyArn",
    "SubnetMappings",
    "VpcId",
  ],
  dependencies: {
    vpc: {
      type: "Vpc",
      group: "EC2",
      dependencyId: ({ lives, config }) => get("VpcId"),
    },
    subnets: {
      type: "Subnet",
      group: "EC2",
      list: true,
      dependencyIds: ({ lives, config }) =>
        pipe([get("SubnetMappings"), pluck("SubnetId")]),
    },
    firewallPolicy: {
      type: "Policy",
      group: "NetworkFirewall",
      dependencyId: ({ lives, config }) => get("FirewallPolicyArn"),
    },
    //TODO
    // kmsKey: {
    //   type: "Key",
    //   group: "KMS",
    //   dependencyId: ({ lives, config }) => get(""),
    // },
    // vpcEndpoint: {
    //   type: "VpcEndpoint",
    //   group: "EC2",
    //   dependencyId: ({ lives, config }) => get(""),
    // },
  },
  ignoreErrorCodes: ["ResourceNotFoundException"],
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/NetworkFirewall.html#describeFirewall-property
  getById: {
    method: "describeFirewall",
    pickId,
    decorate,
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/NetworkFirewall.html#listFirewalls-property
  getList: {
    method: "listFirewalls",
    getParam: "Firewalls",
    decorate: ({ getById }) => pipe([getById]),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/NetworkFirewall.html#createFirewall-property
  create: { method: "createFirewall", pickCreated: () => get("Firewall") },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/NetworkFirewall.html#deleteFirewall-property
  destroy: {
    method: "deleteFirewall",
    pickId,
    shouldRetryOnExceptionMessages: [
      "Unable to fulfill request because the following related VPC endpoint(s) still exist in route table(s)",
    ],
  },
  getByName: getByNameCore,
  tagger: () => ({ tagResource: tagResource, untagResource: untagResource }),

  configDefault: ({
    name,
    namespace,
    properties: { Tags, ...otherProps },
    dependencies: { vpc, subnets, firewallPolicy },
    config,
  }) =>
    pipe([
      tap((params) => {
        assert(otherProps.FirewallName);
        assert(vpc);
        assert(subnets);
        assert(firewallPolicy);
      }),
      () => otherProps,
      defaultsDeep({
        VpcId: getField(vpc, "VpcId"),
        SubnetMappings: pipe([
          () => subnets,
          map((subnet) => ({ SubnetId: getField(subnet, "SubnetId") })),
        ])(),
        FirewallPolicyArn: getField(firewallPolicy, "FirewallPolicyArn"),
        Tags: buildTags({ config, namespace, name, UserTags: Tags }),
      }),
    ])(),
});
