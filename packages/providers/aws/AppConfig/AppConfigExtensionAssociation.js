const assert = require("assert");
const {
  pipe,
  tap,
  get,
  pick,
  fork,
  switchCase,
  eq,
  assign,
} = require("rubico");
const { defaultsDeep, find } = require("rubico/x");

const { getByNameCore } = require("@grucloud/core/Common");
const { buildTagsObject } = require("@grucloud/core/Common");

const { Tagger, assignTags } = require("./AppConfigCommon");
const { getField } = require("@grucloud/core/ProviderCommon");

const managedByOther = ({ lives, config }) =>
  pipe([
    get("ExtensionArn"),
    lives.getById({
      type: "Extension",
      group: "AppConfig",
      providerName: config.providerName,
    }),
    get("managedByOther"),
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
        ({ ExtensionAssociationId }) =>
          `arn:aws:appconfig:${
            config.region
          }:${config.accountId()}:extensionassociation/${ExtensionAssociationId}`,
      ]),
    }),
  ]);

const pickId = pipe([
  tap(({ ExtensionAssociationId }) => {
    assert(ExtensionAssociationId);
  }),
  pick(["ExtensionAssociationId"]),
]);

const idToExtensionAssociationId = ({ Id, ...other }) => ({
  ExtensionAssociationId: Id,
  ...other,
});

const decorate = ({ endpoint, config }) =>
  pipe([
    idToExtensionAssociationId,
    assignArn({ config }),
    assignTags({ buildArn: buildArn(config), endpoint }),
  ]);

const dependencyId =
  ({ type, group }) =>
  ({ lives, config }) =>
  ({ ResourceArn }) =>
    pipe([
      lives.getByType({
        type,
        group,
        providerName: config.providerName,
      }),
      find(eq(get("live.Arn"), ResourceArn)),
      get("id"),
    ])();

const getDependencyName =
  ({ type, group, lives, config }) =>
  ({ ResourceArn }) =>
    pipe([
      lives.getByType({
        type,
        group,
        providerName: config.providerName,
      }),
      find(eq(get("live.Arn"), ResourceArn)),
      get("name"),
    ])();

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/AppConfig.html
exports.AppConfigExtensionAssociation = () => ({
  type: "ExtensionAssociation",
  package: "appconfig",
  client: "AppConfig",
  propertiesDefault: {},
  managedByOther,
  cannotBeDeleted: managedByOther,
  omitProperties: [
    "ExtensionAssociationId",
    "Arn",
    "ExtensionArn",
    "ResourceArn",
    "ExtensionVersionNumber",
    "ExtensionIdentifier",
    "ResourceIdentifier",
  ],
  inferName: ({
    dependenciesSpec: {
      extension,
      application,
      configurationProfile,
      environment,
    },
  }) =>
    pipe([
      tap((params) => {
        assert(application || configurationProfile || environment);
      }),
      () =>
        `${extension}::${application || configurationProfile || environment}`,
      tap((Name) => {
        assert(Name);
      }),
    ]),
  findName: ({ lives, config }) =>
    pipe([
      fork({
        extension: pipe([
          get("ExtensionArn"),
          lives.getById({
            type: "Extension",
            group: "AppConfig",
            providerName: config.providerName,
          }),
          get("name"),
        ]),
        application: getDependencyName({
          type: "Application",
          group: "AppConfig",
          lives,
          config,
        }),
        configurationProfile: getDependencyName({
          type: "ConfigurationProfile",
          group: "AppConfig",
          lives,
          config,
        }),
        environment: getDependencyName({
          type: "Environment",
          group: "AppConfig",
          lives,
          config,
        }),
      }),
      ({ extension, application, configurationProfile, environment }) =>
        `${extension}::${application || configurationProfile || environment}`,
    ]),
  findId: () =>
    pipe([
      get("ExtensionAssociationId"),
      tap((id) => {
        assert(id);
      }),
    ]),
  dependencies: {
    application: {
      type: "Application",
      group: "AppConfig",
      parent: true,
      dependencyId: dependencyId({
        type: "Application",
        group: "AppConfig",
      }),
    },
    configurationProfile: {
      type: "ConfigurationProfile",
      group: "AppConfig",
      parent: true,
      dependencyId: dependencyId({
        type: "ConfigurationProfile",
        group: "AppConfig",
      }),
    },
    environment: {
      type: "Environment",
      group: "AppConfig",
      parent: true,
      dependencyId: dependencyId({
        type: "Environment",
        group: "AppConfig",
      }),
    },
    extension: {
      type: "Extension",
      group: "AppConfig",
      parent: true,
      dependencyId: ({ lives, config }) => pipe([get("ExtensionArn")]),
    },
  },
  ignoreErrorCodes: ["ResourceNotFoundException"],
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/AppConfig.html#getExtensionAssociation-property
  getById: {
    method: "getExtensionAssociation",
    pickId,
    decorate,
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/AppConfig.html#listExtensionAssociations-property
  getList: {
    method: "listExtensionAssociations",
    getParam: "Items",
    decorate: ({ getById }) => pipe([idToExtensionAssociationId, getById]),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/AppConfig.html#createExtensionAssociation-property
  create: {
    method: "createExtensionAssociation",
    pickCreated: ({ payload }) => pipe([idToExtensionAssociationId]),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/AppConfig.html#updateExtensionAssociation-property
  update: {
    method: "updateExtensionAssociation",
    filterParams: ({ payload, diff, live }) =>
      pipe([() => payload, defaultsDeep(pickId(live))])(),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/AppConfig.html#deleteExtensionAssociation-property
  destroy: {
    method: "deleteExtensionAssociation",
    pickId,
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
    dependencies: { extension, application, configurationProfile, environment },
    config,
  }) =>
    pipe([
      tap((params) => {
        assert(extension);
      }),
      () => otherProps,
      defaultsDeep({
        ExtensionIdentifier: getField(extension, "ExtensionIdentifier"),
        Tags: buildTagsObject({ name, config, namespace, userTags: Tags }),
      }),
      switchCase([
        () => application,
        defaultsDeep({
          ResourceIdentifier: getField(application, "Arn"),
        }),
        () => configurationProfile,
        defaultsDeep({
          ResourceIdentifier: getField(configurationProfile, "Arn"),
        }),
        () => environment,
        defaultsDeep({
          ResourceIdentifier: getField(environment, "Arn"),
        }),
        () => {
          assert(false, "missing dependency");
        },
      ]),
    ])(),
});
