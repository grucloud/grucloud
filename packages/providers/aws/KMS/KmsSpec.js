const assert = require("assert");
const { pipe, map } = require("rubico");
const { defaultsDeep } = require("rubico/x");

const { compareAws } = require("../AwsCommon");
const { createAwsService } = require("../AwsService");

const { KmsKey } = require("./KmsKey");
const { KmsReplicaKey } = require("./KmsReplicaKey");

const GROUP = "KMS";

const tagsKey = "Tags";

const compare = compareAws({ tagsKey, key: "Key" });

module.exports = pipe([
  () => [
    //
    KmsKey({ compare }),
    KmsReplicaKey({ compare }),
  ],
  map(
    pipe([
      createAwsService,
      defaultsDeep({ group: GROUP, tagsKey, compare: compare({}) }),
    ])
  ),
]);
