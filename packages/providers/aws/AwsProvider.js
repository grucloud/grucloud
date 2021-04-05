process.env.AWS_SDK_LOAD_CONFIG = "true";
const AWS = require("aws-sdk");
const assert = require("assert");
const { map, pipe, get, filter, not, reduce, tap } = require("rubico");
const { first, pluck, defaultsDeep, isFunction, isEmpty } = require("rubico/x");
const { tos } = require("@grucloud/core/tos");

const logger = require("@grucloud/core/logger")({ prefix: "AwsProvider" });
const CoreProvider = require("@grucloud/core/CoreProvider");
const { Ec2New } = require("./AwsCommon");
const AwsS3 = require("./S3");
const AwsEC2 = require("./EC2");
const AwsIam = require("./IAM");
const AwsRoute53 = require("./Route53");
const AwsRoute53Domain = require("./Route53Domain");
const AwsCertificateManager = require("./ACM");
const AwsCloudFront = require("./CloudFront");
const AwsEKS = require("./EKS");
const AwsELB = require("./ELB");

const defaultRegion = "eu-west-2";

const fnSpecs = () => [
  ...AwsS3,
  ...AwsEC2,
  ...AwsIam,
  ...AwsRoute53,
  ...AwsRoute53Domain,
  ...AwsCertificateManager,
  ...AwsCloudFront,
  ...AwsEKS,
  ...AwsELB,
];
const getAvailabilityZonesName = pipe([
  ({ region }) => Ec2New({ region }),
  (ec2) => ec2().describeAvailabilityZones(),
  get("AvailabilityZones"),
  pluck("ZoneName"),
]);

const validateConfig = ({ region, zone, zones }) => {
  logger.debug(`region: ${region}, zone: ${zone}, zones: ${zones}`);
  if (zone && !zones.includes(zone)) {
    const message = `The configued zone '${zone}' is not part of region ${region}, available zones for this region: ${zones}`;
    throw { code: 400, type: "configuration", message };
  }
};

//TODO wrap for retry
const fetchAccountId = pipe([
  () => new AWS.STS(),
  (sts) => sts.getCallerIdentity({}).promise(),
  get("Account"),
]);

exports.AwsProvider = ({ name = "aws", config, configs = [], ...other }) => {
  assert(config ? isFunction(config) : true, "config must be a function");

  AWS.config.apiVersions = {
    ec2: "2016-11-15",
    resourcegroupstaggingapi: "2017-01-26",
    s3: "2006-03-01",
    iam: "2010-05-08",
    route53: "2013-04-01",
    route53domains: "2014-05-15",
    acm: "2015-12-08",
    cloudfront: "2020-05-31",
    eks: "2017-11-01",
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

  const getRegionDefault = () => region || AWS.config.region || defaultRegion;

  const getRegion = (config) => config.region || getRegionDefault();
  const getZone = ({ zones, config }) => config.zone() || first(zones);
  const start = async () => {
    accountId = await fetchAccountId();
    const merged = mergeConfig({ config, configs });
    region = getRegion(merged);
    zones = await getAvailabilityZonesName({ region });
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
    region,
    zone,
  });

  const mergeConfig = ({ config, configs }) =>
    pipe([
      () => [...configs, config],
      filter((x) => x),
      reduce((acc, config) => defaultsDeep(config(acc))(acc), {
        zone: () => zone,
        accountId: () => accountId,
      }),
      defaultsDeep({
        region: getRegionDefault(),
      }),
      tap((merged) => {
        logger.info(`mergeConfig : ${tos(merged)}`);
      }),
    ])();

  return CoreProvider({
    ...other,
    type: "aws",
    name,
    get config() {
      return mergeConfig({ config, configs });
    },
    fnSpecs,
    start,
    info,
  });
};
