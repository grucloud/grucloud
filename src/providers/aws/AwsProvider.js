process.env.AWS_SDK_LOAD_CONFIG = "true";
const AWS = require("aws-sdk");
const assert = require("assert");
const { map, pipe, get } = require("rubico");
const { first, pluck, defaultsDeep, isFunction } = require("rubico/x");

const logger = require("../../logger")({ prefix: "AwsProvider" });
const { tos } = require("../../tos");
const CoreProvider = require("../CoreProvider");
const { Ec2New } = require("./AwsCommon");
const AwsS3 = require("./S3");
const AwsEC2 = require("./EC2");
const AwsIam = require("./IAM");
const AwsRoute53 = require("./Route53");
const AwsRoute53Domain = require("./Route53Domain");
const AwsCertificateManager = require("./ACM");
const AwsCloudFront = require("./CloudFront");
const AwsEKS = require("./EKS");

const fnSpecs = () => [
  ...AwsS3,
  ...AwsEC2,
  ...AwsIam,
  ...AwsRoute53,
  ...AwsRoute53Domain,
  ...AwsCertificateManager,
  ...AwsCloudFront,
  ...AwsEKS,
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

exports.AwsProvider = ({ name = "aws", config, ...other }) => {
  assert(isFunction(config), "config must be a function");

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
  const getRegion = (config) => config.region || AWS.config.region;
  const getZone = ({ zones }) => config.zone || first(zones);
  const region = getRegion(config);
  const start = async () => {
    accountId = await fetchAccountId();
    zones = await getAvailabilityZonesName({ region });
    zone = getZone({ zones });
    validateConfig({
      region,
      zone: config.zone,
      zones,
    });
  };

  const info = () => ({
    accountId,
    region,
    zone,
  });

  return CoreProvider({
    ...other,
    type: "aws",
    name,
    get config() {
      return pipe([
        () => ({
          accountId: () => accountId,
          region: getRegion(config),
          zone: () => zone,
        }),
        (configProvider) =>
          defaultsDeep(configProvider)(config(configProvider)),
      ])();
    },
    fnSpecs,
    start,
    info,
  });
};
