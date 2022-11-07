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

const { AppRunnerService } = require("./AppRunnerService");
const { AppRunnerConnection } = require("./AppRunnerConnection");
const { AppRunnerVpcConnector } = require("./AppRunnerVpcConnector");
const {
  AppRunnerVpcIngressConnection,
} = require("./AppRunnerVpcIngressConnection");

const GROUP = "AppRunner";

const compareAppRunner = compareAws({});

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/AppRunner.html

module.exports = pipe([
  () => [
    {
      type: "Connection",
      Client: AppRunnerConnection,
      inferName: get("properties.ConnectionName"),
      omitProperties: ["ConnectionArn", "Status", "CreatedAt"],
      filterLive: () => pipe([pick(["ConnectionName", "ProviderType"])]),
    },
    {
      type: "Service",
      Client: AppRunnerService,
      inferName: get("properties.ServiceName"),
      dependencies: {
        accessRole: {
          type: "Role",
          group: "IAM",
          dependencyId: ({ lives, config }) =>
            get(
              "SourceConfiguration.AuthenticationConfiguration.AccessRoleArn"
            ),
        },
        connection: {
          type: "Connection",
          group: "AppRunner",
          dependencyId: ({ lives, config }) =>
            get(
              "SourceConfiguration.AuthenticationConfiguration.ConnectionArn"
            ),
        },
        kmsKey: {
          type: "Key",
          group: "KMS",
          dependencyId: ({ lives, config }) =>
            get("EncryptionConfiguration.KmsKey"),
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
        vpcConnector: {
          type: "VpcConnector",
          group: "AppRunner",
          dependencyId: ({ lives, config }) =>
            get("NetworkConfiguration.EgressConfiguration.VpcConnectorArn"),
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
        "NetworkConfiguration.EgressConfiguration.VpcConnectorArn",
        "EncryptionConfiguration.KmsKey",
        "AutoScalingConfigurationSummary",
      ],
      filterLive: ({ lives, providerConfig }) =>
        pipe([
          pick([
            "ServiceName",
            "NetworkConfiguration",
            "SourceConfiguration",
            "InstanceConfiguration",
            "ObservabilityConfiguration",
            "HealthCheckConfiguration",
          ]),
          omit(["SourceConfiguration.AuthenticationConfiguration"]),
          assign({
            SourceConfiguration: pipe([
              get("SourceConfiguration"),
              when(
                get("ImageRepository"),
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
                })
              ),
            ]),
          }),
        ]),
    },
    {
      type: "VpcConnector",
      Client: AppRunnerVpcConnector,
      inferName: get("properties.VpcConnectorName"),
      omitProperties: [
        "VpcConnectorArn",
        "Status",
        "CreatedAt",
        "DeletedAt",
        "Subnets",
        "SecurityGroups",
      ],
      dependencies: {
        subnets: {
          type: "Subnet",
          group: "EC2",
          list: true,
          dependencyIds: ({ lives, config }) => get("Subnets"),
        },
        securityGroups: {
          type: "SecurityGroup",
          group: "EC2",
          list: true,
          dependencyIds: ({ lives, config }) => get("SecurityGroups"),
        },
      },
    },
    {
      type: "VpcIngressConnection",
      Client: AppRunnerVpcIngressConnection,
      inferName: get("properties.VpcIngressConnectionName"),
      omitProperties: [
        "VpcIngressConnectionArn",
        "Status",
        "CreatedAt",
        "AccountId",
        "DomainName",
        "IngressVpcConfiguration",
        "ServiceArn",
      ],
      dependencies: {
        service: {
          type: "Service",
          group: "AppRunner",
          dependencyId: ({ lives, config }) => get("ServiceArn"),
        },
        vpcEndpoint: {
          type: "VpcEndpoint",
          group: "EC2",
          dependencyId: ({ lives, config }) =>
            get("IngressVpcConfiguration.VpcEndpointId"),
        },
      },
    },
  ],
  map(defaultsDeep({ group: GROUP, compare: compareAppRunner() })),
]);
