const assert = require("assert");
const { pipe, tap, get, eq, assign, map } = require("rubico");
const { defaultsDeep, when, append, identity, pluck } = require("rubico/x");
const { buildTagsObject } = require("@grucloud/core/Common");
const { getByNameCore } = require("@grucloud/core/Common");
const { replaceWithName } = require("@grucloud/core/Common");

const { getField } = require("@grucloud/core/ProviderCommon");

const { Tagger, assignTags } = require("./AppConfigCommon");

const pickId = pipe([
  ({ Id, ApplicationId }) => ({ EnvironmentId: Id, ApplicationId }),
]);

const buildArn = () =>
  pipe([
    get("Arn"),
    tap((arn) => {
      assert(arn);
    }),
  ]);

const assignArn = ({ config }) =>
  pipe([
    assign({
      Arn: pipe([
        ({ Id, ApplicationId }) =>
          `arn:${config.partition}:appconfig:${
            config.region
          }:${config.accountId()}:application/${ApplicationId}/environment/${Id}`,
      ]),
    }),
  ]);

const decorate = ({ endpoint, config }) =>
  pipe([
    assignArn({ config }),
    assignTags({ buildArn: buildArn(config), endpoint }),
  ]);

exports.AppConfigEnvironment = () => ({
  type: "Environment",
  package: "appconfig",
  client: "AppConfig",
  ignoreErrorCodes: ["ResourceNotFoundException"],
  inferName:
    ({ dependenciesSpec }) =>
    ({ Name }) =>
      `${dependenciesSpec.application}::${Name}`,
  findName:
    ({ lives, config }) =>
    (live) =>
      pipe([
        () => live,
        get("ApplicationId"),
        lives.getById({
          type: "Application",
          group: "AppConfig",
          providerName: config.providerName,
        }),
        get("name", live.ApplicationId),
        append(`::${live.Name}`),
      ])(),
  findId: () => pipe([get("Id")]),
  propertiesDefault: { Monitors: [] },
  omitProperties: ["Id", "ApplicationId", "State", "Arn"],

  dependencies: {
    application: {
      type: "Application",
      group: "AppConfig",
      parent: true,
      dependencyId: ({ lives, config }) => get("ApplicationId"),
    },
    alarmRoles: {
      type: "Role",
      group: "IAM",
      list: true,
      dependencyIds: ({ lives, config }) =>
        pipe([get("Monitors"), pluck("AlarmRoleArn")]),
    },
    alarms: {
      type: "MetricAlarm",
      group: "CloudWatch",
      list: true,
      dependencyIds: ({ lives, config }) =>
        pipe([get("Monitors"), pluck("AlarmArn")]),
    },
  },
  filterLive: ({ providerConfig, lives }) =>
    pipe([
      assign({
        Monitors: pipe([
          get("Monitors"),
          map(
            assign({
              AlarmArn: pipe([
                get("AlarmArn"),
                replaceWithName({
                  groupType: "CloudWatch::MetricAlarm",
                  path: "id",
                  providerConfig,
                  lives,
                }),
              ]),
              AlarmRoleArn: pipe([
                get("AlarmRoleArn"),
                replaceWithName({
                  groupType: "IAM::Role",
                  path: "id",
                  providerConfig,
                  lives,
                }),
              ]),
            })
          ),
        ]),
      }),
    ]),
  getByName: getByNameCore,
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/AppConfig.html#listEnvironments-property
  getList: ({ client, endpoint, getById, config }) =>
    pipe([
      () =>
        client.getListWithParent({
          parent: { type: "Application", group: "AppConfig" },
          pickKey: pipe([({ Id }) => ({ ApplicationId: Id })]),
          method: "listEnvironments",
          getParam: "Items",
          config,
          decorate,
        }),
    ])(),
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/AppConfig.html#getEnvironment-property
  getById: {
    method: "getEnvironment",
    pickId,
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/AppConfig.html#createEnvironment-property
  create: {
    method: "createEnvironment",
    pickCreated: ({ payload }) => pipe([identity]),
    isInstanceUp: eq(get("State"), "ReadyForDeployment"),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/AppConfig.html#updateEnvironment-property
  update: {
    method: "updateEnvironment",
    filterParams: ({ payload, live }) =>
      pipe([() => payload, defaultsDeep({ EnvironmentId: live.Id })])(),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/AppConfig.html#deleteEnvironment-property
  destroy: {
    method: "deleteEnvironment",
    pickId,
  },
  tagger: ({ config }) =>
    Tagger({
      buildArn: buildArn({ config }),
    }),
  configDefault: ({
    name,
    namespace,
    properties: { Tags, ...otherProps },
    dependencies: { application, iamRole },
    config,
  }) =>
    pipe([
      () => otherProps,
      defaultsDeep({
        ApplicationId: getField(application, "Id"),
        Tags: buildTagsObject({ name, config, namespace, UserTags: Tags }),
      }),
      when(
        () => iamRole,
        assign({ RetrievalRoleArn: getField(iamRole, "Arn") })
      ),
    ])(),
});
