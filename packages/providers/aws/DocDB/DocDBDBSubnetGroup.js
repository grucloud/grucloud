const assert = require("assert");
const { pipe, tap, get, pick, eq, assign, map } = require("rubico");
const { defaultsDeep, pluck, callProp, isIn } = require("rubico/x");

const { getByNameCore } = require("@grucloud/core/Common");
const { getField } = require("@grucloud/core/ProviderCommon");
const { buildTags } = require("../AwsCommon");

const { Tagger, assignTags } = require("./DocDBCommon");

const isDefaultParameterGroup = pipe([
  get("DBSubnetGroupName"),
  callProp("startsWith", "default"),
]);

const managedByOther = () => pipe([isDefaultParameterGroup]);

const buildArn = () =>
  pipe([
    get("DBSubnetGroupArn"),
    tap((DBSubnetGroupArn) => {
      assert(DBSubnetGroupArn);
    }),
  ]);

const pickId = pipe([
  tap(({ DBSubnetGroupName }) => {
    assert(DBSubnetGroupName);
  }),
  pick(["DBSubnetGroupName"]),
]);

const decorate = ({ endpoint, config }) =>
  pipe([
    tap((params) => {
      assert(endpoint);
    }),
    assignTags({ buildArn: buildArn(config), endpoint }),
    assign({ SubnetIds: pipe([get("Subnets"), pluck("SubnetIdentifier")]) }),
  ]);

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/DocDB.html
exports.DocDBDBSubnetGroup = () => ({
  type: "DBSubnetGroup",
  package: "docdb",
  client: "DocDB",
  propertiesDefault: {},
  omitProperties: [
    "SubnetGroupStatus",
    "Subnets",
    "DBSubnetGroupArn",
    "VpcId",
    "SubnetIds", //TODO
  ],
  inferName: () =>
    pipe([
      get("DBSubnetGroupName"),
      tap((Name) => {
        assert(Name);
      }),
    ]),
  findName: () =>
    pipe([
      get("DBSubnetGroupName"),
      tap((name) => {
        assert(name);
      }),
    ]),
  findId: () =>
    pipe([
      get("DBSubnetGroupName"),
      tap((id) => {
        assert(id);
      }),
    ]),
  ignoreErrorCodes: ["DBSubnetGroupNotFoundFault"],
  managedByOther,
  cannotBeDeleted: managedByOther,
  dependencies: {
    subnets: {
      type: "Subnet",
      group: "EC2",
      list: true,
      required: true,
      pathId: "SubnetIds",
      dependencyIds: ({ lives, config }) =>
        pipe([
          get("SubnetIds"),
          tap((SubnetIds) => {
            assert(SubnetIds);
          }),
        ]),
    },
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/DocDB.html#describeDBSubnetGroups-property
  getById: {
    method: "describeDBSubnetGroups",
    getField: "DBSubnetGroups",
    pickId,
    decorate,
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/DocDB.html#describeDBSubnetGroups-property
  getList: {
    method: "describeDBSubnetGroups",
    getParam: "DBSubnetGroups",
    decorate,
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/DocDB.html#createDBSubnetGroup-property
  create: {
    method: "createDBSubnetGroup",
    pickCreated: ({ payload }) => pipe([() => payload]),
    isInstanceUp: pipe([get("SubnetGroupStatus"), isIn(["Complete"])]),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/DocDB.html#updateDBSubnetGroup-property
  update: {
    method: "modifyDBSubnetGroup",
    filterParams: ({ payload, diff, live }) =>
      pipe([() => payload, defaultsDeep(pickId(live))])(),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/DocDB.html#deleteDBSubnetGroup-property
  destroy: {
    method: "deleteDBSubnetGroup",
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
    dependencies: { subnets },
    config,
  }) =>
    pipe([
      tap(() => {
        assert(subnets);
      }),
      () => otherProps,
      defaultsDeep({
        Tags: buildTags({ name, config, namespace, UserTags: Tags }),
      }),
      assign({
        SubnetIds: pipe([
          () => subnets,
          map((subnet) => getField(subnet, "SubnetId")),
        ]),
      }),
    ])(),
});
