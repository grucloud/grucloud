const assert = require("assert");
const { pipe, assign, map, omit, tap, pick, get } = require("rubico");
const { when } = require("rubico/x");

const { isOurMinion } = require("../AwsCommon");
const { compare, replaceWithName } = require("@grucloud/core/Common");

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
        filterAll: pipe([
          tap((params) => {
            assert(true);
          }),
          omit(["ConnectionArn", "Status", "CreatedAt"]),
        ]),
        filterTarget: () =>
          pipe([
            tap((params) => {
              assert(true);
            }),
            omit(["Tags"]),
          ]),
        filterLive: () =>
          pipe([
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
      dependsOn: ["AppRunner::Connection", "IAM::Role", "ECR::Repository"],
      dependencies: {
        connection: { type: "Connection", group: "AppRunner" },
        accessRole: { type: "Role", group: "IAM" },
        repository: { type: "Repository", group: "ECR" },
      },
      isOurMinion,
      compare: compare({
        filterAll: pipe([
          tap((params) => {
            assert(true);
          }),
          omit([
            "ServiceId",
            "ServiceArn",
            "ServiceUrl",
            "CreatedAt",
            "UpdatedAt",
            "Status",
            //TODO
            "AutoScalingConfigurationSummary",
          ]),
        ]),
        filterTarget: () =>
          pipe([
            tap((params) => {
              assert(true);
            }),
            omit(["Tags"]),
          ]),
        filterLive: () =>
          pipe([
            tap((params) => {
              assert(true);
            }),
          ]),
      }),
      filterLive: ({ lives }) =>
        pipe([
          tap((params) => {
            assert(lives);
          }),
          pick([
            "SourceConfiguration",
            "InstanceConfiguration",
            "HealthCheckConfiguration",
          ]),
          omit(["SourceConfiguration.AuthenticationConfiguration"]),
          assign({
            SourceConfiguration: pipe([
              get("SourceConfiguration"),
              tap((params) => {
                assert(true);
              }),
              assign({
                ImageRepository: pipe([
                  get("ImageRepository"),
                  when(
                    get("ImageIdentifier"),
                    assign({
                      ImageIdentifier: ({ ImageIdentifier }) =>
                        pipe([
                          () => ({ Id: ImageIdentifier, lives }),
                          replaceWithName({
                            groupType: "ECR::Repository",
                            pathLive: "live.repositoryUri",
                            path: "live.repositoryUri",
                          }),
                        ])(),
                    })
                  ),
                ]),
              }),
            ]),
          }),
        ]),
    },
  ]);
