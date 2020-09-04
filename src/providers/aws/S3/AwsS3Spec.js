const { AwsS3Bucket, isOurMinionS3Bucket } = require("./AwsS3Bucket");
const { AwsS3Object, isOurMinionS3Object } = require("./AwsS3Object");

module.exports = [
  {
    type: "S3Bucket",
    Client: ({ spec, config }) => AwsS3Bucket({ spec, config }),
    isOurMinion: isOurMinionS3Bucket,
  },
  {
    type: "S3Object",
    dependsOn: ["S3Bucket"],
    Client: ({ spec, config }) => AwsS3Object({ spec, config }),
    isOurMinion: isOurMinionS3Object,
  },
];
