const assert = require("assert");
const { assign, map, pipe, tap, get, pick } = require("rubico");
const { defaultsDeep, callProp } = require("rubico/x");
const { isOurMinion } = require("../AwsCommon");
const { compareAws } = require("../AwsCommon");

const { SSMParameter } = require("./SSMParameter");

const GROUP = "SSM";
const compareSSM = compareAws({});

module.exports = pipe([
  () => [
    {
      type: "Parameter",
      Client: SSMParameter,
      ignoreResource: () =>
        pipe([get("name"), callProp("startsWith", "/cdk-bootstrap/")]),
      omitProperties: [
        "Version",
        "LastModifiedDate",
        "ARN",
        "Description", //TODO
        "Tier",
      ],
      filterLive: () =>
        pick([
          "Type",
          "Value",
          "Description",
          "Tier",
          //"Policies",
          "DataType",
        ]),
    },
  ],
  map(defaultsDeep({ group: GROUP, isOurMinion, compare: compareSSM({}) })),
]);
