const assert = require("assert");
const { pipe, tap, get, pick, eq, omit } = require("rubico");
const { defaultsDeep } = require("rubico/x");

const { buildTags } = require("../AwsCommon");

const { Tagger, filterLiveDefault } = require("./LightsailCommon");

const buildArn = () =>
  pipe([
    get("relationalDatabaseSnapshotName"),
    tap((arn) => {
      assert(arn);
    }),
  ]);

const pickId = pipe([
  tap(({ relationalDatabaseSnapshotName }) => {
    assert(relationalDatabaseSnapshotName);
  }),
  pick(["relationalDatabaseSnapshotName"]),
]);

const decorate = ({ endpoint }) =>
  pipe([
    tap((arn) => {
      assert(arn);
    }),
    ({ name, location, ...other }) => ({
      relationalDatabaseSnapshotName: name,
      availabilityZone: location.availabilityZone,
      ...other,
    }),
  ]);

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Lightsail.html
exports.LightsailDatabaseSnapshot = ({ compare }) => ({
  type: "DatabaseSnapshot",
  package: "lightsail",
  client: "Lightsail",
  propertiesDefault: {},
  omitProperties: ["arn", "supportCode", "createdAt", "resourceType", "state"],
  inferName: () => get("relationalDatabaseSnapshotName"),
  ignoreResource: () => () => true,
  findName: () =>
    pipe([
      get("relationalDatabaseSnapshotName"),
      tap((name) => {
        assert(name);
      }),
    ]),
  findId: () =>
    pipe([
      tap((id) => {
        assert(id);
      }),
      get("relationalDatabaseSnapshotName"),
      tap((id) => {
        assert(id);
      }),
    ]),
  filterLive: filterLiveDefault,
  tagger: ({ config }) =>
    Tagger({
      buildArn: buildArn({ config }),
    }),
  ignoreErrorCodes: ["DoesNotExist"],
  configDefault: ({
    name,
    namespace,
    properties: { tags, ...otherProps },
    dependencies: {},
    config,
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
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Lightsail.html#getRelationalDatabaseSnapshot-property
  getById: {
    method: "getRelationalDatabaseSnapshot",
    getField: "relationalDatabaseSnapshot",
    pickId,
    decorate,
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Lightsail.html#getRelationalDatabaseSnapshots-property
  getList: {
    method: "getRelationalDatabaseSnapshots",
    getParam: "relationalDatabaseSnapshots",
    decorate,
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Lightsail.html#createRelationalDatabase-property
  create: {
    method: "createRelationalDatabaseSnapshot",
    pickCreated: ({ payload }) => pipe([() => payload]),
    isInstanceUp: pipe([eq(get("state"), "available")]),
    isInstanceError: pipe([eq(get("state"), "error")]),
  },
  // TODO update
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Lightsail.html#updateRelationalDatabase-property
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Lightsail.html#updateRelationalDatabaseParameters-property
  update: {
    method: "updateRelationalDatabase",
    filterParams: ({ payload, diff, live }) => pipe([() => payload])(),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Lightsail.html#deleteRelationalDatabaseSnapshot-property
  destroy: {
    method: "deleteRelationalDatabaseSnapshot",
    pickId,
    shouldRetryOnExceptionMessages: [
      "Sorry, you cannot delete a snapshot while the snapshot is in the state creating. Please try again late",
    ],
  },
  getByName: ({ getById }) =>
    pipe([
      ({ name }) => ({ relationalDatabaseSnapshotName: name }),
      getById({}),
    ]),
});
