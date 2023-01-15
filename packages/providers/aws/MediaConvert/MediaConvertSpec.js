const assert = require("assert");
const { tap, pipe, map, get } = require("rubico");
const { defaultsDeep } = require("rubico/x");

const { compareAws } = require("../AwsCommon");
const { createAwsService } = require("../AwsService");

const GROUP = "MediaConvert";

const tagsKey = "Tags";
const compare = compareAws({ tagsKey, key: "Key" });

const { MediaConvertQueue } = require("./MediaConvertQueue");

module.exports = pipe([
  () => [
    //
    MediaConvertQueue({}),
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
