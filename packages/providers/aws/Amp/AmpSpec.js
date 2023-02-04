const assert = require("assert");
const { tap, pipe, map, get } = require("rubico");
const { defaultsDeep } = require("rubico/x");

const { createAwsService } = require("../AwsService");
const { compareAws } = require("../AwsCommon");

const GROUP = "Amp";
const tagsKey = "tags";
const compare = compareAws({ tagsKey, key: "key" });

//const { AmpWorkspace } = require("./AmpWorkspace");

module.exports = pipe([
  () => [
    //
    //AmpWorkspace({}),
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
