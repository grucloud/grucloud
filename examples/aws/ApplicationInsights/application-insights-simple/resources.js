// Generated by 'gc gencode'
const {} = require("rubico");
const {} = require("rubico/x");

exports.createResources = () => [
  {
    type: "Application",
    group: "ApplicationInsights",
    properties: ({}) => ({
      AnomalyDetectionEnabled: true,
      ApplicationStatus: "ENABLED",
      AutoConfigEnabled: true,
      CWEMonitorEnabled: true,
      GroupingType: "ACCOUNT_BASED",
      OpsCenterEnabled: true,
      ReplaceCloudWatchConfig: true,
      ResourceGroupName: "ApplicationInsights-my-app",
    }),
  },
];
