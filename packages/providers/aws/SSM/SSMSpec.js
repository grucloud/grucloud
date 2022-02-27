const assert = require("assert");
const { assign, map, pipe, tap, omit, pick } = require("rubico");
const { isOurMinion } = require("../AwsCommon");
const { compareAws } = require("../AwsCommon");

const { SSMParameter } = require("./SSMParameter");

const GROUP = "SSM";

module.exports = () =>
  map(assign({ group: () => GROUP }))([
    {
      type: "Parameter",
      Client: SSMParameter,
      isOurMinion,
      compare: compareAws({
        filterAll: omit(["Tags"]),
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
  ]);
