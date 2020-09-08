const AWS = require("aws-sdk");
const assert = require("assert");
const { map } = require("rubico");

const logger = require("../../logger")({ prefix: "AwsProvider" });
const { checkConfig } = require("../../Utils");
const { tos } = require("../../tos");
const CoreProvider = require("../CoreProvider");

const AwsS3 = require("./S3");
const AwsEC2 = require("./EC2");

const fnSpecs = () => [
  //
  ...AwsS3,
  ...AwsEC2,
];

const validateConfig = async ({ region, zone }) => {
  logger.debug(`region: ${region}, zone: ${zone}`);
  const ec2 = new AWS.EC2();

  const { AvailabilityZones } = await ec2.describeAvailabilityZones().promise();
  const zones = map((x) => x.ZoneName)(AvailabilityZones);
  if (!zones.includes(zone)) {
    const message = `The configued zone '${zone}' is not part of region ${region}, available zones for this region: ${zones}`;
    throw { code: 400, type: "configuration", message };
  }
};

const fetchAccountId = async () => {
  var sts = new AWS.STS();
  const { Account } = await sts.getCallerIdentity({}).promise();
  return Account;
};

exports.AwsProvider = async ({ name = "aws", config }) => {
  assert(config);

  const mandatoryConfigKeys = ["region", "zone"];
  checkConfig(config, mandatoryConfigKeys);

  AWS.config.apiVersions = {
    ec2: "2016-11-15",
    resourcegroupstaggingapi: "2017-01-26",
    s3: "2006-03-01",
  };
  AWS.config.update({
    region: config.region,
    accessKeyId: process.env.AWSAccessKeyId,
    secretAccessKey: process.env.AWSSecretKey,
  });

  await validateConfig(config);

  const accountId = await fetchAccountId();

  return CoreProvider({
    type: "aws",
    name,
    mandatoryEnvs: ["AWSAccessKeyId", "AWSSecretKey"],
    config: { ...config, accountId },
    fnSpecs,
  });
};
