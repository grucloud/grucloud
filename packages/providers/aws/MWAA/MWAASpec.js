const assert = require("assert");
const { tap, pipe, map, get } = require("rubico");
const { defaultsDeep } = require("rubico/x");
const { createAwsService } = require("../AwsService");

const { compareAws } = require("../AwsCommon");

const GROUP = "MWAA";
const tagsKey = "Tags";
const compare = compareAws({ tagsKey, key: "Key" });

//const { MWAAEnvironment } = require("./MWAAEnvironment");

module.exports = pipe([
  () => [
    //
    //MWAAEnvironment({}),
  ],
  map(
    pipe([
      createAwsService,
      defaultsDeep({
        group: GROUP,
        compare: compare({}),
      }),
    ])
  ),
]);
