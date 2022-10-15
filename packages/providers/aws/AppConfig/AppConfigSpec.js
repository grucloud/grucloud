const assert = require("assert");
const { pipe, map, tap, get, assign } = require("rubico");
const { defaultsDeep, pluck } = require("rubico/x");

const { replaceWithName, omitIfEmpty } = require("@grucloud/core/Common");

const { compareAws } = require("../AwsCommon");

const { AppConfigApplication } = require("./AppConfigApplication");
const { AppConfigDeployment } = require("./AppConfigDeployment");
const {
  AppConfigDeploymentStrategy,
} = require("./AppConfigDeploymentStrategy");
const {
  AppConfigConfigurationProfile,
} = require("./AppConfigConfigurationProfile");
const { AppConfigEnvironment } = require("./AppConfigEnvironment");
const {
  AppConfigHostedConfigurationVersion,
} = require("./AppConfigHostedConfigurationVersion");

const GROUP = "AppConfig";

const compareAppConfig = compareAws({});

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/AppConfig.html

module.exports = pipe([
  () => [
    {
      type: "Application",
      Client: AppConfigApplication,
      omitProperties: ["Id"],
      inferName: get("properties.Name"),
    },
    {
      type: "Deployment",
      Client: AppConfigDeployment,
      omitProperties: [
        "CompletedAt",
        "DeploymentNumber",
        "ApplicationId",
        "EventLog",
        "EnvironmentId",
        "DeploymentStrategyId",
        "State",
        "StartedAt",
        "ConfigurationProfileId",
        "ConfigurationName",
        "DeploymentDurationInMinutes",
        "FinalBakeTimeInMinutes",
        "GrowthFactor",
        "GrowthType",
        "PercentageComplete",
        "AppliedExtensions",
        "ConfigurationLocationUri",
        "ConfigurationVersion",
        "Latest",
      ],
      inferName: ({ properties, dependenciesSpec }) =>
        `${dependenciesSpec.environment}`,
      dependencies: {
        configurationProfile: {
          type: "ConfigurationProfile",
          group: GROUP,
          dependencyId: ({ lives, config }) => get("ConfigurationProfileId"),
        },
        deploymentStrategy: {
          type: "DeploymentStrategy",
          group: GROUP,
          dependencyId: ({ lives, config }) => get("DeploymentStrategyId"),
        },
        environment: {
          type: "Environment",
          group: GROUP,
          parent: true,
          dependencyId: ({ lives, config }) => get("EnvironmentId"),
        },
        hostedConfigurationVersion: {
          type: "HostedConfigurationVersion",
          group: GROUP,
          dependencyId: ({ lives, config }) =>
            pipe([
              ({ ApplicationId, ConfigurationProfileId }) =>
                `${ApplicationId}::${ConfigurationProfileId}`,
            ]),
        },
      },
    },
    {
      type: "DeploymentStrategy",
      Client: AppConfigDeploymentStrategy,
      omitProperties: ["Id"],
      inferName: get("properties.Name"),
    },
    {
      type: "ConfigurationProfile",
      Client: AppConfigConfigurationProfile,
      omitProperties: ["Id", "ApplicationId"],
      inferName: ({ properties, dependenciesSpec }) =>
        `${dependenciesSpec.application}::${properties.Name}`,
      dependencies: {
        application: {
          type: "Application",
          group: GROUP,
          parent: true,
          dependencyId: ({ lives, config }) => get("ApplicationId"),
        },
      },
      filterLive: () => pipe([omitIfEmpty(["ValidatorTypes"])]),
    },
    {
      type: "Environment",
      Client: AppConfigEnvironment,
      propertiesDefault: { Monitors: [] },
      omitProperties: ["Id", "ApplicationId", "State"],
      inferName: ({ properties, dependenciesSpec }) =>
        `${dependenciesSpec.application}::${properties.Name}`,
      dependencies: {
        application: {
          type: "Application",
          group: GROUP,
          parent: true,
          dependencyId: ({ lives, config }) => get("ApplicationId"),
        },
        alarmRoles: {
          type: "Role",
          group: "IAM",
          list: true,
          dependencyIds: ({ lives, config }) =>
            pipe([get("Monitors"), pluck("AlarmRoleArn")]),
        },
        alarms: {
          type: "MetricAlarm",
          group: "CloudWatch",
          list: true,
          dependencyIds: ({ lives, config }) =>
            pipe([get("Monitors"), pluck("AlarmArn")]),
        },
      },
      filterLive: ({ providerConfig, lives }) =>
        pipe([
          tap((params) => {
            assert(true);
          }),
          assign({
            Monitors: pipe([
              get("Monitors"),
              map(
                assign({
                  AlarmArn: pipe([
                    get("AlarmArn"),
                    replaceWithName({
                      groupType: "CloudWatch::MetricAlarm",
                      path: "id",
                      providerConfig,
                      lives,
                    }),
                  ]),
                  AlarmRoleArn: pipe([
                    get("AlarmRoleArn"),
                    replaceWithName({
                      groupType: "IAM::Role",
                      path: "id",
                      providerConfig,
                      lives,
                    }),
                  ]),
                })
              ),
            ]),
          }),
        ]),
    },
    {
      type: "HostedConfigurationVersion",
      Client: AppConfigHostedConfigurationVersion,
      omitProperties: [
        "Id",
        "ConfigurationProfileId",
        "ApplicationId",
        "VersionNumber",
        "Latest",
      ],
      inferName: ({ properties, dependenciesSpec }) =>
        `${dependenciesSpec.configurationProfile}`,
      dependencies: {
        configurationProfile: {
          type: "ConfigurationProfile",
          group: GROUP,
          parent: true,
          dependencyId: ({ lives, config }) => get("ConfigurationProfileId"),
        },
      },
    },
  ],
  map(defaultsDeep({ group: GROUP, compare: compareAppConfig() })),
]);
