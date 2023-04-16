const assert = require("assert");
const { tap, pipe, map, get } = require("rubico");
const { defaultsDeep } = require("rubico/x");
const { createAwsService } = require("../AwsService");

const { compareAws } = require("../AwsCommon");

const GROUP = "DeviceFarm";

const tagsKey = "Tags";
const compare = compareAws({ tagsKey, key: "Key" });

const { DeviceFarmProject } = require("./DeviceFarmProject");

module.exports = pipe([
  () => [
    //
    DeviceFarmProject({}),
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
