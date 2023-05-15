const assert = require("assert");
const { pipe, tap, get, map, assign } = require("rubico");
const { defaultsDeep, pluck } = require("rubico/x");

const { getField } = require("@grucloud/core/ProviderCommon");

const { buildTags } = require("../AwsCommon");

const { Tagger, assignTags } = require("./MemoryDBCommon");

const pickId = pipe([
  tap(({ Name }) => {
    assert(Name);
  }),
  ({ Name }) => ({ SubnetGroupName: Name }),
]);

const buildArn = () =>
  pipe([
    get("ARN"),
    tap(({ ARN }) => {
      assert(ARN);
    }),
  ]);

const decorate = ({ endpoint, config }) =>
  pipe([
    tap((params) => {
      assert(true);
    }),
    assignTags({ buildArn: buildArn(config), endpoint }),
  ]);

exports.MemoryDBSubnetGroup = ({}) => ({
  type: "SubnetGroup",
  package: "memorydb",
  client: "MemoryDB",
  inferName: () => get("Name"),
  findName: () => pipe([get("Name")]),
  findId: () => pipe([get("Name")]),
  ignoreErrorCodes: ["SubnetGroupNotFoundFault"],
  omitProperties: ["ARN", "VpcId", "Subnets", "SubnetIds"],
  dependencies: {
    subnets: {
      type: "Subnet",
      group: "EC2",
      list: true,
      dependencyIds: ({ lives, config }) =>
        pipe([get("Subnets"), pluck("Identifier")]),
    },
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/MemoryDB.html#describeSubnetGroups-property
  getById: {
    method: "describeSubnetGroups",
    getField: "SubnetGroups",
    pickId,
    decorate,
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/MemoryDB.html#describeSubnetGroups-property
  getList: {
    method: "describeSubnetGroups",
    getParam: "SubnetGroups",
    decorate,
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/MemoryDB.html#createSubnetGroup-property
  create: {
    method: "createSubnetGroup",
    filterPayload: pipe([
      ({ Name, ...other }) => ({
        SubnetGroupName: Name,
        ...other,
      }),
    ]),
    pickCreated: ({ payload }) => pipe([get("SubnetGroup")]),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/MemoryDB.html#modifySubnetGroup-property
  update: {
    method: "modifySubnetGroup",
    //TODO
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/MemoryDB.html#deleteSubnetGroup-property
  destroy: {
    method: "deleteSubnetGroup",
    pickId,
  },
  getByName: ({ getList, endpoint, getById }) =>
    pipe([
      ({ name }) => ({
        Name: name,
      }),
      getById({}),
    ]),
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
        Tags: buildTags({
          name,
          config,
          namespace,
          UserTags: Tags,
        }),
      }),
      assign({
        SubnetIds: pipe([
          () => subnets,
          map((subnet) => getField(subnet, "SubnetId")),
        ]),
      }),
    ])(),
});
