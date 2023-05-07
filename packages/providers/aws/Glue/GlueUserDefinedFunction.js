const assert = require("assert");
const { pipe, tap, get, pick } = require("rubico");
const { defaultsDeep } = require("rubico/x");

const { getByNameCore } = require("@grucloud/core/Common");

const pickId = pipe([
  tap(({ DatabaseName, FunctionName }) => {
    assert(DatabaseName);
    assert(FunctionName);
  }),
  pick(["DatabaseName", "FunctionName", "CatalogId"]),
]);

const decorate = ({ endpoint, config }) =>
  pipe([
    tap((params) => {
      assert(endpoint);
    }),
  ]);

const findName =
  () =>
  ({ DatabaseName, FunctionName }) =>
    pipe([
      tap(() => {
        assert(DatabaseName);
        assert(FunctionName);
      }),
      () => `${DatabaseName}::${FunctionName}`,
    ])();

const filterPayload = pipe([
  ({ DatabaseName, CatalogId, ...FunctionInput }) =>
    pipe([
      tap(() => {
        assert(DatabaseName);
      }),
      () => ({ DatabaseName, CatalogId, FunctionInput }),
    ]),
]);

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Glue.html
exports.GlueUserDefinedFunction = () => ({
  type: "UserDefinedFunction",
  package: "glue",
  client: "Glue",
  propertiesDefault: {},
  omitProperties: ["DatabaseName", "CreateTime"],
  inferName:
    ({ dependenciesSpec: { database } }) =>
    ({ FunctionName }) =>
      pipe([
        tap((params) => {
          assert(database);
          assert(FunctionName);
        }),
        () => `${database}::${FunctionName}`,
      ])(),
  findName,
  findId: findName,
  ignoreErrorCodes: ["EntityNotFoundException"],
  dependencies: {
    database: {
      type: "Database",
      group: "Glue",
      parent: true,
      dependencyId: ({ lives, config }) =>
        pipe([
          get("DatabaseName"),
          tap((DatabaseName) => {
            assert(DatabaseName);
          }),
        ]),
    },
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Glue.html#getUserDefinedFunction-property
  getById: {
    method: "getUserDefinedFunction",
    getField: "UserDefinedFunction",
    pickId,
    decorate,
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Glue.html#getUserDefinedFunctions-property
  getList: {
    enhanceParams: () => () => ({ Pattern: "*" }),
    method: "getUserDefinedFunctions",
    getParam: "UserDefinedFunctions",
    decorate: ({ getById }) => pipe([getById]),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Glue.html#createUserDefinedFunction-property
  create: {
    filterPayload,
    method: "createUserDefinedFunction",
    pickCreated: ({ payload }) => pipe([() => payload]),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Glue.html#updateUserDefinedFunction-property
  update: {
    method: "updateUserDefinedFunction",
    filterParams: ({ payload, diff, live }) =>
      pipe([() => payload, filterPayload, defaultsDeep(pickId(live))])(),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Glue.html#deleteUserDefinedFunction-property
  destroy: {
    method: "deleteUserDefinedFunction",
    pickId,
  },
  getByName: getByNameCore,
  configDefault: ({
    name,
    namespace,
    properties: { ...otherProps },
    dependencies: { database },
    config,
  }) =>
    pipe([
      () => otherProps,
      defaultsDeep({
        DatabaseName: get("config.Name")(database),
      }),
    ])(),
});
