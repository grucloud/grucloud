const assert = require("assert");
const { pipe, tap, get, pick, eq, assign, omit, map } = require("rubico");
const { defaultsDeep, pluck } = require("rubico/x");

const { getField } = require("@grucloud/core/ProviderCommon");
const { getByNameCore } = require("@grucloud/core/Common");

const pickId = pipe([
  tap(({ SubnetGroupName }) => {
    assert(SubnetGroupName);
  }),
  pick(["SubnetGroupName"]),
]);

const decorate = ({ endpoint, config }) =>
  pipe([
    tap((params) => {
      assert(endpoint);
    }),
    assign({ SubnetIds: pipe([get("Subnets"), pluck("SubnetIdentifier")]) }),
    omit(["Subnets"]),
  ]);

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/DAX.html
exports.DAXSubnetGroup = ({ compare }) => ({
  type: "SubnetGroup",
  package: "dax",
  client: "DAX",
  propertiesDefault: {},
  omitProperties: ["Arn", "VpcId", "SubnetIds"],
  inferName: () =>
    pipe([
      get("SubnetGroupName"),
      tap((Name) => {
        assert(Name);
      }),
    ]),
  findName: () =>
    pipe([
      get("SubnetGroupName"),
      tap((name) => {
        assert(name);
      }),
    ]),
  findId: () =>
    pipe([
      tap((params) => {
        assert(true);
      }),
      get("SubnetGroupName"),
      tap((id) => {
        assert(id);
      }),
    ]),
  dependencies: {
    subnets: {
      type: "Subnet",
      group: "EC2",
      list: true,
      dependencyIds: ({ lives, config }) =>
        pipe([
          get("SubnetIds"),
          tap((ids) => {
            assert(ids);
          }),
        ]),
    },
  },
  ignoreErrorCodes: ["SubnetGroupNotFoundFault"],
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/DAX.html#describeSubnetGroups-property
  getById: {
    method: "describeSubnetGroups",
    getField: "SubnetGroups",
    pickId: pipe([
      tap(({ SubnetGroupName }) => {
        assert(SubnetGroupName);
      }),
      ({ SubnetGroupName }) => ({
        SubnetGroupNames: [SubnetGroupName],
      }),
    ]),
    decorate,
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/DAX.html#describeSubnetGroups-property
  getList: {
    method: "describeSubnetGroups",
    getParam: "SubnetGroups",
    decorate,
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/DAX.html#createSubnetGroup-property
  create: {
    method: "createSubnetGroup",
    pickCreated: ({ payload }) => pipe([() => payload]),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/DAX.html#updateSubnetGroup-property
  update: {
    method: "updateSubnetGroup",
    filterParams: ({ payload, diff, live }) => pipe([() => payload])(),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/DAX.html#deleteSubnetGroup-property
  destroy: {
    method: "deleteSubnetGroup",
    pickId,
  },
  getByName: getByNameCore,
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
        SubnetIds: pipe([
          () => subnets,
          map((subnet) => getField(subnet, "SubnetId")),
        ])(),
      }),
    ])(),
});
