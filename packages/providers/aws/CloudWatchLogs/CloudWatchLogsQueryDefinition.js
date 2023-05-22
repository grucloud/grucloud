const assert = require("assert");
const { pipe, tap, get, pick } = require("rubico");
const { defaultsDeep } = require("rubico/x");

const { getByNameCore } = require("@grucloud/core/Common");

const pickId = pipe([
  tap(({ queryDefinitionId }) => {
    assert(queryDefinitionId);
  }),
  pick(["queryDefinitionId"]),
]);

const decorate = ({ endpoint, config }) =>
  pipe([
    tap((params) => {
      assert(endpoint);
    }),
  ]);

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/CloudWatchLogs.html
exports.CloudWatchLogsQueryDefinition = () => ({
  type: "QueryDefinition",
  package: "cloudwatch-logs",
  client: "CloudWatchLogs",
  propertiesDefault: {},
  omitProperties: ["lastModified"],
  inferName: () =>
    pipe([
      get("name"),
      tap((Name) => {
        assert(Name);
      }),
    ]),
  findName: () =>
    pipe([
      get("name"),
      tap((name) => {
        assert(name);
      }),
    ]),
  findId: () =>
    pipe([
      get("queryDefinitionId"),
      tap((id) => {
        assert(id);
      }),
    ]),
  ignoreErrorCodes: ["ResourceNotFoundException"],
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/CloudWatchLogs.html#getQueryDefinition-property
  getById: {
    method: "describeQueryDefinitions",
    getField: "queryDefinitions",
    pickId: pipe([
      ({ name }) => ({
        queryDefinitionNamePrefix: name,
      }),
    ]),
    // TODO find exact destinationName
    decorate,
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/CloudWatchLogs.html#listQueryDefinitions-property
  getList: {
    method: "describeQueryDefinitions",
    getParam: "queryDefinitions",
    decorate: ({ getById }) => pipe([getById]),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/CloudWatchLogs.html#putQueryDefinition-property
  create: {
    method: "putQueryDefinition",
    pickCreated: ({ payload }) => pipe([() => payload]),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/CloudWatchLogs.html#putQueryDefinition-property
  update: {
    method: "putQueryDefinition",
    filterParams: ({ payload, diff, live }) =>
      pipe([() => payload, defaultsDeep(pickId(live))])(),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/CloudWatchLogs.html#deleteQueryDefinition-property
  destroy: {
    method: "deleteQueryDefinition",
    pickId,
  },
  getByName: getByNameCore,
  configDefault: ({
    name,
    namespace,
    properties: { ...otherProps },
    dependencies: {},
    config,
  }) => pipe([() => otherProps, defaultsDeep({})])(),
});
