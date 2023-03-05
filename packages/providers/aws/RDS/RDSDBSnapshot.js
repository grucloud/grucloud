const assert = require("assert");
const { pipe, tap, get, pick, eq } = require("rubico");
const { defaultsDeep } = require("rubico/x");

const { getField } = require("@grucloud/core/ProviderCommon");
const { buildTags } = require("../AwsCommon");

const { Tagger } = require("./RDSCommon");

const managedByOther = () => pipe([eq(get("SnapshotType"), "automated")]);

const buildArn = () =>
  pipe([
    get("DBSnapshotIdentifier"),
    tap((arn) => {
      assert(arn);
    }),
  ]);

const pickId = pipe([
  tap(({ DBSnapshotIdentifier }) => {
    assert(DBSnapshotIdentifier);
  }),
  pick(["DBSnapshotIdentifier"]),
]);

const findNameSnapshot = pipe([
  get("DBSnapshotIdentifier"),
  tap((DBSnapshotIdentifier) => {
    assert(DBSnapshotIdentifier);
  }),
]);

const decorate = ({ endpoint }) =>
  pipe([
    tap((params) => {
      assert(endpoint);
    }),
  ]);

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/RDS.html
exports.RDSDBSnapshot = ({ compare }) => ({
  type: "DBSnapshot",
  package: "rds",
  client: "RDS",
  inferName: () => pipe([findNameSnapshot]),
  findName: () => pipe([findNameSnapshot]),
  findId: () =>
    pipe([
      findNameSnapshot,
      tap((id) => {
        assert(id);
      }),
    ]),
  ignoreErrorCodes: ["DBSnapshotNotFoundFault"],
  propertiesDefault: {},
  omitProperties: [
    "DBInstanceIdentifier",
    "DBSnapshotResourceIdentifier",
    "SnapshotCreateTime",
    "Status",
    "DBSnapshotArn",
    "AvailabilityZones",
  ],
  dependencies: {
    dbInstance: {
      type: "DBInstance",
      group: "RDS",
      dependencyId: ({ lives, config }) =>
        pipe([
          get("DBInstanceIdentifier"),
          tap((DBInstanceIdentifier) => {
            assert(DBInstanceIdentifier);
          }),
        ]),
    },
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/RDS.html#getDBSnapshot-property
  getById: {
    method: "describeDBSnapshots",
    getField: "DBSnapshots",
    pickId,
    decorate,
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/RDS.html#describeDBSnapshots-property
  getList: {
    method: "describeDBSnapshots",
    getParam: "DBSnapshots",
    decorate,
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/RDS.html#createDBSnapshot-property
  create: {
    method: "createDBSnapshot",
    pickCreated: ({ payload }) => pipe([get("DBSnapshot")]),
    isInstanceUp: pipe([eq(get("Status"), "available")]),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/RDS.html#modifyDBSnapshot-property
  update: {
    method: "modifyDBSnapshot",
    filterParams: ({ payload, diff, live }) => pipe([() => payload])(),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/RDS.html#deleteDBSnapshot-property
  destroy: {
    method: "deleteDBSnapshot",
    pickId,
  },
  managedByOther,
  // cannotBeDeleted: managedByOther,
  getByName: ({ getById }) =>
    pipe([({ name }) => ({ DBSnapshotIdentifier: name }), getById({})]),
  tagger: ({ config }) =>
    Tagger({
      buildArn: buildArn({ config }),
    }),
  configDefault: ({
    name,
    namespace,
    properties: { Tags, ...otherProps },
    dependencies: { cluster },
    config,
  }) =>
    pipe([
      tap((params) => {
        assert(cluster);
      }),
      () => otherProps,
      defaultsDeep({
        DBInstanceIdentifier: getField(cluster, "DBInstanceIdentifier"),
        Tags: buildTags({ name, config, namespace, UserTags: Tags }),
      }),
    ])(),
});
