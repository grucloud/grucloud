const assert = require("assert");
const { pipe, assign, map, omit, tap, pick } = require("rubico");
const { isOurMinion } = require("../AwsCommon");
const { compare } = require("@grucloud/core/Common");

const { AppRunnerService } = require("./Service");
const { AppRunnerConnection } = require("./Connection");

const GROUP = "AppRunner";

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/AppRunner.html

module.exports = () =>
  map(assign({ group: () => GROUP }))([
    {
      type: "Connection",
      Client: AppRunnerConnection,
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
          pick(["ProviderType"]),
        ]),
    },
    {
      type: "Service",
      Client: AppRunnerService,
      dependsOn: ["AppRunner::Connection"],
      dependencies: { connection: { type: "Connection", group: "AppRunner" } },
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
          pick([
            "SourceConfiguration",
            "InstanceConfiguration",
            "HealthCheckConfiguration",
          ]),
          omit(["SourceConfiguration.AuthenticationConfiguration"]),
        ]),
    },
  ]);
