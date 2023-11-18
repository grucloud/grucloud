const {
  pipe,
  tap,
  flatMap,
  filter,
  eq,
  get,
  map,
  switchCase,
  assign,
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
  identity,
} = require("rubico/x");

const assert = require("assert");
const AwsServicesAvailability = require("./AwsServicesAvailability.json");

const defaultExcludes = [
  "ACMPCA",
  "AppIntegrations",
  "ApplicationInsights",
  "Appflow",
  "AppMesh",
  "AppStream",
  "Aps",
  "AuditManager",
  "Batch",
  "CloudHSMV2",
  "CodeCatalyst",
  "CodeGuruReviewer",
  "ControlTower",
  "Comprehend",
  "Connect",
  "DataBrew",
  "DataPipeline",
  "DataSync",
  "DAX",
  "Detective",
  "DeviceFarm",
  "DirectConnect",
  "DirectoryService",
  "DMS",
  "DocDB",
  "DocDBElastic",
  "ElastiCache",
  "EMR",
  "EMRContainers",
  "EMRServerless",
  "Evidently",
  "Fis",
  "FMS",
  "Glue",
  "Grafana",
  "GlobalAccelerator",
  "Imagebuilder",
  "InternetMonitor",
  "Iot",
  "IVS",
  "Ivschat",
  "Kendra",
  "Keyspaces",
  "KinesisAnalyticsV2",
  "KinesisVideo",
  "LakeFormation",
  "LexModelsV2",
  "LicenseManager",
  "Lightsail",
  "Location",
  "LookoutMetrics",
  "LookoutVision",
  "Macie2",
  "MediaConnect",
  "MediaConvert",
  "MediaLive",
  "MediaPackage",
  "MediaStore",
  "MediaTailor",
  "MQ",
  "MSK",
  "Neptune",
  "NetworkFirewall",
  "NetworkManager",
  "MWAA",
  "OSIS",
  "OAM",
  "OpenSearch",
  "OpenSearchServerless",
  "OSIS",
  "Pinpoint",
  "QLDB",
  "QuickSight",
  "Rbin",
  "ResourceExplorer2",
  "Rekognition",
  "ResilienceHub",
  "RolesAnywhere",
  "Route53RecoveryControlConfig",
  "Route53RecoveryReadiness",
  "Route53Resolver",
  "RUM",
  "SageMaker",
  "Schemas",
  "SecurityHub",
  "ServiceCatalog",
  "ServiceDiscovery",
  "ServiceQuotas",
  "Shield",
  "Signer",
  "SSMContacts",
  "SSMIncidents",
  "StorageGateway",
  "Synthetics",
  "TimestreamWrite",
  "Transfer",
  "VpcLattice",
  "WorkSpaces",
  "WorkSpacesWeb",
];

const defaultIncludes = ["IAM", "CloudWatchLogs"];

const GROUPS = [
  ["Account", "account"],
  ["AccessAnalyzer", "accessanalyzer"],
  ["ACM", "acm"],
  ["ACMPCA", "acm-pca"],
  ["Aps", "aps", "amp"],
  ["Amplify", "amplify"],
  ["APIGateway", "apigateway", "api-gateway"],
  ["ApiGatewayV2", "apigatewayv2"],
  ["AppConfig", "appconfig"],
  ["AppMesh", "appmesh", "app-mesh"],
  ["AppRunner", "apprunner"],
  ["ApplicationAutoScaling", "application-autoscaling"],
  ["ApplicationInsights", "application-insights"],
  ["Appflow", "appflow"],
  ["AppIntegrations", "appintegrations"],
  ["AppStream", "appstream"],
  ["AppSync", "appsync"],
  ["Athena", "athena"],
  ["AuditManager", "auditmanager"],
  ["AutoScaling", "autoscaling", "auto-scaling"],
  ["AutoScalingPlans", "autoscaling", "auto-scaling-plans"],
  ["Backup", "backup"],
  ["Batch", "batch"],
  ["Budgets", "budgets"],
  ["CodeArtifact", "codeartifact"],
  ["CodeBuild", "codebuild"],
  // TODO
  //["CodeCatalyst", "codecatalyst"],
  ["CodeCommit", "codecommit"],
  ["CodeDeploy", "codedeploy"],
  ["CodePipeline", "codepipeline"],
  ["CodeGuruReviewer", "codeguru-reviewer"],
  ["CodeStar", "codestar"],
  ["CodeStarConnections", "codestar-connections"],
  ["CodeStarNotifications", "codestar-notifications"],
  ["Config", "config", "config-service"],
  ["Cloud9", "cloud9"],
  ["CloudFront", "cloudfront"],
  ["CloudFormation", "cloudformation"],
  ["CloudHSMV2", "cloudhsmv2", "cloudhsm-v2"],
  ["CloudSearch", "cloudsearch"],
  ["CloudTrail", "cloudtrail"],
  ["CloudWatch", "cloudwatch"],
  ["CloudWatchLogs", "cloudwatch-logs"],
  ["CloudWatchEvents", "cloudwatch"],
  ["Cognito", "cognito-identity"],
  [
    "CognitoIdentityServiceProvider",
    "cognito-idp",
    "cognito-identity-provider",
  ],
  ["Comprehend", "comprehend"],
  ["ControlTower", "controltower"],
  ["CostExplorer", "costexplorer", "cost-explorer"],
  ["CUR", "cur", "cost-and-usage-report-service"],
  ["DataSync", "datasync"],
  ["DAX", "dax"],
  ["DataBrew", "databrew"],
  ["Detective", "detective"],
  ["DeviceFarm", "devicefarm", "device-farm"],
  ["DirectConnect", "directconnect", "direct-connect"],
  ["DirectoryService", "directory-service"],
  ["DMS", "dms", "database-migration-service"],
  ["DocDB", "docdb"],
  ["DocDBElastic", "docdb"],
  ["DynamoDB", "dynamodb"],
  ["EC2", "ec2"],
  ["ECR", "ecr"],
  ["ECS", "ecr"],
  ["EFS", "efs"],
  ["EKS", "eks"],
  ["ElasticBeanstalk", "elasticbeanstalk", "elastic-beanstalk"],
  ["ElastiCache", "elasticache"],
  ["EMR", "emr"],
  ["EMRContainers", "emr-containers"],
  ["EMRServerless", "emr-serverless"],
  ["ElasticLoadBalancingV2", "elb", "elastic-load-balancing-v2"],
  ["Evidently", "evidently"],
  ["EventBridge", "eventbridge"],
  ["Firehose", "firehose"],
  ["Fis", "fis"],
  ["FMS", "fms"],
  ["FSx", "fsx"],
  ["Glacier", "glacier"],
  ["Imagebuilder", "imagebuilder"],
  ["Iot", "iot"],
  ["IVS", "ivs"],
  ["Ivschat", "ivschat"],
  ["GuardDuty", "guardduty"],
  ["Glue", "glue"],
  ["Grafana", "grafana"],
  ["IdentityStore", "identitystore"],
  ["Inspector2", "inspector2"],
  ["InternetMonitor", "internetmonitor"],
  ["Kendra", "kendra"],
  ["Keyspaces", "keyspaces"],
  ["Kinesis", "kinesis"],
  ["KinesisAnalyticsV2", "kinesisanalytics", "kinesis-analytics"],
  ["KinesisVideo", "kinesisvideo", "kinesis-video"],
  ["KMS", "kms"],
  ["LakeFormation", "lakeformation"],
  ["Lambda", "lambda"],
  ["LexModelsV2", "lexv2-models", "lex-models-v2"],
  ["LicenseManager", "license-manager"],
  ["Lightsail", "lightsail"],
  ["Location", "amazonlocationservice", "location"],
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
  ["OAM", "oam"],
  ["OpenSearchServerless", "opensearchserverless"],
  ["Organisations", "organizations"],
  ["OSIS", "osis"],
  ["Pipes", "pipes"],
  ["Pinpoint", "pinpoint"],
  ["QLDB", "qldb"],
  ["QuickSight", "quicksight"],
  ["RAM", "ram"],
  ["Rbin", "rbin"],
  ["ResilienceHub", "resiliencehub"],
  ["Rekognition", "rekognition"],
  ["Redshift", "redshift"],
  //["RedshiftData", "redshift-data"],
  ["RDS", "rds"],
  ["ResourceExplorer2", "resource-explorer-2"],
  ["ResourceGroups", "resource-groups"],
  ["RolesAnywhere", "rolesanywhere"],
  ["Route53", "route-53"],
  ["Route53Domains", "route-53-domains"],
  ["Route53Resolver", "route53resolver"],
  ["Route53RecoveryControlConfig", "route53-recovery-control-config"],
  ["RUM", "rum"],
  ["S3", "s3"],
  ["S3Control", "s3control", "s3-control"],
  ["SageMaker", "sagemaker"],
  ["Scheduler", "scheduler"],
  ["Schemas", "schemas"],
  ["SecretsManager", "secretsmanager", "secrets-manager"],
  ["SecurityHub", "securityhub"],
  ["ServiceDiscovery", "servicediscovery"],
  ["ServiceQuotas", "service-quotas"],
  ["SESV2", "ses"],
  ["ServiceCatalog", "servicecatalog", "service-catalog"],
  ["Signer", "signer"],
  ["Shield", "shield"],
  ["StepFunctions", "sns"],
  ["SNS", "sns"],
  ["SSOAdmin", "identity-center", "sso-admin"],
  ["SQS", "sqs"],
  ["SSM", "ssm"],
  ["SSMContacts", "ssm-contacts"],
  ["SSMIncidents", "ssm-incidents"],
  ["StorageGateway", "storagegateway"],
  ["Synthetics", "synthetics"],
  ["TimestreamWrite", "timestream-write"],
  ["Transfer", "transfer"],
  ["WAFv2", "waf", "wafv2"],
  ["WorkSpaces", "workspaces"],
  ["WorkSpacesWeb", "workspaces-web"],
  ["XRay", "xray"],
];
exports.GROUPS = GROUPS;

// TODO open an AWS ticket support
const mapRegionService = {
  "us-east-1": [
    "RedshiftServerless",
    "OpenSearch",
    "DirectoryService",
    "Keyspaces",
    "VpcLattice",
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

const doExcludeGroups = ({
  config: { includeGroups = [], includeAllResources, excludeGroups = [] },
}) =>
  pipe([
    tap((params) => {
      assert(true);
    }),
    switchCase([
      () => includeAllResources,
      identity,
      () => isEmpty(includeGroups),
      filterOut(isIn(defaultExcludes)),
      filter(isIn([...defaultIncludes, ...includeGroups])),
    ]),
    filterOut(isIn(excludeGroups)),
  ]);

const excludeResources = ({ config }) =>
  pipe([
    tap((params) => {
      assert(config);
    }),
    filterOut(
      pipe([
        get("groupType"),
        tap((groupType) => {
          assert(groupType);
        }),
        isIn(config.excludeResources),
      ])
    ),
    tap((params) => {
      assert(true);
    }),
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
        doExcludeGroups({ config }),
        callProp("sort", (a, b) => a.localeCompare(b)),
        flatMap(pipe([(group) => require(`./${group}`), (fn) => fn()])),
        tap((params) => {
          assert(true);
        }),
        map(
          assign({
            groupType: ({ type, group }) =>
              pipe([
                tap((params) => {
                  assert(type);
                  assert(group);
                }),
                () => `${group}::${type}`,
              ])(),
          })
        ),
        excludeResources({ config }),
      ])(),
  ])();
