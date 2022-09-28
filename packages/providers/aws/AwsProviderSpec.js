const { pipe, tap, flatMap, filter, eq, get, map } = require("rubico");
const { find, includes, append, callProp, unless } = require("rubico/x");

const assert = require("assert");
const AwsServicesAvailability = require("./AwsServicesAvailability.json");
const GROUPS = [
  ["ACM", "acm"],
  ["ApiGateway", "apigateway"],
  ["ApiGatewayV2", "apigatewayv2"],
  ["AppRunner", "apprunner"],
  ["AppSync", "appsync"],
  ["Autoscaling", "autoscaling"],
  ["CodeBuild", "codebuild"],
  ["CodeDeploy", "codedeploy"],
  ["CodePipeline", "codepipeline"],
  ["CodeStarConnections", "codestar-connections"],
  ["CloudFront", "cloudfront"],
  ["CloudFormation", "cloudformation"],
  ["CloudTrail", "cloudtrail"],
  ["CloudWatch", "cloudwatch"],
  ["CloudWatchEvent", "cloudwatch"],
  ["CognitoIdentityServiceProvider", "cognito-idp"],
  ["DynamoDB", "dynamodb"],
  ["EC2", "ec2"],
  ["ECR", "ecr"],
  ["ECS", "ecr"],
  ["EFS", "efs"],
  ["EKS", "eks"],
  ["ELBv2", "elb"],
  ["Firehose", "firehose"],
  ["Glue", "glue"],
  ["Kinesis", "kinesis"],
  ["KMS", "kms"],
  ["Lambda", "lambda"],
  ["NetworkFirewall", "network-firewall"],
  ["NetworkManager", "networkmanager"],
  ["Organisations", "organizations"],
  ["RDS", "rds"],
  ["RAM", "ram"],
  ["Route53Resolver", "route53resolver"],
  ["Route53RecoveryControlConfig", "route53-recovery-control-config"],
  ["S3", "s3"],
  ["SecretsManager", "secretsmanager"],
  ["StepFunctions", "sns"],
  ["SNS", "sns"],
  ["SQS", "sqs"],
  ["SSM", "ssm"],
  ["WAFV2", "waf"],
];

const GROUPS_MISSING = [
  "CloudWatchLogs", // missing from the list provider by AWS
];
const GROUPS_GLOBAL = [
  "IAM",
  "Route53",
  "Route53Domain", // always on us-east-1
  "Route53RecoveryReadiness",
];

const findServicesPerRegion = ({ region }) =>
  pipe([
    tap(() => {
      assert(region);
    }),
    () => AwsServicesAvailability,
    find(eq(get("region"), region)),
    get("services"),
    tap((services) => {
      assert(services, `no service for region '${region}'`);
    }),
  ])();

exports.fnSpecs = (config) =>
  pipe([
    tap(() => {
      assert(config);
      assert(config.region);
    }),
    () => config,
    findServicesPerRegion,
    (servicesPerRegion) =>
      pipe([
        tap((params) => {
          assert(servicesPerRegion);
        }),
        () => GROUPS,
        filter(([group, client]) =>
          pipe([
            tap((params) => {
              assert(client);
            }),
            () => servicesPerRegion,
            tap((params) => {
              assert(true);
            }),
            includes(client),
          ])()
        ),
        tap((params) => {
          assert(true);
        }),
        map(([group]) => group),
        append(GROUPS_MISSING),
        unless(() => config.noGlobalEndpoint, append(GROUPS_GLOBAL)),
        callProp("sort", (a, b) => a.localeCompare(b)),
        flatMap(pipe([(group) => require(`./${group}`), (fn) => fn()])),
      ])(),
  ])();
