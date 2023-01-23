const assert = require("assert");
const { tap, pipe, map, get } = require("rubico");
const { defaultsDeep } = require("rubico/x");

const { createAwsService } = require("../AwsService");

const { compareAws } = require("../AwsCommon");

const GROUP = "Athena";

const tagsKey = "Tags";
const compare = compareAws({ tagsKey, key: "Key" });

const { AthenaDataCatalog } = require("./AthenaDataCatalog");
const { AthenaWorkGroup } = require("./AthenaWorkGroup");

module.exports = pipe([
  () => [
    //
    AthenaDataCatalog({ compare }),
    AthenaWorkGroup({ compare }),
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
