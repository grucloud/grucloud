const assert = require("assert");
const {
  pipe,
  tap,
  get,
  pick,
  eq,
  map,
  fork,
  flatMap,
  not,
  assign,
  omit,
} = require("rubico");
const { defaultsDeep, prepend, callProp, when } = require("rubico/x");

const { getByNameCore } = require("@grucloud/core/Common");
const { getField } = require("@grucloud/core/ProviderCommon");
const { replaceWithName } = require("@grucloud/core/Common");

const pickId = pipe([
  tap(({ connectorProfileName }) => {
    assert(connectorProfileName);
  }),
  pick(["connectorProfileName"]),
]);

const decorate = ({ endpoint }) =>
  pipe([
    tap((params) => {
      assert(endpoint);
    }),
    ({ connectorProfileProperties, ...other }) => ({
      ...other,
      connectorProfileConfig: connectorProfileProperties,
    }),
  ]);

const connectorCredentials = [
  { name: "Datadog", keys: ["apiKey", "applicationKey"] },
  {
    name: "CustomConnector",
    keys: ["apiKey", "authenticationType", "basic", "custom", "oauth2"],
  },
  {
    name: "GoogleAnalytics",
    keys: [
      "accessToken",
      "clientId",
      "clientSecret",
      "oAuthRequest",
      "refreshToken",
    ],
  },
  {
    name: "Salesforce",
    keys: [
      "accessToken",
      "clientCredentialsArn",
      "oAuthRequest",
      "refreshToken",
    ],
  },
  {
    name: "Slack",
    keys: ["accessToken", "clientId", "oAuthRequest"],
  },
  { name: "Snowflake", keys: ["username", "password"] },
  { name: "Redshift", keys: ["username", "password"] },
];

const createEnvironmentVariables = pipe([
  () => connectorCredentials,
  flatMap(({ name, keys }) =>
    pipe([
      tap((params) => {
        assert(name);
      }),
      () => keys,
      map(
        pipe([
          fork({
            path: pipe([
              prepend("."),
              prepend(name),
              prepend("connectorProfileConfig.connectorProfileCredentials."),
            ]),
            suffix: pipe([
              callProp("toUpperCase"),
              prepend("_"),
              prepend(name.toUpperCase()),
            ]),
            rejectEnvironmentVariable: () => rejectEnvironmentVariable(name),
          }),
        ])
      ),
    ])()
  ),
]);

const rejectEnvironmentVariable = (service) => () =>
  pipe([
    tap((params) => {
      assert(service);
    }),
    not(eq(get("connectorType"), service)),
  ]);

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Appflow.html
exports.AppflowConnectorProfile = ({ compare }) => ({
  type: "ConnectorProfile",
  package: "appflow",
  client: "Appflow",
  propertiesDefault: {},
  omitProperties: [
    "connectorProfileArn",
    "createdAt",
    "credentialsArn",
    "lastUpdatedAt",
    "privateConnectionProvisioningState",
    "kmsArn",
  ],
  inferName: () =>
    pipe([
      get("connectorProfileName"),
      tap((Name) => {
        assert(Name);
      }),
    ]),
  findName: () =>
    pipe([
      get("connectorProfileName"),
      tap((name) => {
        assert(name);
      }),
    ]),
  findId: () =>
    pipe([
      get("connectorProfileName"),
      tap((id) => {
        assert(id);
      }),
    ]),
  dependencies: {
    kmsKey: {
      type: "Key",
      group: "KMS",
      excludeDefaultDependencies: true,
      dependencyId: ({ lives, config }) => get("kmsArn"),
    },
    iamRoleRedshift: {
      type: "Role",
      group: "IAM",
      dependencyId: ({ lives, config }) =>
        pipe([
          get(
            "connectorProfileConfig.connectorProfileProperties.Redshift.roleArn"
          ),
        ]),
    },
    s3BucketRedshift: {
      type: "Bucket",
      group: "S3",
      dependencyId: ({ lives, config }) =>
        pipe([
          get(
            "connectorProfileConfig.connectorProfileProperties.Redshift.bucketName"
          ),
          lives.getByName({
            type: "Bucket",
            group: "S3",
            providerName: config.providerName,
          }),
          get("id"),
        ]),
    },
  },
  compare: compare({
    filterTarget: () =>
      pipe([omit(["connectorProfileConfig.connectorProfileCredentials"])]),
  }),
  environmentVariables: createEnvironmentVariables(),
  ignoreErrorCodes: ["ResourceNotFoundException"],
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Appflow.html#getConnectorProfile-property
  getById: {
    method: "describeConnectorProfiles",
    getField: "connectorProfileDetails",
    pickId: pipe([
      tap(({ connectorProfileName }) => {
        assert(connectorProfileName);
      }),
      ({ connectorProfileName }) => ({
        connectorProfileNames: [connectorProfileName],
      }),
    ]),
    decorate,
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Appflow.html#listConnectorProfiles-property
  getList: {
    method: "describeConnectorProfiles",
    getParam: "connectorProfileDetails",
    decorate,
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Appflow.html#createConnectorProfile-property
  create: {
    method: "createConnectorProfile",
    pickCreated: ({ payload }) => pipe([identity]),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Appflow.html#updateConnectorProfile-property
  update: {
    method: "updateConnectorProfile",
    filterParams: ({ payload, diff, live }) =>
      pipe([() => payload, defaultsDeep(pickId(live))])(),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Appflow.html#deleteConnectorProfile-property
  destroy: {
    method: "deleteConnectorProfile",
    pickId: pipe([pickId, defaultsDeep({ forceDelete: true })]),
  },
  getByName: getByNameCore,
  filterLive: ({ lives, providerConfig }) =>
    pipe([
      assign({
        connectorProfileConfig: pipe([
          get("connectorProfileConfig"),
          assign({
            connectorProfileProperties: pipe([
              get("connectorProfileProperties"),
              when(
                get("Redshift"),
                assign({
                  Redshift: pipe([
                    get("Redshift"),
                    assign({
                      roleArn: pipe([
                        get("roleArn"),
                        replaceWithName({
                          groupType: "IAM::Role",
                          path: "id",
                          providerConfig,
                          lives,
                        }),
                      ]),
                    }),
                  ]),
                })
              ),
            ]),
          }),
        ]),
      }),
    ]),
  configDefault: ({
    properties: { tags, ...otherProps },
    dependencies: { kmsKey },
    config,
  }) =>
    pipe([
      () => otherProps,
      defaultsDeep({}),
      when(
        () => kmsKey,
        defaultsDeep({
          kmsArn: getField(kmsKey, "Arn"),
        })
      ),
    ])(),
});
