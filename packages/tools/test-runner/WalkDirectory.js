const assert = require("assert");
const {
  eq,
  map,
  pipe,
  tap,
  tryCatch,
  get,
  filter,
  switchCase,
  flatMap,
  any,
  and,
} = require("rubico");
const {
  filterOut,
  isIn,
  callProp,
  isEmpty,
  find,
  keys,
  includes,
} = require("rubico/x");

const constants = require("fs");
const { readdir } = require("fs").promises;

const path = require("path");
const fs = require("fs").promises;

const IncludeList = [
  "ACM",
  "APIGateway",
  "AccessAnalyzer",
  "Account",
  "Amplify",
  "ApiGatewayV2",
  "AppConfig",
  "AppIntegrations",
  "AppMesh",
  "AppRunner",
  "AppStream",
  "AppSync",
  "Appflow",
  "ApplicationAutoScaling",
  "ApplicationInsights",
  "Aps",
  "Athena",
  "AuditManager",
  "AutoScaling",
  "Backup",
  "Batch",
  "Budgets",
  "CUR",
  "Cloud9",
  // "CloudFront"
  //"CloudHSMv2"
  "CloudTrail",
  "CloudWatch",
  "CloudWatchEvent",
  "CloudWatchLogs",
  "CodeArtifact",
  "CodeBuild",
  "CodeCommit",
  "CodeDeploy",
  "CodeGuruReviewer",
  "CodePipeline",
  "CognitoIdentity",
  "CognitoIdentityServiceProvider",
  "Comprehend",
  "Config",
  // "ControlTower"
  "CostExplorer",
  // "DAX"
  // "DMS"
  // "DataBrew"
  // "DataPipeline"
  // "DataSync"
  "Detective",
  "DeviceFarm",
  // "DirectConnect"
  // "DirectoryService"
  "DynamoDb",
  // "EC2",
  "ECR",
  "ECS",
  // "EFS",
  "EKS",
  // "EMR"
  // "EMRServerless"
  // "ElastiCache"
  // "ElasticBeanstalk"
  "ElasticLoadBalancingV2",
  // "ElasticTranscoder"
  "Elemental",
  "Evidently",
  //"FSx",
  "Firehose",
  "Glacier",
  "GlobalAccelerator",
  "Glue",
  "Grafana",
  // "GuardDuty"
  "IAM",
  // "IVS",
  "IdentityStore",
  "Imagebuilder",
  //  "Inspector2",
  // "InternetMonitor",
  //  "Ivschat"
  "KMS",
  //"Kendra",
  "KeySpaces",
  "Kinesis",
  "KinesisAnalyticsV2",
  "KinesisVideo",
  "LakeFormation",
  "Lambda",
  "Lex",
  "LicenseManager",
  "Lightsail",
  "Location",
  //"MQ",
  //"MSK",
  // "MWAA",
  // "Macie"
  "MediaConnect",
  "MediaConvert",
  "MediaLive",
  "MediaPackage",
  "MediaTailor",
  // "MemoryDB",
  //"Neptune",
  //"NetworkFirewall"
  // "NetworkManager"
  // "OpenSearch"
  //  "OpenSearchServerless"
  "Organisation",
  //  "Pinpoint"
  "Pipes",
  "QLDB",
  // "QuickSight",
  "RAM",
  // "RDS",
  "RUM",
  "Rbin",
  // "Redshift",
  // "RedshiftServerless"
  // "ResilienceHub"
  "ResourceExplorer2",
  "ResourceGroups",
  // "RoleEverywhere"
  "Route53",
  //  "Route53RecoveryControlConfig"
  //  "Route53RecoveryReadiness"
  "Route53Resolver",
  "S3",
  "S3Control",
  "SESV2",
  "SNS",
  "SQS",
  "SSM",
  "SSOAdmin",
  // "SageMaker",
  "Scheduler",
  "Schema",
  "SecretsManager",
  // "SecurityHub",
  //"ServiceCatalog",
  "ServiceDiscovery",
  "ServiceQuotas",
  "Signer",
  "StepFunctions",
  "Synthetics",
  "TimestreamWrite",
  // "Transfer",
  // "VpcLattice",
  //  "WAFv2"
  // "WorkSpaces",
  // "WorkSpacesWeb",
  "XRay",
  "website-https",
];
const ExcludeDirsDefault = [
  //
  ".DS_Store",
  "node_modules",
  "artifacts",
  "empty",
  "appintegration-simple",
  "application-autoscaling-simple",
  "ta-eventbridge-lambda-s3",
  "databrew-simple",
  "elastictranscoder-simple",
  "mediaconvert-simple",
  "media-tailor",
  "resiliencehub-simple",
  "route53-recovery-control-config",
  "route53-recovery-readiness",
  "s3-storage-lens", // Bug in the aws sdk js
  "sagemaker-simple",
  "terraform-backend-s3-dynamodb",
  "kops", // TODO update
  "docker", // TODO move docker dir out of the example
  "Batch",
  "Workspaces", // $$$
  "FSx", // "much expensive $$$"
  "DirectoryService", // "much expensive $$$"
  "datasync-fsxwindows", // "much expensive $$$"
  "datasync-fsxlustre", // "much expensive $$$"
  "datasync-fsxlustre-s3", // "much expensive $$$"
  "datasync-fsxopenzfs",
  "globalcluster", // Too slow
  "msk-lambda-cdk", //  Too slow
  "private-apigw-lambda-cdk", //  Too slow
  "cloudfront-lambda-url-java", //  Too slow
  "direct-connect-simple",
  "repository", // TODO
  "transfer-ftps-s3", //TODO  create Transfer::Server Certificate type not supported
  "xray-simple", // TODO
  "hub-and-spoke-with-inspection-vpc",
  "hub-and-spoke-with-shared-services-vpc-terraform",
  "cloud-wan",
  "emr-simple",
  "servicediscovery", // TODO
  "resource-share",
  "hub-and-spoke-with-inspection-vpc",
  "eks-workshop",
  "mq-simple", // Cannot even delete MQ Configuration
  "lex-simple", // problem with role seen as read only
  "licensemanager-simple",
  "internetmonitor-simple",
  "auditmanager-simple",
  "directory-service-microsoft-ad",
  "inspector2-simple",
  "guardduty-simple",
  "securityhub-simple",
  "identity-store-simple",
  "organisations-policy",
  "account-bulk",
  "macie-simple",
  "ssoadmin-simple",
  "securityhub-simple/",
  //"redshiftserverless-simple",
  // Route53Domain only on main account
  "certificate",
  "cloudfront-distribution",
  "identity-provider",
  "control-tower-simple",
  "apigw-mutualtls-lambda",
  "http-lambda",
  "auth0",
  "eks-load-balancer",
  "load-balancer",
  "lightsail-wordpress",
  "route53-delegation-set",
  "website-https",
  // Bugs
  //"codedeploy-ecs", // CodeDeploy::DeploymentGroup 0/1  AWS CodeDeploy does not have the permissions required to assume the role arn:aws:iam::840541460064:role/roleECSCodeDeploy.
  "memorydb-parameter-group-default", // "Subnets: [subnet-08ff91f6dbe67999c] are not in a supported availability zone. Supported availability zones are [us-east-1c, us-east-1d, us-east-1b]."
  "memorydb-simple",
  "subscription-filter", // Could not execute the lambda function. Make sure you have given CloudWatch Logs permission to execute your function.
  "cloudhsmv2", // CloudHSM is not currently available in us-east-1a
  "Ivschat", // 'Your account is pending verification. Until the verification process is complete, you may not be able to carry out requests with this account. If you have questions, contact AWS Support.',
  "IVS", // 'Your account is pending verification. Until the verification process is complete, you may not be able to carry out requests with this account. If you have questions, contact AWS Support.',
  "lake-formation", // "Insufficient Lake Formation permission(s): Required Create Tag on Catalog",
  "cost-explorer-simple",
  "appconfig-feature-flag-sam",
  "apprunner-github",
  "apprunner-leaderboard",
  "apprunner-simple",
  "apprunner-ngnix",
  "apprunner-secrets-manager",
  "cloudfront-distribution",
  "medialive-simple",
  "elemental-mediaconnect-medialive-mediapackage",
  "elemental-medialive-mediapackage-cdk-ts",
  "elemental-mediapackage-cloudfront-cdk-ts",
  "cloudfront-lambda-edge-cdk-python", // TODO
  "cloudfront-le-apigw-cdk", // TODO
  "xray-lambdalayers-cdk-python",
  "stepfunctions-eventbridge-lambda-sam-java",
  "role-everywhere",
  "lambda-layer-terraform",
  "retail-store-sample-app",
  "appflow-redshift",
  "appstream-stack",
  "appstream-simple", // need to create an S3 object
  "cognito-restapi-vpclink",
  "apigw-http-eventbridge-terraform",
  "aws-route53-recovery-control-config",
  "amplify-nextjs",
  "amplify_cognito_apigateway_lambda_envvariables", // Github token expires quickly
  "backup-simple",
  "apigw-rest-api-batch-sam",
  "cloud9-simple", // reason: 'Instance profile AWSCloud9SSMInstanceProfile does not exist in this account. Please create an instance profile and role as described here https://docs.aws.amazon.com/cloud9/latest/user-guide/ec2-ssm.html',
  "graphql", //
  "eventbridge-codebuild-sns", // S3 "AccessDenied: Access Denied"
  "eventbridge-sfn-terraform",
  "cloudwatch-logs-subscription-lambda-cdk", //SubscriptionFilter: "Could not execute the lambda function. Make sure you have given CloudWatch Logs permission to execute your function.",
  "config-simple", // issue with the cloud formation format
  "dax-simple", //  "No permission to assume role: arn:aws:iam::729329093404:role/service-role/daxdynamodb",
  "dynamodb-kinesis", // Table is not in a valid state to enable Kinesis Streaming Destination: KinesisStreamingDestination must be ACTIVE to perform DISABLE operation.
  "ec2-credit", // "This account cannot launch T2 instances with Unlimited enabled. Please contact AWS Support to enable this feature.",
  //"elasticache-redis-full",
  "elasticbeanstalk-simple",
  "fsx-openzfs", // Volume "1 validation error detected: Value null at 'openZFSConfiguration.parentVolumeId' failed to satisfy constraint: Member must not be null",
  "ssm-association",
];

const fileExist = pipe([
  tap((directory) => {
    assert(directory);
  }),
  tryCatch(
    tap(pipe([(fileName) => fs.access(fileName, constants.F_OK)])),
    (error, filename) =>
      pipe([
        tap(() => {
          assert(error);
        }),
        () => {
          throw Error(`directory '${filename}' does not exist`);
        },
      ])()
  ),
]);

const filterExcludeFiles = ({ excludeDirs }) =>
  pipe([
    filterOut(
      pipe([
        get("name"),
        tap((content) => {
          assert(content);
        }),
        isIn([excludeDirs, ...ExcludeDirsDefault]),
      ])
    ),
  ]);

const filterIncludeDir = ({ IncludeList }) =>
  pipe([filter(({ name }) => pipe([() => IncludeList, includes(name)])())]);
//

const isGruCloudExample = ({ directory, name }) =>
  pipe([
    get("name"),
    (fileName) => path.resolve(directory, name, fileName),
    (filename) => fs.readFile(filename, "utf-8"),
    tap((content) => {
      assert(content);
    }),
    JSON.parse,
    tap((content) => {
      assert(content);
    }),
    get("dependencies"),
    keys,
    any(includes("@grucloud/core")),
  ]);

const walkDirectoryUnit =
  ({ excludeDirs = [], directory }) =>
  (name) =>
    pipe([
      () => name,
      tap((params) => {
        assert(directory);
        assert(name);
      }),
      () => readdir(path.resolve(directory, name), { withFileTypes: true }),
      filterExcludeFiles({ excludeDirs }),

      tap((params) => {
        assert(true);
      }),
      (dirs) =>
        pipe([
          () => dirs,
          switchCase([
            and([
              find(eq(get("name"), "resources.js")),
              find(eq(get("name"), "package.json")),
            ]),
            pipe([() => [{ name, directory: path.resolve(directory, name) }]]),
            pipe([
              filter(callProp("isDirectory")),
              flatMap(
                pipe([
                  get("name"),
                  walkDirectoryUnit({
                    excludeDirs,
                    directory: path.resolve(directory, name),
                  }),
                ])
              ),
            ]),
          ]),
        ])(),
      tap((params) => {
        assert(true);
      }),
      filterOut(isEmpty),
    ])();

exports.walkDirectory =
  ({ excludeDirs = [] }) =>
  (directory) =>
    pipe([
      //
      () => directory,
      fileExist,
      () => readdir(directory, { withFileTypes: true }),
      filter(callProp("isDirectory")),
      filterExcludeFiles({ excludeDirs }),
      filterIncludeDir({ IncludeList }),
      flatMap(
        pipe([get("name"), walkDirectoryUnit({ excludeDirs, directory })])
      ),
      tap((directory) => {
        assert(true);
      }),
    ])();
