const assert = require("assert");
const { pipe, map, assign, tap, not, get, pick } = require("rubico");
const { defaultsDeep } = require("rubico/x");

const { compareAws, assignPolicyAccountAndRegion } = require("../AwsCommon");
const { isOurMinionFactory } = require("../AwsCommon");
const { KmsKey } = require("./KmsKey");

const GROUP = "KMS";
const compareKMS = compareAws({ key: "TagKey" });

module.exports = pipe([
  () => [
    {
      type: "Key",
      Client: KmsKey,
      isOurMinion: isOurMinionFactory({ key: "TagKey", value: "TagValue" }),
      omitProperties: [
        "AWSAccountId",
        "KeyId",
        "Arn",
        "Alias",
        "CreationDate",
        "DeletionDate",
        "KeyState",
        "CustomerMasterKeySpec",
      ],
      propertiesDefault: {
        Enabled: true,
        KeyManager: "CUSTOMER",
        KeySpec: "SYMMETRIC_DEFAULT",
        // You cannot specify KeySpec and CustomerMasterKeySpec in the same request. CustomerMasterKeySpec is deprecated
        //CustomerMasterKeySpec: "SYMMETRIC_DEFAULT",
        MultiRegion: false,
        Origin: "AWS_KMS",
        Description: "",
        KeyUsage: "ENCRYPT_DECRYPT",
        EncryptionAlgorithms: ["SYMMETRIC_DEFAULT"],
      },
      compare: compareKMS({}),
      filterLive: ({ providerConfig, lives }) =>
        pipe([
          //TODO no pick
          pick(["Enabled", "Description", "Policy"]),
          assign({
            Policy: pipe([
              get("Policy"),
              assignPolicyAccountAndRegion({ providerConfig, lives }),
            ]),
          }),
        ]),
      ignoreResource: ({ lives }) => pipe([not(get("live.Enabled"))]),
    },
  ],
  map(defaultsDeep({ group: GROUP })),
]);
