const assert = require("assert");
const { pipe, assign, map, omit, tap, pick, get } = require("rubico");
const { when } = require("rubico/x");

const { compareAws, isOurMinion } = require("../AwsCommon");
const { replaceWithName } = require("@grucloud/core/Common");

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
      compare: compareAws({
        filterAll: pipe([omit(["ConnectionArn", "Status", "CreatedAt"])]),
      }),
      filterLive: () => pipe([pick(["ProviderType"])]),
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
      compare: compareAws({
        filterAll: pipe([
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
      }),
      filterLive: ({ lives }) =>
        pipe([
          pick([
            "SourceConfiguration",
            "InstanceConfiguration",
            "HealthCheckConfiguration",
          ]),
          omit(["SourceConfiguration.AuthenticationConfiguration"]),
          assign({
            SourceConfiguration: pipe([
              get("SourceConfiguration"),
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
