const { pipe, assign, map } = require("rubico");
const { isOurMinionFactory } = require("../AwsCommon");
const { KmsKey, compareKmsKey } = require("./KmsKey");

const GROUP = "KMS";

module.exports = () =>
  map(assign({ group: () => GROUP }))([
    {
      type: "Key",
      Client: KmsKey,
      isOurMinion: isOurMinionFactory({ key: "TagKey", value: "TagValue" }),
      compare: compareKmsKey,
    },
  ]);
