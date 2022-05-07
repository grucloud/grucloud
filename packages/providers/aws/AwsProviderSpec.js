const { pipe, tap, flatMap, filter, eq, get } = require("rubico");
const { find, includes, append } = require("rubico/x");

const assert = require("assert");
const AwsServicesAvailability = require("./AwsServicesAvailability.json");
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
  "NetworkFirewall",
  "RDS",
  "Route53",
  "S3",
  "SecretsManager",
  "StepFunctions",
  "SNS",
  "SQS",
  "SSM",
];

const GROUPS_GLOBAL = ["Route53Domain"];

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
        filter((group) =>
          pipe([() => servicesPerRegion, includes(group.toLowerCase())])()
        ),
        append(GROUPS_GLOBAL),
        flatMap(pipe([(group) => require(`./${group}`), (fn) => fn()])),
      ])(),
  ])();
