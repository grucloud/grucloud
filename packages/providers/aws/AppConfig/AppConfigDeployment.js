const assert = require("assert");
const { pipe, tap, get, pick, eq } = require("rubico");
const {
  defaultsDeep,
  identity,
  callProp,
  unless,
  append,
  isEmpty,
} = require("rubico/x");
const { buildTagsObject, getByNameCore } = require("@grucloud/core/Common");
const { getField } = require("@grucloud/core/ProviderCommon");

const { createAwsResource } = require("../AwsClient");

const { tagResource, untagResource, assignTags } = require("./AppConfigCommon");

const pickId = pipe([
  pick(["DeploymentNumber", "ApplicationId", "EnvironmentId"]),
]);

const buildArn =
  ({ region, accountId }) =>
  ({ ApplicationId, EnvironmentId, DeploymentNumber }) =>
    `arn:aws:appconfig:${region}:${accountId()}:application/${ApplicationId}/environment/${EnvironmentId}/deployment/${DeploymentNumber}`;

const decorate = ({ endpoint, config }) =>
  pipe([assignTags({ buildArn: buildArn(config), endpoint })]);

const model = ({ config }) => ({
  package: "appconfig",
  client: "AppConfig",
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
});

exports.AppConfigDeployment = ({ spec, config }) =>
  createAwsResource({
    model: model({ config }),
    spec,
    config,
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
    findId: () => pipe([buildArn(config)]),
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
    tagResource: tagResource({
      buildArn: buildArn(config),
    }),
    untagResource: untagResource({
      buildArn: buildArn(config),
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
