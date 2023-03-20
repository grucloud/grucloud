const assert = require("assert");
const {
  pipe,
  tap,
  get,
  pick,
  eq,
  assign,
  map,
  and,
  or,
  not,
  filter,
  fork,
} = require("rubico");
const {
  defaultsDeep,
  first,
  pluck,
  callProp,
  when,
  isEmpty,
  unless,
  identity,
} = require("rubico/x");

const { getByNameCore } = require("@grucloud/core/Common");
const { getField } = require("@grucloud/core/ProviderCommon");
const { buildTags } = require("../AwsCommon");

const { Tagger, assignTags } = require("./TimestreamWriteCommon");

const buildArn = () =>
  pipe([
    get("Arn"),
    tap((arn) => {
      assert(arn);
    }),
  ]);

const pickId = pipe([
  tap(({ DatabaseName }) => {
    assert(DatabaseName);
  }),
  pick(["DatabaseName"]),
]);

const decorate = ({ endpoint, config }) =>
  pipe([
    tap((params) => {
      assert(endpoint);
    }),
    assignTags({ buildArn: buildArn(config), endpoint }),
  ]);

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/TimestreamWrite.html
exports.TimestreamWriteDatabase = () => ({
  type: "Database",
  package: "timestream-write",
  client: "TimestreamWrite",
  propertiesDefault: {},
  omitProperties: [
    "Arn",
    "KmsKeyId",
    "TableCount",
    "CreationTime",
    "LastUpdatedTime",
  ],
  inferName: () =>
    pipe([
      get("DatabaseName"),
      tap((Name) => {
        assert(Name);
      }),
    ]),
  findName: () =>
    pipe([
      get("DatabaseName"),
      tap((name) => {
        assert(name);
      }),
    ]),
  findId: () =>
    pipe([
      get("DatabaseName"),
      tap((id) => {
        assert(id);
      }),
    ]),
  ignoreErrorCodes: ["ResourceNotFoundException"],
  dependencies: {
    kmsKey: {
      type: "Key",
      group: "KMS",
      excludeDefaultDependencies: true,
      dependencyId: ({ lives, config }) => get("KmsKeyId"),
    },
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/TimestreamWrite.html#describeDatabase-property
  getById: {
    method: "describeDatabase",
    getField: "Database",
    pickId,
    decorate,
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/TimestreamWrite.html#listDatabases-property
  getList: {
    method: "listDatabases",
    getParam: "Databases",
    decorate: ({ getById }) => pipe([getById]),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/TimestreamWrite.html#createDatabase-property
  create: {
    method: "createDatabase",
    pickCreated: ({ payload }) => pipe([get("Database")]),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/TimestreamWrite.html#updateDatabase-property
  update: {
    method: "updateDatabase",
    filterParams: ({ payload, diff, live }) =>
      pipe([() => payload, defaultsDeep(pickId(live))])(),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/TimestreamWrite.html#deleteDatabase-property
  destroy: {
    method: "deleteDatabase",
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
    dependencies: { kmsKey },
    config,
  }) =>
    pipe([
      () => otherProps,
      defaultsDeep({
        Tags: buildTags({ name, config, namespace, UserTags: Tags }),
      }),
      when(
        () => kmsKey,
        defaultsDeep({
          KmsKeyId: getField(kmsKey, "Arn"),
        })
      ),
    ])(),
});
