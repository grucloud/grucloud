const assert = require("assert");
const { pipe, tap, get, pick, eq, omit } = require("rubico");
const { defaultsDeep } = require("rubico/x");

const { buildTags } = require("../AwsCommon");
const { createAwsResource } = require("../AwsClient");

const { Tagger, filterLiveDefault } = require("./LightsailCommon");

const buildArn = () =>
  pipe([
    get("relationalDatabaseName"),
    tap((arn) => {
      assert(arn);
    }),
  ]);

const pickId = pipe([
  tap(({ relationalDatabaseName }) => {
    assert(relationalDatabaseName);
  }),
  pick(["relationalDatabaseName"]),
]);

const decorate = ({ endpoint }) =>
  pipe([
    ({ name, location, ...other }) => ({
      relationalDatabaseName: name,
      availabilityZone: location.availabilityZone,
      ...other,
    }),
  ]);

const model = ({ config }) => ({
  package: "lightsail",
  client: "Lightsail",
  ignoreErrorCodes: ["DoesNotExist"],
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Lightsail.html#getRelationalDatabase-property
  getById: {
    method: "getRelationalDatabase",
    getField: "relationalDatabase",
    pickId,
    decorate,
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Lightsail.html#getRelationalDatabases-property
  getList: {
    method: "getRelationalDatabases",
    getParam: "relationalDatabases",
    decorate,
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Lightsail.html#createRelationalDatabase-property
  create: {
    method: "createRelationalDatabase",
    pickCreated: ({ payload }) => pipe([() => payload]),
    isInstanceUp: pipe([eq(get("state"), "available")]),
    isInstanceError: pipe([eq(get("state"), "error")]),
    // getErrorMessage: get("StatusMessage", "error"),
  },
  // TODO update
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Lightsail.html#updateRelationalDatabase-property
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Lightsail.html#updateRelationalDatabaseParameters-property

  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Lightsail.html#deleteRelationalDatabase-property
  destroy: {
    //TODO skipFinalSnapshot:true and finalRelationalDatabaseSnapshotName
    method: "deleteRelationalDatabase",
    pickId,
  },
});

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Lightsail.html
exports.LightsailDatabase = ({ compare }) => ({
  type: "Database",
  propertiesDefault: {
    publiclyAccessible: false,
    backupRetentionEnabled: true,
  },
  omitProperties: [
    "arn",
    "supportCode",
    "resourceType",
    "createdAt",
    "state",
    "masterEndpoint",
    "pendingMaintenanceActions",
    "caCertificateIdentifier",
    "masterUserPassword",
    "parameterApplyStatus",
    "pendingModifiedValues",
    "latestRestorableTime",
  ],
  inferName: get("properties.relationalDatabaseName"),
  environmentVariables: [
    { path: "masterUsername", suffix: "MASTER_USERNAME" },
    { path: "masterUserPassword", suffix: "MASTER_USER_PASSWORD" },
  ],
  compare: compare({
    filterTarget: () => pipe([omit(["commasterUserPasswordpare"])]),
  }),
  filterLive: filterLiveDefault,
  Client: ({ spec, config }) =>
    createAwsResource({
      model: model({ config }),
      spec,
      config,
      findName: pipe([
        get("live"),
        get("relationalDatabaseName"),
        tap((name) => {
          assert(name);
        }),
      ]),
      findId: pipe([
        get("live"),
        get("relationalDatabaseName"),
        tap((id) => {
          assert(id);
        }),
      ]),
      getByName: ({ getById }) =>
        pipe([({ name }) => ({ relationalDatabaseName: name }), getById({})]),
      ...Tagger({ buildArn: buildArn(config) }),
      configDefault: ({
        name,
        namespace,
        properties: { tags, ...otherProps },
        dependencies: {},
      }) =>
        pipe([
          () => otherProps,
          defaultsDeep({
            tags: buildTags({
              name,
              config,
              namespace,
              UserTags: tags,
              key: "key",
              value: "value",
            }),
          }),
        ])(),
    }),
});
