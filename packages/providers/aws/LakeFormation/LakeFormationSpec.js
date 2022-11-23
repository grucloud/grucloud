const assert = require("assert");
const { tap, pipe, map, get } = require("rubico");
const { defaultsDeep } = require("rubico/x");

const { compareAws } = require("../AwsCommon");

const GROUP = "LakeFormation";

const tagsKey = "Tags";
const compare = compareAws({ tagsKey, key: "Key" });

//const { ReportDefinition } = require("./CURReportDefinition");

module.exports = pipe([
  () => [
    // {
    //   type: "ReportDefinition",
    //   Client: CURReportDefinition,
    //   propertiesDefault: {},
    //   omitProperties: [],
    //   inferName: () => get("ReportName"),
    // },
  ],
  map(
    defaultsDeep({
      group: GROUP,
      compare: compare({}),
      tagsKey,
    })
  ),
]);
