const { isOurMinionS3 } = require("./AwsS3Tags");
const { AwsS3Bucket } = require("./AwsS3Bucket");

module.exports = [
  {
    type: "S3Bucket",
    Client: ({ spec, config }) => AwsS3Bucket({ spec, config }),
    isOurMinion: isOurMinionS3,
  },
];
