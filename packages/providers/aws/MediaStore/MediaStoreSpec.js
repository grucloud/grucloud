const assert = require("assert");
const { tap, pipe, map, get } = require("rubico");
const { defaultsDeep } = require("rubico/x");

const { compareAws } = require("../AwsCommon");
const { createAwsService } = require("../AwsService");

const GROUP = "MediaStore";

const tagsKey = "Tags";
const compare = compareAws({ tagsKey, key: "Key" });

const { MediaStoreContainer } = require("./MediaStoreContainer");

module.exports = pipe([
  () => [
    //
    MediaStoreContainer({}),
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
