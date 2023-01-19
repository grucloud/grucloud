const assert = require("assert");
const { pipe, tap, get, pick, not, map, assign } = require("rubico");
const { defaultsDeep, callProp } = require("rubico/x");
const { omitIfEmpty } = require("@grucloud/core/Common");

const pickId = pipe([
  tap(({ ParameterGroupName }) => {
    assert(ParameterGroupName);
  }),
  pick(["ParameterGroupName"]),
]);

const isDefaultParameterGroup = pipe([
  get("ParameterGroupName"),
  callProp("startsWith", "default"),
]);

const managedByOther = () => pipe([isDefaultParameterGroup]);

const decorate = ({ endpoint }) =>
  pipe([
    tap((params) => {
      assert(true);
    }),
    assign({
      ParameterNameValues: pipe([
        pickId,
        //defaultsDeep({ Source: "user" }),
        endpoint().describeParameters,
        get("Parameters"),
        map(pick(["ParameterName", "ParameterValue"])),
      ]),
    }),
    omitIfEmpty(["Parameters"]),
  ]);

exports.DAXParameterGroup = ({ compare }) => ({
  type: "ParameterGroup",
  package: "dax",
  client: "DAX",
  ignoreErrorCodes: ["ParameterGroupNotFound", "ParameterGroupNotFoundFault"],
  inferName: () => get("ParameterGroupName"),
  findName: () => pipe([get("ParameterGroupName")]),
  findId: () => pipe([get("ParameterGroupName")]),
  managedByOther,
  cannotBeDeleted: managedByOther,
  omitProperties: [],
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/DAX.html#describeParameterGroups-property
  getById: {
    method: "describeParameterGroups",
    getField: "ParameterGroups",
    pickId: pipe([
      tap(({ ParameterGroupName }) => {
        assert(ParameterGroupName);
      }),
      ({ ParameterGroupName }) => ({
        ParameterGroupNames: [ParameterGroupName],
      }),
    ]),
    decorate,
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/DAX.html#describeParameterGroups-property
  getList: {
    method: "describeParameterGroups",
    //filterResource: pipe([not(isDefaultParameterGroup)]),
    getParam: "ParameterGroups",
    decorate,
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/DAX.html#createParameterGroup-property
  create: {
    method: "createParameterGroup",
    pickCreated: ({ payload }) => pipe([get("ParameterGroup")]),
    postCreate:
      ({ endpoint, payload, created }) =>
      (live) =>
        pipe([() => payload, endpoint().updateParameterGroup])(),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/DAX.html#updateParameterGroup-property
  update: {
    method: "updateParameterGroup",
    filterParams: ({ payload, diff, live }) => pipe([() => payload])(),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/DAX.html#deleteParameterGroup-property
  destroy: {
    method: "deleteParameterGroup",
    pickId,
  },
  getByName: ({ getList, endpoint, getById }) =>
    pipe([
      ({ name }) => ({
        ParameterGroupName: name,
      }),
      getById({}),
    ]),
  configDefault: ({
    name,
    namespace,
    properties: { Tags, ...otherProps },
    dependencies: {},
    config,
  }) => pipe([() => otherProps, defaultsDeep({})])(),
});
