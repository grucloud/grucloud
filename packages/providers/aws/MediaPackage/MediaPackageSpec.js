const assert = require("assert");
const { tap, pipe, map, get } = require("rubico");
const { defaultsDeep } = require("rubico/x");

const { compareAws } = require("../AwsCommon");
const { createAwsService } = require("../AwsService");

const GROUP = "MediaPackage";

const tagsKey = "Tags";
const compare = compareAws({ tagsKey, key: "Key" });

const { MediaPackageChannel } = require("./MediaPackageChannel");
const { MediaPackageOriginEndpoint } = require("./MediaPackageOriginEndpoint");

module.exports = pipe([
  () => [
    //
    MediaPackageChannel({}),
    MediaPackageOriginEndpoint({}),
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
