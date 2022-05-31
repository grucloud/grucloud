const assert = require("assert");
const { pipe, assign, map, omit, tap, pick, get } = require("rubico");
const { when, defaultsDeep } = require("rubico/x");

const { compareAws } = require("../AwsCommon");

//const { AppConfigApplication } = require("./AppConfigApplication");

const GROUP = "AppConfig";

const compareAppConfig = compareAws({});

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/AppConfig.html

module.exports = pipe([
  () => [
    // {
    //   type: "Application",
    //   Client: AppConfigApplication,
    //   isOurMinion,
    //   omitProperties: [""],
    //   filterLive: () =>
    //     pipe([
    //       tap((params) => {
    //         assert(true);
    //       }),
    //     ]),
    // },
  ],
  map(defaultsDeep({ group: GROUP, compare: compareAppConfig() })),
]);
