const { pipe, assign, map } = require("rubico");
const { AwsS3Bucket } = require("./AwsS3Bucket");
const { AwsS3Object, compareS3Object } = require("./AwsS3Object");
const { isOurMinion } = require("../AwsCommon");

const GROUP = "s3";

module.exports = () =>
  map(assign({ group: () => GROUP }))([
    {
      type: "S3Bucket",
      Client: AwsS3Bucket,
      isOurMinion,
    },
    {
      type: "S3Object",
      dependsOn: ["S3Bucket"],
      Client: AwsS3Object,
      compare: compareS3Object,
      isOurMinion,
    },
  ]);
