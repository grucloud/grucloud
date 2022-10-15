const assert = require("assert");
const { tap, pipe, map, get, omit } = require("rubico");
const { defaultsDeep } = require("rubico/x");

const { compareAws } = require("../AwsCommon");

const GROUP = "Batch";
const tagsKey = "tags";
const compare = compareAws({ tagsKey, key: "key" });

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
