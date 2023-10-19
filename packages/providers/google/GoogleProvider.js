const assert = require("assert");
const path = require("path");
const os = require("os");
const fs = require("fs").promises;
const {
  map,
  pipe,
  pick,
  get,
  tap,
  filter,
  switchCase,
  omit,
  reduce,
} = require("rubico");
const { defaultsDeep, isEmpty, when } = require("rubico/x");

const CoreProvider = require("@grucloud/core/CoreProvider");
const AxiosMaker = require("@grucloud/core/AxiosMaker");

const logger = require("@grucloud/core/logger")({ prefix: "GoogleProvider" });

const { init, unInit } = require("./GoogleInit");
const { runGCloudCommand } = require("./GoogleCommon");
const { authorize } = require("./GoogleAuthorize");

const { generateCode } = require("./Gcp2gc");

const computeDefault = {
  region: "europe-west4",
  zone: "europe-west4-a",
};
const { fnSpecs } = require("./GoogleSpec");

const ServiceAccountName = "grucloud";

const ApplicationCredentialsFile = pipe([
  tap(({ projectId }) => {
    assert(projectId);
  }),
  ({ configDir = path.resolve(os.homedir(), ".config/gcloud"), projectId }) =>
    path.resolve(configDir, `${projectId}.json`),
]);

const getConfig = () =>
  runGCloudCommand({ command: "gcloud info --format json" });

const info = ({
  config,
  gcloudConfig,
  projectId,
  projectName,
  applicationCredentialsFile,
  serviceAccountName,
}) => {
  return {
    projectId,
    projectName,
    applicationCredentialsFile,
    serviceAccountName,
    hasGCloud: !!gcloudConfig,
    config: omit(["projectName", "projectId", "accessToken"])(config),
  };
};

exports.GoogleProvider = ({
  name = "google",
  config,
  configs = [],
  stage,
  ...other
}) => {
  logger.debug(
    `GoogleProvider has GOOGLE_CREDENTIALS ${!!process.env.GOOGLE_CREDENTIALS}`
  );
  const gcloudConfig = getConfig();

  const mergeConfig = ({ config, configs }) =>
    pipe([
      () => [...configs, config],
      filter((x) => x),
      reduce((acc, config) => defaultsDeep(acc)(config(acc)), {
        stage,
        managedByTag: "-managed-by-gru",
        managedByKey: "gc-managed-by",
        managedByValue: "grucloud",
        accessToken: () => serviceAccountAccessToken,
        projectNumber: () => _projectNumber,
      }),
      defaultsDeep({
        region: process.env.GOOGLE_REGION,
        zone: process.env.GOOGLE_ZONE,
      }),
      when(
        () => gcloudConfig,
        defaultsDeep(
          pipe([
            () => gcloudConfig,
            get("config.properties.compute", {}),
            pick(["region", "zone"]),
            map(get("value")),
            defaultsDeep(config),
          ])()
        )
      ),
      defaultsDeep(computeDefault),
    ])();

  const mergedConfig = mergeConfig({ config, configs });

  const projectId = pipe([() => mergedConfig, get("projectId")]);
  const projectName = () => get("projectName", projectId())(mergedConfig);
  const region = () => get("region")(mergedConfig);

  const resolveApplicationCredentialsFile = switchCase([
    () => mergedConfig.credentialFile,
    () => path.resolve(mergedConfig.credentialFile),
    () =>
      ApplicationCredentialsFile({
        configDir: gcloudConfig?.config?.paths.global_config_dir,
        projectId: projectId(),
      }),
  ]);

  const readCredentialsJson = () =>
    pipe([
      () => process.env.GOOGLE_CREDENTIALS,
      when(
        isEmpty,
        pipe([() => fs.readFile(resolveApplicationCredentialsFile(), "utf-8")])
      ),
      JSON.parse,
    ])();

  let serviceAccountAccessToken;
  let _projectNumber;

  const start = async () => {
    if (!serviceAccountAccessToken) {
      const credentials = await readCredentialsJson();
      serviceAccountAccessToken = await authorize({
        gcloudConfig,
        projectId: projectId(),
        projectName: projectName(),
        credentials,
      });
    }

    return pipe([
      tap((params) => {
        assert(projectId(), "projectId");
      }),
      () => ({
        baseURL: `https://cloudresourcemanager.googleapis.com/v1/projects/${projectId()}`,
        onHeaders: () => ({
          Authorization: `Bearer ${serviceAccountAccessToken}`,
        }),
      }),
      tap((params) => {
        assert(true);
      }),
      AxiosMaker,
      (axiosService) => axiosService.get("/"),
      tap((params) => {
        assert(true);
      }),
      get("data"),
      tap(({ projectNumber }) => {
        logger.debug(`started`);
        _projectNumber = projectNumber;
      }),
    ])();
  };

  const core = CoreProvider({
    ...other,
    type: "google",
    name,
    makeConfig: () => mergedConfig,
    fnSpecs,
    start,
    info: ({ options } = {}) =>
      info({
        options,
        config: mergedConfig,
        gcloudConfig,
        projectName: projectName(),
        projectId: projectId(),
        applicationCredentialsFile: resolveApplicationCredentialsFile(),
        serviceAccountName: ServiceAccountName,
      }),
    init: ({ options, programOptions } = {}) =>
      init({
        options,
        programOptions,
        gcloudConfig,
        region: region(),
        projectName: projectName(),
        projectId: projectId(),
        applicationCredentialsFile: resolveApplicationCredentialsFile(),
        serviceAccountName: ServiceAccountName,
      }),
    unInit: ({ options } = {}) =>
      unInit({
        options,
        gcloudConfig,
        projectName: projectName(),
        projectId: projectId(),
        applicationCredentialsFile: resolveApplicationCredentialsFile(),
        serviceAccountName: ServiceAccountName,
      }),
    generateCode: ({ commandOptions, programOptions, providers }) =>
      generateCode({
        providers,
        providerName: name,
        providerConfig: mergedConfig,
        specs: fnSpecs(mergedConfig),
        commandOptions,
        programOptions,
      }),
  });

  return core;
};
