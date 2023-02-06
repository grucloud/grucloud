const assert = require("assert");
const { pipe, tap, get, pick, eq } = require("rubico");
const { defaultsDeep, when } = require("rubico/x");

const { getByNameCore } = require("@grucloud/core/Common");
const { getField } = require("@grucloud/core/ProviderCommon");
const { ignoreErrorCodes } = require("./AthenaCommon");
const ignoreErrorMessages = ["was not found"];

const pickId = pipe([
  tap(({ StatementName, WorkGroup }) => {
    assert(StatementName);
    assert(WorkGroup);
  }),
  pick(["StatementName", "WorkGroup"]),
]);

const decorate = ({ endpoint }) =>
  pipe([
    tap((params) => {
      assert(endpoint);
    }),
  ]);

const inferName =
  ({ workgroup }) =>
  ({ StatementName }) =>
    pipe([
      tap((name) => {
        assert(StatementName);
        assert(workgroup);
      }),
      () => `${workgroup}::${StatementName}`,
    ]);
const findName =
  () =>
  ({ StatementName, WorkGroup }) =>
    pipe([
      tap((name) => {
        assert(StatementName);
        assert(WorkGroup);
      }),
      () => `${WorkGroup}::${StatementName}`,
    ]);

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Athena.html
exports.AthenaPreparedStatement = ({ compare }) => ({
  type: "PreparedStatement",
  package: "athena",
  client: "Athena",
  propertiesDefault: {},
  omitProperties: ["Workgroup"],
  inferName,
  findName,
  findId: findName,
  getByName: getByNameCore,
  configDefault: ({
    name,
    namespace,
    properties: { ...otherProps },
    dependencies: { workgroup },
    config,
  }) =>
    pipe([
      () => otherProps,
      defaultsDeep({}),
      when(
        () => workgroup,
        defaultsDeep({ Workgroup: getField(workgroup, "Name") })
      ),
    ])(),
  ignoreErrorCodes,
  ignoreErrorMessages,
  dependencies: {
    workgroup: {
      type: "Workgroup",
      group: "Athena",
      parent: true,
      dependencyId: () =>
        pipe([
          get("WorkGroup"),
          tap((WorkGroup) => {
            assert(WorkGroup);
          }),
        ]),
    },
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Athena.html#getPreparedStatement-property
  getById: {
    method: "getPreparedStatement",
    getField: "PreparedStatement",
    pickId,
    decorate,
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Athena.html#listPreparedStatements-property
  getList: ({ client, endpoint, getById, config }) =>
    pipe([
      () =>
        client.getListWithParent({
          parent: { type: "Workgroup", group: "Athena" },
          pickKey: pipe([
            pick(["WorkGroup"]),
            tap(({ WorkGroup }) => {
              assert(WorkGroup);
            }),
          ]),
          method: "listPreparedStatements",
          getParam: "PreparedStatements",
          config,
          decorate: () => pipe([getById({})]),
        }),
    ])(),
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Athena.html#createPreparedStatement-property
  create: {
    method: "createPreparedStatement",
    pickCreated: ({ payload }) => pipe([() => payload]),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Athena.html#updatePreparedStatement-property
  update: {
    method: "updatePreparedStatement",
    filterParams: ({ payload, diff, live }) =>
      pipe([() => payload, defaultsDeep(pickId(live))])(),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Athena.html#deletePreparedStatement-property
  destroy: {
    method: "deletePreparedStatement",
    pickId,
    ignoreErrorMessages,
  },
});
