const assert = require("assert");
const { tap, pipe, map, get, omit } = require("rubico");
const { defaultsDeep } = require("rubico/x");

const { compareAws } = require("../AwsCommon");

const GROUP = "MQ";
const tagsKey = "Tags";
const compare = compareAws({ tagsKey, key: "Key" });

module.exports = pipe([
  () => [],
  map(
    defaultsDeep({
      group: GROUP,
      compare: compare({}),
      tagsKey,
    })
  ),
]);
