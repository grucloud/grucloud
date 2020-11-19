const assert = require("assert");
const { omit } = require("rubico");

const { md5FileBase64 } = require("../../Common");
const logger = require("../../../logger")({ prefix: "AwsS3Spec" });
const { tos } = require("../../../tos");

const { AwsS3Bucket } = require("./AwsS3Bucket");
const {
  AwsS3Object,
  isOurMinionS3Object,
  compareS3Object,
} = require("./AwsS3Object");
const { isOurMinion } = require("../AwsCommon");

module.exports = [
  {
    type: "S3Bucket",
    Client: ({ spec, config }) => AwsS3Bucket({ spec, config }),
    isOurMinion,
  },
  {
    type: "S3Object",
    dependsOn: ["S3Bucket"],
    Client: ({ spec, config }) => AwsS3Object({ spec, config }),
    compare: compareS3Object,
    isOurMinion: isOurMinionS3Object,
  },
];
