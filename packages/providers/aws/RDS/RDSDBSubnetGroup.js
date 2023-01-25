const assert = require("assert");
const { pipe, tap, get, pick, map, eq, assign } = require("rubico");
const { defaultsDeep, pluck } = require("rubico/x");

const { getField } = require("@grucloud/core/ProviderCommon");
const { buildTags } = require("../AwsCommon");

const { Tagger } = require("./RDSCommon");

const managedByOther = () => pipe([eq(get("DBSubnetGroupName"), "default")]);

const buildArn = () =>
  pipe([
    get("DBSubnetGroupArn"),
    tap((arn) => {
      assert(arn);
    }),
  ]);

const pickId = pipe([
  tap(({ DBSubnetGroupName }) => {
    assert(DBSubnetGroupName);
  }),
  pick(["DBSubnetGroupName"]),
]);

const decorate = ({ endpoint }) =>
  pipe([
    tap((params) => {
      assert(endpoint);
    }),
    ({ Subnets, ...other }) => ({
      SubnetIds: pipe([() => Subnets, pluck("SubnetIdentifier")])(),
      ...other,
    }),
    assign({
      Tags: pipe([
        ({ DBSubnetGroupArn }) => ({ ResourceName: DBSubnetGroupArn }),
        endpoint().listTagsForResource,
        get("TagList"),
      ]),
    }),
  ]);

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/RDS.html
exports.RDSDBSubnetGroup = ({ compare }) => ({
  type: "DBSubnetGroup",
  package: "rds",
  client: "RDS",
  ignoreErrorCodes: ["DBSubnetGroupNotFoundFault"],
  propertiesDefault: { SupportedNetworkTypes: ["IPV4"] },
  omitProperties: [
    "SubnetGroupStatus",
    "VpcId",
    "DBSubnetGroupArn",
    "SubnetIds",
  ],
  inferName: () =>
    pipe([
      get("DBSubnetGroupName"),
      tap((name) => {
        assert(name);
      }),
    ]),
  // compare: compare({
  //   filterTarget: () => pipe([omit(["compare"])]),
  // }),
  dependencies: {
    subnets: {
      type: "Subnet",
      group: "EC2",
      list: true,
      dependencyIds: ({ lives, config }) => pipe([get("SubnetIds")]),
    },
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/RDS.html#getDBSubnetGroup-property
  getById: {
    method: "describeDBSubnetGroups",
    getField: "DBSubnetGroups",
    pickId,
    decorate,
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/RDS.html#listDBSubnetGroups-property
  getList: {
    method: "describeDBSubnetGroups",
    getParam: "DBSubnetGroups",
    decorate,
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/RDS.html#createDBSubnetGroup-property
  create: {
    method: "createDBSubnetGroup",
    pickCreated: ({ payload }) => pipe([() => payload]),
    isInstanceUp: pipe([eq(get("SubnetGroupStatus"), "Complete")]),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/RDS.html#modifyDBSubnetGroup-property
  update: {
    method: "modifyDBSubnetGroup",
    filterParams: ({ payload, diff, live }) => pipe([() => payload])(),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/RDS.html#deleteDBSubnetGroup-property
  destroy: {
    method: "deleteDBSubnetGroup",
    pickId,
  },
  managedByOther,
  cannotBeDeleted: managedByOther,
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
  getByName: ({ getById }) =>
    pipe([({ name }) => ({ DBSubnetGroupName: name }), getById({})]),
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
      tap((params) => {
        assert(subnets);
      }),
      () => otherProps,
      defaultsDeep({
        Tags: buildTags({ name, config, namespace, UserTags: Tags }),
        SubnetIds: pipe([
          () => subnets,
          map((subnet) => getField(subnet, "SubnetId")),
        ])(),
      }),
    ])(),
});
