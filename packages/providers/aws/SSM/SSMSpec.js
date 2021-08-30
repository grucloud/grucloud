const assert = require("assert");
const { assign, map, pipe, tap, omit } = require("rubico");
const { isOurMinion } = require("../AwsCommon");
const { compare } = require("@grucloud/core/Common");

const { SSMParameter } = require("./SSMParameter");

const GROUP = "ssm";

module.exports = () =>
  map(assign({ group: () => GROUP }))([
    {
      type: "Parameter",
      Client: SSMParameter,
      isOurMinion,
      compare: compare({
        filterAll: omit(["Tags"]),
        filterTarget: pipe([
          tap((params) => {
            assert(true);
          }),
          omit(["Description", "Tier"]),
        ]),
        filterLive: pipe([
          tap((params) => {
            assert(true);
          }),
        ]),
      }),
    },
  ]);
