const assert = require("assert");
const {
  pipe,
  tap,
  get,
  pick,
  eq,
  assign,
  or,
  switchCase,
  omit,
} = require("rubico");
const { defaultsDeep, callProp, when } = require("rubico/x");

const { getByNameCore } = require("@grucloud/core/Common");
const { getField } = require("@grucloud/core/ProviderCommon");
const { buildTags } = require("../AwsCommon");

const { Tagger, listTagsForResource } = require("./DMSCommon");

const buildArn = () =>
  pipe([
    get("EndpointArn"),
    tap((arn) => {
      assert(arn);
    }),
  ]);

const pickId = pipe([
  tap(({ EndpointArn }) => {
    assert(EndpointArn);
  }),
  pick(["EndpointArn"]),
]);

const decorate = ({ endpoint, config }) =>
  pipe([
    tap((params) => {
      assert(endpoint);
    }),
    omit(["ExtraConnectionAttributes"]),
    assign({
      EndpointType: pipe([get("EndpointType"), callProp("toLowerCase")]),
    }),
    listTagsForResource({ endpoint, buildArn: buildArn() }),
  ]);

const envPassword = ({ path, suffix }) => ({
  path: `${path}.Password`,
  suffix,
  rejectEnvironmentVariable: () =>
    pipe([
      switchCase([
        get(path),
        get(`${path}.SecretsManagerSecretId`),
        () => true,
      ]),
    ]),
});

const dependenciesDb = ({ dbType, path }) => ({
  [`iamRoleSecretsManager${dbType}`]: {
    type: "Role",
    group: "IAM",
    dependencyId: ({ lives, config }) =>
      pipe([get(`${path}.SecretsManagerAccessRoleArn`)]),
  },
  [`secret${dbType}`]: {
    type: "Secret",
    group: "SecretsManager",
    dependencyId: ({ lives, config }) =>
      pipe([get(`${path}.SecretsManagerSecretId`)]),
  },
});

const assignIamRole = ({ iamRole, settings }) =>
  when(
    () => iamRole,
    defaultsDeep({
      [settings]: {
        SecretsManagerAccessRoleArn: getField(iamRole, "Arn"),
      },
    })
  );

const assignSecret = ({ secret, settings }) =>
  when(
    () => secret,
    defaultsDeep({
      [settings]: {
        SecretsManagerSecretId: getField(secret, "ARN"),
      },
    })
  );

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/DMS.html
exports.DMSEndpoint = ({ compare }) => ({
  type: "Endpoint",
  package: "database-migration-service",
  client: "DatabaseMigrationService",
  propertiesDefault: {
    ReceiveTransferredFiles: false,
    TransferFiles: false,
    SslMode: "none",
  },
  omitProperties: [
    "EndpointArn",
    "ServiceAccessRoleArn",
    "KmsKeyId",
    "Status",
    "S3Settings.ServiceAccessRoleArn",
    "MySQLSettings.SecretsManagerAccessRoleArn",
    "MySQLSettings.SecretsManagerSecretId",
    "PostgreSQLSettings.SecretsManagerAccessRoleArn",
    "PostgreSQLSettings.SecretsManagerSecretId",
    "CertificateArn",
  ],
  inferName: () =>
    pipe([
      get("EndpointIdentifier"),
      tap((Name) => {
        assert(Name);
      }),
    ]),
  findName: () =>
    pipe([
      get("EndpointIdentifier"),
      tap((name) => {
        assert(name);
      }),
    ]),
  findId: () =>
    pipe([
      get("EndpointArn"),
      tap((id) => {
        assert(id);
      }),
    ]),
  environmentVariables: [
    {
      path: "Password",
      suffix: "PASSWORD",
      rejectEnvironmentVariable: () =>
        pipe([
          or([
            eq(get("EngineName"), "s3"),
            get("DocDbSettings.SecretsManagerSecretId"),
            get("GcpMySQLSettings.SecretsManagerSecretId"),
            get("IBMDb2Settings.SecretsManagerSecretId"),
            get("MicrosoftSQLServerSettings.SecretsManagerSecretId"),
            get("MongoDbSettings.SecretsManagerSecretId"),
            get("MySQLSettings.SecretsManagerSecretId"),
            get("OracleSettings.SecretsManagerSecretId"),
            get("PostgreSQLSettings.SecretsManagerSecretId"),
            get("RedshiftSettings.SecretsManagerSecretId"),
            get("SybaseSettings.SecretsManagerSecretId"),
          ]),
        ]),
    },
    envPassword({ path: "DocDbSettings", suffix: "DOCDB_PASSWORD" }),
    envPassword({ path: "GcpMySQLSettings", suffix: "GCPMYSQL_PASSWORD" }),
    envPassword({ path: "IBMDb2Settings", suffix: "IDMDB2_PASSWORD" }),
    envPassword({
      path: "MicrosoftSQLServerSettings",
      suffix: "MICROSOFTSQLSERVER_PASSWORD",
    }),
    envPassword({ path: "MySQLSettings", suffix: "MYSQL_PASSWORD" }),
    envPassword({ path: "OracleSettings", suffix: "ORACLE_PASSWORD" }),
    envPassword({ path: "PostgreSQLSettings", suffix: "POSTGRESSQL_PASSWORD" }),
    envPassword({ path: "RedshiftSettings", suffix: "REDSHIFT_PASSWORD" }),
    envPassword({ path: "SybaseSettings", suffix: "SYSBASE_PASSWORD" }),
  ],
  dependencies: {
    certificate: {
      type: "Certificate",
      group: "DMS",
      dependencyId: ({ lives, config }) => pipe([get("CertificateArn")]),
    },
    iamRoleServiceAccess: {
      type: "Role",
      group: "IAM",
      dependencyId: ({ lives, config }) => pipe([get("ServiceAccessRoleArn")]),
    },
    kmsKey: {
      type: "Key",
      group: "KMS",
      excludeDefaultDependencies: true,
      dependencyId: ({ lives, config }) => get("KmsKeyId"),
    },
    ...dependenciesDb({ dbType: "MySQL", path: "MySQLSettings" }),
    ...dependenciesDb({ dbType: "Postgres", path: "PostgreSQLSettings" }),
  },
  compare: compare({ filterTarget: () => pipe([omit(["Password"])]) }),
  ignoreErrorCodes: ["ResourceNotFoundFault"],
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/DMS.html#getEndpoint-property
  getById: {
    method: "describeEndpoints",
    getField: "Endpoints",
    pickId: pipe([
      tap(({ EndpointArn }) => {
        assert(EndpointArn);
      }),
      ({ EndpointArn }) => ({
        Filters: [
          {
            Name: "endpoint-arn",
            Values: [EndpointArn],
          },
        ],
      }),
    ]),
    decorate,
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/DMS.html#listEndpoints-property
  getList: {
    method: "describeEndpoints",
    getParam: "Endpoints",
    decorate,
  },

  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/DMS.html#createEndpoint-property
  create: {
    method: "createEndpoint",
    pickCreated: ({ payload }) => pipe([get("Endpoint")]),
    shouldRetryOnExceptionMessages: ["is not configured properly.AccessDenied"],
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/DMS.html#updateEndpoint-property
  update: {
    method: "updateEndpoint",
    filterParams: ({ payload, diff, live }) =>
      pipe([() => payload, defaultsDeep(pickId(live))])(),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/DMS.html#deleteEndpoint-property
  destroy: {
    method: "deleteEndpoint",
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
    dependencies: {
      certificate,
      kmsKey,
      iamRoleServiceAccess,
      //MySQL
      secretMySQL,
      iamRoleSecretsManagerMySQL,
      //Postgres
      secretPostgres,
      iamRoleSecretsManagerPostgres,
    },
    config,
  }) =>
    pipe([
      () => otherProps,
      defaultsDeep({
        Tags: buildTags({ name, config, namespace, UserTags: Tags }),
      }),
      when(
        () => certificate,
        defaultsDeep({
          CertificateArn: getField(certificate, "CertificateArn"),
        })
      ),
      when(
        () => kmsKey,
        defaultsDeep({
          KmsKeyId: getField(kmsKey, "Arn"),
        })
      ),
      when(
        () => iamRoleServiceAccess,
        defaultsDeep({
          ServiceAccessRoleArn: getField(iamRoleServiceAccess, "Arn"),
        })
      ),
      //MySQL
      assignIamRole({
        iamRole: iamRoleSecretsManagerMySQL,
        settings: "MySQLSettings",
      }),
      assignSecret({ secret: secretMySQL, settings: "MySQLSettings" }),
      //Postgres
      assignIamRole({
        iamRole: iamRoleSecretsManagerPostgres,
        settings: "PostgreSQLSettings",
      }),
      assignSecret({ secret: secretPostgres, settings: "PostgreSQLSettings" }),
    ])(),
});
