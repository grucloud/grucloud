const { isOurMinionFactory } = require("../AwsCommon");
const { KmsKey, compareKmsKey } = require("./KmsKey");

module.exports = [
  {
    type: "KmsKey",
    Client: KmsKey,
    isOurMinion: isOurMinionFactory({ key: "TagKey", value: "TagValue" }),
    compare: compareKmsKey,
  },
];
