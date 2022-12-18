// Generated by 'gc gencode'
const {} = require("rubico");
const {} = require("rubico/x");

exports.createResources = () => [
  {
    type: "Association",
    group: "SSM",
    properties: ({}) => ({
      ApplyOnlyAtCronInterval: false,
      AssociationName: "my-association",
      ComplianceSeverity: "UNSPECIFIED",
      Name: "AmazonCloudWatch-ManageAgent",
      Parameters: {
        action: ["configure"],
        mode: ["ec2"],
        optionalConfigurationSource: ["ssm"],
        optionalOpenTelemetryCollectorConfigurationSource: ["ssm"],
        optionalRestart: ["yes"],
      },
      ScheduleExpression: "cron(0 */30 * * * ? *)",
      Targets: [
        {
          Key: "InstanceIds",
          Values: ["*"],
        },
      ],
    }),
  },
];
