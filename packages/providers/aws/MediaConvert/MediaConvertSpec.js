const assert = require("assert");
const { tap, pipe, map, get } = require("rubico");
const { defaultsDeep } = require("rubico/x");

const { compareAws } = require("../AwsCommon");
const { createAwsService } = require("../AwsService");

const GROUP = "MediaConvert";

const tagsKey = "Tags";
const compare = compareAws({ tagsKey, key: "Key" });

const { MediaConvertJobTemplate } = require("./MediaConvertJobTemplate");
const { MediaConvertPreset } = require("./MediaConvertPreset");
const { MediaConvertQueue } = require("./MediaConvertQueue");

module.exports = pipe([
  () => [
    //
    MediaConvertJobTemplate({}),
    MediaConvertPreset({}),
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
