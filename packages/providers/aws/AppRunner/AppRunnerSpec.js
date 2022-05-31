const assert = require("assert");
const { pipe, assign, map, omit, tap, pick, get } = require("rubico");
const { when, defaultsDeep } = require("rubico/x");

const { compareAws, isOurMinion } = require("../AwsCommon");
const { replaceWithName } = require("@grucloud/core/Common");

const { AppRunnerService } = require("./Service");
const { AppRunnerConnection } = require("./Connection");

const GROUP = "AppRunner";

const compareAppRunner = compareAws({});

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/AppRunner.html

module.exports = pipe([
  () => [
    {
      type: "Connection",
      Client: AppRunnerConnection,
      isOurMinion,
      omitProperties: ["ConnectionArn", "Status", "CreatedAt"],
      filterLive: () => pipe([pick(["ProviderType"])]),
    },
    {
      type: "Service",
      Client: AppRunnerService,
      dependencies: {
        connection: { type: "Connection", group: "AppRunner" },
        accessRole: { type: "Role", group: "IAM" },
        repository: { type: "Repository", group: "ECR" },
      },
      propertiesDefault: {
        NetworkConfiguration: {
          EgressConfiguration: { EgressType: "DEFAULT" },
        },
      },
      isOurMinion,
      omitProperties: [
        "ServiceId",
        "ServiceArn",
        "ServiceUrl",
        "CreatedAt",
        "UpdatedAt",
        "Status",
        //TODO
        "AutoScalingConfigurationSummary",
      ],
      filterLive: ({ lives, providerConfig }) =>
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
                          () => ({ Id: ImageIdentifier }),
                          replaceWithName({
                            groupType: "ECR::Repository",
                            pathLive: "live.repositoryUri",
                            path: "live.repositoryUri",
                            providerConfig,
                            lives,
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
  ],
  map(defaultsDeep({ group: GROUP, compare: compareAppRunner() })),
]);
