const { pipe, assign, map, omit, tap } = require("rubico");
const { isOurMinion } = require("../AwsCommon");
const { compare } = require("@grucloud/core/Common");

const { AppRunnerService } = require("./Service");

const GROUP = "AppRunner";

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/AppRunner.html

module.exports = () =>
  map(assign({ group: () => GROUP }))([
    {
      type: "Service",
      Client: AppRunnerService,
      isOurMinion,
      compare: compare({
        filterTarget: pipe([
          tap((params) => {
            assert(true);
          }),
          omit(["Tags"]),
        ]),
        filterLive: pipe([
          tap((params) => {
            assert(true);
          }),
        ]),
      }),
      filterLive: () =>
        pipe([
          tap((params) => {
            assert(true);
          }),
        ]),
    },
  ]);
