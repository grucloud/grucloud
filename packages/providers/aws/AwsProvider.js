process.env.AWS_SDK_LOAD_CONFIG = 1;
const AWS = require("aws-sdk");
const assert = require("assert");
const {
  omit,
  pipe,
  get,
  tap,
  tryCatch,
  assign,
  switchCase,
  map,
} = require("rubico");
const {
  first,
  pluck,
  isFunction,
  size,
  identity,
  callProp,
} = require("rubico/x");
const { tos } = require("@grucloud/core/tos");

const logger = require("@grucloud/core/logger")({ prefix: "AwsProvider" });
const CoreProvider = require("@grucloud/core/CoreProvider");
const { Ec2New } = require("./AwsCommon");
const { mergeConfig } = require("@grucloud/core/ProviderCommon");

const { generateCode } = require("./Aws2gc");

const ApiGatewayV2 = require("./ApiGatewayV2");
const ApiGateway = require("./ApiGateway");
const AppSync = require("./AppSync");
const AutoScaling = require("./Autoscaling");
const AwsCertificateManager = require("./ACM");
const AwsCloudFront = require("./CloudFront");
const CognitoIdentityServiceProvider = require("./CognitoIdentityServiceProvider");
const AwsEC2 = require("./EC2");
const DynamoDB = require("./DynamoDB");

const ECR = require("./ECR");

const AwsEKS = require("./EKS");
const AwsELBv2 = require("./ELBv2");
const AwsIam = require("./IAM");
const AwsKMS = require("./KMS");
const AwsLambda = require("./Lambda");
const AwsRDS = require("./RDS");
const AwsRoute53 = require("./Route53");
const AwsRoute53Domain = require("./Route53Domain");
const AwsS3 = require("./S3");
const SSM = require("./SSM");

const fnSpecs = (config) =>
  pipe([
    tap(() => {
      assert(config);
    }),
    () => [
      //...ApiGateway(),
      ...ApiGatewayV2(),
      ...AppSync(),
      ...AutoScaling(),
      ...AwsCertificateManager(),
      ...AwsCloudFront(),
      ...CognitoIdentityServiceProvider(),
      ...DynamoDB(),
      ...AwsEC2(),
      ...ECR(),
      ...AwsEKS(),
      ...AwsELBv2(),
      ...AwsIam(),
      ...AwsKMS(),
      ...AwsLambda(),
      ...AwsRDS(),
      ...AwsRoute53(),
      ...AwsRoute53Domain(),
      ...AwsS3(),
      ...SSM(),
    ],
  ])();

const getAvailabilityZonesName = ({ region }) =>
  pipe([
    () => Ec2New({ region }),
    (ec2) => ec2().describeAvailabilityZones(),
    get("AvailabilityZones"),
    pluck("ZoneName"),
    tap((ZoneNames) => {
      logger.debug(`AvailabilityZones: for region ${region}: ${ZoneNames}`);
    }),
  ])();

const validateConfig = ({ region, zone, zones }) => {
  logger.debug(`region: ${region}, zone: ${zone}, zones: ${zones}`);
  if (zone && !zones.includes(zone)) {
    const message = `The configued zone '${zone}' is not part of region ${region}, available zones for this region: ${zones}`;
    throw { code: 400, type: "configuration", message };
  }
};

//TODO wrap for retry
const fetchAccountId = pipe([
  tap(() => {
    logger.debug(`fetchAccountId`);
  }),
  () => new AWS.STS(),
  (sts) => sts.getCallerIdentity({}).promise(),
  get("Account"),
]);

exports.AwsProvider = ({
  name = "aws",
  stage = "dev",
  config,
  programOptions,
  configs = [],
  ...other
}) => {
  assert(config ? isFunction(config) : true, "config must be a function");

  AWS.config.apiVersions = {
    acm: "2015-12-08",
    apigateway: "2015-07-09",
    apigatewayv2: "2018-11-29",
    appsync: "2017-07-25",
    autoscaling: "2011-01-01",
    cloudfront: "2020-05-31",
    cloudwatch: "2010-08-01",
    cognitoidentityserviceprovider: "2016-04-18",
    dynamodb: "2012-08-10",
    ec2: "2016-11-15",
    ecr: "2015-09-21",
    ecs: "2014-11-13",
    eks: "2017-11-01",
    elb: "2012-06-01",
    elbv2: "2015-12-01",
    iam: "2010-05-08",
    kms: "2014-11-01",
    lambda: "2015-03-31",
    rds: "2014-10-31",
    resourcegroupstaggingapi: "2017-01-26",
    route53: "2013-04-01",
    route53domains: "2014-05-15",
    s3: "2006-03-01",
    ssm: "2014-11-06",
  };

  const { AWSAccessKeyId, AWSSecretKey } = process.env;

  AWS.config.update({
    ...(AWSAccessKeyId && {
      accessKeyId: AWSAccessKeyId,
    }),
    ...(AWSSecretKey && {
      secretAccessKey: AWSSecretKey,
    }),
  });

  let accountId;
  let zone;
  let zones;
  let region;

  const getRegionDefault = () => region || AWS.config.region;

  const configDefault = {
    stage,
    zone: () => zone,
    accountId: () => accountId,
    region: getRegionDefault(),
  };

  const makeConfig = () => mergeConfig({ configDefault, config, configs });

  const getRegion = (config) => config.region || getRegionDefault();
  const getZone = ({ zones, config }) => config.zone() || first(zones);

  const start = async () => {
    accountId = await fetchAccountId();
    const merged = makeConfig();
    region = getRegion(merged);
    zones = await getAvailabilityZonesName({ region });
    assert(zones, `no zones for region ${region}`);
    zone = getZone({ zones, config: merged });
    assert(zone);
    validateConfig({
      region,
      zone,
      zones,
    });
  };

  const info = () => ({
    accountId,
    zone,
    config: omit(["accountId", "zone"])(makeConfig()),
  });

  const localeCompare = ({ key, a, b }) => a[key].localeCompare(b[key]);

  const sortTags = () =>
    callProp("sort", (a, b) =>
      pipe([
        switchCase([
          () => a.Key,
          () => localeCompare({ a, b, key: "Key" }),
          () => a.TagKey,
          () => localeCompare({ a, b, key: "TagKey" }),
          () => true,
        ]),
      ])()
    );

  const assignTags = switchCase([
    pipe([get("Tags"), Array.isArray]),
    assign({ Tags: pipe([get("Tags"), sortTags()]) }),
    pipe([get("tags"), Array.isArray]),
    assign({ tags: pipe([get("tags"), sortTags()]) }),
    identity,
  ]);

  const getListHof = ({ getList, spec }) =>
    tryCatch(
      pipe([
        tap(() => {
          logger.debug(`getList ${spec.groupType}`);
        }),
        getList,
        tap((items) => {
          Array.isArray(items);
        }),
        map(assignTags),
        (items) => ({ items, total: size(items) }),
        tap(({ total, items }) => {
          logger.debug(`getList ${spec.groupType} total: ${total}`);
        }),
      ]),
      (error) =>
        pipe([
          tap((params) => {
            logger.error(`getList #${spec.groupType}, ${error}`);
          }),
          () => {
            throw error;
          },
        ])()
    );

  return CoreProvider({
    ...other,
    type: "aws",
    name,
    programOptions,
    makeConfig,
    fnSpecs,
    start,
    info,
    generateCode,
    getListHof,
  });
};
