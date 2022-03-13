const assert = require("assert");
const { assign, map, pipe, tap, omit, pick } = require("rubico");
const defaultsDeep = require("rubico/x/defaultsDeep");
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
