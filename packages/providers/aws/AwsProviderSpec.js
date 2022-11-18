const { pipe, tap, flatMap, filter, eq, get, map } = require("rubico");
const { find, includes, append, callProp, unless } = require("rubico/x");

const assert = require("assert");
const AwsServicesAvailability = require("./AwsServicesAvailability.json");
const GROUPS = [
  ["Account", "account"],
  ["AccessAnalyzer", "accessanalyzer"],
  ["ACM", "acm"],
  ["ACMPCA", "acm-pca"],
  ["ApiGateway", "apigateway"],
  ["ApiGatewayV2", "apigatewayv2"],
  ["AppConfig", "appconfig"],
  ["AppMesh", "appmesh"],
  ["AppRunner", "apprunner"],
  ["ApplicationAutoScaling", "application-autoscaling"],
  ["Appflow", "appflow"],
  ["AppSync", "appsync"],
  ["Athena", "athena"],
  ["AuditManager", "auditmanager"],
  ["Autoscaling", "autoscaling"],
  ["Backup", "backup"],
  ["Batch", "batch"],
  ["Budgets", "budgets"],
  ["CodeBuild", "codebuild"],
  ["CodeDeploy", "codedeploy"],
  ["CodePipeline", "codepipeline"],
  ["CodeStarConnections", "codestar-connections"],
  ["ConfigService", "config"],
  ["CloudFront", "cloudfront"],
  ["CloudFormation", "cloudformation"],
  ["CloudHSMV2", "cloudhsmv2"],
  ["CloudTrail", "cloudtrail"],
  ["CloudWatch", "cloudwatch"],
  ["CloudWatchEvent", "cloudwatch"],
  ["CognitoIdentity", "cognito-identity"],
  ["CognitoIdentityServiceProvider", "cognito-idp"],
  ["ControlTower", "controltower"],
  ["CUR", "cur"],
  ["DMS", "dms"],
  ["DynamoDB", "dynamodb"],
  ["EC2", "ec2"],
  ["ECR", "ecr"],
  ["ECS", "ecr"],
  ["EFS", "efs"],
  ["EKS", "eks"],
  ["ElasticBeanstalk", "elasticbeanstalk"],
  ["ElastiCache", "elasticache"],
  ["EMRServerless", "emr-serverless"],
  ["ELBv2", "elb"],
  ["Firehose", "firehose"],
  ["Glue", "glue"],
  ["Grafana", "grafana"],
  ["IdentityStore", "identitystore"],
  ["Inspector2", "inspector2"],
  ["Kinesis", "kinesis"],
  ["KMS", "kms"],
  ["LakeFormation", "lakeformation"],
  ["Lambda", "lambda"],
  ["Lightsail", "lightsail"],
  ["MediaLive", "medialive"],
  ["MemoryDB", "memorydb"],
  ["MQ", "mq"],
  ["MSK", "kafka"],
  ["NetworkFirewall", "network-firewall"],
  ["NetworkManager", "networkmanager"],
  //["OpenSearch", "opensearch"],
  ["Organisations", "organizations"],
  ["RAM", "ram"],
  ["Redshift", "redshift"],
  //["RedshiftData", "redshift-data"],
  ["RDS", "rds"],
  ["Route53Resolver", "route53resolver"],
  ["Route53RecoveryControlConfig", "route53-recovery-control-config"],
  ["S3", "s3"],
  ["SecretsManager", "secretsmanager"],
  ["SecurityHub", "securityhub"],
  ["SESV2", "ses"],
  ["ServiceCatalog", "servicecatalog"],
  ["Shield", "shield"],
  ["StepFunctions", "sns"],
  ["SNS", "sns"],
  ["SSOAdmin", "sso"],
  ["SQS", "sqs"],
  ["SSM", "ssm"],
  ["Transfer", "transfer"],
  ["WAFV2", "waf"],
];

const GROUPS_MISSING = [
  "CloudWatchLogs", // missing from the list provider by AWS
  //"Scheduler", Not yet available from SSM
  // "DirectoryService" Not available from SSM
];
const GROUPS_GLOBAL = [
  "IAM",
  "Route53",
  "Route53Domain", // always on us-east-1
  "Route53RecoveryReadiness",
  "GlobalAccelerator",
];

const findServicesPerRegion = ({ region = "us-east-1" }) =>
  pipe([
    tap(() => {
      //assert(region);
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
      //assert(config.region);
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
