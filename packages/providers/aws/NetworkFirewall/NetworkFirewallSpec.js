const assert = require("assert");
const { pipe, map, tap, eq, get, omit, assign } = require("rubico");
const { defaultsDeep, when } = require("rubico/x");
const { replaceWithName } = require("@grucloud/core/Common");

const { compareAws } = require("../AwsCommon");

const { Firewall } = require("./Firewall");
const { FirewallPolicy } = require("./FirewallPolicy");
const { FirewallRuleGroup } = require("./FirewallRuleGroup");
const {
  FirewallLoggingConfiguration,
} = require("./FirewallLoggingConfiguration");

const GROUP = "NetworkFirewall";
const compareFirewall = compareAws({});

const omitEncryptionConfiguration = when(
  eq(get("EncryptionConfiguration.Type"), "AWS_OWNED_KMS_KEY"),
  omit(["EncryptionConfiguration"])
);

module.exports = pipe([
  () => [
    {
      type: "Firewall",
      Client: Firewall,
      inferName: ({ properties }) =>
        pipe([() => properties, get("FirewallName")])(),
      compare: compareFirewall({
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
        vpc: { type: "Vpc", group: "EC2" },
        subnets: { type: "Subnet", group: "EC2", list: true },
        firewallPolicy: { type: "Policy", group: "NetworkFirewall" },
        kmsKey: { type: "Key", group: "KMS" },
        vpcEndpoint: { type: "VpcEndpoint", group: "EC2" },
      },
    },
    {
      type: "Policy",
      Client: FirewallPolicy,
      inferName: ({ properties }) =>
        pipe([() => properties, get("FirewallPolicyName")])(),
      compare: compareFirewall({
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
        kmsKey: { type: "Key", group: "KMS" },
        ruleGroups: { type: "RuleGroup", group: GROUP, list: true },
      },
    },
    {
      type: "RuleGroup",
      Client: FirewallRuleGroup,
      inferName: ({ properties }) =>
        pipe([() => properties, get("RuleGroupName")])(),
      omitProperties: [
        "ConsumedCapacity",
        "LastModifiedTime",
        "RuleGroupArn",
        "RuleGroupStatus",
        "RuleGroupId",
        "NumberOfAssociations",
      ],
      compare: compareFirewall({
        filterLive: () => pipe([omitEncryptionConfiguration]),
      }),
      filterLive: () => pipe([omitEncryptionConfiguration]),
      dependencies: { kmsKey: { type: "Key", group: "KMS" } },
    },
    {
      type: "LoggingConfiguration",
      Client: FirewallLoggingConfiguration,
      inferName: ({ properties, dependenciesSpec: { firewall } }) =>
        pipe([
          tap((params) => {
            assert(firewall);
          }),
          () => firewall,
        ])(),
      omitProperties: ["FirewallArn"],
      filterLive: ({ resource, programOptions }) =>
        pipe([
          assign({
            LoggingConfiguration: pipe([
              get("LoggingConfiguration"),
              assign({
                LogDestinationConfigs: pipe([
                  get("LogDestinationConfigs"),
                  map(
                    pipe([
                      assign({
                        LogDestination: pipe([
                          get("LogDestination"),
                          // when(
                          //   get("logGroup"),
                          //   assign({
                          //     logGroup: pipe([
                          //       get("logGroup"),
                          //       tap((params) => {
                          //         assert(true);
                          //       }),
                          //     ]),
                          //   })
                          // ),
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
        firewall: { type: "Firewall", group: "NetworkFirewall", parent: true },
        logGroups: { type: "LogGroup", group: "CloudWatchLogs", list: true },
        buckets: { type: "Bucket", group: "S3", list: true },
        //TODO firehose
      },
    },
  ],
  map(
    defaultsDeep({
      group: GROUP,
      compare: compareFirewall({}),
    })
  ),
]);
