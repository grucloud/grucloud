const assert = require("assert");
const { pipe, tap, get, pick, eq, map, fork, flatMap } = require("rubico");
const { defaultsDeep, prepend, callProp, when } = require("rubico/x");

const { getByNameCore } = require("@grucloud/core/Common");
const { getField } = require("@grucloud/core/ProviderCommon");
const { buildTags } = require("../AwsCommon");
const { replaceWithName } = require("@grucloud/core/Common");

const { Tagger } = require("./AppflowCommon");

const buildArn = () =>
  pipe([
    get("connectorProfileArn"),
    tap((arn) => {
      assert(arn);
    }),
  ]);

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
  map(({ name, keys }) =>
    pipe([
      tap((params) => {
        assert(name);
      }),
      () => keys,
      flatMap(
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
  pipe([get(`connectorProfileConfig.connectorProfileCredentials.${service}`)]);

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/AppConnectorProfile.html
exports.AppflowConnectorProfile = () => ({
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
      dependencyId: ({ lives, config }) => get("kmsArn"), // TODO
    },
    // s3BucketDestination: {
    //   type: "S3",
    //   group: "Bucket",
    //   dependencyId: ({ lives, config }) =>
    //     pipe([get("destination_ConnectorProfile_config.s3.bucket")]), // TODO
    // },
  },
  environmentVariables: createEnvironmentVariables(),
  ignoreErrorCodes: ["ResourceNotFoundException"],
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/AppConnectorProfile.html#getConnectorProfile-property
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
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/AppConnectorProfile.html#listConnectorProfiles-property
  getList: {
    method: "describeConnectorProfiles",
    getParam: "connectorProfileDetails",
    //decorate: ({ getById }) => pipe([getById]),
    decorate,
    //decorate: ({ getById }) => pipe([(name) => ({ name }), getById]),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/AppConnectorProfile.html#createConnectorProfile-property
  create: {
    method: "createConnectorProfile",
    pickCreated: ({ payload }) => pipe([identity]),
    // isInstanceUp: pipe([eq(get("ConnectorProfileStatus"), "OPERATIONAL")]),
    // isInstanceError: pipe([eq(get("ConnectorProfileStatus"), "ACTION_NEEDED")]),
    // getErrorMessage: get("StatusMessage", "error"),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/AppConnectorProfile.html#updateConnectorProfile-property
  update: {
    method: "updateConnectorProfile",
    filterParams: ({ pickId, payload, diff, live }) =>
      pipe([() => payload, defaultsDeep(pickId(live))])(),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/AppConnectorProfile.html#deleteConnectorProfile-property
  destroy: {
    method: "deleteConnectorProfile",
    pickId: pipe([pickId, defaultsDeep({ forceDelete: true })]),
    // isInstanceDown: pipe([eq(get("status"), "INACTIVE")]),
    // ignoreErrorCodes: ["ClusterNotFoundException"],
    // ignoreErrorMessages: [
    //   "The specified cluster is inactive. Specify an active cluster and try again.",
    // ],
    // shouldRetryOnExceptionCodes: [],
    // shouldRetryOnExceptionMessages: [],
  },
  getByName: getByNameCore,
  // getByName: ({ getById }) =>
  //   pipe([({ name }) => ({ ConnectionName: name }), getById({})]),

  // filterLive: ({ lives, providerConfig }) =>
  //   pipe([
  //     assign({
  //       apiStages: pipe([
  //         get("apiStages"),
  //         map(
  //           assign({
  //             apiId: pipe([
  //               get("apiId"),
  //               replaceWithName({
  //                 groupType: "APIGateway::RestApi",
  //                 path: "id",
  //                 pathLive: "live.id",
  //                 providerConfig,
  //                 lives,
  //               }),
  //             ]),
  //           })
  //         ),
  //       ]),
  //     }),
  //   ]),
  tagger: ({ config }) =>
    Tagger({
      buildArn: buildArn({ config }),
    }),
  configDefault: ({
    name,
    namespace,
    properties: { tags, ...otherProps },
    dependencies: { kmsKey },
    config,
  }) =>
    pipe([
      () => otherProps,
      defaultsDeep({
        tags: buildTags({ name, config, namespace, UserTags: tags }),
      }),
      when(
        () => kmsKey,
        defaultsDeep({
          kmsArn: getField(kmsKey, "Arn"),
        })
      ),
    ])(),
});
