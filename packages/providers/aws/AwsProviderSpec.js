const { pipe, tap, flatMap, filter, eq, get, map } = require("rubico");
const {
  find,
  includes,
  append,
  callProp,
  unless,
  isEmpty,
  isIn,
} = require("rubico/x");

const assert = require("assert");
const AwsServicesAvailability = require("./AwsServicesAvailability.json");

const GROUPS = [
  ["Account", "account"],
  ["AccessAnalyzer", "accessanalyzer"],
  ["ACM", "acm"],
  ["ACMPCA", "acm-pca"],
  ["Amplify", "amplify"],
  ["APIGateway", "apigateway"],
  ["ApiGatewayV2", "apigatewayv2"],
  ["AppConfig", "appconfig"],
  ["AppMesh", "appmesh"],
  ["AppRunner", "apprunner"],
  ["ApplicationAutoScaling", "application-autoscaling"],
  ["Appflow", "appflow"],
  ["AppStream", "appstream"],
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
  ["CloudWatchEvents", "cloudwatch"],
  ["CognitoIdentity", "cognito-identity"],
  ["CognitoIdentityServiceProvider", "cognito-idp"],
  ["ControlTower", "controltower"],
  ["CostExplorer", "costexplorer"],
  ["CUR", "cur"],
  ["DirectConnect", "directconnect"],
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
  ["ElasticLoadBalancingV2", "elb"],
  ["Evidently", "evidently"],
  ["Firehose", "firehose"],
  ["FSx", "fsx"],
  ["Imagebuilder", "imagebuilder"],
  ["IVS", "ivs"],
  //["Ivschat", "ivschat"],
  ["GuardDuty", "guardduty"],
  ["Glue", "glue"],
  ["Grafana", "grafana"],
  ["IdentityStore", "identitystore"],
  ["Inspector2", "inspector2"],
  ["Kinesis", "kinesis"],
  ["KMS", "kms"],
  ["LakeFormation", "lakeformation"],
  ["Lambda", "lambda"],
  ["Lightsail", "lightsail"],
  ["Macie2", "macie"],
  ["MediaLive", "medialive"],
  ["MemoryDB", "memorydb"],
  ["MQ", "mq"],
  ["MSK", "kafka"],
  ["NetworkFirewall", "network-firewall"],
  ["NetworkManager", "networkmanager"],
  ["OpenSearchServerless", "opensearchserverless"],
  ["Organisations", "organizations"],
  ["RAM", "ram"],
  ["Redshift", "redshift"],
  //["RedshiftData", "redshift-data"],
  ["RDS", "rds"],
  ["Route53Resolver", "route53resolver"],
  ["Route53RecoveryControlConfig", "route53-recovery-control-config"],
  ["RUM", "rum"],
  ["S3", "s3"],
  ["S3Control", "s3control"],
  ["Scheduler", "scheduler"],
  ["Schemas", "schemas"],
  ["SecretsManager", "secretsmanager"],
  ["SecurityHub", "securityhub"],
  ["ServiceQuotas", "service-quotas"],
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
  ["XRay", "xray"],
];

const mapRegionService = {
  "us-east-1": ["RedshiftServerless", "OpenSearch", "DirectoryService"],
};

const GROUPS_MISSING = [
  "CloudWatchLogs", // missing from the list provider by AWS
];
const GROUPS_GLOBAL = [
  "IAM",
  "Route53",
  "Route53Domain", // always on us-east-1
  "Route53RecoveryReadiness",
  "GlobalAccelerator",
];

const appendMissingServices = ({ region }) =>
  pipe([
    tap((params) => {
      assert(region);
    }),
    unless(
      () => isEmpty(mapRegionService[region]),
      append(mapRegionService[region])
    ),
  ]);

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

const excludeGroups = ({ config: { includeGroups = [] } }) =>
  pipe([
    tap((params) => {
      assert(true);
    }),
    unless(
      () => isEmpty(includeGroups),
      filter(isIn(["IAM", "CloudWatchLogs", ...includeGroups]))
    ),
  ]);

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
          pipe([() => servicesPerRegion, includes(client)])()
        ),
        map(([group]) => group),
        append(GROUPS_MISSING),
        unless(() => config.noGlobalEndpoint, append(GROUPS_GLOBAL)),
        appendMissingServices(config),
        tap((params) => {
          assert(true);
        }),
        excludeGroups({ config }),
        callProp("sort", (a, b) => a.localeCompare(b)),
        flatMap(pipe([(group) => require(`./${group}`), (fn) => fn()])),
      ])(),
  ])();
