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
} = require("rubico");
const {
  first,
  pluck,
  isFunction,
  size,
  defaultsDeep,
  when,
} = require("rubico/x");

const path = require("path");

const { STS } = require("@aws-sdk/client-sts");

const logger = require("@grucloud/core/logger")({ prefix: "AwsProvider" });
const CoreProvider = require("@grucloud/core/CoreProvider");
const { assignTagsSort } = require("./AwsCommon");
const { mergeConfig } = require("@grucloud/core/ProviderCommon");
const {
  createProjectAws,
} = require("@grucloud/core/cli/providers/createProjectAws");

const { generateCode } = require("./Aws2gc");
const { createEC2 } = require("./EC2/EC2Common");
const { fnSpecs } = require("./AwsProviderSpec");

const getAvailabilityZonesName = ({ region }) =>
  pipe([
    () => createEC2({ region }),
    tap((params) => {
      assert(true);
    }),
    (ec2) => ec2().describeAvailabilityZones({}),
    tap((params) => {
      assert(true);
    }),
    get("AvailabilityZones"),
    pluck("ZoneName"),
    tap((ZoneNames) => {
      logger.debug(`AvailabilityZones: for region ${region}: ${ZoneNames}`);
    }),
  ])();

const validateConfig = ({ region, zone, zones }) => {
  logger.debug(`region: ${region}, zone: ${zone}, zones: ${zones}`);
  if (zone && !zones.includes(zone)) {
    const message = `The configued zone '${zone}' is not part of region ${region}, available zones for this region: ${zones}`;
    throw { code: 400, type: "configuration", message };
  }
};

//TODO wrap for retry
const fetchAccountId = pipe([
  tap(() => {
    logger.debug(`fetchAccountId`);
  }),
  () => new STS({ region: "us-east-1" }),
  (sts) => sts.getCallerIdentity({}),
  get("Account"),
]);

exports.AwsProvider = ({
  name = "aws",
  stage = "dev",
  config,
  programOptions,
  configs = [],
  ...other
}) => {
  assert(config ? isFunction(config) : true, "config must be a function");

  const { AWSAccessKeyId, AWSSecretKey } = process.env;

  // AWS.config.update({
  //   ...(AWSAccessKeyId && {
  //     accessKeyId: AWSAccessKeyId,
  //   }),
  //   ...(AWSSecretKey && {
  //     secretAccessKey: AWSSecretKey,
  //   }),
  // });

  let accountId;
  let zone;
  let zones;

  const getRegion = (config) =>
    pipe([
      () => ({}),
      when(
        () => process.env.AWS_REGION,
        defaultsDeep({ region: process.env.AWS_REGION })
      ),
      defaultsDeep(config),
      get("region", "us-east-1"),
      tap((region) => {
        assert(region);
        logger.info(`using region '${region}'`);
      }),
    ])();

  let region = getRegion(
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
          stage,
          zone: () => zone,
          accountId: () => accountId,
          region,
        },
        config,
        configs,
      }),
  ]);

  const getZone = ({ zones, config }) => config.zone() || first(zones);

  const start = async () => {
    accountId = await fetchAccountId();
    const merged = makeConfig();
    zones = await getAvailabilityZonesName({ region });
    assert(zones, `no zones for region ${region}`);
    zone = getZone({ zones, config: merged });
    assert(zone);
    validateConfig({
      region,
      zone,
      zones,
    });
  };

  const info = () => ({
    accountId,
    region,
    zone,
    config: omit(["accountId", "zone"])(makeConfig()),
  });

  const init = ({ options, programOptions }) =>
    pipe([
      tap(() => {
        assert(programOptions.workingDirectory);
      }),
      fork({
        dirs: () => ({
          destination: path.resolve(programOptions.workingDirectory),
        }),
      }),
      createProjectAws,
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
    programOptions,
    makeConfig,
    fnSpecs,
    start,
    info,
    init,
    generateCode: ({ commandOptions, programOptions }) =>
      generateCode({
        providerConfig: makeConfig(),
        specs: fnSpecs(makeConfig()),
        commandOptions,
        programOptions,
      }),
    getListHof,
  });
};
