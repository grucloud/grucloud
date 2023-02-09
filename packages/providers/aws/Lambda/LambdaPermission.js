const assert = require("assert");
const {
  pipe,
  tap,
  get,
  pick,
  fork,
  map,
  assign,
  omit,
  eq,
  filter,
} = require("rubico");
const { defaultsDeep, when, find } = require("rubico/x");

const { getByNameCore } = require("@grucloud/core/Common");
const { replacePolicy } = require("../IAM/AwsIamCommon");

const pickId = pipe([
  tap(({ FunctionName }) => {
    assert(FunctionName);
  }),
  pick(["FunctionName"]),
]);

// TODO use common
const dependenciesPermissions = {
  apiGatewayRestApis: {
    pathLive: "live.arnv2",
    type: "RestApi",
    group: "APIGateway",
  },
  apiGatewayV2Apis: {
    pathLive: "id",
    type: "Api",
    group: "ApiGatewayV2",
  },
  appsyncGraphqlApis: {
    pathLive: "live.uris.GRAPHQL",
    type: "GraphqlApi",
    group: "AppSync",
  },
  secretsManagerSecrets: {
    pathLive: "live.ARN",
    type: "Secret",
    group: "SecretsManager",
  },
};

const buildDependency = ({ pathLive, type, group }) => ({
  type,
  group,
  list: true,
  dependencyIds: ({ lives, config }) =>
    pipe([
      get("Permissions"),
      filter(get("SourceArn")),
      map(({ SourceArn = "" }) =>
        pipe([
          tap((params) => {
            assert(SourceArn);
            assert(pathLive);
          }),
          lives.getByType({
            providerName: config.providerName,
            type,
            group,
          }),
          find(pipe([get(pathLive), (id) => SourceArn.startsWith(id)])),
          get("id"),
        ])()
      ),
    ]),
});

const buildDependencies = pipe([
  () => dependenciesPermissions,
  map(buildDependency),
]);

const decorate = ({ endpoint, config, live }) =>
  pipe([
    tap((Policy) => {
      assert(config);
      assert(endpoint);
      assert(Policy);
      assert(live.FunctionName);
    }),
    fork({
      FunctionName: () => live.FunctionName,
      Permissions: pipe([
        JSON.parse,
        get("Statement"),
        map(({ Principal, Sid, Condition }) =>
          pipe([
            () => ({
              Action: "lambda:InvokeFunction",
              FunctionName: live.FunctionName,
              Principal: Principal.Service,
              StatementId: Sid,
            }),
            when(
              () => get(["ArnLike", "AWS:SourceArn"])(Condition),
              defaultsDeep({
                SourceArn: get(["ArnLike", "AWS:SourceArn"])(Condition),
              })
            ),
            when(
              () => get(["StringEquals", "AWS:SourceAccount"])(Condition),
              defaultsDeep({
                SourceAccount: get(["StringEquals", "AWS:SourceAccount"])(
                  Condition
                ),
              })
            ),
            when(
              eq(get("SourceAccount"), config.accountId()),
              omit(["SourceAccount"])
            ),
          ])()
        ),
      ]),
    }),
    tap((params) => {
      assert(true);
    }),
  ]);

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Lambda.html
exports.LambdaPermission = () => ({
  type: "Permission",
  package: "lambda",
  client: "Lambda",
  propertiesDefault: {},
  omitProperties: ["FunctionName"],
  inferName: ({ dependenciesSpec: { lambdaFunction } }) =>
    pipe([
      () => lambdaFunction,
      tap((Name) => {
        assert(Name);
      }),
    ]),
  findName: () =>
    pipe([
      get("FunctionName"),
      tap((name) => {
        assert(name);
      }),
    ]),
  findId: () =>
    pipe([
      get("FunctionName"),
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
    ...buildDependencies(),
  },
  filterLive: ({ lives, providerConfig }) =>
    pipe([
      assign({
        Permissions: pipe([
          get("Permissions"),
          map(
            when(
              get("SourceArn"),
              assign({
                SourceArn: pipe([
                  get("SourceArn"),
                  replacePolicy({ lives, providerConfig }),
                ]),
              })
            )
          ),
        ]),
      }),
    ]),

  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Lambda.html#getPolicy-property
  getById: {
    method: "getPolicy",
    getField: "Policy",
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
          method: "getPolicy",
          getParam: "Policy",
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

  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Lambda.html#addPermission-property
  create:
    ({ endpoint, getById }) =>
    ({ payload, resolvedDependencies }) =>
      pipe([
        () => payload,
        get("Permissions"),
        map(
          pipe([
            tap((params) => {
              assert(true);
            }),
            endpoint().addPermission,
            tap((params) => {
              assert(true);
            }),
          ])
        ),
      ])(),

  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Lambda.html#updatePermission-property
  update: {
    method: "updatePermission",
    filterParams: ({ payload, diff, live }) =>
      pipe([() => payload, defaultsDeep(pickId(live))])(),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Lambda.html#removePermission-property
  destroy:
    ({ endpoint, getById }) =>
    ({ live }) =>
      pipe([
        tap((params) => {
          assert(true);
        }),
        () => live,
        get("Permissions"),
        map(
          pipe([
            tap(({ FunctionName, StatementId }) => {
              assert(FunctionName);
              assert(StatementId);
            }),
            endpoint().removePermission,
            tap((params) => {
              assert(true);
            }),
          ])
        ),
      ])(),
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
