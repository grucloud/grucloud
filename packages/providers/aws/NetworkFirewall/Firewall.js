const assert = require("assert");
const { pipe, tap, get, pick, map, assign } = require("rubico");
const { defaultsDeep, identity } = require("rubico/x");
const { getByNameCore } = require("@grucloud/core/Common");
const { getField } = require("@grucloud/core/ProviderCommon");

const { buildTags } = require("../AwsCommon");
const { createAwsResource } = require("../AwsClient");
const { tagResource, untagResource } = require("./NetworkFirewallCommon");

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

const createModel = ({ config }) => ({
  package: "network-firewall",
  client: "NetworkFirewall",
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
});

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/NetworkFirewall.html
exports.Firewall = ({ spec, config }) =>
  createAwsResource({
    model: createModel({ config }),
    spec,
    config,
    findName: () => get("FirewallName"),
    findId: () => pipe([get("FirewallArn")]),
    pickCreated: ({ payload }) => pipe([get("Firewall")]),
    getByName: getByNameCore,
    tagResource: tagResource,
    untagResource: untagResource,
    configDefault: ({
      name,
      namespace,
      properties: { Tags, ...otherProps },
      dependencies: { vpc, subnets, firewallPolicy },
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
