const assert = require("assert");
const { tap, pipe, map, get, switchCase, assign } = require("rubico");
const { defaultsDeep, includes } = require("rubico/x");

const { compareAws, replaceAccountAndRegion } = require("../AwsCommon");
const { replaceWithName } = require("@grucloud/core/Common");

const GROUP = "Config";

const tagsKey = "Tags";
const compare = compareAws({ tagsKey, key: "Key" });

const { ConfigConfigRule } = require("./ConfigConfigRule");

const {
  ConfigConfigurationRecorder,
} = require("./ConfigConfigurationRecorder");
const {
  ConfigConfigurationRecorderStatus,
} = require("./ConfigConfigurationRecorderStatus");
const { ConfigConformancePack } = require("./ConfigConformancePack");

const { ConfigDeliveryChannel } = require("./ConfigDeliveryChannel");

module.exports = pipe([
  () => [
    {
      type: "ConfigRule",
      Client: ConfigConfigRule,
      propertiesDefault: {},
      omitProperties: [
        "ConfigRuleArn",
        "ConfigRuleId",
        "ConfigRuleState",
        "CreatedBy",
      ],
      inferName: () => get("ConfigRuleName"),
    },
    {
      type: "ConfigurationRecorder",
      Client: ConfigConfigurationRecorder,
      propertiesDefault: {},
      omitProperties: [],
      inferName: () => get("name"),
      dependencies: {
        iamRole: {
          type: "Role",
          group: "IAM",
          dependencyId: ({ lives, config }) => pipe([get("roleARN")]),
        },
      },
      filterLive: ({ lives, providerConfig }) =>
        pipe([
          assign({
            roleARN: pipe([
              get("roleARN"),
              switchCase([
                includes("AWSServiceRoleForConfig"),
                replaceAccountAndRegion({ lives, providerConfig }),
                replaceWithName({
                  groupType: "IAM::Role",
                  path: "id",
                  providerConfig,
                  lives,
                }),
              ]),
            ]),
          }),
        ]),
    },
    {
      type: "ConfigurationRecorderStatus",
      Client: ConfigConfigurationRecorderStatus,
      propertiesDefault: {},
      omitProperties: [
        "ConfigurationRecorderName",
        "lastStartTime",
        "lastStopTime",
        "lastStatus",
        "lastErrorCode",
        "lastErrorMessage",
        "lastStatusChangeTime",
      ],
      inferName: ({ dependenciesSpec: { deliveryChannel } }) =>
        pipe([
          tap((params) => {
            assert(deliveryChannel);
          }),
          () => deliveryChannel,
        ]),
      compare: compare({}),
      dependencies: {
        deliveryChannel: {
          type: "DeliveryChannel",
          group: "Config",
          parent: true,
          dependencyId: ({ lives, config }) =>
            pipe([get("ConfigurationRecorderName")]),
        },
      },
    },
    {
      type: "ConformancePack",
      Client: ConfigConformancePack,
      propertiesDefault: {},
      omitProperties: [
        "LastUpdateRequestedTime",
        "ConformancePackArn",
        "ConformancePackId",
        "ConformancePackState",
        "ConformancePackStatusReason",
        "LastUpdateCompletedTime",
        "StackArn",
        "Rules[].ComplianceType",
        "Rules[].Controls",
      ],
      inferName: () => get("ConformancePackName"),
      dependencies: {
        stack: {
          type: "Stack",
          group: "CloudFormation",
          parent: true,
          dependsOnTypeOnly: true,
        },
        s3BucketDelivery: {
          type: "Bucket",
          group: "S3",
          dependencyId: ({ lives, config }) => pipe([get("DeliveryS3Bucket")]),
        },
        s3BucketTemplate: {
          type: "Bucket",
          group: "S3",
          dependencyId: ({ lives, config }) => pipe([get("TemplateS3Uri")]),
        },
        // TODO
        // deliveryChannel: {
        //   type: "DeliveryChannel",
        //   group: "Config",
        //   parent: true,
        //   dependencyId: ({ lives, config }) =>
        //     pipe([get("ConfigurationRecorderName")]),
        // },
      },
    },
    {
      type: "DeliveryChannel",
      Client: ConfigDeliveryChannel,
      propertiesDefault: {},
      omitProperties: ["s3BucketName", "snsTopicARN"],
      inferName: () => get("name"),
      dependencies: {
        configurationRecorder: {
          type: "ConfigurationRecorder",
          group: "Config",
          dependencyId: ({ lives, config }) => pipe([get("name")]),
        },
        snsTopic: {
          type: "Topic",
          group: "SNS",
          dependencyId: ({ lives, config }) => pipe([get("snsTopicARN")]),
        },
        s3Bucket: {
          type: "Bucket",
          group: "S3",
          dependencyId: ({ lives, config }) => pipe([get("s3BucketName")]),
        },
      },
    },
  ],
  map(
    defaultsDeep({
      group: GROUP,
      compare: compare({}),
      tagsKey,
    })
  ),
]);
