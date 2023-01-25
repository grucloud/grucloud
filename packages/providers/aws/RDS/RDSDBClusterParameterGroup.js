const assert = require("assert");
const { pipe, tap, get, pick, assign, map, not } = require("rubico");
const { defaultsDeep, callProp } = require("rubico/x");

const { buildTags } = require("../AwsCommon");

const { Tagger } = require("./RDSCommon");

const buildArn = () =>
  pipe([
    get("DBClusterParameterGroupArn"),
    tap((arn) => {
      assert(arn);
    }),
  ]);

const pickId = pipe([
  tap(({ DBClusterParameterGroupName }) => {
    assert(DBClusterParameterGroupName);
  }),
  pick(["DBClusterParameterGroupName"]),
]);

const decorate = ({ endpoint }) =>
  pipe([
    tap((params) => {
      assert(endpoint);
    }),
    assign({
      Parameters: pipe([
        pickId,
        defaultsDeep({ Source: "user" }),
        endpoint().describeDBClusterParameters,
        get("Parameters"),
        tap((params) => {
          assert(true);
        }),
        map(pick(["ParameterName", "ParameterValue"])),
      ]),
    }),
    tap((params) => {
      assert(true);
    }),
  ]);

const isDefaultParameterGroup = pipe([
  get("DBClusterParameterGroupName"),
  callProp("startsWith", "default."),
]);

const managedByOther = () => pipe([isDefaultParameterGroup]);

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/RDS.html
exports.RDSDBClusterParameterGroup = ({ compare }) => ({
  type: "DBClusterParameterGroup",
  package: "rds",
  client: "RDS",
  ignoreErrorCodes: ["DBParameterGroupNotFoundFault"],
  propertiesDefault: {},
  omitProperties: [
    "SubnetGroupStatus",
    "VpcId",
    "DBClusterParameterGroupArn",
    "SubnetIds",
  ],
  inferName: () => get("DBClusterParameterGroupName"),
  // compare: compare({
  //   filterTarget: () => pipe([omit(["compare"])]),
  // }),
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/RDS.html#describeDBClusterParameterGroups-property
  getById: {
    method: "describeDBClusterParameterGroups",
    getField: "DBClusterParameterGroups",
    pickId,
    decorate,
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/RDS.html#describeDBClusterParameterGroups-property
  getList: {
    method: "describeDBClusterParameterGroups",
    getParam: "DBClusterParameterGroups",
    filterResource: pipe([not(isDefaultParameterGroup)]),
    decorate,
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/RDS.html#createDBClusterParameterGroup-property
  create: {
    method: "createDBClusterParameterGroup",
    pickCreated: ({ payload }) => pipe([() => payload]),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/RDS.html#modifyDBClusterParameterGroup-property
  update: {
    method: "modifyDBClusterParameterGroup",
    filterParams: ({ payload, diff, live }) =>
      pipe([
        tap((params) => {
          assert(true);
        }),
        () => payload,
      ])(),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/RDS.html#deleteDBClusterParameterGroup-property
  destroy: {
    method: "deleteDBClusterParameterGroup",
    pickId,
  },
  managedByOther,
  cannotBeDeleted: managedByOther,
  findName: () =>
    pipe([
      get("DBClusterParameterGroupName"),
      tap((name) => {
        assert(name);
      }),
    ]),
  findId: () =>
    pipe([
      get("DBClusterParameterGroupName"),
      tap((id) => {
        assert(id);
      }),
    ]),
  getByName: ({ getById }) =>
    pipe([({ name }) => ({ DBClusterParameterGroupName: name }), getById({})]),
  tagger: ({ config }) =>
    Tagger({
      buildArn: buildArn({ config }),
    }),
  configDefault: ({
    name,
    namespace,
    properties: { Tags, ...otherProps },
    dependencies: {},
    config,
  }) =>
    pipe([
      () => otherProps,
      defaultsDeep({
        Tags: buildTags({ name, config, namespace, UserTags: Tags }),
      }),
    ])(),
});
