const assert = require("assert");
const { pipe, assign, map, omit, tap, pick, get, eq } = require("rubico");
const {
  when,
  defaultsDeep,
  unless,
  isEmpty,
  callProp,
  first,
  find,
} = require("rubico/x");

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
      inferName: get("properties.ConnectionName"),
      isOurMinion,
      omitProperties: ["ConnectionArn", "Status", "CreatedAt"],
      filterLive: () => pipe([pick(["ConnectionName", "ProviderType"])]),
    },
    {
      type: "Service",
      Client: AppRunnerService,
      inferName: get("properties.ServiceName"),
      dependencies: {
        connection: {
          type: "Connection",
          group: "AppRunner",
          dependencyId: ({ lives, config }) =>
            get(
              "SourceConfiguration.AuthenticationConfiguration.ConnectionArn"
            ),
        },
        accessRole: {
          type: "Role",
          group: "IAM",
          dependencyId: ({ lives, config }) =>
            get(
              "SourceConfiguration.AuthenticationConfiguration.AccessRoleArn"
            ),
        },
        repository: {
          type: "Repository",
          group: "ECR",
          dependencyId: ({ lives, config }) =>
            pipe([
              get("SourceConfiguration.ImageRepository.ImageIdentifier"),
              unless(
                isEmpty,
                pipe([
                  callProp("split", ":"),
                  first,
                  (repositoryUri) =>
                    pipe([
                      () =>
                        lives.getByType({
                          type: "Repository",
                          group: "ECR",
                          providerName: config.providerName,
                        }),
                      find(eq(get("live.repositoryUri"), repositoryUri)),
                    ])(),
                  get("id"),
                ])
              ),
            ]),
        },
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
            "ServiceName",
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
                      ImageIdentifier: pipe([
                        get("ImageIdentifier"),
                        replaceWithName({
                          groupType: "ECR::Repository",
                          pathLive: "live.repositoryUri",
                          path: "live.repositoryUri",
                          providerConfig,
                          lives,
                        }),
                      ]),
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
