const assert = require("assert");
const { pipe, tap, get, pick, not, assign, map } = require("rubico");
const { defaultsDeep, callProp } = require("rubico/x");

const { getByNameCore } = require("@grucloud/core/Common");
const { buildTags } = require("../AwsCommon");

const { Tagger, assignTags } = require("./DocDBCommon");

const isDefaultParameterGroup = pipe([
  get("DBClusterParameterGroupName"),
  callProp("startsWith", "default."),
]);

const managedByOther = () => pipe([isDefaultParameterGroup]);

const buildArn = () =>
  pipe([
    get("DBClusterParameterGroupArn"),
    tap((DBClusterParameterGroupArn) => {
      assert(DBClusterParameterGroupArn);
    }),
  ]);

const pickId = pipe([
  tap(({ DBClusterParameterGroupName }) => {
    assert(DBClusterParameterGroupName);
  }),
  pick(["DBClusterParameterGroupName"]),
]);

const decorate = ({ endpoint, config }) =>
  pipe([
    tap((params) => {
      assert(endpoint);
    }),
    assignTags({ buildArn: buildArn(config), endpoint }),
    assign({
      Parameters: pipe([
        pickId,
        defaultsDeep({ Source: "user" }),
        endpoint().describeDBClusterParameters,
        get("Parameters"),
        map(pick(["ParameterName", "ParameterValue", "ApplyMethod"])),
      ]),
    }),
  ]);

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/DocDB.html
exports.DocDBDBClusterParameterGroup = () => ({
  type: "DBClusterParameterGroup",
  package: "docdb",
  client: "DocDB",
  propertiesDefault: {},
  omitProperties: ["DBClusterParameterGroupArn"],
  managedByOther,
  cannotBeDeleted: managedByOther,
  inferName: () =>
    pipe([
      get("DBClusterParameterGroupName"),
      tap((Name) => {
        assert(Name);
      }),
    ]),
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
  ignoreErrorCodes: ["DBParameterGroupNotFoundFault"],
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/DocDB.html#describeDBClusterParameterGroup-property
  getById: {
    method: "describeDBClusterParameterGroups",
    getField: "DBClusterParameterGroups",
    pickId,
    decorate,
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/DocDB.html#describeDBClusterParameterGroups-property
  getList: {
    method: "describeDBClusterParameterGroups",
    getParam: "DBClusterParameterGroups",
    filterResource: pipe([not(isDefaultParameterGroup)]),
    decorate,
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/DocDB.html#createDBClusterParameterGroup-property
  create: {
    method: "createDBClusterParameterGroup",
    pickCreated: ({ payload }) => pipe([() => payload]),
    postCreate:
      ({ name, payload, programOptions, endpoint, config }) =>
      ({}) =>
        pipe([
          tap(() => {
            assert(endpoint);
            assert(payload);
          }),
          () => payload,
          endpoint().modifyDBClusterParameterGroup,
        ])(),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/DocDB.html#modifyDBClusterParameterGroup-property
  update: {
    method: "modifyDBClusterParameterGroup",
    filterParams: ({ payload, diff, live }) => pipe([() => payload])(),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/DocDB.html#deleteDBClusterParameterGroup-property
  destroy: {
    method: "deleteDBClusterParameterGroup",
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
