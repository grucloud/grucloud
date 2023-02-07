const assert = require("assert");
const { pipe, tap, get, pick, assign } = require("rubico");
const { defaultsDeep, identity } = require("rubico/x");

const { getByNameCore, omitIfEmpty } = require("@grucloud/core/Common");

const pickId = pipe([
  tap(({ FunctionName, Name }) => {
    assert(FunctionName);
    assert(Name);
  }),
  pick(["FunctionName", "Name"]),
]);

const decorate = ({ endpoint, config, live }) =>
  pipe([
    tap(() => {
      assert(config);
      assert(endpoint);
      assert(live.FunctionName);
    }),
    defaultsDeep({ FunctionName: live.FunctionName }),
    omitIfEmpty(["Description"]),
  ]);

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Lambda.html
exports.LambdaAlias = () => ({
  type: "Alias",
  package: "lambda",
  client: "Lambda",
  propertiesDefault: {},
  omitProperties: ["FunctionName", "AliasArn", "RevisionId"],
  inferName:
    ({ dependenciesSpec: { lambdaFunction } }) =>
    ({ Name }) =>
      pipe([
        tap((params) => {
          assert(lambdaFunction);
          assert(Name);
        }),
        () => `${lambdaFunction}::${Name}`,
      ])(),
  findName:
    () =>
    ({ FunctionName, Name }) =>
      pipe([
        tap((params) => {
          assert(FunctionName);
          assert(Name);
        }),
        () => `${FunctionName}::${Name}`,
      ])(),
  findId: () =>
    pipe([
      get("AliasArn"),
      tap((id) => {
        assert(id);
      }),
    ]),
  ignoreErrorCodes: ["ResourceNotFoundException"],
  dependencies: {
    lambdaFunction: {
      type: "Function",
      group: "Lambda",
      parent: true,
      dependencyId: ({ lives, config }) =>
        pipe([
          get("FunctionName"),
          tap((FunctionName) => {
            assert(FunctionName);
          }),
          lives.getByName({
            type: "Function",
            group: "Lambda",
            providerName: config.providerName,
          }),
          get("id"),
        ]),
    },
  },
  filterLive: ({ lives, providerConfig }) => pipe([assign({})]),
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Lambda.html#getPolicy-property
  getById: {
    method: "getAlias",
    pickId,
    decorate,
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Lambda.html#getPolicy-property
  getList: ({ client, endpoint, getById, config }) =>
    pipe([
      () =>
        client.getListWithParent({
          parent: { type: "Function", group: "Lambda" },
          pickKey: pipe([
            ({ Configuration }) => ({
              FunctionName: Configuration.FunctionName,
            }),
            tap(({ FunctionName }) => {
              assert(FunctionName);
            }),
          ]),
          method: "listAliases",
          getParam: "Aliases",
          config,
          decorate: ({ endpoint, parent }) =>
            pipe([
              decorate({
                endpoint,
                config,
                live: {
                  FunctionName: parent.Configuration.FunctionName,
                },
              }),
            ]),
        }),
    ])(),

  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Lambda.html#createAlias-property
  create: {
    method: "createAlias",
    pickCreated: ({ payload }) => pipe([identity]),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Lambda.html#updateAlias-property
  update: {
    method: "updateAlias",
    filterParams: ({ payload, diff, live }) =>
      pipe([() => payload, defaultsDeep(pickId(live))])(),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Lambda.html#deleteAlias-property
  destroy: {
    method: "deleteAlias",
    pickId,
  },
  getByName: getByNameCore,
  configDefault: ({
    name,
    namespace,
    properties: { ...otherProps },
    dependencies: { lambdaFunction },
    config,
  }) =>
    pipe([
      tap((params) => {
        assert(lambdaFunction);
        assert(lambdaFunction.config.Configuration.FunctionName);
      }),
      () => otherProps,
      defaultsDeep({
        FunctionName: lambdaFunction.config.Configuration.FunctionName,
      }),
    ])(),
});
