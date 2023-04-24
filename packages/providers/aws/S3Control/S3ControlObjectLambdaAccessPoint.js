const assert = require("assert");
const { pipe, tap, get, pick, set, assign, map, omit } = require("rubico");
const { defaultsDeep } = require("rubico/x");

const { getByNameCore } = require("@grucloud/core/Common");
const { replaceWithName } = require("@grucloud/core/Common");
const { replaceAccountAndRegion } = require("../AwsCommon");

const pickId = pipe([
  tap(({ Name, AccountId }) => {
    assert(Name);
    assert(AccountId);
  }),
  pick(["Name", "AccountId"]),
]);

const decorate = ({ endpoint, config }) =>
  pipe([
    tap((params) => {
      assert(endpoint);
    }),
    defaultsDeep({ AccountId: config.accountId() }),
    assign({
      Configuration: pipe([
        pickId,
        endpoint().getAccessPointConfigurationForObjectLambda,
        get("Configuration"),
      ]),
    }),
    omit(["PublicAccessBlockConfiguration"]),
    // TODO Policy
  ]);

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/S3Control.html
exports.S3ControlObjectLambdaAccessPoint = () => ({
  type: "ObjectLambdaAccessPoint",
  package: "s3-control",
  client: "S3Control",
  propertiesDefault: {},
  omitProperties: [
    "ObjectLambdaAccessPointArn",
    "CreationDate",
    "AccountId",
    "Alias",
  ],
  inferName: () =>
    pipe([
      get("Name"),
      tap((Name) => {
        assert(Name);
      }),
    ]),
  findName: () =>
    pipe([
      get("Name"),
      tap((name) => {
        assert(name);
      }),
    ]),
  findId: () =>
    pipe([
      get("Name"),
      tap((id) => {
        assert(id);
      }),
    ]),
  ignoreErrorCodes: ["NoSuchAccessPoint"],
  dependencies: {
    s3AccessPoint: {
      type: "AccessPoint",
      group: "S3Control",
      dependencyId: ({ lives, config }) =>
        pipe([get("Configuration.SupportingAccessPoint")]),
    },
    lambdaFunctions: {
      type: "Function",
      group: "Lambda",
      list: true,
      dependencyIds: ({ lives, config }) =>
        pipe([
          get("Configuration.TransformationConfigurations"),
          map(pipe([get("ContentTransformation.AwsLambda.FunctionArn")])),
        ]),
    },
  },
  filterLive: ({ lives, providerConfig }) =>
    pipe([
      assign({
        Configuration: pipe([
          get("Configuration"),
          assign({
            SupportingAccessPoint: pipe([
              get("SupportingAccessPoint"),
              replaceAccountAndRegion({ providerConfig, lives }),
            ]),
            TransformationConfigurations: pipe([
              get("TransformationConfigurations"),
              map(
                set(
                  "ContentTransformation.AwsLambda.FunctionArn",
                  pipe([
                    get("ContentTransformation.AwsLambda.FunctionArn"),
                    replaceWithName({
                      groupType: "Lambda::Function",
                      path: "id",
                      providerConfig,
                      lives,
                    }),
                  ])
                )
              ),
            ]),
          }),
        ]),
      }),
    ]),
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/S3Control.html#getAccessPointForObjectLambda-property
  getById: {
    method: "getAccessPointForObjectLambda",
    pickId,
    decorate,
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/S3Control.html#listAccessPointsForObjectLambda-property
  getList: {
    enhanceParams:
      ({ config }) =>
      () => ({ AccountId: config.accountId() }),
    method: "listAccessPointsForObjectLambda",
    getParam: "ObjectLambdaAccessPointList",
    decorate: ({ getById, config }) =>
      pipe([defaultsDeep({ AccountId: config.accountId() }), getById]),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/S3Control.html#createAccessPointForObjectLambda-property
  create: {
    method: "createAccessPointForObjectLambda",
    pickCreated: ({ payload }) => pipe([() => payload]),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/S3Control.html#updateObjectLambdaAccessPoint-property
  // TODO
  //   update: {
  //     method: "updateObjectLambdaAccessPoint",
  //     filterParams: ({ payload, diff, live }) =>
  //       pipe([() => payload, defaultsDeep(pickId(live))])(),
  //   },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/S3Control.html#deleteObjectLambdaAccessPoint-property
  destroy: {
    method: "deleteAccessPointForObjectLambda",
    pickId,
  },
  getByName: getByNameCore,
  configDefault: ({
    name,
    namespace,
    properties: { ...otherProps },
    dependencies: {},
    config,
  }) =>
    pipe([() => otherProps, defaultsDeep({ AccountId: config.accountId() })])(),
});
