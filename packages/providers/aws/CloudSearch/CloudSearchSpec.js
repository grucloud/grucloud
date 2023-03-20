const assert = require("assert");
const { tap, pipe, map, get } = require("rubico");
const { defaultsDeep } = require("rubico/x");
const { createAwsService } = require("../AwsService");

const { compareAws } = require("../AwsCommon");

// CloudSearch seems to be in maintenance mode

const GROUP = "CloudSearch";
const tagsKey = "Tags";
const compare = compareAws({ tagsKey, key: "Key" });

//const { CloudSearchDomain} = require("./CloudSearchDomain");

module.exports = pipe([
  () => [
    //
    //CloudSearchDomain({}),
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
