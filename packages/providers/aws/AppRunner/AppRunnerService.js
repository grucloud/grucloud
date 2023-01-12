const assert = require("assert");
const {
  eq,
  pipe,
  tap,
  get,
  pick,
  omit,
  assign,
  filter,
  switchCase,
  map,
} = require("rubico");
const {
  defaultsDeep,
  when,
  unless,
  isEmpty,
  callProp,
  first,
  find,
  values,
} = require("rubico/x");
const { getField } = require("@grucloud/core/ProviderCommon");
const { getByNameCore } = require("@grucloud/core/Common");
const { buildTags, replaceAccountAndRegion } = require("../AwsCommon");
const { Tagger, assignTags } = require("./AppRunnerCommon");
const { replaceWithName } = require("@grucloud/core/Common");

const EnvironmentResourcesType = [
  {
    arnPrefix: "arn:aws:secretsmanager",
    groupType: "SecretsManager::Secret",
  },
  {
    arnPrefix: "arn:aws:ssm",
    groupType: "SSM::Parameter",
  },
];

const buildArn = () => get("ServiceArn");
const pickId = pipe([pick(["ServiceArn"])]);

const decorate = ({ endpoint }) =>
  pipe([assignTags({ endpoint, buildArn: buildArn() })]);

const replaceRuntimeEnvironment =
  ({ lives, providerConfig }) =>
  (arn) =>
    pipe([
      tap((params) => {
        assert(arn);
      }),
      () => EnvironmentResourcesType,
      find(pipe([({ arnPrefix }) => arn.startsWith(arnPrefix)])),
      switchCase([
        isEmpty,
        () => arn,
        ({ groupType }) =>
          pipe([
            () => arn,
            replaceWithName({
              groupType,
              path: "id",
              providerConfig,
              lives,
            }),
          ])(),
      ]),
    ])();

exports.AppRunnerService = ({ compare }) => ({
  type: "Service",
  package: "apprunner",
  client: "AppRunner",
  ignoreErrorCodes: ["ResourceNotFoundException"],
  findName: () => pipe([get("ServiceName")]),
  findId: () => pipe([get("ServiceArn")]),
  inferName: () => get("ServiceName"),
  dependencies: {
    accessRole: {
      type: "Role",
      group: "IAM",
      dependencyId: ({ lives, config }) =>
        get("SourceConfiguration.AuthenticationConfiguration.AccessRoleArn"),
    },
    instanceRole: {
      type: "Role",
      group: "IAM",
      dependencyId: ({ lives, config }) =>
        get("InstanceConfiguration.InstanceRoleArn"),
    },
    autoScalingConfiguration: {
      type: "AutoScalingConfiguration",
      group: "AppRunner",
      excludeDefaultDependencies: true,
      dependencyId: ({ lives, config }) =>
        get("AutoScalingConfigurationSummary.AutoScalingConfigurationArn"),
    },
    connection: {
      type: "Connection",
      group: "AppRunner",
      dependencyId: ({ lives, config }) =>
        get("SourceConfiguration.AuthenticationConfiguration.ConnectionArn"),
    },
    kmsKey: {
      type: "Key",
      group: "KMS",
      dependencyId: ({ lives, config }) =>
        get("EncryptionConfiguration.KmsKey"),
    },
    observabilityConfiguration: {
      type: "ObservabilityConfiguration",
      group: "AppRunner",
      excludeDefaultDependencies: true,
      dependencyId: ({ lives, config }) =>
        get("ObservabilityConfiguration.ObservabilityConfigurationArn"),
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
    secrets: {
      type: "Secret",
      group: "SecretsManager",
      list: true,
      dependencyIds: () =>
        pipe([
          get(
            "SourceConfiguration.CodeRepository.CodeConfiguration.CodeConfigurationValues.RuntimeEnvironmentResourcesType"
          ),
          values,
          filter(callProp("startsWith", "arn:aws:secretsmanager")),
        ]),
    },
    ssmParameters: {
      type: "Parameter",
      group: "SSM",
      list: true,
      dependencyIds: () =>
        pipe([
          get(
            "SourceConfiguration.CodeRepository.CodeConfiguration.CodeConfigurationValues.RuntimeEnvironmentResourcesType"
          ),
          values,
          filter(callProp("startsWith", "arn:aws:ssm")),
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
  omitProperties: [
    "ServiceId",
    "ServiceArn",
    "ServiceUrl",
    "CreatedAt",
    "UpdatedAt",
    "Status",
    "NetworkConfiguration.EgressConfiguration.VpcConnectorArn",
    "EncryptionConfiguration.KmsKey",
    "AutoScalingConfigurationSummary.AutoScalingConfigurationArn",
    "InstanceConfiguration.InstanceRoleArn",
  ],
  filterLive: ({ lives, providerConfig }) =>
    pipe([
      pick([
        "AutoScalingConfigurationSummary",
        "ServiceName",
        "NetworkConfiguration",
        "SourceConfiguration",
        "InstanceConfiguration",
        "ObservabilityConfiguration",
        "HealthCheckConfiguration",
      ]),
      omit(["SourceConfiguration.AuthenticationConfiguration"]),
      when(
        get("ObservabilityConfiguration.ObservabilityConfigurationArn"),
        assign({
          ObservabilityConfiguration: pipe([
            get("ObservabilityConfiguration"),
            assign({
              ObservabilityConfigurationArn: pipe([
                get("ObservabilityConfigurationArn"),
                replaceAccountAndRegion({ lives, providerConfig }),
              ]),
            }),
          ]),
        })
      ),
      assign({
        SourceConfiguration: pipe([
          get("SourceConfiguration"),
          when(
            get("CodeRepository"),
            assign({
              CodeRepository: pipe([
                get("CodeRepository"),
                assign({
                  CodeConfiguration: pipe([
                    get("CodeConfiguration"),
                    assign({
                      CodeConfigurationValues: pipe([
                        get("CodeConfigurationValues"),
                        when(
                          get("RuntimeEnvironmentResourcesType"),
                          assign({
                            RuntimeEnvironmentResourcesType: pipe([
                              get("RuntimeEnvironmentResourcesType"),
                              map(
                                replaceRuntimeEnvironment({
                                  lives,
                                  providerConfig,
                                })
                              ),
                            ]),
                          })
                        ),
                      ]),
                    }),
                  ]),
                }),
              ]),
            })
          ),
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
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/AppRunner.html#describeService-property
  getById: {
    method: "describeService",
    pickId,
    getField: "Service",
    decorate,
  },
  getList: {
    method: "listServices",
    getParam: "ServiceSummaryList",
    decorate: ({ getById, endpoint }) => pipe([getById]),
  },
  create: {
    method: "createService",
    pickCreated: ({ payload }) => pipe([get("Service")]),
    shouldRetryOnExceptionMessages: ["Error in assuming access"],
    isInstanceUp: pipe([eq(get("Status"), "RUNNING")]),
    isInstanceError: pipe([eq(get("Status"), "CREATE_FAILED")]),
  },
  update: {
    method: "updateService",
    filterParams: ({ payload, live }) =>
      pipe([() => payload, defaultsDeep({ ServiceArn: live.ServiceArn })])(),
  },
  destroy: {
    method: "deleteService",
    pickId,
    isInstanceDown: eq(get("Status"), "DELETED"),
  },
  getByName: getByNameCore,
  tagger: ({ config }) =>
    Tagger({
      buildArn: buildArn({ config }),
    }),
  configDefault: ({
    name,
    namespace,
    properties: { Tags, ...otherProps },
    dependencies,
    config,
  }) =>
    pipe([
      () => otherProps,
      defaultsDeep({
        ServiceName: name,
        Tags: buildTags({ name, namespace, config, UserTags: Tags }),
      }),
      when(
        () => dependencies.vpcConnector,
        defaultsDeep({
          NetworkConfiguration: {
            EgressConfiguration: {
              VpcConnectorArn: getField(
                dependencies.vpcConnector,
                "VpcConnectorArn"
              ),
            },
          },
        })
      ),
      when(
        () => dependencies.autoScalingConfiguration,
        defaultsDeep({
          AutoScalingConfigurationSummary: {
            AutoScalingConfigurationName: getField(
              dependencies.autoScalingConfiguration,
              "AutoScalingConfigurationArn"
            ),
          },
        })
      ),
      when(
        () => dependencies.kmsKey,
        defaultsDeep({
          EncryptionConfiguration: {
            KmsKey: getField(dependencies.kmsKey, "Arn"),
          },
        })
      ),
      when(
        () => dependencies.accessRole,
        defaultsDeep({
          SourceConfiguration: {
            AuthenticationConfiguration: {
              AccessRoleArn: getField(dependencies.accessRole, "Arn"),
            },
          },
        })
      ),
      when(
        () => dependencies.instanceRole,
        defaultsDeep({
          InstanceConfiguration: {
            InstanceRoleArn: getField(dependencies.instanceRole, "Arn"),
          },
        })
      ),
      when(
        () => dependencies.connection,
        defaultsDeep({
          SourceConfiguration: {
            AuthenticationConfiguration: {
              ConnectionArn: getField(dependencies.connection, "ConnectionArn"),
            },
          },
        })
      ),
    ])(),
});
