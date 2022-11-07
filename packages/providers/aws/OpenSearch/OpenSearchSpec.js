const assert = require("assert");
const { tap, pipe, map, get } = require("rubico");
const { defaultsDeep } = require("rubico/x");

const { compareAws } = require("../AwsCommon");

const GROUP = "OpenSearch";

const tagsKey = "tags";
const compare = compareAws({ tagsKey, key: "key" });

//const { ReportDefinition } = require("./CURReportDefinition");

module.exports = pipe([
  () => [
    // {
    //   type: "ReportDefinition",
    //   Client: CURReportDefinition,
    //   propertiesDefault: {},
    //   omitProperties: [],
    //   inferName: get("properties.ReportName"),
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
