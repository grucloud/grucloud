const assert = require("assert");
const { pipe, tap, get, pick, assign, eq, switchCase } = require("rubico");
const {
  defaultsDeep,
  identity,
  callProp,
  unless,
  isEmpty,
  append,
  when,
  isIn,
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

const buildArn = () =>
  pipe([
    get("Arn"),
    tap((arn) => {
      assert(arn);
    }),
  ]);

const assignArn = ({ config }) =>
  pipe([
    tap((params) => {
      assert(config.region);
    }),
    assign({
      Arn: pipe([
        pickId,
        ({ VersionNumber, ApplicationId, ConfigurationProfileId }) =>
          `arn:aws:appconfig:${
            config.region
          }:${config.accountId()}:application/${ApplicationId}/configurationprofile/${ConfigurationProfileId}/hostedconfigurationversion/${VersionNumber}`,
      ]),
    }),
  ]);

const replacer = (key, value) =>
  pipe([
    () => key,
    switchCase([
      isIn(["_updatedAt", "_createdAt"]),
      () => undefined,
      () => value,
    ]),
  ])();

const parseJsonContent = pipe([
  when(
    eq(get("ContentType"), "application/json"),
    assign({
      Content: pipe([
        get("Content"),
        JSON.parse,
        (x) => JSON.stringify(x, replacer, 4),
        JSON.parse,
      ]),
    })
  ),
]);

const stringifyJsonContent = pipe([
  when(
    eq(get("ContentType"), "application/json"),
    assign({ Content: pipe([get("Content"), JSON.stringify]) })
  ),
]);

const decorate = ({ config }) =>
  pipe([
    tap((params) => {
      assert(config);
    }),
    assign({
      Content: ({ Content }) => pipe([() => Buffer.from(Content).toString()])(),
    }),
    parseJsonContent,
    assignArn({ config }),
  ]);

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
    "Arn",
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
    decorate,
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/AppConfig.html#createHostedConfigurationVersion-property
  create: {
    filterPayload: stringifyJsonContent,
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
              tap((params) => {
                assert(true);
              }),

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
          assert(payload.ApplicationId);
          assert(payload.ConfigurationProfileId);
          assert(payload.ContentType);
        }),
        () => payload,
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
