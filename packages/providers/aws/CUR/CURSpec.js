const assert = require("assert");
const { tap, pipe, map, get } = require("rubico");
const { defaultsDeep } = require("rubico/x");

const { compareAws } = require("../AwsCommon");

const GROUP = "CUR";

// No tags
const tagsKey = "Tags";
const compare = compareAws({ tagsKey, key: "Key" });

const { CURReportDefinition } = require("./CURReportDefinition");

module.exports = pipe([
  () => [
    {
      type: "ReportDefinition",
      Client: CURReportDefinition,
      propertiesDefault: {},
      omitProperties: [],
      inferName: get("properties.ReportName"),
      dependencies: {
        s3Bucket: {
          type: "Bucket",
          group: "S3",
          dependencyId: () =>
            pipe([
              tap((params) => {
                assert(true);
              }),
              get("S3Bucket"),
            ]),
        },
      },
    },
  ],
  map(
    defaultsDeep({
      group: GROUP,
      compare: compare({}),
      tagsKey,
    })
  ),
]);
