const assert = require("assert");
const {
  omit,
  pipe,
  get,
  tap,
  tryCatch,
  filter,
  not,
  map,
  fork,
  assign,
} = require("rubico");
const { isFunction, size, defaultsDeep, when, isEmpty } = require("rubico/x");

const { loadConfig } = require("@aws-sdk/node-config-provider");
const path = require("path");

const { STS } = require("@aws-sdk/client-sts");
const {
  AssumeRoleWithWebIdentityCommand,
  STSClient,
} = require("@aws-sdk/client-sts");

const logger = require("@grucloud/core/logger")({ prefix: "AwsProvider" });
const CoreProvider = require("@grucloud/core/CoreProvider");
const { assignTagsSort, createEndpointOption } = require("./AwsCommon");
const { mergeConfig } = require("@grucloud/core/ProviderCommon");
const { getWebIdentityToken } = require("@grucloud/core/getJwt");

const {
  createProjectAws,
} = require("@grucloud/core/cli/providers/createProjectAws");

const { generateCode } = require("./Aws2gc");
const { fnSpecs } = require("./AwsProviderSpec");

exports.AwsProvider = async ({
  name = "aws",
  stage = "dev",
  config,
  programOptions,
  configs = [],
  mapGloblalNameToResource,
  ...other
}) => {
  assert(config ? isFunction(config) : true, "config must be a function");

  let accountId;
  let _credentials;
  //TODO wrap for retry
  const fetchAccountId = (config) =>
    tryCatch(
      pipe([
        tap(() => {
          assert(config);
          //logger.debug(`fetchAccountId ${name}`);
        }),
        createEndpointOption(config),
        (options) => new STS(options),
        (sts) => sts.getCallerIdentity({}),
        get("Account"),
        tap((accountId) => {
          logger.debug(`fetchAccountId ${name}, accountId: ${accountId}`);
        }),
      ]),
      (error) => {
        throw error;
      }
    )();

  const getRegionFromCredentialFiles = (config) =>
    pipe([
      tap((params) => {
        assert(config);
        logger.debug(`getRegionFromCredentialFiles ${name}`);
      }),
      () => config,
      get("credentials.profile", "default"),
      (profile) =>
        pipe([
          () =>
            loadConfig(
              {
                configFileSelector: get("region"),
              },
              { profile }
            ),
          (awsConfig) => awsConfig({}),
          tap((region) => {
            //assert(region);
          }),
        ])(),
      tap((region) => {
        logger.debug(`getRegionFromCredentialFiles ${name} region: ${region}`);
      }),
    ])();

  const getRegion = (config) =>
    pipe([
      tap((params) => {
        assert(config);
      }),
      () => config,
      getRegionFromCredentialFiles,
      (regionFromCredentialFiles) =>
        pipe([
          () => ({}),
          defaultsDeep({ region: config.region }),
          defaultsDeep({ region: regionFromCredentialFiles }),
          when(
            () => process.env.AWS_REGION,
            defaultsDeep({ region: process.env.AWS_REGION })
          ),
          defaultsDeep(config),
          get("region"),
          tap((region) => {
            //assert(region);
            logger.info(
              `using region '${region}', regionFromCredential: ${regionFromCredentialFiles}, AWS_REGION:${process.env.AWS_REGION}`
            );
          }),
        ])(),
      tap((params) => {
        assert(true);
      }),
    ])();

  //let region;
  let region = await getRegion(
    mergeConfig({
      config,
      configs,
    })
  );

  const makeConfig = pipe([
    tap((params) => {
      assert(true);
    }),
    () =>
      mergeConfig({
        configDefault: {
          credentials: _credentials,
          stage,
          accountId: pipe([
            () => accountId,
            tap(() => {
              assert(accountId);
            }),
          ]),
          region,
          partition: "aws",
        },
        config,
        configs,
      }),
  ]);

  const assumeRoleWebIdentity = ({ RoleArn, RoleSessionName }) =>
    pipe([
      tap((WebIdentityToken) => {
        assert(WebIdentityToken);
        assert(RoleArn);
      }),
      (WebIdentityToken) => ({
        WebIdentityToken,
        RoleSessionName,
        RoleArn,
      }),
      (input) => new AssumeRoleWithWebIdentityCommand(input),
      (command) =>
        new STSClient({
          region: "us-east-1",
        }).send(command),
      get("Credentials"),
      ({ AccessKeyId, SecretAccessKey, SessionToken }) => ({
        accessKeyId: AccessKeyId,
        secretAccessKey: SecretAccessKey,
        sessionToken: SessionToken,
      }),
    ]);

  const start = pipe([
    () => process.env,
    tap.if(
      get("GRUCLOUD_ROLE_WEB_IDENTITY_ARN"),
      pipe([
        () => ({
          audience: process.env.AWS_OAUTH_AUDIENCE ?? "aws.workload.identity",
        }),
        getWebIdentityToken,
        assumeRoleWebIdentity({
          RoleArn: process.env.GRUCLOUD_ROLE_WEB_IDENTITY_ARN,
          RoleSessionName: "grucloud-session",
        }),
        tap((credentials) => {
          _credentials = credentials;
        }),
      ])
    ),
    tap(async (params) => {
      const merged = makeConfig();
      accountId = await fetchAccountId(
        defaultsDeep(merged)({
          credentials: { clientConfig: { region: "us-east-1" } },
        })
      );
    }),
  ]);

  const information = () => ({
    accountId,
    region,
    config: omit(["accountId"])(makeConfig()),
  });

  const init = ({ options, programOptions }) =>
    pipe([
      tap(() => {
        assert(programOptions.workingDirectory);
      }),
      fork({
        dirs: () => ({
          destination: path.resolve(programOptions.workingDirectory),
          providerDirectory: other.directory,
        }),
        config: makeConfig,
      }),
      assign({ profile: get("config.credentials.profile", "default") }),
      createProjectAws({}),
    ])();

  const getListHof = ({ getList, spec }) =>
    tryCatch(
      pipe([
        tap(() => {
          logger.debug(`getList ${spec.groupType}`);
        }),
        getList,
        tap((items) => {
          Array.isArray(items);
        }),
        map(assignTagsSort),
        filter(not(isEmpty)),
        (items) => ({ items, total: size(items) }),
        tap(({ total, items }) => {
          logger.debug(`getList ${spec.groupType} total: ${total}`);
        }),
      ]),
      (error) =>
        pipe([
          tap((params) => {
            logger.error(`getList #${spec.groupType}, ${error}`);
          }),
          () => {
            throw error;
          },
        ])()
    );

  return CoreProvider({
    ...other,
    type: "aws",
    name,
    displayName: pipe([
      () => ({
        config,
        configs,
      }),
      mergeConfig,
      get("credentials.profile", ""),
      (profile) => `${name} ${region} ${profile}`,
    ]),
    programOptions,
    makeConfig,
    fnSpecs,
    start,
    info: information,
    init,
    generateCode: ({ commandOptions, programOptions, providers }) =>
      generateCode({
        providerName: name,
        providers,
        providerConfig: makeConfig(),
        specs: fnSpecs(makeConfig()),
        commandOptions,
        programOptions,
      }),
    getListHof,
    mapGloblalNameToResource,
  });
};
