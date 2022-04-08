const { pipe, tap, flatMap } = require("rubico");
const assert = require("assert");

const GROUPS = [
  "ACM",
  "ApiGateway",
  "ApiGatewayV2",
  "AppRunner",
  "AppSync",
  "AutoScaling",
  "CloudFront",
  "CloudFormation",
  "CloudTrail",
  "CloudWatchEvent",
  "CloudWatchLogs",
  "CognitoIdentityServiceProvider",
  "DynamoDB",
  "EC2",
  "ECR",
  "ECS",
  "EFS",
  "EKS",
  "ELBv2",
  "IAM",
  "KMS",
  "Lambda",
  "RDS",
  "Route53",
  "Route53Domain",
  "S3",
  "SecretsManager",
  "StepFunctions",
  "SNS",
  "SQS",
  "SSM",
];

exports.fnSpecs = (config) =>
  pipe([
    tap(() => {
      assert(config);
    }),
    () => GROUPS,
    flatMap(pipe([(group) => require(`./${group}`), (fn) => fn()])),
  ])();
