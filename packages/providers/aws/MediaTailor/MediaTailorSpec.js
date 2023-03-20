const assert = require("assert");
const { tap, pipe, map, get } = require("rubico");
const { defaultsDeep } = require("rubico/x");

const { compareAws } = require("../AwsCommon");
const { createAwsService } = require("../AwsService");

const GROUP = "MediaConvert";

const tagsKey = "Tags";
const compare = compareAws({ tagsKey, key: "Key" });

//const { MediaTailorConfiguration } = require("./MediaTailorConfiguration");

module.exports = pipe([
  () => [
    //
    //MediaTailorConfiguration({}),
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
