const assert = require("assert");
const { pipe, map, tap } = require("rubico");
const { defaultsDeep } = require("rubico/x");

const { compareAws } = require("../AwsCommon");
const { createAwsService } = require("../AwsService");

const { SecretsManagerSecret } = require("./SecretsManagerSecret");
const {
  SecretsManagerSecretRotation,
} = require("./SecretsManagerSecretRotation");

const {
  SecretsManagerResourcePolicy,
} = require("./SecretsManagerResourcePolicy");

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/SecretsManager.html
const GROUP = "SecretsManager";

const compare = compareAws({});

module.exports = pipe([
  () => [
    SecretsManagerSecret({ compare }),
    SecretsManagerSecretRotation({}),
    SecretsManagerResourcePolicy({ compare }),
  ],
  map(
    pipe([
      createAwsService,
      defaultsDeep({
        group: GROUP,
        compare: compare({}),
      }),
    ])
  ),
]);
