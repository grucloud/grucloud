const assert = require("assert");
const { pipe, tap, get, assign } = require("rubico");
const { defaultsDeep, identity } = require("rubico/x");
const { buildTagsObject } = require("@grucloud/core/Common");
const { getByNameCore } = require("@grucloud/core/Common");

const { Tagger, assignTags } = require("./AppConfigCommon");

const pickId = pipe([
  tap(({ Id }) => {
    assert(Id);
  }),
  ({ Id }) => ({ ApplicationId: Id }),
]);

const buildArn = () =>
  pipe([
    get("Arn"),
    tap((arn) => {
      assert(arn);
    }),
  ]);

const assignArn = ({ config }) =>
  pipe([
    assign({
      Arn: pipe([
        tap(({ Id }) => {
          assert(Id);
        }),
        ({ Id }) =>
          `arn:${config.partition}:appconfig:${
            config.region
          }:${config.accountId()}:application/${Id}`,
      ]),
    }),
  ]);

const decorate = ({ endpoint, config }) =>
  pipe([
    assignArn({ config }),
    assignTags({ buildArn: buildArn(config), endpoint }),
  ]);

exports.AppConfigApplication = () => ({
  type: "Application",
  package: "appconfig",
  client: "AppConfig",
  ignoreErrorCodes: ["ResourceNotFoundException"],
  omitProperties: ["Id", "Arn"],
  inferName: () => get("Name"),
  findName: () =>
    pipe([
      get("Name"),
      tap((Name) => {
        assert(Name);
      }),
    ]),
  findId: () =>
    pipe([
      get("Id"),
      tap((Id) => {
        assert(Id);
      }),
    ]),
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/AppConfig.html#getApplication-property
  getById: {
    method: "getApplication",
    pickId,
    decorate,
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/AppConfig.html#listApplications-property
  getList: {
    method: "listApplications",
    getParam: "Items",
    decorate: ({ getById }) => getById,
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/AppConfig.html#createApplication-property
  create: {
    method: "createApplication",
    pickCreated: ({ payload }) => pipe([identity]),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/AppConfig.html#updateApplication-property
  update: {
    method: "updateApplication",
    filterParams: ({ payload, live }) =>
      pipe([() => payload, defaultsDeep({ ApplicationId: live.Id })])(),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/AppConfig.html#deleteApplication-property
  destroy: {
    method: "deleteApplication",
    pickId,
    shouldRetryOnExceptionMessages: ["Cannot delete application"],
  },
  getByName: getByNameCore,
  tagger: ({ config }) =>
    Tagger({
      buildArn: buildArn({ config }),
    }),
  configDefault: ({
    name,
    namespace,
    properties: { Tags, ...otherProps },
    dependencies: {},
    config,
  }) =>
    pipe([
      () => otherProps,
      defaultsDeep({
        Tags: buildTagsObject({ name, config, namespace, userTags: Tags }),
      }),
    ])(),
});
