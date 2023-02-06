const assert = require("assert");
const { pipe, map, tap } = require("rubico");
const { defaultsDeep } = require("rubico/x");

const { compareAws } = require("../AwsCommon");
const { createAwsService } = require("../AwsService");

const { SignerSigningProfile } = require("./SignerSigningProfile");

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Signer.html
const GROUP = "Signer";
const tagsKey = "tags";
const compare = compareAws({ tagsKey, key: "key" });

module.exports = pipe([
  () => [
    //
    SignerSigningProfile({ compare }),
  ],
  map(
    pipe([
      createAwsService,
      defaultsDeep({
        group: GROUP,
        tagsKey,
        compare: compare({}),
      }),
    ])
  ),
]);
