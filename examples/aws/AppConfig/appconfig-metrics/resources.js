// Generated by 'gc gencode'
const {} = require("rubico");
const {} = require("rubico/x");

exports.createResources = () => [
  {
    type: "Application",
    group: "AppConfig",
    properties: ({}) => ({
      Description: "My App Config",
      Name: "my-appconfig",
    }),
  },
  {
    type: "ConfigurationProfile",
    group: "AppConfig",
    properties: ({}) => ({
      LocationUri: "hosted",
      Name: "profile-freeform",
      Type: "AWS.Freeform",
    }),
    dependencies: ({}) => ({
      application: "my-appconfig",
    }),
  },
  {
    type: "Deployment",
    group: "AppConfig",
    dependencies: ({}) => ({
      configurationProfile: "my-appconfig::profile-freeform",
      deploymentStrategy: "my-stategy",
      environment: "my-appconfig::env-dev",
      hostedConfigurationVersion: "my-appconfig::profile-freeform",
    }),
  },
  {
    type: "DeploymentStrategy",
    group: "AppConfig",
    properties: ({}) => ({
      DeploymentDurationInMinutes: 0,
      Description: "Strategy quick  ",
      FinalBakeTimeInMinutes: 10,
      GrowthFactor: 100,
      GrowthType: "LINEAR",
      Name: "my-stategy",
      ReplicateTo: "NONE",
    }),
  },
  {
    type: "Environment",
    group: "AppConfig",
    properties: ({ getId }) => ({
      Description: "dev",
      Monitors: [
        {
          AlarmArn: `${getId({
            type: "MetricAlarm",
            group: "CloudWatch",
            name: "High_5xx_Errors_Alarm",
          })}`,
          AlarmRoleArn: `${getId({
            type: "Role",
            group: "IAM",
            name: "SSMCloudWatchAlarmDiscoveryRole",
          })}`,
        },
      ],
      Name: "env-dev",
    }),
    dependencies: ({}) => ({
      application: "my-appconfig",
      alarmRoles: ["SSMCloudWatchAlarmDiscoveryRole"],
      alarms: ["High_5xx_Errors_Alarm"],
    }),
  },
  {
    type: "HostedConfigurationVersion",
    group: "AppConfig",
    properties: ({}) => ({
      ContentType: "text/plain",
      Content: "yolo=3",
    }),
    dependencies: ({}) => ({
      configurationProfile: "my-appconfig::profile-freeform",
    }),
  },
  {
    type: "MetricAlarm",
    group: "CloudWatch",
    properties: ({ config }) => ({
      AlarmName: "High_5xx_Errors_Alarm",
      AlarmActions: [
        `arn:aws:sns:${
          config.region
        }:${config.accountId()}:5xx_Errors_SNS_Topic`,
      ],
      MetricName: "ConsumedLCUs",
      Namespace: "AWS/ApplicationELB",
      Statistic: "Sum",
      Dimensions: [
        {
          Value: "app/CdkSt-Farga-1U06CXLRFZ4ZC/01670162ba2b5d68",
          Name: "LoadBalancer",
        },
      ],
      Period: 60,
      EvaluationPeriods: 1,
      DatapointsToAlarm: 1,
      Threshold: 1,
      ComparisonOperator: "GreaterThanThreshold",
      TreatMissingData: "missing",
    }),
    dependencies: ({}) => ({
      snsTopic: "5xx_Errors_SNS_Topic",
    }),
  },
  {
    type: "InstanceProfile",
    group: "IAM",
    name: "SSMCloudWatchAlarmDiscoveryRole",
    dependencies: ({}) => ({
      roles: ["SSMCloudWatchAlarmDiscoveryRole"],
    }),
  },
  {
    type: "Role",
    group: "IAM",
    properties: ({}) => ({
      RoleName: "SSMCloudWatchAlarmDiscoveryRole",
      Description: "Allows EC2 instances to call AWS services on your behalf.",
      AssumeRolePolicyDocument: {
        Version: "2012-10-17",
        Statement: [
          {
            Effect: "Allow",
            Principal: {
              Service: "appconfig.amazonaws.com",
            },
            Action: "sts:AssumeRole",
          },
        ],
      },
    }),
    dependencies: ({}) => ({
      policies: ["SSMCloudWatchAlarmDiscoveryPolicy"],
    }),
  },
  {
    type: "Policy",
    group: "IAM",
    properties: ({}) => ({
      PolicyName: "SSMCloudWatchAlarmDiscoveryPolicy",
      PolicyDocument: {
        Version: "2012-10-17",
        Statement: [
          {
            Effect: "Allow",
            Action: ["cloudwatch:DescribeAlarms"],
            Resource: "*",
          },
        ],
      },
      Path: "/",
    }),
  },
  { type: "Topic", group: "SNS", name: "5xx_Errors_SNS_Topic" },
];
