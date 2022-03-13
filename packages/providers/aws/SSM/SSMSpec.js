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
      compare: compareSSM({
        filterTarget: () =>
          pipe([
            tap((params) => {
              assert(true);
            }),
            omit(["Description", "Tier"]),
          ]),
        filterLive: () =>
          pipe([
            tap((params) => {
              assert(true);
            }),
            omit(["Version", "LastModifiedDate", "ARN"]),
          ]),
      }),
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
  map(defaultsDeep({ group: GROUP, isOurMinion })),
]);
