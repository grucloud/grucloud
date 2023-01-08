const assert = require("assert");
const { pipe, tap, get, pick, assign } = require("rubico");
const {
  defaultsDeep,
  identity,
  callProp,
  unless,
  isEmpty,
  append,
} = require("rubico/x");
const { getByNameCore } = require("@grucloud/core/Common");

const { getField } = require("@grucloud/core/ProviderCommon");

const { Tagger } = require("./AppConfigCommon");

const managedByOther =
  ({ lives, config }) =>
  (live) =>
    pipe([
      () => live,
      get("ConfigurationProfileId"),
      lives.getById({
        type: "ConfigurationProfile",
        group: "AppConfig",
        providerName: config.providerName,
      }),
      get("managedByOther"),
    ])();

const pickId = pipe([
  tap(({ VersionNumber, ApplicationId, ConfigurationProfileId }) => {
    assert(VersionNumber);
    assert(ApplicationId);
    assert(ConfigurationProfileId);
  }),
  pick(["VersionNumber", "ApplicationId", "ConfigurationProfileId"]),
]);

const buildArn =
  ({ region, accountId }) =>
  ({ VersionNumber, ApplicationId, ConfigurationProfileId }) =>
    `arn:aws:appconfig:${region}:${accountId()}:application/${ApplicationId}/configurationprofile/${ConfigurationProfileId}/hostedconfigurationversion/${VersionNumber}`;

exports.AppConfigHostedConfigurationVersion = () => ({
  type: "HostedConfigurationVersion",
  package: "appconfig",
  client: "AppConfig",
  ignoreErrorCodes: ["ResourceNotFoundException"],
  managedByOther,
  cannotBeDeleted: managedByOther,
  inferName:
    ({ dependenciesSpec }) =>
    () =>
      `${dependenciesSpec.configurationProfile}`,
  findName:
    ({ lives, config }) =>
    (live) =>
      pipe([
        () => live,
        get("ConfigurationProfileId"),
        lives.getById({
          type: "ConfigurationProfile",
          group: "AppConfig",
          providerName: config.providerName,
        }),
        get("name", live.ConfigurationProfileId),
        unless(() => live.Latest, append(`::${live.VersionNumber}`)),
      ])(),
  findId: () =>
    pipe([
      ({ ApplicationId, ConfigurationProfileId }) =>
        `${ApplicationId}::${ConfigurationProfileId}`,
    ]),
  omitProperties: [
    "Id",
    "ConfigurationProfileId",
    "ApplicationId",
    "VersionNumber",
    "Latest",
  ],

  dependencies: {
    configurationProfile: {
      type: "ConfigurationProfile",
      group: "AppConfig",
      parent: true,
      dependencyId: ({ lives, config }) => get("ConfigurationProfileId"),
    },
  },
  getByName: getByNameCore,
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/AppConfig.html#getHostedConfigurationVersion-property
  getById: {
    method: "getHostedConfigurationVersion",
    pickId,
    decorate: () =>
      pipe([
        assign({
          Content: ({ Content }) =>
            pipe([() => Buffer.from(Content).toString()])(),
        }),
      ]),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/AppConfig.html#createHostedConfigurationVersion-property
  create: {
    method: "createHostedConfigurationVersion",
    pickCreated: ({ payload }) => pipe([identity]),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/AppConfig.html#deleteHostedConfigurationVersion-property
  destroy: {
    method: "deleteHostedConfigurationVersion",
    pickId,
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/AppConfig.html#listHostedConfigurationVersions-property
  getList: ({ client, endpoint, getById, config }) =>
    pipe([
      () =>
        client.getListWithParent({
          parent: { type: "ConfigurationProfile", group: "AppConfig" },
          pickKey: pipe([
            ({ Id, ApplicationId }) => ({
              ConfigurationProfileId: Id,
              ApplicationId,
            }),
          ]),
          method: "listHostedConfigurationVersions",
          getParam: "Items",
          config,
          transformListPost: () =>
            pipe([
              callProp("sort", (a, b) => b.VersionNumber - a.VersionNumber),
              unless(isEmpty, ([latest, ...others]) => [
                { ...latest, Latest: true },
                ...others,
              ]),
              callProp("reverse"),
            ]),
          decorate: () => pipe([getById({})]),
        }),
    ])(),
  update:
    ({ endpoint }) =>
    async ({ pickId, payload, diff, live }) =>
      pipe([
        tap((params) => {
          assert(endpoint);
        }),
        () => payload,
        defaultsDeep({ ApplicationId: live.Id }),
        endpoint().createHostedConfigurationVersion,
      ])(),
  tagger: ({ config }) =>
    Tagger({
      buildArn: buildArn({ config }),
    }),
  // TODO Tags
  configDefault: ({
    name,
    namespace,
    properties: { Tags, ...otherProps },
    dependencies: { configurationProfile },
    config,
  }) =>
    pipe([
      tap((params) => {
        assert(configurationProfile);
      }),
      () => otherProps,
      defaultsDeep({
        ApplicationId: getField(configurationProfile, "ApplicationId"),
        ConfigurationProfileId: getField(configurationProfile, "Id"),
      }),
    ])(),
});
