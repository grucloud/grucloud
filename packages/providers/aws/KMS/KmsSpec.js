const assert = require("assert");
const { pipe, assign, map, omit, tap } = require("rubico");
const { defaultsDeep } = require("rubico/x");

const { compare } = require("@grucloud/core/Common");
const { isOurMinionFactory } = require("../AwsCommon");
const { KmsKey } = require("./KmsKey");

const GROUP = "KMS";

module.exports = () =>
  map(assign({ group: () => GROUP }))([
    {
      type: "Key",
      Client: KmsKey,
      isOurMinion: isOurMinionFactory({ key: "TagKey", value: "TagValue" }),
      compare: compare({
        filterTarget: pipe([
          omit(["Tags"]),
          defaultsDeep({
            Enabled: true,
            KeyState: "Enabled",
            KeyManager: "CUSTOMER",
            CustomerMasterKeySpec: "SYMMETRIC_DEFAULT",
            MultiRegion: false,
            Origin: "AWS_KMS",
            Description: "",
            KeyUsage: "ENCRYPT_DECRYPT",
            EncryptionAlgorithms: ["SYMMETRIC_DEFAULT"],
          }),
        ]),
        filterLive: pipe([
          omit([
            "AWSAccountId",
            "KeyId",
            "Arn",
            "Alias",
            "CreationDate",
            "Tags",
          ]),
        ]),
      }),
    },
  ]);
