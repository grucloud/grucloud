const assert = require("assert");
const { pipe, tap, get, pick, eq } = require("rubico");
const {
  defaultsDeep,
  identity,
  callProp,
  unless,
  append,
  isEmpty,
  keys,
  includes,
} = require("rubico/x");
const { buildTagsObject, getByNameCore } = require("@grucloud/core/Common");
const { getField } = require("@grucloud/core/ProviderCommon");

const { Tagger, assignTags } = require("./AppConfigCommon");

const managedByOther = () => pipe([get("Tags"), keys, includes("DeployedBy")]);

const pickId = pipe([
  pick(["DeploymentNumber", "ApplicationId", "EnvironmentId"]),
]);

const buildArn =
  ({ config: { region, accountId } }) =>
  ({ ApplicationId, EnvironmentId, DeploymentNumber }) =>
    `arn:${
      config.partition
    }:appconfig:${region}:${accountId()}:application/${ApplicationId}/environment/${EnvironmentId}/deployment/${DeploymentNumber}`;

const decorate = ({ endpoint, config }) =>
  pipe([
    //
    assignTags({ buildArn: buildArn({ config }), endpoint }),
  ]);

exports.AppConfigDeployment = () => ({
  type: "Deployment",
  package: "appconfig",
  client: "AppConfig",
  omitProperties: [
    "CompletedAt",
    "DeploymentNumber",
    "ApplicationId",
    "EventLog",
    "EnvironmentId",
    "DeploymentStrategyId",
    "State",
    "StartedAt",
    "ConfigurationProfileId",
    "ConfigurationName",
    "DeploymentDurationInMinutes",
    "FinalBakeTimeInMinutes",
    "GrowthFactor",
    "GrowthType",
    "PercentageComplete",
    "AppliedExtensions",
    "ConfigurationLocationUri",
    "ConfigurationVersion",
    "Latest",
  ],
  inferName:
    ({ dependenciesSpec }) =>
    () =>
      `${dependenciesSpec.environment}`,
  dependencies: {
    configurationProfile: {
      type: "ConfigurationProfile",
      group: "AppConfig",
      dependencyId: ({ lives, config }) => get("ConfigurationProfileId"),
    },
    deploymentStrategy: {
      type: "DeploymentStrategy",
      group: "AppConfig",
      dependencyId: ({ lives, config }) => get("DeploymentStrategyId"),
    },
    environment: {
      type: "Environment",
      group: "AppConfig",
      parent: true,
      dependencyId: ({ lives, config }) => get("EnvironmentId"),
    },
    hostedConfigurationVersion: {
      type: "HostedConfigurationVersion",
      group: "AppConfig",
      dependencyId: ({ lives, config }) =>
        pipe([
          ({ ApplicationId, ConfigurationProfileId }) =>
            `${ApplicationId}::${ConfigurationProfileId}`,
        ]),
    },
  },
  managedByOther,
  cannotBeDeleted: managedByOther,
  findName:
    ({ lives, config }) =>
    (live) =>
      pipe([
        () => live,
        get("EnvironmentId"),
        tap((id) => {
          assert(id);
        }),
        lives.getById({
          type: "Environment",
          group: "AppConfig",
          providerName: config.providerName,
        }),
        get("name", live.EnvironmentId),
        tap((params) => {
          assert(true);
        }),
        unless(() => live.Latest, append(`::${live.DeploymentNumber}`)),
      ])(),
  findId: ({ config }) => pipe([buildArn({ config })]),
  getByName: getByNameCore,
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/AppConfig.html#listDeployments-property
  getList: ({ client, endpoint, getById, config }) =>
    pipe([
      () =>
        client.getListWithParent({
          parent: { type: "Environment", group: "AppConfig" },
          pickKey: pipe([
            tap((params) => {
              assert(true);
            }),
            ({ Id, ApplicationId }) => ({
              EnvironmentId: Id,
              ApplicationId,
            }),
          ]),
          method: "listDeployments",
          getParam: "Items",
          config,
          transformListPost: () =>
            pipe([
              callProp(
                "sort",
                (a, b) => b.DeploymentNumber - a.DeploymentNumber
              ),
              unless(isEmpty, ([latest, ...others]) => [
                { ...latest, Latest: true },
                ...others,
              ]),
              callProp("reverse"),
            ]),
          decorate: ({ parent }) =>
            pipe([
              defaultsDeep({
                EnvironmentId: parent.Id,
                ApplicationId: parent.ApplicationId,
              }),
              getById({}),
            ]),
        }),
    ])(),
  ignoreErrorCodes: ["ResourceNotFoundException", "BadRequestException"],
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/AppConfig.html#getDeployment-property
  getById: {
    method: "getDeployment",
    pickId,
    decorate,
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/AppConfig.html#startDeployment-property
  create: {
    method: "startDeployment",
    pickCreated: ({ payload }) => pipe([identity]),
  },
  //TODO
  // // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/AppConfig.html#startDeployment-property
  // update: {
  //   method: "startDeployment",
  //   filterParams: ({ payload, live }) =>
  //     pipe([() => payload, defaultsDeep({ DeploymentId: live.Id })])(),
  // },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/AppConfig.html#stopDeployment-property
  destroy: {
    method: "stopDeployment",
    pickId,
    isInstanceDown: eq(get("State"), "ROLLED_BACK"),
  },
  tagger: ({ config }) =>
    Tagger({
      buildArn: buildArn({ config }),
    }),
  configDefault: ({
    name,
    namespace,
    properties: { Tags, ...otherProps },
    dependencies: {
      configurationProfile,
      deploymentStrategy,
      environment,
      hostedConfigurationVersion,
    },
    config,
  }) =>
    pipe([
      () => otherProps,
      defaultsDeep({
        ApplicationId: getField(configurationProfile, "ApplicationId"),
        ConfigurationProfileId: getField(configurationProfile, "Id"),
        ConfigurationVersion: getField(
          hostedConfigurationVersion,
          "VersionNumber"
        ).toString(),
        DeploymentStrategyId: getField(deploymentStrategy, "Id"),
        EnvironmentId: getField(environment, "Id"),
        Tags: buildTagsObject({ name, config, namespace, userTags: Tags }),
      }),
    ])(),
});
