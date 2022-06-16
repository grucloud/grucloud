const assert = require("assert");
const { pipe, tap, get, pick, map, assign } = require("rubico");
const { defaultsDeep, pluck } = require("rubico/x");
const { getByNameCore } = require("@grucloud/core/Common");
const { getField } = require("@grucloud/core/ProviderCommon");

const { buildTags } = require("../AwsCommon");
const { createAwsResource } = require("../AwsClient");
const { tagResource, untagResource } = require("./NetworkFirewallCommon");

const createModel = ({ config }) => ({
  package: "network-firewall",
  client: "NetworkFirewall",
  ignoreErrorCodes: ["ResourceNotFoundException"],
  getById: {
    method: "describeFirewall",
    decorate:
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
        ])(),
  },
  getList: {
    method: "listFirewalls",
    getParam: "Firewalls",
    decorate: ({ endpoint, getById }) =>
      pipe([
        tap((params) => {
          assert(getById);
          assert(endpoint);
        }),
        getById,
      ]),
  },
  create: { method: "createFirewall" },
  destroy: {
    method: "deleteFirewall",
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
    findName: get("live.FirewallName"),
    findId: pipe([
      get("live.FirewallArn"),
      tap((FirewallArn) => {
        assert(FirewallArn);
      }),
    ]),
    pickId: pipe([
      tap(({ FirewallArn }) => {
        assert(FirewallArn);
      }),
      pick(["FirewallArn"]),
    ]),
    findDependencies: ({ live }) => [
      {
        type: "Vpc",
        group: "EC2",
        ids: [live.VpcId],
      },
      {
        type: "Subnet",
        group: "EC2",
        ids: pipe([() => live, get("SubnetMappings"), pluck("SubnetId")])(),
      },
      {
        type: "Policy",
        group: "NetworkFirewall",
        ids: [live.FirewallPolicyArn],
      },
    ],

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
          assert(vpc);
          assert(subnets);
          assert(firewallPolicy);
        }),
        () => otherProps,
        defaultsDeep({
          FirewallName: name,
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
