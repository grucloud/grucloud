const assert = require("assert");
const {
  filter,
  eq,
  map,
  pipe,
  get,
  tap,
  fork,
  tryCatch,
  assign,
  any,
  switchCase,
  not,
  or,
} = require("rubico");
const {
  uniq,
  pluck,
  callProp,
  isEmpty,
  values,
  includes,
} = require("rubico/x");
const pluralize = require("pluralize");

const path = require("path");
const CoreProvider = require("@grucloud/core/CoreProvider");
const {
  createProjectAzure,
  writeConfigToFile,
} = require("@grucloud/core/cli/providers/createProjectAzure");

const { mergeConfig } = require("@grucloud/core/ProviderCommon");
const {
  AZURE_MANAGEMENT_BASE_URL,
  AZURE_KEYVAULT_AUDIENCE,
  AZURE_STORAGE_AUDIENCE,
  createAxiosAzure,
} = require("./AzureCommon");
const { AzAuthorize } = require("./AzAuthorize");
const { checkEnv } = require("@grucloud/core/Utils");
const { generateCode } = require("./Az2gc");
const { fnSpecs } = require("./AzureSpec");
const logger = require("@grucloud/core/logger")({ prefix: "AzureProvider" });

const AUDIENCES = [AZURE_MANAGEMENT_BASE_URL, AZURE_KEYVAULT_AUDIENCE];

const ResourceInclusionList = [
  "ResourceGroup",
  "UserAssignedIdentity",
  "RoleAssignment",
  "RoleDefinition", //Authorization
];

exports.AzureProvider = ({
  name = "azure",
  config,
  configs = [],
  ...other
}) => {
  const mandatoryEnvs = [
    "AZURE_TENANT_ID",
    "AZURE_SUBSCRIPTION_ID",
    "AZURE_CLIENT_ID",
    "AZURE_CLIENT_SECRET",
  ];

  const bearerTokenMap = {};
  let _livesTypes = [];

  const axios = createAxiosAzure({
    baseURL: AZURE_MANAGEMENT_BASE_URL,
    bearerToken: () => bearerTokenMap[AZURE_MANAGEMENT_BASE_URL],
  });

  const authorizeByResource = ({ resource }) =>
    pipe([
      AzAuthorize({ resource }),
      get("bearerToken"),
      tap((bearerToken) => {
        bearerTokenMap[resource] = bearerToken;
      }),
    ]);

  const listTypes = pipe([
    () =>
      `/subscriptions/${process.env.AZURE_SUBSCRIPTION_ID}/resources?api-version=2021-04-01`,
    axios.get,
    get("data.value"),
    pluck("type"),
    uniq,
    tap((livesTypes) => {
      logger.info(`livesTypes: ${livesTypes}`);
      _livesTypes = livesTypes;
    }),
  ]);

  const start = pipe([
    tap(() => {
      checkEnv(mandatoryEnvs);
    }),
    () => AUDIENCES,
    map.pool(5, (resource) =>
      pipe([
        () => ({
          tenantId: process.env.AZURE_TENANT_ID,
          appId: process.env.AZURE_CLIENT_ID,
          password: process.env.AZURE_CLIENT_SECRET,
        }),
        //Change curry order
        authorizeByResource({
          resource,
        }),
      ])()
    ),
    listTypes,
  ]);

  const configProviderDefault = {
    bearerToken: pipe([
      (audience) => bearerTokenMap[audience],
      tap((params) => {
        assert(true);
      }),
    ]),
    retryCount: 60,
    retryDelay: 10e3,
    subscriptionId: process.env.AZURE_SUBSCRIPTION_ID,
    tenantId: process.env.AZURE_TENANT_ID,
    appId: process.env.AZURE_CLIENT_ID,
  };

  const makeConfig = () =>
    mergeConfig({ configDefault: configProviderDefault, config, configs });

  const info = () => ({
    subscriptionId: process.env.AZURE_SUBSCRIPTION_ID,
    tenantId: process.env.AZURE_TENANT_ID,
    appId: process.env.AZURE_CLIENT_ID,
    config: makeConfig(),
  });

  const configRead = ({ programOptions }) =>
    pipe([
      tryCatch(
        pipe([
          () => path.resolve(programOptions.workingDirectory, "config.js"),
          require,
          (fnConfig) => fnConfig(),
        ]),
        (error) => {
          return undefined;
        }
      ),
    ])();

  const init = ({ programOptions }) =>
    pipe([
      tap(() => {
        assert(programOptions.workingDirectory);
      }),
      fork({
        config: pipe([() => ({ programOptions }), configRead]),
        dirs: () => ({
          destination: path.resolve(programOptions.workingDirectory),
        }),
      }),
      assign({ projectName: get("config.projectName") }),
      createProjectAzure,
      writeConfigToFile,
    ])();

  const isGroupTypeIncluded = ({ group, type }) =>
    pipe([
      tap((livesTypes) => {
        assert(group);
        assert(type);
        assert(livesTypes);
      }),
      any(
        callProp(
          "match",
          new RegExp(`^Microsoft.${group}/${pluralize.plural(type)}$`, "ig")
        )
      ),
    ]);

  const filterClient = pipe([
    tap((params) => {
      assert(true);
    }),
    switchCase([
      or([
        () => isEmpty(_livesTypes),
        pipe([
          get("spec.type"),
          (type) => pipe([() => ResourceInclusionList, includes(type)])(),
        ]),
      ]),
      () => true,
      pipe([
        get("spec"),
        ({ group, type, dependencies }) =>
          pipe([
            () => dependencies,
            filter(get("parent")),
            filter(not(eq(get("type"), "ResourceGroup"))),
            values,
            (deps) => [...deps, { group, type }],
            any((dep) => pipe([() => _livesTypes, isGroupTypeIncluded(dep)])()),
          ])(),
      ]),
    ]),
    tap((params) => {
      assert(true);
    }),
  ]);

  return {
    ...CoreProvider({
      ...other,
      type: "azure",
      name,
      mandatoryConfigKeys: ["location"],
      makeConfig,
      fnSpecs,
      start,
      info,
      init,
      filterClient,
      generateCode: ({ commandOptions, programOptions }) =>
        generateCode({
          providerConfig: makeConfig(),
          specs: fnSpecs(makeConfig()),
          commandOptions,
          programOptions,
        }),
    }),
  };
};
