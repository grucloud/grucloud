process.env.AWS_SDK_LOAD_CONFIG = 1;
const AWS = require("aws-sdk");
const assert = require("assert");
const { omit, pipe, get, filter, not, reduce, tap } = require("rubico");
const { first, pluck, defaultsDeep, isFunction, isEmpty } = require("rubico/x");
const { tos } = require("@grucloud/core/tos");

const logger = require("@grucloud/core/logger")({ prefix: "AwsProvider" });
const CoreProvider = require("@grucloud/core/CoreProvider");
const { Ec2New } = require("./AwsCommon");

const AutoScaling = require("./Autoscaling");
const AwsCertificateManager = require("./ACM");
const AwsCloudFront = require("./CloudFront");
const AwsEC2 = require("./EC2");
const AwsEKS = require("./EKS");
const AwsELBv2 = require("./ELBv2");
const AwsIam = require("./IAM");
const AwsKMS = require("./KMS");
const AwsLambda = require("./Lambda");

const AwsRDS = require("./RDS");
const AwsRoute53 = require("./Route53");
const AwsRoute53Domain = require("./Route53Domain");
const AwsS3 = require("./S3");

const fnSpecs = () => [
  ...AutoScaling(),
  ...AwsCertificateManager(),
  ...AwsCloudFront(),
  ...AwsEC2(),
  ...AwsEKS(),
  ...AwsELBv2(),
  ...AwsIam(),
  ...AwsKMS(),
  ...AwsLambda(),
  ...AwsRDS(),
  ...AwsRoute53(),
  ...AwsRoute53Domain(),
  ...AwsS3(),
];

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
  configs = [],
  ...other
}) => {
  assert(config ? isFunction(config) : true, "config must be a function");

  AWS.config.apiVersions = {
    acm: "2015-12-08",
    autoscaling: "2011-01-01",
    cloudfront: "2020-05-31",
    ec2: "2016-11-15",
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

  const getRegion = (config) => config.region || getRegionDefault();
  const getZone = ({ zones, config }) => config.zone() || first(zones);
  const start = async () => {
    accountId = await fetchAccountId();
    const merged = mergeConfig({ config, configs });
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

  const mergeConfig = ({ config, configs }) =>
    pipe([
      () => [...configs, config],
      filter((x) => x),
      reduce((acc, config) => defaultsDeep(acc)(config(acc)), {
        stage,
        zone: () => zone,
        accountId: () => accountId,
        region: getRegionDefault(),
      }),
      tap((merged) => {
        logger.info(`mergeConfig : ${tos(merged)}`);
      }),
    ])();

  const mergedConfig = mergeConfig({ config, configs });

  const info = () => ({
    accountId,
    zone,
    config: omit(["accountId", "zone"])(mergedConfig),
  });

  return CoreProvider({
    ...other,
    type: "aws",
    name,
    get config() {
      return mergedConfig;
    },
    fnSpecs,
    start,
    info,
  });
};
