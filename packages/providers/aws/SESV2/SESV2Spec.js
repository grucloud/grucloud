const assert = require("assert");
const { tap, pipe, map, get } = require("rubico");
const { defaultsDeep } = require("rubico/x");

const { compareAws } = require("../AwsCommon");
const { createAwsService } = require("../AwsService");

const GROUP = "SESV2";

const tagsKey = "Tags";
const compare = compareAws({ tagsKey, key: "Key" });

const { SESV2ConfigurationSet } = require("./SESV2ConfigurationSet");
const { SESV2DedicatedIpPool } = require("./SESV2DedicatedIpPool");

const { SESV2EmailIdentity } = require("./SESV2EmailIdentity");

module.exports = pipe([
  () => [
    SESV2ConfigurationSet({}),
    SESV2DedicatedIpPool({}),
    SESV2EmailIdentity({}),
  ],
  map(
    pipe([
      createAwsService,
      defaultsDeep({
        group: GROUP,
        compare: compare({}),
        tagsKey,
      }),
    ])
  ),
]);
