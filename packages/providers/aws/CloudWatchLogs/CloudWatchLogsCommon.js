const assert = require("assert");
const { pipe, tap } = require("rubico");
const { createEndpoint } = require("../AwsCommon");

exports.createCloudWatchLogs = createEndpoint(
  "cloudwatch-logs",
  "CloudWatchLogs"
);

exports.ignoreErrorCodes = ["ResourceNotFoundException"];

exports.LogGroupNameManagedByOther = [
  "/aws/APIGW",
  "API-Gateway-Execution-Logs",
  "/aws/apigateway/",
  "/aws/lambda/",
  "/aws/ecs/",
  "/aws-glue/jobs/",
  "/ecs/",
  "/aws/rds/",
  "RDSOSMetrics",
  "/aws/apprunner",
];

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/CloudWatchLogs.html#tagLogGroup-property
exports.tagResource =
  ({ endpoint }) =>
  ({ live }) =>
    pipe([
      (tags) => ({ logGroupName: live.logGroupName, tags }),
      endpoint().tagLogGroup,
    ]);

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/CloudWatchLogs.html#untagLogGroup-property
exports.untagResource =
  ({ endpoint }) =>
  ({ live }) =>
    pipe([
      (tags) => ({ logGroupName: live.logGroupName, tags }),
      endpoint().untagLogGroup,
    ]);
