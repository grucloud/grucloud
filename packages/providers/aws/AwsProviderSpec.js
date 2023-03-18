const {
  pipe,
  tap,
  flatMap,
  filter,
  eq,
  get,
  map,
  switchCase,
} = require("rubico");
const {
  find,
  includes,
  append,
  callProp,
  unless,
  isEmpty,
  isIn,
  filterOut,
} = require("rubico/x");

const assert = require("assert");
const AwsServicesAvailability = require("./AwsServicesAvailability.json");

const defaultExcludes = [
  //"ACMPCA",
  //"Appflow",
  //"AppMesh",
  //"CloudHSMV2",
  "IVS",
  "Isvchat",
  "MediaConvert",
  "Signer",
];

const defaultIncludes = ["IAM", "CloudWatchLogs"];

const GROUPS = [
  ["Account", "account"],
  ["AccessAnalyzer", "accessanalyzer"],
  ["ACM", "acm"],
  ["ACMPCA", "acm-pca"],
  ["Aps", "aps"],
  ["Amplify", "amplify"],
  ["APIGateway", "apigateway"],
  ["ApiGatewayV2", "apigatewayv2"],
  ["AppConfig", "appconfig"],
  ["AppMesh", "appmesh"],
  ["AppRunner", "apprunner"],
  ["ApplicationAutoScaling", "application-autoscaling"],
  ["ApplicationInsights", "application-insights"],
  ["Appflow", "appflow"],
  ["AppIntegrations", "appintegrations"],
  ["AppStream", "appstream"],
  ["AppSync", "appsync"],
  ["Athena", "athena"],
  ["AuditManager", "auditmanager"],
  ["AutoScaling", "autoscaling"],
  ["Backup", "backup"],
  ["Batch", "batch"],
  ["Budgets", "budgets"],
  ["CodeArtifact", "codeartifact"],
  ["CodeBuild", "codebuild"],
  ["CodeCommit", "codecommit"],
  ["CodeDeploy", "codedeploy"],
  ["CodePipeline", "codepipeline"],
  ["CodeGuruReviewer", "codeguru-reviewer"],
  ["CodeStar", "codestar"],
  ["CodeStarConnections", "codestar-connections"],
  ["CodeStarNotifications", "codestar-notifications"],
  ["Config", "config"],
  ["Cloud9", "cloud9"],
  ["CloudFront", "cloudfront"],
  ["CloudFormation", "cloudformation"],
  ["CloudHSMV2", "cloudhsmv2"],
  ["CloudSearch", "cloudsearch"],
  ["CloudTrail", "cloudtrail"],
  ["CloudWatch", "cloudwatch"],
  ["CloudWatchEvents", "cloudwatch"],
  ["Cognito", "cognito-identity"],
  ["CognitoIdentityServiceProvider", "cognito-idp"],
  ["Comprehend", "comprehend"],
  ["ControlTower", "controltower"],
  ["CostExplorer", "costexplorer"],
  ["CUR", "cur"],
  ["DataSync", "datasync"],
  ["DAX", "dax"],
  ["Detective", "detective"],
  ["DeviceFarm", "devicefarm"],
  ["DirectConnect", "directconnect"],
  ["DMS", "dms"],
  ["DynamoDB", "dynamodb"],
  ["EC2", "ec2"],
  ["ECR", "ecr"],
  ["ECS", "ecr"],
  ["EFS", "efs"],
  ["EKS", "eks"],
  ["ElasticBeanstalk", "elasticbeanstalk"],
  ["ElasticTranscoder", "elastictranscoder"],
  ["ElastiCache", "elasticache"],
  ["EMR", "emr"],
  ["EMRContainers", "emr-containers"],
  ["EMRServerless", "emr-serverless"],
  ["ElasticLoadBalancingV2", "elb"],
  ["Evidently", "evidently"],
  ["EventBridge", "eventbridge"],
  ["Firehose", "firehose"],
  ["FMS", "fms"],
  ["FSx", "fsx"],
  ["Glacier", "glacier"],
  ["Imagebuilder", "imagebuilder"],
  ["IVS", "ivs"],
  ["Ivschat", "ivschat"],
  ["GuardDuty", "guardduty"],
  ["Glue", "glue"],
  ["Grafana", "grafana"],
  ["IdentityStore", "identitystore"],
  ["Inspector2", "inspector2"],
  ["InternetMonitor", "internetmonitor"],
  ["Keyspaces", "keyspaces"],
  ["Kinesis", "kinesis"],
  ["KinesisAnalyticsV2", "kinesisanalytics"],
  ["KinesisVideo", "kinesisvideo"],
  ["KMS", "kms"],
  ["LakeFormation", "lakeformation"],
  ["Lambda", "lambda"],
  ["LicenseManager", "license-manager"],
  ["Lightsail", "lightsail"],
  ["Location", "amazonlocationservice"],
  ["Macie2", "macie"],
  ["MediaConnect", "mediaconnect"],
  ["MediaConvert", "mediaconvert"],
  ["MediaLive", "medialive"],
  ["MediaPackage", "mediapackage"],
  ["MediaStore", "mediastore"],
  ["MediaTailor", "mediatailor"],
  ["MemoryDB", "memorydb"],
  ["MQ", "mq"],
  ["MSK", "kafka"],
  ["MWAA", "mwaa"],
  ["NetworkFirewall", "network-firewall"],
  ["NetworkManager", "networkmanager"],
  ["OpenSearchServerless", "opensearchserverless"],
  ["Organisations", "organizations"],
  ["Pipes", "pipes"],
  ["Pinpoint", "pinpoint"],
  ["QLDB", "qldb"],
  ["QuickSight", "quicksight"],
  ["RAM", "ram"],
  ["Rekognition", "rekognition"],
  ["Redshift", "redshift"],
  //["RedshiftData", "redshift-data"],
  ["RDS", "rds"],
  ["ResourceExplorer2", "resource-explorer-2"],
  ["ResourceGroups", "resource-groups"],
  ["Route53Resolver", "route53resolver"],
  ["Route53RecoveryControlConfig", "route53-recovery-control-config"],
  ["RUM", "rum"],
  ["S3", "s3"],
  ["S3Control", "s3control"],
  ["Scheduler", "scheduler"],
  ["Schemas", "schemas"],
  ["SecretsManager", "secretsmanager"],
  ["SecurityHub", "securityhub"],
  ["ServiceDiscovery", "servicediscovery"],
  ["ServiceQuotas", "service-quotas"],
  ["SESV2", "ses"],
  ["ServiceCatalog", "servicecatalog"],
  ["Signer", "signer"],
  ["Shield", "shield"],
  ["StepFunctions", "sns"],
  ["SNS", "sns"],
  ["SSOAdmin", "identity-center"],
  ["SQS", "sqs"],
  ["SSM", "ssm"],
  ["StorageGateway", "storagegateway"],
  ["Synthetics", "synthetics"],
  ["TimestreamWrite", "timestream-write"],
  ["Transfer", "transfer"],
  ["WAFv2", "waf"],
  ["WorkSpaces", "workspaces"],
  ["WorkSpacesWeb", "workspaces-web"],
  ["XRay", "xray"],
];

// TODO open an AWS ticket support
const mapRegionService = {
  "us-east-1": [
    "RedshiftServerless",
    "OpenSearch",
    "DirectoryService",
    "Keyspaces",
  ],
};

const GROUPS_MISSING = [
  "CloudWatchLogs", // missing from the list provider by AWS
];
const GROUPS_GLOBAL = [
  "IAM",
  "Route53",
  "Route53Domains", // always on us-east-1
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
    switchCase([
      () => isEmpty(includeGroups),
      filterOut(isIn(defaultExcludes)),
      filter(isIn([...defaultIncludes, ...includeGroups])),
    ]),
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
