const assert = require("assert");
const { pipe, tap, get, assign, map, pick } = require("rubico");
const {
  defaultsDeep,
  when,
  append,
  identity,
  keys,
  includes,
} = require("rubico/x");

const { omitIfEmpty } = require("@grucloud/core/Common");
const { buildTagsObject } = require("@grucloud/core/Common");
const { getByNameCore } = require("@grucloud/core/Common");

const { getField } = require("@grucloud/core/ProviderCommon");

const { Tagger, assignTags } = require("./AppConfigCommon");

const managedByOther = () => pipe([get("Tags"), keys, includes("Owner")]);

const pickId = pipe([
  ({ Id, ApplicationId }) => ({ ConfigurationProfileId: Id, ApplicationId }),
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
          }:${config.accountId()}:application/${ApplicationId}/configurationprofile/${Id}`,
      ]),
    }),
  ]);

const decorate = ({ endpoint, config }) =>
  pipe([
    assignArn({ config }),
    assignTags({ buildArn: buildArn(config), endpoint }),
  ]);

exports.AppConfigConfigurationProfile = () => ({
  type: "ConfigurationProfile",
  package: "appconfig",
  client: "AppConfig",
  ignoreErrorCodes: ["ResourceNotFoundException"],
  omitProperties: ["Id", "ApplicationId", "Arn"],
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
  dependencies: {
    application: {
      type: "Application",
      group: "AppConfig",
      parent: true,
      dependencyId: ({ lives, config }) => get("ApplicationId"),
    },
    // TODO  Add Secrets manager
  },
  filterLive: () => pipe([omitIfEmpty(["ValidatorTypes"])]),
  managedByOther,
  cannotBeDeleted: managedByOther,
  getByName: getByNameCore,
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/AppConfig.html#getConfigurationProfile-property
  getById: {
    method: "getConfigurationProfile",
    pickId,
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/AppConfig.html#listConfigurationProfiles-property
  getList: ({ client, endpoint, getById, config }) =>
    pipe([
      () =>
        client.getListWithParent({
          parent: { type: "Application", group: "AppConfig" },
          pickKey: pipe([({ Id }) => ({ ApplicationId: Id })]),
          method: "listConfigurationProfiles",
          getParam: "Items",
          config,
          decorate,
        }),
    ])(),
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/AppConfig.html#createConfigurationProfile-property
  create: {
    method: "createConfigurationProfile",
    pickCreated: ({ payload }) => pipe([identity]),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/AppConfig.html#updateConfigurationProfile-property
  update: {
    method: "updateConfigurationProfile",
    filterParams: ({ payload, live }) =>
      pipe([
        () => payload,
        defaultsDeep({ ConfigurationProfileId: live.Id }),
      ])(),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/AppConfig.html#deleteConfigurationProfile-property
  destroy: {
    preDestroy: ({ endpoint }) =>
      tap(
        pipe([
          ({ Id, ApplicationId }) => ({
            ConfigurationProfileId: Id,
            ApplicationId,
          }),
          endpoint().listHostedConfigurationVersions,
          get("Items"),
          map(
            pipe([
              pick([
                "VersionNumber",
                "ApplicationId",
                "ConfigurationProfileId",
              ]),
              endpoint().deleteHostedConfigurationVersion,
            ])
          ),
        ])
      ),
    method: "deleteConfigurationProfile",
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
        Tags: buildTagsObject({ name, config, namespace, userTags: Tags }),
      }),
      when(
        () => iamRole,
        assign({ RetrievalRoleArn: getField(iamRole, "Arn") })
      ),
    ])(),
});
