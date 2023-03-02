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

const ExcludeDirsDefault = [
  //
  ".DS_Store",
  "node_modules",
  "artifacts",
  "empty",
  "kops", // TODO update
  "docker", // TODO move docker dir out of the example
  "Batch",
  //
  "auditmanager-simple",
  "directory-service-microsoft-ad",
  "inspector2-simple",
  "guardduty-simple",
  "securityhub-simple",
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
  "cost-explorer-simple",
  "appconfig-feature-flag-sam",
  "apprunner-github",
  "apprunner-leaderboard",
  "apprunner-simple",
  "apprunner-ngnix",
  "apprunner-secrets-manager",
  "cloudfront-distribution",
  "cloudfront-lambda-edge-cdk-python", // TODO
  "cloudfront-le-apigw-cdk", // TODO
  "xray-lambdalayers-cdk-python",
  "stepfunctions-eventbridge-lambda-sam-java",
  "role-everywhere",
  "lambda-layer-terraform",
  "retail-store-sample-app",
  "appflow-redshift",
  "appstream-stack",
  "cognito-restapi-vpclink",
  "apigw-http-eventbridge-terraform",
  "aws-route53-recovery-control-config",
  "amplify-nextjs",
  "amplify_cognito_apigateway_lambda_envvariables", // Github token expires quickly
  "appstream-simple", // need to create an S3 object
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
  filterOut(
    pipe([
      get("name"),
      tap((content) => {
        assert(content);
      }),
      isIn([excludeDirs, ...ExcludeDirsDefault]),
    ])
  );

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

      flatMap(
        pipe([get("name"), walkDirectoryUnit({ excludeDirs, directory })])
      ),
      tap((directory) => {
        assert(true);
      }),
    ])();
