process.env.AWS_SDK_LOAD_CONFIG = "true";
const AWS = require("aws-sdk");
const assert = require("assert");
const { map, pipe, get } = require("rubico");

const logger = require("../../logger")({ prefix: "AwsProvider" });
const { tos } = require("../../tos");
const CoreProvider = require("../CoreProvider");

const AwsS3 = require("./S3");
const AwsEC2 = require("./EC2");
const AwsIam = require("./IAM");
const AwsRoute53 = require("./Route53");
const AwsRoute53Domain = require("./Route53Domain");
const AwsCertificateManager = require("./ACM");
const AwsCloudFront = require("./CloudFront");

const fnSpecs = () => [
  ...AwsS3,
  ...AwsEC2,
  ...AwsIam,
  ...AwsRoute53,
  ...AwsRoute53Domain,
  ...AwsCertificateManager,
  ...AwsCloudFront,
];

const validateConfig = async ({ region, zone }) => {
  logger.debug(`region: ${region}, zone: ${zone}`);
  const ec2 = new AWS.EC2();

  const { AvailabilityZones } = await ec2.describeAvailabilityZones().promise();
  const zones = map((x) => x.ZoneName)(AvailabilityZones);
  if (zone && !zones.includes(zone)) {
    const message = `The configued zone '${zone}' is not part of region ${region}, available zones for this region: ${zones}`;
    throw { code: 400, type: "configuration", message };
  }
};

const fetchAccountId = pipe([
  () => new AWS.STS(),
  (sts) => sts.getCallerIdentity({}).promise(),
  get("Account"),
]);

exports.AwsProvider = ({ name = "aws", config }) => {
  assert(config);

  AWS.config.apiVersions = {
    ec2: "2016-11-15",
    resourcegroupstaggingapi: "2017-01-26",
    s3: "2006-03-01",
    iam: "2010-05-08",
    route53: "2013-04-01",
    route53domains: "2014-05-15",
    acm: "2015-12-08",
    cloudfront: "2020-05-31",
  };

  const { AWSAccessKeyId, AWSSecretKey } = process.env;

  AWS.config.update({
    ...(config.region && { region: config.region }),
    ...(AWSAccessKeyId && {
      accessKeyId: AWSAccessKeyId,
    }),
    ...(AWSSecretKey && {
      secretAccessKey: AWSSecretKey,
    }),
  });

  let accountId;
  const start = async () => {
    accountId = await fetchAccountId();

    await validateConfig({ region: AWS.config.region, zone: config.zone });
  };
  const info = () => ({
    accountId,
    region: AWS.config.region,
  });
  return CoreProvider({
    type: "aws",
    name,
    config: {
      ...config,
      accountId: () => accountId,
      region: AWS.config.region,
    },
    fnSpecs,
    start,
    info,
  });
};
