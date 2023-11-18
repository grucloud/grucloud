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

const IncludeListExpensive = [
  //"EMR", //TODO
  "DMS",
  "DAX",
  "EMRServerless",
  "ElastiCache",
  "FSx",
  "MQ",
  "MSK",
  "MWAA",
  "MemoryDB",
  //"Neptune",
  // "NetworkFirewall",
  // "NetworkManager",
  "OpenSearch",
  "OpenSearchServerless",
  "Redshift",
  "RedshiftServerless",
  "RDS",
  "Transfer",
  "VpcLattice",
  "WAFv2",
];

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
  //"AuditManager",
  "AutoScaling",
  "Backup",
  "Batch",
  "Budgets",
  "CUR",
  "Cloud9",
  "CloudFront",
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
  // "DataSync" $$$
  //"Detective",
  "DeviceFarm",
  // "DirectConnect"
  // "DirectoryService"
  "DynamoDb",
  // "EC2",
  "ECR",
  "ECS",
  // "EFS",
  //"EKS",
  // "EMR"
  // "EMRServerless"
  // "ElastiCache"
  // "ElasticBeanstalk"
  "ElasticLoadBalancingV2",
  "Elemental",
  "Evidently",
  //"FSx", $$$
  "Firehose",
  "Glacier",
  "GlobalAccelerator",
  "Glue",
  "Grafana",
  // "GuardDuty"
  "IAM",
  // "IVS",
  //"IdentityStore",
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
  //"Lex",
  //"LicenseManager",
  "Lightsail",
  "Location",
  //"MQ",
  //"MSK",
  // "MWAA", $$$
  // "Macie"
  // "MediaConnect",
  // "MediaConvert",
  // "MediaLive",
  // "MediaPackage",
  // "MediaTailor",
  // "MemoryDB",
  //"Neptune",
  //"NetworkFirewall"
  // "NetworkManager"
  // "OpenSearch"
  //  "OpenSearchServerless"
  //"Organisation",
  //  "Pinpoint"
  "Pipes",
  "QLDB",
  // "QuickSight",
  //"RAM",
  // "RDS", $$
  "RUM",
  "Rbin",
  // "Redshift", $$
  // "RedshiftServerless"
  // "ResilienceHub"
  "ResourceExplorer2",
  "ResourceGroups",
  // "RoleEverywhere"
  "Route53",
  //  "Route53RecoveryControlConfig" $$$
  //  "Route53RecoveryReadiness" $$$
  "Route53Resolver",
  "S3",
  "S3Control",
  "SESV2",
  "SNS",
  "SQS",
  "SSM",
  //"SSOAdmin",
  // "SageMaker",$$$
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
  // "Transfer", $$
  // "VpcLattice",
  //  "WAFv2" $
  // "WorkSpaces", $$$
  // "WorkSpacesWeb",
  //"XRay",
];
const ExcludeDirsDefault = [
  //
  ".DS_Store",
  "node_modules",
  "artifacts",
  "empty",
  "certificate",
  "appflow-redshift",

  "amplify-nextjs",
  "amplify_cognito_apigateway_lambda_envvariables", // Github token expires quickly
  "private-apigw-lambda-cdk", //  Too slow"

  "appstream-stack",
  "appstream-simple", // need to create an S3 object
  "backup-simple", //UpdateGlobalSettings AccessDeniedException: Insufficient privileges to perform this action.
  "ta-eventbridge-lambda-s3",
  "cloud9-simple", // reason: 'Instance profile AWSCloud9SSMInstanceProfile does not exist in this account. Please create an instance profile and role as described here https://docs.aws.amazon.com/cloud9/latest/user-guide/ec2-ssm.html',
  "directory-service-microsoft-ad", // multi account
  "globalcluster", // Too slow
  "msk-lambda-cdk", //  Too slow
  "transfer-ftps-s3", //TODO  create Transfer::Server Certificate type not supported
  "eks-workshop",
  //"directory-service-microsoft-ad", // slow
  "organisations-policy",
  "account-bulk",
  //"redshiftserverless-simple",
  // Route53Domain only on main account
  "identity-provider",
  "apigw-mutualtls-lambda",
  "eks-load-balancer",
  "lightsail-wordpress",
  "route53-delegation-set",
  "lambda-vpc-interface-endpoints-secrets-manager", // slow
  // Bugs
  //"codedeploy-ecs", // CodeDeploy::DeploymentGroup 0/1  AWS CodeDeploy does not have the permissions required to assume the role arn:aws:iam::840541460064:role/roleECSCodeDeploy.
  "memorydb-parameter-group-default", // "Subnets: [subnet-08ff91f6dbe67999c] are not in a supported availability zone. Supported availability zones are [us-east-1c, us-east-1d, us-east-1b]."
  "subscription-filter", // Could not execute the lambda function. Make sure you have given CloudWatch Logs permission to execute your function.
  "lake-formation", // "Insufficient Lake Formation permission(s): Required Create Tag on Catalog",
  "apprunner-github",
  "apprunner-leaderboard",
  "apprunner-simple",
  "apprunner-ngnix",
  "apprunner-secrets-manager",
  "retail-store-sample-app",
  "cloudfront-lambda-edge-cdk-python", // TODO
  "cloudfront-le-apigw-cdk", // TODO
  "cloudfront-lambda-url-java", //  Too slow
  "elemental-mediaconnect-medialive-mediapackage",
  "elemental-medialive-mediapackage-cdk-ts",
  "elemental-mediapackage-cloudfront-cdk-ts",
  "xray-lambdalayers-cdk-python",
  "stepfunctions-eventbridge-lambda-sam-java",
  "lambda-layer-terraform",
  "redshift-simple", // uses Organisation, use the default profile
  "cognito-restapi-vpclink",
  "apigw-http-eventbridge-terraform",
  "s3-storage-lens", // Bug in the aws sdk js
  "eventbridge-codebuild-sns", // S3 "AccessDenied: Access Denied"
  "eventbridge-sfn-terraform",
  "cloudwatch-logs-subscription-lambda-cdk", //SubscriptionFilter: "Could not execute the lambda function. Make sure you have given CloudWatch Logs permission to execute your function.",
  "dynamodb-kinesis", // Table is not in a valid state to enable Kinesis Streaming Destination: KinesisStreamingDestination must be ACTIVE to perform DISABLE operation.
  "ec2-credit", // "This account cannot launch T2 instances with Unlimited enabled. Please contact AWS Support to enable this feature.",
  "fsx-openzfs", // Volume "1 validation error detected: Value null at 'openZFSConfiguration.parentVolumeId' failed to satisfy constraint: Member must not be null",
  "s3-object-lambda", //TODO
  "s3-s3-replication-cdk", //TODO
  "ecs-simple", //TODO update
  "graphql",
  "auth0", //run as default profile due to certificate
  "http-lambda", //run as default profile due to certificate
  "load-balancer",
  "cloudfront-distribution",
  "website-https",
  "detective-simple",
  "cost-explorer-simple",
  "docker", // TODO move docker dir out of the example
  "kops",
  "aws-samples",
  "aws-cdk-examples",
  "terraform-backend-s3-dynamodb",
  "verified-access-simple",
  "kms-replica-key",
  "config-simple",
  "config-organization-custom-rule",
  "appmesh-ram",
  "s3-multiregion-accesspoint",
  "cloud-wan",
  "next-sst-grucloud",
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

// const isGruCloudExample = ({ directory, name }) =>
//   pipe([
//     get("name"),
//     (fileName) => path.resolve(directory, name, fileName),
//     (filename) => fs.readFile(filename, "utf-8"),
//     tap((content) => {
//       assert(content);
//     }),
//     JSON.parse,
//     tap((content) => {
//       assert(content);
//     }),
//     get("dependencies"),
//     keys,
//     any(includes("@grucloud/core")),
//   ]);

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
      //filterIncludeDir({ IncludeList }),
      //filterIncludeDir({ IncludeList: IncludeListExpensive }),
      flatMap(
        pipe([get("name"), walkDirectoryUnit({ excludeDirs, directory })])
      ),
      tap((directory) => {
        assert(true);
      }),
    ])();
