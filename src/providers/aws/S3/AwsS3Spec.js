const assert = require("assert");
const { omit } = require("rubico");

const { md5FileBase64 } = require("../../Common");
const logger = require("../../../logger")({ prefix: "AwsS3Spec" });
const { tos } = require("../../../tos");

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
    compare: async ({ target, live }) => {
      logger.debug(`compare object`);
      const md5hash = live.Metadata?.md5hash;
      if (!md5hash) {
        logger.debug(`no md5 hash for ${tos(live)}`);
        return [];
      }
      if (target.source) {
        const md5 = await md5FileBase64(target.source);

        if (md5hash !== md5) {
          return [{ type: "DIFF", target, live: omit(["Body"])(live) }];
        }
      }

      return [];
    },
    isOurMinion: isOurMinionS3Object,
  },
];
