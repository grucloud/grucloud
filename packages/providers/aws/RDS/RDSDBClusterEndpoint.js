const assert = require("assert");
const { pipe, tap, get, pick, eq, switchCase, not } = require("rubico");
const { defaultsDeep } = require("rubico/x");

const { getField } = require("@grucloud/core/ProviderCommon");
const { buildTags } = require("../AwsCommon");

const { Tagger } = require("./RDSCommon");

const buildArn = () =>
  pipe([
    get("DBClusterEndpointArn"),
    tap((arn) => {
      assert(arn);
    }),
  ]);

const pickId = pipe([
  tap(({ DBClusterEndpointIdentifier }) => {
    assert(DBClusterEndpointIdentifier);
  }),
  pick(["DBClusterEndpointIdentifier"]),
]);

const decorate = ({ endpoint }) =>
  pipe([
    tap((params) => {
      assert(endpoint);
    }),
  ]);

const managedByOther = () => pipe([not(get("DBClusterEndpointIdentifier"))]);

const findNameClusterEndpoint = pipe([
  switchCase([
    get("DBClusterEndpointIdentifier"),
    get("DBClusterEndpointIdentifier"),
    pipe([
      tap((params) => {
        assert(true);
      }),
      ({ DBClusterIdentifier, EndpointType }) =>
        `${DBClusterIdentifier}::${EndpointType}`,
    ]),
  ]),
]);

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/RDS.html
exports.RDSDBClusterEndpoint = ({ compare }) => ({
  type: "DBClusterEndpoint",
  package: "rds",
  client: "RDS",
  ignoreErrorCodes: ["DBClusterEndpointNotFoundFault"],
  propertiesDefault: {},
  omitProperties: [
    "DBClusterIdentifier",
    "DBClusterEndpointResourceIdentifier",
    "Endpoint",
    "Status",
    "DBClusterEndpointArn",
    "CustomEndpointType",
  ],
  inferName: () => get("DBClusterEndpointIdentifier"),
  // compare: compare({
  //   filterTarget: () => pipe([omit(["compare"])]),
  // }),
  dependencies: {
    cluster: {
      type: "DBCluster",
      group: "RDS",
      dependencyId: ({ lives, config }) => pipe([get("DBClusterIdentifier")]),
    },
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/RDS.html#getDBClusterEndpoint-property
  getById: {
    method: "describeDBClusterEndpoints",
    getField: "DBClusterEndpoints",
    pickId,
    decorate,
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/RDS.html#describeDBClusterEndpoints-property
  getList: {
    method: "describeDBClusterEndpoints",
    getParam: "DBClusterEndpoints",
    decorate,
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/RDS.html#createDBClusterEndpoint-property
  create: {
    method: "createDBClusterEndpoint",
    pickCreated: ({ payload }) => pipe([() => payload]),
    isInstanceUp: pipe([eq(get("Status"), "available")]),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/RDS.html#modifyDBClusterEndpoint-property
  update: {
    method: "modifyDBClusterEndpoint",
    filterParams: ({ payload, diff, live }) => pipe([() => payload])(),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/RDS.html#deleteDBClusterEndpoint-property
  destroy: {
    method: "deleteDBClusterEndpoint",
    pickId,
  },
  managedByOther,
  cannotBeDeleted: managedByOther,
  findName: () => pipe([findNameClusterEndpoint]),
  findId: () =>
    pipe([
      findNameClusterEndpoint,
      tap((id) => {
        assert(id);
      }),
    ]),
  getByName: ({ getById }) =>
    pipe([({ name }) => ({ DBClusterEndpointIdentifier: name }), getById({})]),
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
        DBClusterIdentifier: getField(cluster, "DBClusterIdentifier"),
        Tags: buildTags({ name, config, namespace, UserTags: Tags }),
      }),
    ])(),
});
