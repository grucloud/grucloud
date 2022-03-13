const assert = require("assert");
const { pipe, map, omit, tap, not, get, pick } = require("rubico");
const { defaultsDeep } = require("rubico/x");

const { compareAws } = require("../AwsCommon");
const { isOurMinionFactory } = require("../AwsCommon");
const { KmsKey } = require("./KmsKey");

const GROUP = "KMS";
const compareEKS = compareAws({ key: "TagKey" });

module.exports = pipe([
  () => [
    {
      type: "Key",
      Client: KmsKey,
      isOurMinion: isOurMinionFactory({ key: "TagKey", value: "TagValue" }),
      compare: compareEKS({
        filterTarget: () =>
          pipe([
            omit(["KeyState"]),
            defaultsDeep({
              Enabled: true,
              KeyManager: "CUSTOMER",
              KeySpec: "SYMMETRIC_DEFAULT",
              CustomerMasterKeySpec: "SYMMETRIC_DEFAULT",
              MultiRegion: false,
              Origin: "AWS_KMS",
              Description: "",
              KeyUsage: "ENCRYPT_DECRYPT",
              EncryptionAlgorithms: ["SYMMETRIC_DEFAULT"],
            }),
          ]),
        filterLive: () =>
          pipe([
            omit([
              "AWSAccountId",
              "KeyId",
              "Arn",
              "Alias",
              "CreationDate",
              "DeletionDate",
              "KeyState",
            ]),
          ]),
      }),
      filterLive: () => pick([""]),
      ignoreResource: ({ lives }) => pipe([not(get("live.Enabled"))]),
    },
  ],
  map(defaultsDeep({ group: GROUP })),
]);
