const assert = require("assert");
const { tap, pipe, map, get } = require("rubico");
const { defaultsDeep } = require("rubico/x");
const { createAwsService } = require("../AwsService");

const { compareAws } = require("../AwsCommon");

const GROUP = "CUR";

// No tags
const tagsKey = "Tags";
const compare = compareAws({ tagsKey, key: "Key" });

const { CURReportDefinition } = require("./CURReportDefinition");

module.exports = pipe([
  () => [
    //
    CURReportDefinition({}),
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
